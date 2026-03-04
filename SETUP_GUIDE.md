# Admin Dashboard - Complete Setup Guide

This guide provides step-by-step instructions to set up and run the admin dashboard application along with the backend services.

## Overview

The admin dashboard is a professional, scalable application that allows administrators to:

- Authenticate securely with OTP verification
- View pending vendor purchase requests
- Approve or reject purchase requests
- Track transaction statistics
- Manage permissions and access

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Admin Dashboard                       │
│  (React + Vite + Tailwind CSS)                           │
│  - Login/OTP Verification                               │
│  - Dashboard with Transaction Management                │
│  - Real-time Status Updates                             │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ HTTP/REST API
                     │
         ┌───────────▼────────────┐
         │    Backend Server      │
         │   (Node.js + Express)  │
         │                        │
         │  ├─ /api/v1/admin      │
         │  ├─ /api/v1/users      │
         │  └─ /api/v1/vendor     │
         └───────────┬────────────┘
                     │
         ┌───────────┴────────────┐
         │                        │
    ┌────▼────┐             ┌────▼────┐
    │ Postgres │             │  Redis  │
    │ Database │             │ Cache   │
    └──────────┘             └─────────┘
```

## Prerequisites

Before starting, ensure you have:

- **Node.js**: Version 16 or higher
  - Download from: https://nodejs.org/
  - Verify: `node --version` and `npm --version`

- **Git**: For version control
  - Download from: https://git-scm.com/

- **Database**: PostgreSQL must be running
  - Ensure database is accessible
  - Database credentials configured

- **Redis**: Optional but recommended
  - For session/token caching
  - For rate limiting

## Installation Steps

### 1. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Configure environment variables:

Create `.env` file with:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/admin_db
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:5173
PORT=8000
```

Run database migrations:

```bash
npx prisma migrate dev --name init
```

Start the backend server:

```bash
npm run dev
# or
npm start
```

Expected output:

```
Server is running on http://localhost:8000
Connected to Redis
```

### 2. Admin Dashboard Setup

Open a new terminal and navigate to admin directory:

```bash
cd admin
```

Install dependencies:

```bash
npm install
```

The API server URL is configured in `src/main.jsx`:

```javascript
export const server = "http://localhost:8000";
```

Update if your backend is on a different URL.

Start the development server:

```bash
npm run dev
```

Expected output:

```
VITE v7.x.x  ready in xxx ms

➜  Local:   http://localhost:5174/
➜  press h to show help
```

### 3. Frontend Setup (Optional)

For a complete system test, also set up the main frontend:

```bash
cd frontend
npm install
npm run dev
```

## Running the Applications

### Development Mode

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev
```

**Terminal 2 - Admin Dashboard:**

```bash
cd admin
npm run dev
```

**Terminal 3 - Frontend (Optional):**

```bash
cd frontend
npm run dev
```

Access the applications:

- Admin Dashboard: http://localhost:5174
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000

## Testing the Admin Dashboard

### 1. Create an Admin User

Use a REST client (Postman, curl, etc.) or the frontend registration:

```bash
curl -X POST http://localhost:8000/api/v1/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "AdminPassword123!",
    "name": "Admin User",
    "mobile": "+1234567890",
    "role": "ADMIN"
  }'
```

Or use the frontend to register an account, then manually update the role in the database.

### 2. Complete Admin Login Flow

1. Navigate to http://localhost:5174
2. Enter admin email and password
3. Click "Login"
4. Check your email for OTP (check console/logs in dev mode)
5. Enter OTP and verify
6. Access the admin dashboard

### 3. Test Transaction Management

1. Create a vendor purchase request through the frontend (as vendor)
2. Check the request appears in admin dashboard
3. Test the approve/reject functionality
4. Verify transaction appears in the ledger
5. Check vendor points are updated

## Database Schema

Key tables for admin functionality:

```sql
-- Users table
users (id, email, password, name, role, points, mobile, ...)

-- Purchase Requests
purchaseRequest (
  request_id,
  vendor_id,
  points,
  status (PENDING/APPROVED/REJECTED),
  created_at,
  approved_by,
  approved_at
)

-- Transaction Ledger
transactionLedger (
  transaction_id,
  user_id,
  correspondent_id,
  type,
  direction,
  amount,
  created_at
)

-- Vendor Purchases
vendorPurchase (
  purchase_id,
  transaction_id,
  vendor_id,
  points_purchased,
  created_at
)
```

## API Endpoints Used by Admin Dashboard

### Authentication

- `POST /api/v1/users/login` - Admin login
- `POST /api/v1/users/verify-otp` - Verify OTP
- `GET /api/v1/users/me` - Get current admin info
- `POST /api/v1/users/logout` - Logout
- `POST /api/v1/users/refresh` - Refresh access token
- `POST /api/v1/users/refresh-csrf` - Refresh CSRF token

### Admin Operations

- `GET /api/v1/admin/pending-requests` - Get all purchase requests
- `POST /api/v1/admin/approve-purchase-request` - Approve request
- `POST /api/v1/admin/reject-purchase-request` - Reject request

## File Structure

```
.
├── admin/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── VerifyOtp.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── Transactions.jsx
│   │   ├── components/
│   │   │   ├── NavBar.jsx
│   │   │   └── PurchaseTransaction.jsx
│   │   ├── context/
│   │   │   └── AppContext.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── apiInterceptor.js
│   │   ├── config.js
│   │   ├── Loading.jsx
│   │   └── index.css
│   └── ...
├── backend/
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── userRoute.js
│   │   └── ...
│   ├── controllers/
│   │   ├── adminController.js
│   │   └── ...
│   ├── middleware/
│   ├── config/
│   ├── prisma/
│   │   └── schema.prisma
│   └── index.js
└── frontend/
    ├── src/
    └── ...
