import trycatch from "../middlewares/trycatch.js";
import sanitize from "mongo-sanitize";
import { prisma } from "../config/prisma.js";
import { userRegistrationSchema, userLoginSchema } from "../config/zod.js";
import { redisClient } from "../index.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import sendMail from "../config/sendMail.js";
// import { get } from "http";
import { getOtpHtml, getVerifyEmailHtml } from "../config/html.js";
import {
  generateAccessToken,
  generateToken,
  verifyRefreshToken,
  revokeRefreshToken,
} from "../config/generateToken.js";

export const registerUser = trycatch(async (req, res) => {
  const sanitizedBody = sanitize(req.body);
  console.log(sanitizedBody);

  const validation = userRegistrationSchema.safeParse(sanitizedBody);
  // const { email, name, password, mobile } = req.body;

  if (!validation.success) {
    const zodError = validation.error;
    let firstErrorMessage = "Validation error";
    let allErrors = [];
    if (zodError?.issues && Array.isArray(zodError.issues)) {
      allErrors = zodError.issues.map((issue) => ({
        field: issue.path ? issue.path.join(".") : "unknown",
        message: issue.message || "Validation error",
        code: issue.code || "invalid",
      }));
      firstErrorMessage = allErrors[0]?.message || "Validation error";
    }

    return res.status(400).json({
      message: firstErrorMessage,
      errors: allErrors,
    });
  }
  const { email, name, password, mobile, role } = validation.data;

  // implementing rate limiting using Redis can be done here
  const rateLimitKey = `register-rate-limit:${req.ip}:${email}`;
  if (await redisClient.get(rateLimitKey)) {
    return res.status(429).json({
      message: "Too many registration attempts. Please try again later.",
    });
  }
  console.log("passed rate limit");

  // check if user already exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  console.log("hii Rajesh");
  console.log(existingUser);
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }
  // hash the password before storing
  const hashedPassword = await bcrypt.hash(password, 10);

  const verifyToken = crypto.randomBytes(32).toString("hex");

  const verifyKey = `verify:${verifyToken}`;

  const datatoStore = JSON.stringify({
    email,
    name,
    password: hashedPassword,
    mobile,
    role,
  });

  await redisClient.set(verifyKey, datatoStore, { EX: 300 });

  const subject = "Verify your email for Account creation";
  const html = getVerifyEmailHtml({ email, token: verifyToken });

  await sendMail({
    email,
    subject,
    html,
  });

  await redisClient.set(rateLimitKey, "true", { EX: 60 }); // 1 minute rate limit

  // const newUser = await prisma.user.create({
  //   data: { email, name, password, mobile },
  // });
  res.status(201).json({
    // message: "User registered successfully", user: newUser
    message:
      "If your email is valid, a verification link has been sent to your email address. Please verify to complete registration. it will expire in 5 minutes.",
  });
});

export const verifyUser = trycatch(async (req, res) => {
  const { token } = req.params;

  if (!token) {
    return res.status(400).json({ message: "Verification token is required" });
  }
  const verifyKey = `verify:${token}`;
  const userDataJson = await redisClient.get(verifyKey);
  if (!userDataJson) {
    return res
      .status(400)
      .json({ message: "Verification Link is expired or invalid" });
  }

  await redisClient.del(verifyKey); // Delete the token after use to prevent reuse
  const userData = JSON.parse(userDataJson);
  const existingUser = await prisma.user.findUnique({
    where: { email: userData.email },
  });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  // const { email, name, password, mobile } = JSON.parse(userDataJson);

  const newUser = await prisma.user.create({
    data: {
      email: userData.email,
      name: userData.name,
      password: userData.password,
      mobile: userData.mobile,
      role: userData.role || "USER",
    },
  });
  await redisClient.del(verifyKey);
  res.status(201).json({
    message: "User verified and registered successfully",
    user: {
      _id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      mobile: newUser.mobile,
    },
  });
});

