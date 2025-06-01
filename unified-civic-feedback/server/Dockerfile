# Stage 1: Build the Go binary
FROM golang:1.20-alpine AS builder
WORKDIR /app

# Copy go.mod and go.sum first (leverages layer caching)
COPY go.mod go.sum ./
RUN go mod download

# Copy the rest of the source
COPY . .

# Compile the binary (static linking enabled by CGO_ENABLED=0)
ENV CGO_ENABLED=0
RUN go build -o ucffi-server main.go

# Stage 2: Create a minimal runtime image
FROM alpine:3.18
RUN apk add --no-cache ca-certificates

WORKDIR /root/
# Copy the compiled binary from the builder stage
COPY --from=builder /app/ucffi-server .

# Copy templates and static assets
COPY --from=builder /app/templates ./templates
COPY --from=builder /app/assets ./assets

# Expose port (must match your Gin server’s port)
EXPOSE 3000

# Set environment (optional default; override via Compose or CLI)
ENV PORT=3000

# Run the binary
CMD ["./ucffi-server"]