```

## Troubleshooting

### Issue: Backend not starting

**Error**: `REDIS_URL is not defined`

**Solution**:

- Ensure Redis is running
- Set REDIS_URL in `.env`
- Or install and start Redis:

  ```bash
  # macOS
  brew install redis
  brew services start redis

  # Linux
  sudo apt-get install redis-server
  sudo systemctl start redis-server

  # Windows (WSL)
  sudo apt-get install redis-server
  sudo service redis-server start
  ```

### Issue: Admin cannot login

**Error**: `Only admins can access this panel`

**Solution**:

- Verify user has `role: "ADMIN"` in database
- Check database connection
- Verify JWT tokens are being issued correctly

### Issue: OTP not received

**Email Configuration**:

- OTP is sent via email (configured in backend)
- In dev mode, check server logs for OTP
- Ensure email service credentials are configured

### Issue: CORS errors

**Error**: `Access to XMLHttpRequest blocked by CORS policy`

**Solution**:

- Verify FRONTEND_URL in backend `.env`
- Ensure backend CORS is configured for your frontend URL
- Check CORS middleware in `backend/index.js`

### Issue: Database connection failed

**Error**: `P1000 - Authentication failed`

**Solution**:

- Verify DATABASE_URL is correct
- Ensure PostgreSQL is running
- Check database credentials
- Verify database exists

## Production Deployment

### Building for Production

Admin Dashboard:

```bash
cd admin
npm run build
# Output: dist/
```

Backend:

```bash
cd backend
npm run build  # if applicable
```

### Environment Variables

Create `.env.production`:

```env
# Backend
DATABASE_URL=postgresql://prod_user:prod_pass@prod_host:5432/admin_db
REDIS_URL=redis://prod_redis_host:6379
JWT_SECRET=long_secure_secret_key
FRONTEND_URL=https://youradmin.com
PORT=8000

# Admin Dashboard
VITE_API_URL=https://api.youradmin.com
```

### Deployment Steps

1. **Backend**:
   - Deploy to hosting (Heroku, Railway, etc.)
   - Run migrations: `npx prisma migrate deploy`
   - Set environment variables
   - Start server

2. **Admin Dashboard**:
   - Build: `npm run build`
   - Deploy `dist/` folder to CDN or server
   - Configure API URL for production
   - Set up SSL/HTTPS

## Performance Optimization

### Admin Dashboard

- **Code Splitting**: Routes are lazy-loaded
- **Image Optimization**: Use Tailwind CSS instead of images
- **Bundle Size**: Monitor with `npm run build`
- **Caching**: Browser cache with proper headers

### Backend

- **Database Indexing**: Ensure proper indexes on foreign keys
- **Redis Caching**: Cache frequently accessed data
- **Query Optimization**: Use efficient Prisma queries
- **Rate Limiting**: Protect endpoints with rate limits

## Monitoring & Logging

### Backend Logging

Enable detailed logs:

```env
LOG_LEVEL=debug
```

### Admin Dashboard Monitoring

- Use browser DevTools for client-side debugging
- Monitor network requests in Network tab
- Check Console for JavaScript errors

## Scaling Considerations

### For growing user base:

1. **Database**:
   - Implement read replicas
   - Add connection pooling
   - Regular backups

2. **Backend**:
   - Load balancing
   - Horizontal scaling
   - API rate limiting

3. **Admin Dashboard**:
   - CDN for static assets
   - Service Worker for offline capability
   - Progressive Web App (PWA) features

## Security Checklist

- [ ] HTTPS/SSL enabled
- [ ] JWT secrets are strong
- [ ] Database credentials are secure
- [ ] CORS is properly configured
- [ ] CSRF protection enabled
- [ ] Input validation on all endpoints
- [ ] Rate limiting implemented
- [ ] Admin actions are logged
- [ ] Sensitive data is encrypted

## Next Steps

1. **Customize Dashboard**: Modify Dashboard.jsx to add custom widgets
2. **Add Reporting**: Create transaction reports and exports
3. **Implement Notifications**: Add real-time updates with WebSockets
4. **Audit Logging**: Track all admin actions
5. **Advanced Filtering**: Implement advanced search and filters
6. **Admin Roles**: Create sub-roles like approver, reviewer, auditor

## Support & Documentation

For detailed information:

- Backend: See `backend/README.md`
- Admin Dashboard: See `admin/README.md`
- Frontend: See `frontend/README.md`

## License & Attribution

This is part of the points management system.

---

**Last Updated**: March 2026
**Version**: 1.0.0