// export const loginUser = trycatch(async (req, res) => {
//   const sanitizedBody = sanitize(req.body);

//   const validation = userLoginSchema.safeParse(sanitizedBody);

//   if (!validation.success) {
//     const zodError = validation.error;
//     let firstErrorMessage = "Validation error";
//     let allErrors = [];
//     if (zodError?.issues && Array.isArray(zodError.issues)) {
//       allErrors = zodError.issues.map(issue => ({
//         field: issue.path?issue.path.join('.'):"unknown",
//         message: issue.message || "Validation error",
//         code : issue.code || "invalid"
//       }));
//       firstErrorMessage = allErrors[0]?.message || "Validation error";
//     }

//     return res.status(400).json({
//       message: firstErrorMessage,
//       errors: allErrors
//     });
//   }
//   const { email, password } = validation.data;

//   const rateLimitKey = `login-rate-limit:${req.ip}:${email}`;
//   if (await redisClient.get(rateLimitKey)) {
//     return res.status(429).json({ message: "Too many registration attempts. Please try again later." });
//   }

//   const user = await prisma.user.findUnique({ where: { email } });

//   if (!user) {
//     return res.status(400).json({ message: "Invalid email or password" });
//   }
//   const isPasswordValid = await bcrypt.compare(password, user.password);

//   if (!isPasswordValid) {
//     return res.status(400).json({ message: "Invalid email or password" });
//   }

//   const otp = Math.floor(100000 + Math.random() * 900000).toString();
//   const otpKey = `otp:${email}`;
//   await redisClient.set(otpKey,JSON.stringify(otp),{
//     EX: 300
//   }); // OTP valid for 5 minutes

//  const subject = "Your OTP for Login";

//   const html = getOtpHtml({ email, otp });

//   await sendMail({
//     email,
//     subject,
//     html
//  })

//  await redisClient.set(rateLimitKey, "true", { EX: 60 }); // 1 minute rate limit

//   res.status(200).json({ message: "If your email is valid, an OTP has been sent to your email. It will expire in 5 minutes." });

// }
// );

// export const verifyOtp = trycatch(async (req, res) => {
//   const { email, otp } = req.body;
//   console.log(req.body)
//   console.log(email)
//   console.log(otp)

//   if (!email || !otp) {
//     return res.status(400).json({ message: "Please provide email and OTP" });
//   }
//   const otpKey = `otp:${email}`;
//   console.log(otpKey, "otpKey")
//   const storedOtpString = await redisClient.get(otpKey);
//   const parsedOtp = storedOtpString;
//   console.log(parsedOtp)
//   if (!parsedOtp) {
//     return  res.status(400).json({ message: "OTP is expired or invalid" });
//   }

//   // const storedOtp = JSON.parse(parsedOtp);
//   if (parsedOtp !== parseInt(otp)) {
//     return res.status(400).json({ message: "Invalid OTP" });
//   }

//   await redisClient.del(otpKey); // Delete OTP after successful verification
//   let user = await prisma.user.findUnique({ where: { email } });
//   const tokenData = await generateToken(user.id, res);

