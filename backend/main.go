package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"gopkg.in/gomail.v2"
)

// Request/Response structures
type EmailRequest struct {
	To      string `json:"to"`
	Subject string `json:"subject"`
	Body    string `json:"body"`
}

type EmailResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
	ID      string `json:"id,omitempty"`
}

type ErrorResponse struct {
	Error   string `json:"error"`
	Code    int    `json:"code"`
	Message string `json:"message"`
}

type HealthResponse struct {
	Status    string            `json:"status"`
	Timestamp time.Time         `json:"timestamp"`
	Version   string            `json:"version"`
	Services  map[string]string `json:"services"`
}

type StatsResponse struct {
	TotalEmailsSent  int64     `json:"total_emails_sent"`
	SuccessfulEmails int64     `json:"successful_emails"`
	FailedEmails     int64     `json:"failed_emails"`
	LastEmailSent    time.Time `json:"last_email_sent"`
	Uptime           string    `json:"uptime"`
}

// Global variables for stats
var (
	startTime     = time.Now()
	totalEmails   int64
	successEmails int64
	failedEmails  int64
	lastEmailTime time.Time
)

// Rate limiting map
var rateLimitMap = make(map[string]time.Time)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using system environment variables")
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	r := mux.NewRouter()

	// Middleware
	r.Use(corsMiddleware)
	r.Use(loggingMiddleware)
	r.Use(rateLimitMiddleware)

	// Routes
	r.HandleFunc("/health", healthHandler).Methods("GET")
	r.HandleFunc("/stats", statsHandler).Methods("GET")
	r.HandleFunc("/send-email", sendEmailHandler).Methods("POST")
	r.HandleFunc("/api/v1/email", sendEmailHandler).Methods("POST") // API versioning

	// Start server
	log.Printf("🚀 Enhanced ChangeSet Backend starting on port %s", port)
	log.Printf("📊 Health check available at http://localhost:%s/health", port)
	log.Printf("📈 Stats available at http://localhost:%s/stats", port)
	log.Fatal(http.ListenAndServe(":"+port, r))
}

// Middleware functions
func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		w.Header().Set("Access-Control-Max-Age", "86400")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func loggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		log.Printf("📨 %s %s %s", r.Method, r.URL.Path, r.RemoteAddr)

		next.ServeHTTP(w, r)

		log.Printf("⏱️  %s %s completed in %v", r.Method, r.URL.Path, time.Since(start))
	})
}

func rateLimitMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path == "/send-email" || r.URL.Path == "/api/v1/email" {
			clientIP := r.RemoteAddr
			if lastRequest, exists := rateLimitMap[clientIP]; exists {
				if time.Since(lastRequest) < 5*time.Second { // 5 second rate limit
					w.WriteHeader(http.StatusTooManyRequests)
					json.NewEncoder(w).Encode(ErrorResponse{
						Error:   "Rate limit exceeded",
						Code:    429,
						Message: "Please wait 5 seconds before sending another email",
					})
					return
				}
			}
			rateLimitMap[clientIP] = time.Now()
		}
		next.ServeHTTP(w, r)
	})
}

// Handler functions
func healthHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	response := HealthResponse{
		Status:    "healthy",
		Timestamp: time.Now(),
		Version:   "2.0.0",
		Services: map[string]string{
			"email":    "operational",
			"database": "n/a",
			"cache":    "n/a",
		},
	}

	json.NewEncoder(w).Encode(response)
}

func statsHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	response := StatsResponse{
		TotalEmailsSent:  totalEmails,
		SuccessfulEmails: successEmails,
		FailedEmails:     failedEmails,
		LastEmailSent:    lastEmailTime,
		Uptime:           time.Since(startTime).String(),
	}

	json.NewEncoder(w).Encode(response)
}

func sendEmailHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// Parse request
	var req EmailRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		sendErrorResponse(w, "Invalid request body", 400, "Failed to parse JSON")
		return
	}

	// Validate request
	if err := validateEmailRequest(req); err != nil {
		sendErrorResponse(w, err.Error(), 400, "Validation failed")
		return
	}

	// Update stats
	totalEmails++
	lastEmailTime = time.Now()

	// Get email configuration
	smtpConfig := getSMTPConfig()
	if !smtpConfig.isValid() {
		log.Println("📧 Email configuration missing, using enhanced mock email service")
		response := EmailResponse{
			Success: true,
			Message: fmt.Sprintf("Mock email sent to %s: %s", req.To, req.Subject),
			ID:      generateEmailID(),
		}
		successEmails++
		json.NewEncoder(w).Encode(response)
		return
	}

	// Send email
	if err := sendEmail(req, smtpConfig); err != nil {
		failedEmails++
		log.Printf("❌ Error sending email: %v", err)
		sendErrorResponse(w, "Failed to send email", 500, err.Error())
		return
	}

	successEmails++
	response := EmailResponse{
		Success: true,
		Message: fmt.Sprintf("Email sent successfully to %s", req.To),
		ID:      generateEmailID(),
	}
	json.NewEncoder(w).Encode(response)
}

// Helper functions
func validateEmailRequest(req EmailRequest) error {
	if req.To == "" {
		return fmt.Errorf("email address is required")
	}
	if req.Subject == "" {
		return fmt.Errorf("subject is required")
	}
	if req.Body == "" {
		return fmt.Errorf("message body is required")
	}
	if len(req.Body) > 10000 {
		return fmt.Errorf("message body too long (max 10000 characters)")
	}
	return nil
}

func sendErrorResponse(w http.ResponseWriter, error string, code int, message string) {
	w.WriteHeader(code)
	json.NewEncoder(w).Encode(ErrorResponse{
		Error:   error,
		Code:    code,
		Message: message,
	})
}

func generateEmailID() string {
	return fmt.Sprintf("email_%d", time.Now().UnixNano())
}

// SMTP Configuration
type SMTPConfig struct {
	Host      string
	Port      int
	User      string
	Pass      string
	FromEmail string
}

func (c *SMTPConfig) isValid() bool {
	return c.Host != "" && c.Port > 0 && c.User != "" && c.Pass != "" && c.FromEmail != ""
}

func getSMTPConfig() SMTPConfig {
	smtpHost := os.Getenv("SMTP_HOST")
	smtpPortStr := os.Getenv("SMTP_PORT")
	smtpUser := os.Getenv("SMTP_USER")
	smtpPass := os.Getenv("SMTP_PASS")
	fromEmail := os.Getenv("FROM_EMAIL")

	smtpPort := 587 // default port
	if smtpPortStr != "" {
		if port, err := strconv.Atoi(smtpPortStr); err == nil {
			smtpPort = port
		}
	}

	return SMTPConfig{
		Host:      smtpHost,
		Port:      smtpPort,
		User:      smtpUser,
		Pass:      smtpPass,
		FromEmail: fromEmail,
	}
}

func sendEmail(req EmailRequest, config SMTPConfig) error {
	// Create email message
	m := gomail.NewMessage()
	m.SetHeader("From", config.FromEmail)
	m.SetHeader("To", req.To)
	m.SetHeader("Subject", req.Subject)
	m.SetBody("text/plain", req.Body)

	// Send email
	d := gomail.NewDialer(config.Host, config.Port, config.User, config.Pass)
	return d.DialAndSend(m)
}
