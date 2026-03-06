import express from 'express';
import dotenv from 'dotenv';
import {createClient} from 'redis'
import cookieParser from 'cookie-parser';
import cors from 'cors';

dotenv.config();

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
if (!redisUrl) {
  throw new Error("REDIS_URL is not defined in environment variables");
  process.exit(1);
}
export const redisClient = createClient({
  url: redisUrl
});

redisClient
.connect()
.then(() => console.log("Connected to Redis"))
.catch(err => console.error("Failed to connect to Redis", err));

const app = express();


// importing routes
import userRoute from './routes/userRoute.js';
import transactinRoutes from './routes/transactionRoutes.js'
import vendorRoutes from './routes/vendorRoutes.js'
import adminRoutes from './routes/adminRoutes.js'

console.log(process.env.FRONTEND_URL)
// middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin:[  process.env.FRONTEND_URL  ] ,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
}));
// using routes
app.use('/api/v1/users', userRoute);
app.use('/api/v1', transactinRoutes)
app.use('/api/v1/vendor', vendorRoutes)
app.use('/api/v1/admin', adminRoutes)

const PORT = process.env.PORT || 5000 ;

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});