//   res.status(200).json({
//     message: `Welcome back, ${user.name}`,
//     user: {_id: user.id, email: user.email, name: user.name, mobile: user.mobile},
//     token: tokenData.token
//   });
// });
export const loginUser = trycatch(async (req, res) => {
  const { email, password } = sanitize(req.body);

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  const rateLimitKey = `login:${req.ip}:${email}`;
  if (await redisClient.get(rateLimitKey)) {
    return res.status(429).json({ message: "Too many attempts. Try later." });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  //  OTP MUST BE STRING
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpKey = `otp:${email}`;

  await redisClient.set(otpKey, otp, { EX: 300 }); // 5 minutes
  console.log(otpKey, otp);

  await sendMail({
    email,
    subject: "Your Login OTP",
    html: getOtpHtml({ otp }),
  });

  await redisClient.set(rateLimitKey, "1", { EX: 60 });

  return res.status(200).json({
    message: "OTP sent to your email. Valid for 5 minutes.",
  });
});

/* ===================== VERIFY OTP ===================== */

export const verifyOtp = trycatch(async (req, res) => {
  const { email, otp } = req.body;
  console.log(otp, "hii1");
  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP required" });
  }

  const otpKey = `otp:${email}`;
  const storedOtpString = await redisClient.get(otpKey);
  console.log(otpKey, "1", "", storedOtpString);

  if (!storedOtpString) {
    return res.status(400).json({ message: "OTP expired or invalid" });
  }

  const storedOtp = JSON.parse(storedOtpString);
  console.log(storedOtp, typeof storedOtp);
  console.log(otp, typeof otp);
  const modifiedOtp = Number(otp);
  //  STRING vs STRING
  if (storedOtp !== modifiedOtp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }
  console.log("checked and proceed furthur");
  await redisClient.del(otpKey);

  let user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  console.log(user);
  //  SAFE TOKEN GENERATION
  const tokenData = await generateToken(user.id, res);
  console.log(tokenData);

  return res.status(200).json({
    message: `Welcome ${user.name}`,
    token: tokenData.accessToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
      points: user.points,
    },
  });
});

export const myProfile = trycatch(async (req, res) => {
  const user = req.user;
  // console.log(user);
  const freshUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      name: true,
      email: true,
      mobile: true,
      role: true,
      points: true,
      created_at: true,
      updated_at: true,
    },
  });

  res.json({ user: freshUser });
});

export const refreshToken = trycatch(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  // console.log(refreshToken, "this is rfestkn")
  if (!refreshToken) {
    return res.status(401).json({ message: " Valid refresh token required" });
  }
  const decode = await verifyRefreshToken(refreshToken);
  // console.log(decode, "this is decoded token")
  if (!decode) {
    return res
      .status(401)
      .json({ message: "Invalid or expired refresh token" });
  }

  generateAccessToken(decode.id, res);
  res.status(200).json({ message: "Access token refreshed" });
});

export const logoutUser = trycatch(async (req, res) => {
  const userId = req.user.id;
  await revokeRefreshToken(userId);

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.clearCookie("csrfToken");

  await redisClient.del(`user:${userId}`);
  res.status(200).json({ message: "Logged out successfully3" });
});

export const getUserProfile = trycatch(async (req, res) => {
  const { userId } = req.params;
  const user = await prisma.user.findUnique({
    where: { id: parseInt(userId) },
  });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.status(200).json({ user });
});

export const refreshCSRF = trycatch(async (req, res) => {
  const userId = req.user.id;

  const newCSRFToken = await generateCSRFToken(userId, res);
  res.status(200).json({
    message: "CSRF token refreshed",
    csrfToken: newCSRFToken,
  });
});

export const adminController = trycatch(async (req, res) => {
  res.json({
    message: "hello Admin Rajesh",
  });
});

export const getAllVendors = trycatch(async (req, res) => {
  const vendors = await prisma.user.findMany({
    where: { role: "VENDOR" },
    select: {
      id: true,
      name: true,
      email: true,
      mobile: true,
      points: true,
      created_at: true,
    },
  });
  res.status(200).json({
    message: "Vendors fetched successfully",
    vendors,
  });
});

export const getAllCustomers = trycatch(async (req, res) => {
  const customers = await prisma.user.findMany({
    where: { role: "USER" },
    select: {
      id: true,
      name: true,
      email: true,
      mobile: true,
      points: true,
      created_at: true,
    },
  });
  res.status(200).json({
    message: "Customers fetched successfully",
    customers,
  });
});

export const updateProfile = trycatch(async (req, res) => {
  const userId = req.user.id;
  const { name, mobile } = req.body;

  if (!name || !mobile) {
    return res.status(400).json({ message: "Name and mobile are required" });
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      name,
      mobile,
    },
  });

  res.status(200).json({
    message: "Profile updated successfully",
    user: updatedUser,
  });
});
