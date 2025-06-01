package main

import (
	"fmt"
	"html/template"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
)

// Issue represents a civic feedback ticket
//
//	type Issue struct {
//		gorm.Model
//		Description string  `json:"description"`
//		Latitude    float64 `json:"latitude"`
//		Longitude   float64 `json:"longitude"`
//		Category    string  `json:"category"`
//		Status      string  `json:"status"`
//	}
type Issue struct {
	ID          uint      `gorm:"primary_key" json:"id"`
	Description string    `json:"description"`
	Latitude    float64   `json:"latitude"`
	Longitude   float64   `json:"longitude"`
	Category    string    `json:"category"`
	Status      string    `json:"status"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

var (
	db        *gorm.DB
	templates *template.Template
)

func initDB() {
	// Load PostgreSQL URL from environment (e.g., postgres://user:pass@host:port/dbname)
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		log.Fatal("DATABASE_URL environment variable not set")
	}

	var err error
	db, err = gorm.Open("postgres", dbURL)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	// Auto-migrate the schema
	db.AutoMigrate(&Issue{})
}

func main() {
	// Initialize database
	initDB()

	// Load templates
	templates = template.Must(template.ParseGlob("templates/*.html"))

	// Set Gin to release mode
	gin.SetMode(gin.ReleaseMode)
	r := gin.Default()

	// Serve static assets
	r.Static("/static", "assets")

	// Routes for UI pages
	r.GET("/", showIndexPage)
	r.GET("/status", showStatusPage)
	r.GET("/dashboard", showDashboard)

	// API endpoints
	r.POST("/api/issues", createIssue)
	r.GET("/api/issues/:id", getIssue)
	r.GET("/api/metrics", getMetrics)

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}
	r.Run(fmt.Sprintf(":%s", port))
}

// showIndexPage renders the issue submission form
func showIndexPage(c *gin.Context) {
	templates.ExecuteTemplate(c.Writer, "index.html", nil)
}

// showStatusPage renders the status tracking page
func showStatusPage(c *gin.Context) {
	templates.ExecuteTemplate(c.Writer, "status.html", nil)
}

// showDashboard renders aggregated KPIs
func showDashboard(c *gin.Context) {
	// Render template; actual data fetched via AJAX from /api/metrics
	templates.ExecuteTemplate(c.Writer, "dashboard.html", nil)
}

// createIssue handles issue creation and persists to DB
func createIssue(c *gin.Context) {
	var issue Issue
	if err := c.ShouldBindJSON(&issue); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	issue.Status = "Pending"
	if err := db.Create(&issue).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, issue)
}

// getIssue returns status of an existing issue from DB
func getIssue(c *gin.Context) {
	id := c.Param("id")
	var issue Issue
	if err := db.First(&issue, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "Issue not found"})
		return
	}
	c.JSON(http.StatusOK, issue)
}

// getMetrics returns aggregated KPIs: total issues, avg resolution time, etc.
func getMetrics(c *gin.Context) {
	var total int64
	db.Model(&Issue{}).Count(&total)

	// For demo, resolution time and satisfaction metrics are mocked or calculated here
	metrics := gin.H{
		"total_issues": total,
		"pending_issues": func() int64 {
			var count int64
			db.Model(&Issue{}).Where("status = ?", "Pending").Count(&count)
			return count
		}(),
		"resolved_issues": func() int64 {
			var count int64
			db.Model(&Issue{}).Where("status = ?", "Resolved").Count(&count)
			return count
		}(),
	}
	c.JSON(http.StatusOK, metrics)
}
