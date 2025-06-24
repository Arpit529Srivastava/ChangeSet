# ChangeSet Demo Backend

An enhanced Go backend service for sending emails, part of the ChangeSet demo application with improved features, monitoring, and security.

## 🚀 Features

- **RESTful API** for sending emails with comprehensive validation
- **SMTP integration** with environment configuration
- **Enhanced mock email service** for development
- **CORS support** for frontend integration
- **Health check endpoint** with service status
- **Statistics endpoint** for monitoring email metrics
- **Rate limiting** to prevent abuse (5 seconds between requests)
- **Request logging** with timing information
- **API versioning** support
- **Enhanced error handling** with detailed error codes
- **Email ID generation** for tracking

## 🛠️ Setup

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

## 📊 API Endpoints

### Health Check
- `GET /health` - Health check with service status

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "version": "2.0.0",
  "services": {
    "email": "operational",
    "database": "n/a",
    "cache": "n/a"
  }
}
```

### Statistics
- `GET /stats` - Email statistics and server metrics

**Response:**
```json
{
  "total_emails_sent": 42,
  "successful_emails": 40,
  "failed_emails": 2,
  "last_email_sent": "2024-01-15T10:25:00Z",
  "uptime": "2h30m15s"
}
```

### Send Email
- `POST /send-email` - Send email (legacy endpoint)
- `POST /api/v1/email` - Send email (versioned endpoint)

**Request:**
```json
{
  "to": "recipient@example.com",
  "subject": "Test Subject",
  "body": "Test message body"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Email sent successfully to recipient@example.com",
  "id": "email_1705312500000000000"
}
```

**Error Response:**
```json
{
  "error": "Rate limit exceeded",
  "code": 429,
  "message": "Please wait 5 seconds before sending another email"
}
```

## 🔒 Security Features

- **Rate Limiting**: 5-second cooldown between email requests per IP
- **Input Validation**: Comprehensive validation of email requests
- **CORS Configuration**: Secure cross-origin resource sharing
- **Error Handling**: Detailed error responses without exposing sensitive information

## 📈 Monitoring

The backend provides real-time statistics including:
- Total emails sent
- Successful vs failed emails
- Last email timestamp
- Server uptime

## 🧪 Development

If SMTP configuration is not provided, the service will use an enhanced mock email service that:
- Logs email details with timestamps
- Generates unique email IDs
- Updates statistics counters
- Provides realistic response times

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `8080` |
| `SMTP_HOST` | SMTP server host | - |
| `SMTP_PORT` | SMTP server port | `587` |
| `SMTP_USER` | SMTP username | - |
| `SMTP_PASS` | SMTP password | - |
| `FROM_EMAIL` | From email address | - |

## 📝 Logging

The backend provides detailed logging including:
- Request/response timing
- Email sending status
- Error details
- Rate limiting events

Example log output:
```
🚀 Enhanced ChangeSet Backend starting on port 8080
📊 Health check available at http://localhost:8080/health
📈 Stats available at http://localhost:8080/stats
📨 POST /send-email 127.0.0.1:12345
⏱️  POST /send-email completed in 45.2ms
📧 Email configuration missing, using enhanced mock email service
``` 