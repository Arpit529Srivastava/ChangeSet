# ChangeSet Demo

A full-stack demo application showcasing version management with ChangeSet, featuring a Next.js frontend and Go backend for email functionality.

## 🚀 Features

- **Frontend**: Modern Next.js 14 application with TypeScript and Tailwind CSS
- **Backend**: Go REST API for email sending with SMTP integration
- **Version Management**: Automated versioning and publishing with ChangeSet
- **CI/CD**: GitHub Actions workflows for automated testing and deployment

## 📁 Project Structure

```
ChangeSet/
├── src/                    # Next.js frontend source
│   ├── app/               # App Router pages and API routes
│   └── ...
├── backend/               # Go backend service
│   ├── main.go           # Main server file
│   ├── go.mod            # Go module file
│   └── README.md         # Backend documentation
├── .github/              # GitHub Actions workflows
│   └── workflows/        # CI/CD workflows
├── .changeset/           # ChangeSet configuration
└── package.json          # Frontend dependencies
```

## 🛠️ Setup

### Frontend (Next.js)

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Backend (Go)

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

The backend includes a mock email service for development. If SMTP configuration is not provided, emails will be logged instead of actually sent.

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

### Backend API

- `GET /health` - Health check
- `POST /send-email` - Send email

### Frontend API

- `POST /api/send-email` - Proxy to backend email service

## 🎨 UI Features

- Modern, responsive design with Tailwind CSS
- Form validation and error handling
- Loading states and success/error feedback
- Beautiful gradient backgrounds and smooth animations

## 🔒 Security

- CORS configuration for frontend-backend communication
- Environment variable management for sensitive data
- Input validation on both frontend and backend

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
