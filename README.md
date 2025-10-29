# BookIt: Experiences & Slots

A fullstack MERN application for booking travel experiences with slot management. Built with React + TypeScript + Express + MongoDB, featuring a complete booking flow from browsing experiences to confirmation.

## 🚀 Features

- **Experience Browsing**: Browse curated travel experiences with high-quality images
- **Slot Management**: Real-time availability tracking with date/time selection
- **Booking Flow**: Complete booking process with user details and payment
- **Promo Codes**: Support for percentage and flat discount codes
- **Mobile Responsive**: Optimized for all device sizes
- **Safety First**: Certified guides and safety equipment included

## 🛠 Tech Stack

- **Frontend**: React 18 + TypeScript + Vite + TailwindCSS
- **Backend**: Node.js + Express + MongoDB + Mongoose
- **Database**: MongoDB (Atlas or local)
- **Styling**: TailwindCSS with custom design system
- **Images**: Unsplash royalty-free images
- **Deployment**: Vercel (Frontend) + Render/Railway (Backend)

## 📁 Project Structure

```
bookit/
├── backend/                 # Express.js API server
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── models/         # MongoDB models (Experience, Booking, Promo)
│   │   ├── routes/         # API routes
│   │   ├── seed/           # Database seeding
│   │   └── server.js       # Main server file
│   ├── package.json
│   └── env.example
├── frontend/               # React + TypeScript frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service
│   │   └── styles/         # Global styles
│   ├── package.json
│   └── vite.config.ts
├── package.json            # Root package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- MongoDB (local or Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd bookit-fullstack
   ```

2. **Install all dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   
   **Backend** (create `backend/.env`):
   ```env
   MONGO_URI=mongodb://localhost:27017/bookit
   PORT=5000
   NODE_ENV=development
   ```
   
   **Frontend** (create `frontend/.env`):
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Seed the database**
   ```bash
   cd backend
   npm run seed
   ```

5. **Start development servers**
   ```bash
   npm run dev
   ```

This will start:
- Backend server on `http://localhost:5000`
- Frontend dev server on `http://localhost:3000`

## 📋 API Endpoints

### Experiences
- `GET /api/experiences` - List all experiences
- `GET /api/experiences/:id` - Get experience details with slots

### Bookings
- `POST /api/bookings` - Create a new booking (prevents double-booking)

### Promo Codes
- `POST /api/promo/validate` - Validate promo code

### Health Check
- `GET /api/health` - API health status

## 🎨 Design Features

- **Figma-Faithful**: Matches the provided Figma design exactly
- **Responsive Grid**: Adaptive layout for all screen sizes
- **Loading States**: Skeleton loaders and smooth transitions
- **Error Handling**: User-friendly error messages
- **Form Validation**: Real-time validation with helpful feedback
- **Accessibility**: Semantic HTML and keyboard navigation

## 🔧 Available Scripts

### Root Level
- `npm run dev` - Start both frontend and backend
- `npm run install-all` - Install all dependencies
- `npm run build` - Build frontend for production

### Backend
- `npm run start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Seed database with sample data

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🗄 Database Schema

### Experience
```javascript
{
  title: String,
  slug: String,
  price: Number,
  location: String,
  description: String,
  image: String,
  slots: [{
    date: String,
    time: String,
    capacity: Number
  }]
}
```

### Booking
```javascript
{
  refId: String,
  experience: ObjectId,
  date: String,
  time: String,
  qty: Number,
  name: String,
  email: String,
  subtotal: Number,
  taxes: Number,
  total: Number,
  promo: {
    code: String,
    discount: Number
  }
}
```

### Promo
```javascript
{
  code: String,
  type: 'percentage' | 'flat',
  value: Number,
  expiresAt: Date
}
```

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variable: `VITE_API_URL=https://your-backend-url.com/api`
3. Deploy

### Backend (Render/Railway)
1. Connect your GitHub repository
2. Set environment variables:
   - `MONGO_URI` (MongoDB Atlas connection string)
   - `NODE_ENV=production`
3. Deploy

### Database (MongoDB Atlas)
1. Create a MongoDB Atlas cluster
2. Get connection string
3. Update `MONGO_URI` in backend environment

## 🧪 Testing the Application

### Sample Data
The seed script creates 8 experiences with:
- High-quality Unsplash images
- 30 days of availability
- Multiple time slots per day
- Realistic pricing

### Promo Codes
- `SAVE10` - 10% discount
- `FLAT100` - ₹100 flat discount
- `WELCOME20` - 20% discount

### Test Flow
1. Browse experiences on home page
2. Click "View Details" on any experience
3. Select date and time slot
4. Adjust quantity and click "Confirm"
5. Fill in user details and apply promo code
6. Complete booking and view confirmation

## 🔒 Security Features

- **Double-booking Prevention**: Atomic database operations
- **Input Validation**: Server-side validation for all inputs
- **Email Validation**: Proper email format checking
- **CORS Configuration**: Secure cross-origin requests
- **Error Handling**: No sensitive data in error messages

## 📱 Mobile Responsiveness

- **Breakpoints**: Mobile-first design with TailwindCSS
- **Touch-Friendly**: Large buttons and touch targets
- **Optimized Images**: Responsive images with proper aspect ratios
- **Readable Typography**: Scalable font sizes and line heights

## 🎯 Key Features Implemented

✅ **Complete Booking Flow**: Home → Details → Checkout → Result  
✅ **Real-time Slot Management**: Prevents double-booking  
✅ **Promo Code System**: Percentage and flat discounts  
✅ **Mobile Responsive**: Works on all devices  
✅ **Form Validation**: Client and server-side validation  
✅ **Loading States**: Skeleton loaders and spinners  
✅ **Error Handling**: User-friendly error messages  
✅ **Professional UI**: Matches Figma design exactly  

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For issues or questions:
1. Check the API health endpoint: `GET /api/health`
2. Verify environment variables are set correctly
3. Ensure MongoDB is running and accessible
4. Check browser console for frontend errors
5. Check server logs for backend errors

---

**Built with ❤️ using the MERN stack**
