# ChangeSet Demo

A full-stack demo application showcasing version management with ChangeSet, featuring a Next.js frontend with Three.js 3D effects and an enhanced Go backend for email functionality.

## 🚀 Features

- **Frontend**: Modern Next.js 14 application with TypeScript, Tailwind CSS, and Three.js 3D background
- **3D Effects**: Animated floating particles with Three.js and React Three Fiber
- **Enhanced UI**: Glass morphism effects, smooth animations, and responsive design
- **Backend**: Enhanced Go REST API with monitoring, rate limiting, and comprehensive logging
- **Version Management**: Automated versioning and publishing with ChangeSet
- **CI/CD**: GitHub Actions workflows for automated testing and deployment

## 🎨 UI Enhancements

- **Animated Background**: Dynamic gradient backgrounds with smooth color transitions
- **3D Particle System**: Interactive Three.js particle background with auto-rotation
- **Glass Morphism**: Modern glass-effect components with backdrop blur
- **Smooth Animations**: Framer Motion animations for enhanced user experience
- **Responsive Design**: Optimized for all device sizes

## 📁 Project Structure

```
ChangeSet/
├── src/                    # Next.js frontend source
│   ├── app/               # App Router pages and API routes
│   ├── components/        # React components including Three.js
│   │   ├── ThreeBackground.tsx
│   │   └── ThreeScene.tsx
│   └── ...
├── backend/               # Enhanced Go backend service
│   ├── main.go           # Main server file with new features
│   ├── go.mod            # Go module file
│   └── README.md         # Backend documentation
├── .github/              # GitHub Actions workflows
│   └── workflows/        # CI/CD workflows
├── .changeset/           # ChangeSet configuration
└── package.json          # Frontend dependencies
```

## 🛠️ Setup

### Frontend (Next.js + Three.js)

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Backend (Enhanced Go)

1. Navigate to backend directory:
```bash
cd backend
```

2. Install Go dependencies:
```bash
go mod tidy
```

3. Create `.env` file (optional for development):
```env
PORT=8080
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=your-email@gmail.com
```

4. Run the server:
```bash
go run main.go
```

The backend will run on `http://localhost:8080`.

## 🔧 Development

### Email Service

The enhanced backend includes an improved mock email service for development. If SMTP configuration is not provided, emails will be logged with detailed statistics instead of actually sent.

### New Backend Features

- **Health Monitoring**: `/health` endpoint with service status
- **Statistics**: `/stats` endpoint for email metrics
- **Rate Limiting**: 5-second cooldown between requests
- **Enhanced Logging**: Detailed request/response timing
- **API Versioning**: Support for versioned endpoints
- **Better Error Handling**: Comprehensive error responses

### Environment Variables

- `GO_BACKEND_URL`: URL of the Go backend (default: `http://localhost:8080`)
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `FROM_EMAIL`: SMTP configuration for real email sending

## 📦 Version Management

This project uses [ChangeSet](https://github.com/changesets/changesets) for version management:

1. Create a changeset:
```bash
npx changeset
```

2. Version packages:
```bash
npx changeset version
```

3. Publish packages:
```bash
npx changeset publish
```

## 🤖 CI/CD

GitHub Actions workflows are configured for:

- **Changeset Check**: Validates changesets on pull requests
- **Auto Changeset**: Automatically creates changesets for PRs without them
- **Version & Publish**: Automatically versions and publishes on main branch push

## 📝 API Endpoints

### Enhanced Backend API

- `GET /health` - Health check with service status
- `GET /stats` - Email statistics and server metrics
- `POST /send-email` - Send email (legacy endpoint)
- `POST /api/v1/email` - Send email (versioned endpoint)

### Frontend API

- `POST /api/send-email` - Proxy to backend email service

## 🎨 UI Features

- **Three.js 3D Background**: Animated particle system with auto-rotation
- **Glass Morphism**: Modern glass-effect components with backdrop blur
- **Animated Gradients**: Dynamic background colors with smooth transitions
- **Framer Motion**: Smooth animations and micro-interactions
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Form Validation**: Real-time validation with error handling
- **Loading States**: Beautiful loading animations and feedback

## 🔒 Security

- **Rate Limiting**: Prevents abuse with 5-second cooldown
- **CORS Configuration**: Secure frontend-backend communication
- **Input Validation**: Comprehensive validation on both frontend and backend
- **Environment Variable Management**: Secure handling of sensitive data

## 🚀 Performance

- **Optimized 3D Rendering**: Efficient Three.js implementation
- **Lazy Loading**: Components load only when needed
- **Minimal Bundle Size**: Optimized dependencies and imports
- **Fast Backend**: Efficient Go implementation with minimal overhead

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
