# H&M Trads Admin Dashboard - Deployment Guide

## Deployment Overview

This guide covers deploying the H&M Trads Admin Dashboard to production environments.

---

## Pre-Deployment Checklist

- [ ] All tests passing locally
- [ ] Environment variables configured
- [ ] Database migrations tested
- [ ] Security audit completed
- [ ] Performance profiling done
- [ ] SSL certificates ready
- [ ] Domain configured
- [ ] Backup strategy in place
- [ ] Monitoring setup
- [ ] Team trained on deployment

---

## 1. Frontend Deployment

### Option A: Cloudflare Pages (Recommended for Global CDN)

**Setup:**
1. Connect GitHub repository to Cloudflare Pages
2. Configure build settings:
   ```
   Framework: None
   Build command: npm run build
   Build output: dist/
   Root directory: /
   ```

3. Set environment variables in Cloudflare dashboard:
   ```
   VITE_API_URL=https://api.hm-trads.com/v1
   VITE_APP_NAME=H&M Trads Admin
   ```

4. Deploy:
   ```bash
   git push origin main
   # Automatic deployment triggered
   ```

**Features:**
- ✅ Global CDN
- ✅ Automatic HTTPS
- ✅ Preview deployments
- ✅ Zero config deployment

**Cost:** Free tier available

---

### Option B: Vercel

**Setup:**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Configure environment variables in dashboard
# Production: VITE_API_URL=https://api.hm-trads.com/v1
```

**Features:**
- ✅ Edge functions support
- ✅ Incremental Static Regeneration
- ✅ Analytics included

---

### Option C: AWS Amplify

**Setup:**
```bash
# Install Amplify CLI
npm i -g @aws-amplify/cli

# Initialize
amplify init

# Deploy
amplify publish
```

**Configuration (amplify.yml):**
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

---

### Option D: Traditional VPS/Docker

**Setup:**
```bash
# Build application
npm run build

# Create Dockerfile
cat > Dockerfile << 'EOF'
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
EOF

# Build image
docker build -t hm-trads-admin:latest .

# Push to registry
docker tag hm-trads-admin:latest yourregistry/hm-trads-admin:latest
docker push yourregistry/hm-trads-admin:latest

# Deploy to VPS
ssh user@server.com
docker pull yourregistry/hm-trads-admin:latest
docker run -d \
  -p 80:80 \
  -p 443:443 \
  -e VITE_API_URL=https://api.hm-trads.com \
  yourregistry/hm-trads-admin:latest
```

---

## 2. Backend Deployment

### Option A: Railway (Simplest)

**Setup:**
1. Connect GitHub to Railway
2. Create PostgreSQL database
3. Deploy:
   ```bash
   railway up
   ```

**Environment variables:**
```env
DATABASE_URL=postgresql://user:pass@db.railway.app:5432/db
JWT_SECRET=your-secret-key
NODE_ENV=production
CORS_ORIGIN=https://app.hm-trads.com
```

---

### Option B: Heroku

**Setup:**
```bash
# Install Heroku CLI
npm i -g heroku

# Login
heroku login

# Create app
heroku create hm-trads-api

# Add PostgreSQL
heroku addons:create heroku-postgresql:standard-0

# Configure environment
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-secret-key

# Deploy
git push heroku main
```

---

### Option C: AWS EC2 + Docker

**Setup EC2 Instance:**
```bash
# SSH into instance
ssh -i key.pem ec2-user@instance-ip

# Install Docker
sudo yum update -y
sudo yum install docker -y
sudo systemctl start docker
sudo usermod -a -G docker ec2-user

# Create docker-compose.yml
cat > docker-compose.yml << 'EOF'
version: '3.8'
services:
  api:
    image: hm-trads-api:latest
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://user:pass@postgres:5432/hm_trads
      JWT_SECRET: your-secret-key
      NODE_ENV: production
    depends_on:
      - postgres
      - redis
    
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: hm_trads
      POSTGRES_USER: app
      POSTGRES_PASSWORD: secure-password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    
  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
EOF

# Deploy
docker-compose up -d

# Setup SSL with Let's Encrypt
sudo yum install certbot -y
sudo certbot certonly --standalone -d api.hm-trads.com
```

---

### Option D: Kubernetes (Scalable)

**Create deployment manifest:**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: hm-trads-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: hm-trads-api
  template:
    metadata:
      labels:
        app: hm-trads-api
    spec:
      containers:
      - name: api
        image: hm-trads-api:latest
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: database-url
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: jwt-secret
        resources:
          requests:
            memory: "256Mi"
            cpu: "100m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10

---
apiVersion: v1
kind: Service
metadata:
  name: hm-trads-api
spec:
  selector:
    app: hm-trads-api
  type: LoadBalancer
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
```

**Deploy:**
```bash
# Create namespace
kubectl create namespace hm-trads

# Create secrets
kubectl create secret generic app-secrets \
  --from-literal=database-url=$DATABASE_URL \
  --from-literal=jwt-secret=$JWT_SECRET \
  -n hm-trads

# Deploy application
kubectl apply -f deployment.yaml -n hm-trads

# Check deployment
kubectl get pods -n hm-trads
```

---

## 3. Database Deployment

### PostgreSQL Setup

**Using AWS RDS:**
```bash
# Create RDS instance
aws rds create-db-instance \
  --db-instance-identifier hm-trads-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username postgres \
  --master-user-password YourSecurePassword123 \
  --allocated-storage 20

# Get endpoint
aws rds describe-db-instances \
  --db-instance-identifier hm-trads-db \
  --query 'DBInstances[0].Endpoint.Address'
```

