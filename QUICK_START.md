# Quick Start Guide - Admin Dashboard

Get the admin dashboard running in minutes!

## Prerequisites

Ensure you have:

- Node.js 16+ installed
- Backend running on `http://localhost:8000`
- Database and Redis configured (if using backend)

## Quick Setup (3 Steps)

### Step 1: Install Dependencies

```bash
cd admin
npm install
```

### Step 2: Start Development Server

```bash
npm run dev
```

You should see:

```
VITE v7.x.x  ready in xxx ms
➜  Local:   http://localhost:5174/
```

### Step 3: Open in Browser

Go to: **http://localhost:5174**

## First Time Login

1. **Register** (if needed) or use existing admin account
2. **Enter Email & Password**
3. **Check your email for OTP** (in dev mode, check server logs)
4. **Enter OTP** to complete login
5. **Access Dashboard** to see purchase requests

## What You Can Do

- ✅ View all purchase requests
- ✅ Filter by status (Pending, Approved, Rejected)
- ✅ Approve purchase requests
- ✅ Reject purchase requests
- ✅ See real-time statistics
- ✅ Manage transactions

## File Structure

```
admin/
├── src/pages/        # Login, Dashboard, Transactions
├── src/components/   # NavBar, PurchaseTransaction
├── src/context/      # Global state (AppContext)
├── App.jsx          # Main app with routing
├── main.jsx         # Entry point
└── vite.config.js   # Build configuration
```

## Common Tasks

### Change API URL

Edit `src/main.jsx`:

```javascript
export const server = "http://your-api-url:8000";
```

### Update Page Styling

- Components use Tailwind CSS
- Edit `src/index.css` or component className attributes
- Find color schemes in `src/config.js`

### Add New Page

1. Create file in `src/pages/`
2. Add route in `src/App.jsx`
3. Add navigation in `src/components/NavBar.jsx`

### Customize Transaction Component

Edit `src/components/PurchaseTransaction.jsx` to modify how requests are displayed

## Troubleshooting

### Blank page?

- Check browser console for errors (F12)
- Verify backend is running on port 8000
- Clear browser cache (Ctrl+Shift+Del)

### Can't login?

- Verify user has ADMIN role in database
- Check backend logs
- Ensure JWT tokens are working

### API errors?

- Check if backend is running
- Verify CORS configuration
- Check network tab in DevTools

## Development Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Next Steps

1. Read [admin/README.md](admin/README.md) for detailed info
2. Check [SETUP_GUIDE.md](SETUP_GUIDE.md) for complete system setup
3. Review [ADMIN_IMPLEMENTATION_SUMMARY.md](ADMIN_IMPLEMENTATION_SUMMARY.md) for implementation details

## Key Files to Know

| File                                     | Purpose                |
| ---------------------------------------- | ---------------------- |
| `src/App.jsx`                            | Main app & routing     |
| `src/pages/Dashboard.jsx`                | Transaction management |
| `src/context/AppContext.jsx`             | Authentication state   |
| `src/apiInterceptor.js`                  | API requests           |
| `src/components/PurchaseTransaction.jsx` | Transaction card       |
| `src/main.jsx`                           | App configuration      |

## Documentation

- **Admin Dashboard Docs**: [admin/README.md](admin/README.md)
- **Full Setup Guide**: [SETUP_GUIDE.md](SETUP_GUIDE.md)
- **Implementation Details**: [ADMIN_IMPLEMENTATION_SUMMARY.md](ADMIN_IMPLEMENTATION_SUMMARY.md)

## Support

Having issues? Check:

1. Browser DevTools (F12) - Console tab
2. Backend logs - Look for error messages
3. Network tab - Check API requests
4. Documentation files above

---

**Ready to go!** 🚀

Your admin dashboard is set up and ready to manage transactions professionally.
