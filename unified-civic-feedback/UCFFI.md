# Unified Civic Feedback Interface (UCFFI)

## Overview
This repository contains the proof-of-concept for the **Unified Civic Feedback Interface (UCFFI)** — a platform that connects citizens with municipal agencies via a unified, geo-tagged issue reporting API and dashboard.

## Project Structure
~~~
unified-civic-feedback/
├── server/
│   ├── assets/               # Static JS, CSS, and image files
│   │   ├── js/
│   │   │   └── main.js       # JavaScript to handle UI interactions and API calls
│   │   ├── css/
│   │   │   └── styles.css    # Basic styling for PWA pages
│   │   └── images/           # Icons, logos, etc.
│   ├── templates/
│   │   ├── index.html        # Issue submission form with map & fields
│   │   └── status.html       # Status tracking page for submitted issues
│   ├── .env                  # Environment variables (e.g., API keys, DB URL)
│   ├── go.mod                # Go module definitions
│   ├── go.sum                # Go checksums
│   └── main.go               # Entry point: API routes + template rendering + static file server
├── docs/
│   ├── README.md             # Documentation and quickstart guides (this file)
│   └── contributing.md       # Contribution guidelines
├── examples/
│   └── sample-request.json   # Example payload for issue creation
├── .github/
│   ├── ISSUE_TEMPLATE/       # Bug & feature request templates
│   ├── workflows/            # CI/CD GitHub Actions (linting, test, build)
│   └── PULL_REQUEST_TEMPLATE.md
├── .gitignore
└── Concept.md                 # High-level overview (updated separately)
~~~



## Quickstart (Local)

Ready to get the **Unified Civic Feedback Interface (UCFFI)** running on your machine? Follow these simple steps to set up the local environment and launch the application.

### 1. Install Go

Make sure you have **Go (v1.16 or newer)** installed. If not, you can download it from the [official Go website](https://go.dev/doc/install).

### 2. Clone the Repository

Open your terminal or command prompt and run the following commands to clone the UCFFI repository and navigate into its directory:

```bash
git clone [https://github.com/your-org/unified-civic-feedback.git](https://github.com/your-org/unified-civic-feedback.git)
cd unified-civic-feedback
```

```
cd server
go mod tidy
go run main.go
```

Submit issues: http://localhost:3000/

Track status: http://localhost:3000/status