**Run migrations:**
```bash
# Install migration tool
npm install -g db-migrate

# Run migrations
DATABASE_URL=postgresql://user:pass@endpoint:5432/db npm run migrate:latest

# Seed data
npm run seed:production
```

**Backup strategy:**
```bash
# Daily automated backups (AWS handles this)
# Manual backup
pg_dump postgresql://user:pass@endpoint:5432/db > backup.sql

# Restore
psql postgresql://user:pass@endpoint:5432/db < backup.sql
```

---

## 4. SSL/TLS Certificate

### Using Let's Encrypt + Nginx

**Create nginx.conf:**
```nginx
upstream api {
  server api:3000;
}

server {
  listen 80;
  server_name hm-trads.com www.hm-trads.com;
  
  location /.well-known/acme-challenge/ {
    root /var/www/certbot;
  }
  
  location / {
    return 301 https://$server_name$request_uri;
  }
}

server {
  listen 443 ssl http2;
  server_name hm-trads.com www.hm-trads.com;
  
  ssl_certificate /etc/letsencrypt/live/hm-trads.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/hm-trads.com/privkey.pem;
  
  ssl_protocols TLSv1.2 TLSv1.3;
  ssl_ciphers HIGH:!aNULL:!MD5;
  ssl_prefer_server_ciphers on;
  
  location / {
    proxy_pass http://api;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

**Setup SSL:**
```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot certonly --standalone -d hm-trads.com -d www.hm-trads.com

# Auto-renewal
sudo systemctl enable certbot.timer
```

---

## 5. Monitoring & Logging

### Application Monitoring

**Using Prometheus:**
```bash
# Create prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'hm-trads-api'
    static_configs:
      - targets: ['localhost:3000']

# Start Prometheus
docker run -d -p 9090:9090 -v prometheus.yml:/etc/prometheus/prometheus.yml prom/prometheus
```

**Using Grafana:**
```bash
# Start Grafana
docker run -d -p 3000:3000 grafana/grafana

# Access: http://localhost:3000
# Login: admin/admin
# Add Prometheus data source
```

### Error Tracking

**Using Sentry:**
```bash
# Backend initialization (Express)
const Sentry = require("@sentry/node");

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: "production",
  tracesSampleRate: 0.1,
});

app.use(Sentry.Handlers.errorHandler());
```

### Logging

**Using ELK Stack:**
```bash
# Start ELK
docker-compose -f elk-compose.yml up

# Application logging
const winston = require('winston');

const logger = winston.createLogger({
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});
```

---

## 6. Performance Optimization

### Caching Strategy

```bash
# Redis cache (Backend)
const redis = require('redis');
const client = redis.createClient();

// Cache frequently accessed data
client.setex('laptops:featured', 3600, JSON.stringify(data));
client.get('laptops:featured');
```

### CDN Configuration

```bash
# Cloudflare
- Cache everything
- Browser cache TTL: 1 hour
- Cache TTL: 1 month

# Images
- Use WebP format
- Compress with Cloudflare
```

### Database Optimization

```sql
-- Add indices
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_customers_type ON customers(type);

-- Analyze query performance
EXPLAIN ANALYZE SELECT * FROM orders WHERE status = 'Delivered';
```

---

## 7. Scaling Strategy

### Horizontal Scaling

```yaml
# Kubernetes horizontal pod autoscaler
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: hm-trads-api-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: hm-trads-api
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

### Load Balancing

```nginx
upstream api_backend {
  server api1:3000 weight=3;
  server api2:3000 weight=2;
  server api3:3000 weight=1;
}

server {
  location /api {
    proxy_pass http://api_backend;
  }
}
```

---

## 8. Rollback & Recovery

### Deployment Rollback

```bash
# Using Docker
docker pull old-image:v1.0.0
docker stop hm-trads-api
docker run -d old-image:v1.0.0

# Using Kubernetes
kubectl rollout history deployment/hm-trads-api
kubectl rollout undo deployment/hm-trads-api --to-revision=1

# Using Heroku
heroku releases
heroku rollback v5
```

### Database Rollback

```bash
# From backup
pg_restore -d hm_trads backup.sql

# Using migrations
npm run migrate:rollback
```

---

## 9. Post-Deployment

### Verification

```bash
# Health check
curl https://api.hm-trads.com/health

# Test API
curl -H "Authorization: Bearer TOKEN" https://api.hm-trads.com/v1/laptops

# Check SSL
openssl s_client -connect hm-trads.com:443

# Performance test
lighthouse https://app.hm-trads.com
```

### Documentation

- [ ] Update runbook
- [ ] Document emergency procedures
- [ ] Update on-call guide
- [ ] Train team on deployment

---

## 10. Troubleshooting

### Common Deployment Issues

| Issue | Solution |
|-------|----------|
| High memory usage | Scale horizontally, optimize queries |
| Database connection errors | Check connection string, firewall rules |
| SSL certificate issues | Renew certificates, check expiry |
| Slow API responses | Add database indices, enable caching |

---

## Resources

- [Docker Documentation](https://docs.docker.com)
- [Kubernetes Documentation](https://kubernetes.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)
- [Cloudflare Documentation](https://developers.cloudflare.com)
- [AWS Documentation](https://docs.aws.amazon.com)

---

## Support

For deployment issues:
- Check logs: `docker logs container-name`
- Monitor: Prometheus/Grafana dashboards
- Debug: SSH into instance, check services
- Contact: DevOps team
