# Backend & Infrastructure Configuration for V2.0

## File: backend/config.env.example

```env
# Backend Services Configuration

# === DATABASE ===
DB_HOST=localhost
DB_PORT=5432
DB_NAME=aura7f_v2
DB_USER=postgres
DB_PASSWORD=your_db_password
DB_SSL_MODE=require
DB_CONNECTION_POOL_MIN=5
DB_CONNECTION_POOL_MAX=20

# === SUPABASE REALTIME ===
REALTIME_ENABLED=true
REALTIME_MAX_CONNECTIONS=1000
REALTIME_JWT_SECRET=your_jwt_secret

# === AUTHENTICATION ===
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=24h
JWT_REFRESH_EXPIRE=7d
OAUTH_CALLBACK_URL=https://api.aura7f.com/auth/callback

# === PASSWORDS & HASHING ===
BCRYPT_ROUNDS=10
PASSWORD_MIN_LENGTH=8
PASSWORD_REQUIRE_SPECIAL_CHARS=true

# === EMAIL SERVICE (SendGrid) ===
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=noreply@aura7f.com
SENDGRID_FROM_NAME=Aura-7F

# === PAYMENT PROCESSING (Stripe) ===
STRIPE_SECRET_KEY=sk_live_your_stripe_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_API_VERSION=2024-04-10

# === STORAGE (Supabase Storage) ===
STORAGE_BUCKET_NAME=aura7f-assets
STORAGE_MAX_FILE_SIZE=10485760
STORAGE_ALLOWED_EXTENSIONS=jpg,jpeg,png,gif,pdf,mp4,webm

# === LOGGING ===
LOG_LEVEL=info
LOG_FORMAT=json
LOG_TO_FILE=true
LOG_FILE_PATH=/var/log/aura7f/backend.log

# === ERROR TRACKING (Sentry) ===
SENTRY_DSN=your_sentry_dsn
SENTRY_ENVIRONMENT=production
SENTRY_TRACE_SAMPLE_RATE=0.1

# === CACHE (Redis) ===
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
REDIS_TTL=3600

# === RATE LIMITING ===
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_EXEMPT_PATHS=/health,/metrics

# === CORS ===
CORS_ORIGIN=https://aura7f.com,https://staging.aura7f.com
CORS_CREDENTIALS=true
CORS_MAX_AGE=3600

# === ADMIN SETTINGS ===
ADMIN_EMAIL=admin@aura7f.com
ADMIN_NOTIFICATION_WEBHOOK=https://alerts.slack.com/services/...

# === SECURITY ===
ENABLE_HTTPS_ONLY=true
ENABLE_HSTS=true
HSTS_MAX_AGE=31536000
ENABLE_CSP=true
ENABLE_HELMET=true

# === MONITORING ===
ENABLE_METRICS=true
METRICS_PORT=9090
ENABLE_HEALTH_CHECK=true
HEALTH_CHECK_PATH=/health

# === FEATURES ===
ENABLE_REALTIME=true
ENABLE_WEBHOOKS=true
ENABLE_API_THROTTLING=true
ENABLE_REQUEST_LOGGING=true

# === BUILD ===
NODE_ENV=production
DEBUG=false
TIMEZONE=UTC
```

## File: backend/docker-compose.yml

```yaml
version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:16-alpine
    container_name: aura7f-postgres
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${DB_PASSWORD:-postgres}
      POSTGRES_DB: aura7f_v2
      POSTGRES_INITDB_ARGS: "-c max_connections=200"
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./migrations:/docker-entrypoint-initdb.d
    networks:
      - aura7f-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis Cache
  redis:
    image: redis:7-alpine
    container_name: aura7f-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - aura7f-network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Backend API (Node.js)
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: aura7f-backend
    ports:
      - "3000:3000"
      - "9090:9090"  # Metrics
    environment:
      - DB_HOST=postgres
      - REDIS_HOST=redis
      - NODE_ENV=development
      - DEBUG=true
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    volumes:
      - ./backend:/app
      - /app/node_modules
    networks:
      - aura7f-network
    command: npm run dev

  # Supabase (Optional local instance)
  supabase:
    image: supabase/supabase:latest
    container_name: aura7f-supabase
    ports:
      - "54321:54321"
      - "54322:54322"
    environment:
      - SUPABASE_DB_PASSWORD=${DB_PASSWORD:-postgres}
    volumes:
      - supabase_data:/var/lib/postgresql/data
    networks:
      - aura7f-network

volumes:
  postgres_data:
  redis_data:
  supabase_data:

networks:
  aura7f-network:
    driver: bridge
```

## File: backend/Dockerfile

```dockerfile
# Multi-stage build for optimized production image

# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY src ./src

# Build TypeScript
RUN npm run build

# Remove dev dependencies
RUN npm ci --only=production


# Runtime stage
FROM node:18-alpine

WORKDIR /app

# Install dumb-init to handle signals properly
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Copy from builder
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/package*.json ./

# Set environment
ENV NODE_ENV=production

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Switch to non-root user
USER nodejs

# Use dumb-init to run Node
ENTRYPOINT ["dumb-init", "--"]

# Start server
CMD ["node", "dist/server.js"]

EXPOSE 3000
EXPOSE 9090
```

