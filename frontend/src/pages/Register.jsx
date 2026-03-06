import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { server } from "../main.jsx";

const Register = () => {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");
  const [referrerMobile, setReferrerMobile] = useState("");
  const [referredBy, setReferredBy] = useState(null);
  const [referrerError, setReferrerError] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);
  const navigate = useNavigate();

  const checkReferrer = async (mobile) => {
    if (!mobile) {
      setReferrerError("");
      setReferredBy(null);
      return;
    }

    try {
      const { data } = await axios.post(
        `${server}/api/v1/users/check-referrer`,
        {
          mobile: mobile,
        },
      );

      if (data.userId) {
        setReferredBy(data.userId);
        setReferrerError("");
        toast.success("Referrer found!");
      } else {
        setReferrerError("Referrer not found");
        setReferredBy(null);
      }
    } catch (error) {
      setReferrerError(
        error.response?.data?.message || "Error checking referrer",
      );
      setReferredBy(null);
    }
  };

  const handleReferrerChange = async (e) => {
    const mobile = e.target.value;
    setReferrerMobile(mobile);
    await checkReferrer(mobile);
  };

  const submitHandler = async (e) => {
    setBtnLoading(true);
    e.preventDefault();
    try {
      const { data } = await axios.post(`${server}/api/v1/users/register`, {
        name,
        mobile,
        email,
        password,
        role,
        referred_by: referredBy,
      });
      toast.success(data.message);
      setName("");
      setMobile("");
      setEmail("");
      setPassword("");
      setRole("USER");
      setReferrerMobile("");
      setReferredBy(null);
      setReferrerError("");
      // localStorage.setItem('email', email)
      // navigate('/verify')
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setBtnLoading(false);
    }
  };
  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-24 mx-auto flex flex-wrap items-center">
        <div className="lg:w-3/5 md:w-1/2 md:pr-16 lg:pr-0 pr-0">
          <h1 className="title-font font-medium text-3xl text-gray-900">
            Slow-carb next level shoindcgoitch ethical authentic, poko scenester
          </h1>
          <p className="leading-relaxed mt-4">
            Poke slow-carb mixtape knausgaard, typewriter street art gentrify
            hammock starladder roathse. Craies vegan tousled etsy austin.
          </p>
        </div>
        <form
          onSubmit={submitHandler}
          className="lg:w-2/6 md:w-1/2 bg-gray-100 rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0"
        >
          <h2 className="text-gray-900 text-lg font-medium title-font mb-5">
            Register
          </h2>
          <div className="relative mb-4">
            <label htmlFor="name" className="leading-7 text-sm text-gray-600">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="relative mb-4">
            <label htmlFor="mobile" className="leading-7 text-sm text-gray-600">
              Mobile
            </label>
            <input
              type="number"
              id="mobile"
              name="mobile"
              className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />
          </div>
          <div className="relative mb-4">
            <label htmlFor="role" className="leading-7 text-sm text-gray-600">
              Role
            </label>
            <select
              id="role"
              name="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            >
              <option value="USER">USER</option>
              <option value="VENDOR">VENDOR</option>
            </select>
          </div>
          <div className="relative mb-4">
            <label htmlFor="email" className="leading-7 text-sm text-gray-600">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="relative mb-4">
            <label
              htmlFor="referrerMobile"
              className="leading-7 text-sm text-gray-600"
            >
              Referrer Mobile (Optional)
            </label>
            <input
              type="number"
              id="referrerMobile"
              name="referrerMobile"
              className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              value={referrerMobile}
              onChange={handleReferrerChange}
              placeholder="Enter referrer's mobile number"
            />
            {referrerError && (
              <p className="text-red-500 text-xs mt-1">{referrerError}</p>
            )}
            {referredBy && (
              <p className="text-green-500 text-xs mt-1">✓ Referrer verified</p>
            )}
          </div>
          <div className="relative mb-4">
            <label
              htmlFor="password"
              className="leading-7 text-sm text-gray-600"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            className="text-black bg-indigo-600 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
            disabled={btnLoading}
          >
            {btnLoading ? "Loading..." : "Register"}
          </button>
          <Link to="/login" className="text-xs text-gray-500 mt-3">
            {" "}
            Have an account?
          </Link>
        </form>
      </div>
    </section>
  );
};

export default Register;
