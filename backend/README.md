# ChangeSet Demo Backend

A Go backend service for sending emails, part of the ChangeSet demo application.

## Features

- RESTful API for sending emails
- SMTP integration with environment configuration
- Mock email service for development
- CORS support for frontend integration
- Health check endpoint

## Setup

1. Install Go dependencies:
```bash
go mod tidy
```

2. Create a `.env` file in the backend directory:
```env
PORT=8080
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=your-email@gmail.com
```

3. Run the server:
```bash
go run main.go
```

## API Endpoints

- `GET /health` - Health check
- `POST /send-email` - Send email

### Send Email Request
```json
{
  "to": "recipient@example.com",
  "subject": "Test Subject",
  "body": "Test message body"
}
```

### Send Email Response
```json
{
  "success": true,
  "message": "Email sent successfully to recipient@example.com"
}
```

## Development

If SMTP configuration is not provided, the service will use a mock email service that logs the email details instead of actually sending emails. 