## File: backend/.dockerignore

```
node_modules
npm-debug.log
dist
.env.local
.env.production
.git
.gitignore
README.md
.DS_Store
coverage
.nyc_output
test
specs
.vscode
.idea
docker-compose*.yml
Dockerfile
```

## File: backend/nginx.conf (Production reverse proxy)

```nginx
upstream backend {
    server backend:3000;
    keepalive 64;
}

# Rate limiting
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=100r/s;
limit_req_zone $binary_remote_addr zone=auth_limit:10m rate=5r/s;

server {
    listen 80;
    server_name api.aura7f.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.aura7f.com;
    
    # SSL configuration
    ssl_certificate /etc/letsencrypt/live/api.aura7f.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.aura7f.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
    
    # Logging
    access_log /var/log/nginx/api_access.log combined;
    error_log /var/log/nginx/api_error.log warn;
    
    # Gzip compression
    gzip on;
    gzip_types application/json text/plain text/xml;
    gzip_min_length 1024;
    
    # Rate limiting
    limit_req zone=api_limit burst=50 nodelay;
    limit_req_status 429;
    
    location /auth/login {
        limit_req zone=auth_limit burst=5 nodelay;
        proxy_pass http://backend;
    }
    
    location / {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 90;
        proxy_connect_timeout 90;
    }
    
    # Health check endpoint
    location /health {
        access_log off;
        proxy_pass http://backend;
    }
    
    # Metrics endpoint (restricted)
    location /metrics {
        allow 10.0.0.0/8;
        deny all;
        proxy_pass http://backend;
    }
}
```

## File: backend/kubernetes/deployment.yaml (K8s deployment)

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: aura7f-api
  namespace: default
spec:
  replicas: 3
  selector:
    matchLabels:
      app: aura7f-api
  template:
    metadata:
      labels:
        app: aura7f-api
    spec:
      containers:
      - name: api
        image: gcr.io/your-project/aura7f-api:latest
        imagePullPolicy: Always
        ports:
        - containerPort: 3000
          name: http
        - containerPort: 9090
          name: metrics
        
        env:
        - name: NODE_ENV
          value: "production"
        - name: DB_HOST
          valueFrom:
            configMapKeyRef:
              name: api-config
              key: db_host
        - name: REDIS_HOST
          valueFrom:
            configMapKeyRef:
              name: api-config
              key: redis_host
        
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 3
        
        readinessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 10
          periodSeconds: 5
          timeoutSeconds: 3
          failureThreshold: 2
        
        resources:
          requests:
            cpu: 500m
            memory: 512Mi
          limits:
            cpu: 1000m
            memory: 1Gi
        
        securityContext:
          runAsNonRoot: true
          runAsUser: 1001
          allowPrivilegeEscalation: false
          readOnlyRootFilesystem: true
          capabilities:
            drop:
            - ALL

---
apiVersion: v1
kind: Service
metadata:
  name: aura7f-api-service
spec:
  type: LoadBalancer
  selector:
    app: aura7f-api
  ports:
  - port: 80
    targetPort: 3000
    protocol: TCP
    name: http

---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: aura7f-api-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: aura7f-api
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

## File: backend/monitoring/prometheus-config.yaml

```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'aura7f-api'
    static_configs:
      - targets: ['localhost:9090']
    relabel_configs:
      - source_labels: [__address__]
        target_label: instance

  - job_name: 'postgres'
    static_configs:
      - targets: ['localhost:9187']

  - job_name: 'redis'
    static_configs:
      - targets: ['localhost:9121']
```

## File: backend/monitoring/grafana-alerts.yaml

```yaml
groups:
- name: Aura7F API
  rules:
  - alert: HighErrorRate
    expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.01
    for: 5m
    annotations:
      summary: "High error rate detected"

  - alert: HighLatency
    expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 1
    for: 5m
    annotations:
      summary: "API latency is high"

  - alert: DatabaseConnectionPoolExhausted
    expr: pg_stat_activity_count > 90
    for: 5m
    annotations:
      summary: "Database connection pool is nearly exhausted"

  - alert: HighMemoryUsage
    expr: container_memory_usage_bytes{pod=~"aura7f-api-.*"} / 1024 / 1024 > 900
    for: 5m
    annotations:
      summary: "Memory usage is above 900MB"
```

---

## Deployment Checklist

- [ ] Database backups configured
- [ ] SSL certificates installed
- [ ] Environment variables set in production
- [ ] Monitoring and alerting enabled
- [ ] Log aggregation configured (ELK/Datadog)
- [ ] Rate limiting configured
- [ ] CORS whitelist configured
- [ ] Cache warming strategy implemented
- [ ] Database indexes optimized
- [ ] CDN configured for static assets
- [ ] Load balancer health checks configured
- [ ] Auto-scaling policies set
- [ ] Disaster recovery plan documented
- [ ] Security audit completed

---

**Last Updated**: May 8, 2026
