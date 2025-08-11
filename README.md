# Medalyst Ticketing System

A full-stack ticketing system built with Node.js, Express, MongoDB, React, React Native, and TypeScript.

## 🚀 Features

- **User Authentication**: JWT-based authentication with login/register
- **Ticket Management**: Create, read, update, and delete tickets with comments
- **Status Tracking**: Track ticket status (Open, In Progress, Closed) and priority levels
- **Comments System**: Add and manage comments on tickets
- **Search & Filter**: Search tickets by name/number, filter by status, sort by date
- **Input Validation**: Comprehensive client-side validation with error messages
- **Cross-Platform**: Web app (React) and mobile app (React Native)
- **API Documentation**: Interactive Swagger documentation
- **Docker Support**: Containerized development environment
- **TypeScript**: Full TypeScript support across all applications

## 📋 Prerequisites

### For Web App (Docker)
- **Docker Desktop** - [Download here](https://www.docker.com/products/docker-desktop/)

### For Mobile App
- **Node.js 20+** - [Download here](https://nodejs.org/)
- **Expo CLI** - `npm install -g @expo/cli`
- **Expo Go app** on your mobile device - [iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent)

### Docker Setup


```bash
# Clone the repository
git clone https://github.com/medalyst/ticketing.git
cd ticketing

# Start all services
docker-compose up

# Or run in detached mode
docker-compose up -d

# To rebuild after changes
docker-compose up --build

# To stop all services
docker-compose down
```

**Services will be available at:**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5050
- **Swagger Docs**: http://localhost:5050/api-docs
- **MongoDB**: localhost:27017

### Mobile Application (React Native)

```bash
# Navigate to mobile app directory
cd mobile-app

# Install dependencies
npm install

# Start the development server
npm start

# Or use Expo CLI directly
npx expo start
```

**To run on device:**
1. Install Expo Go app on your phone
2. Scan QR code from terminal or browser
3. Update API URL in `mobile-app/src/config/api.ts` to your machine's IP address

## 📁 Project Structure

```
medalyst/
├── backend/                 # Node.js/Express API
│   ├── src/
│   │   ├── config/         # Database and Swagger config
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Authentication middleware
│   │   ├── models/         # MongoDB models (User, Ticket, Comment)
│   │   ├── routes/         # API routes
│   │   ├── types/          # TypeScript type definitions
│   │   └── index.ts        # Main server file
│   ├── Dockerfile
│   └── package.json
├── frontend/               # React/TypeScript web app
│   ├── src/
│   │   ├── api/           # API client functions
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React context (auth)
│   │   ├── pages/         # React pages
│   │   ├── utils/         # Validation utilities
│   │   └── main.tsx       # Main React entry
│   ├── Dockerfile
│   └── package.json
├── mobile-app/             # React Native/Expo mobile app
│   ├── src/
│   │   ├── components/    # Reusable components (FormInput, FormPicker)
│   │   ├── contexts/      # React contexts (AuthContext)
│   │   ├── screens/       # Mobile screens
│   │   ├── services/      # API services
│   │   ├── types/         # TypeScript types
│   │   └── utils/         # Validation schemas (Yup)
│   ├── App.tsx
│   └── package.json
├── docker-compose.yml      # Docker services configuration
└── README.md
```

## 📱 Mobile App Features

The React Native mobile app includes all the features from the web app:

- **Authentication**: Login and register with form validation
- **Ticket Management**: View, create, edit, and delete tickets
- **Comments**: Add and delete comments on tickets
- **Search & Filter**: Search tickets by name/number, filter by status
- **Responsive Design**: Optimized for mobile devices
- **Form Validation**: Real-time validation using react-hook-form + Yup
- **Cross-Platform**: Works on both iOS and Android via Expo

### Mobile App Screenshots
- Login/Register screens with validation
- Ticket list with search and filters
- Ticket detail with comments
- Create/edit ticket forms

## 📚 API Documentation

Interactive API documentation is available via Swagger UI:

**URL**: http://localhost:5050/api-docs

### Key API Endpoints

- **Authentication**: `/api/auth/login`, `/api/auth/register`
- **Tickets**: `/api/tickets` (CRUD operations with search/filter)
- **Comments**: `/api/comments` (CRUD operations)

