# 🚀 Model & Web Application Deployment Guide

This guide details how to deploy **AegisGuard AI** (Model Engine & Web Frontend) across cloud environments including Vercel, Netlify, Docker, Nginx, and GitHub Actions CI/CD.

---

## 📦 Deployment Options Overview

| Platform | Deployment Type | Command / Config File | Ideal Use Case |
| :--- | :--- | :--- | :--- |
| **Vercel** | Serverless / Static SPA | `vercel` / `vercel.json` | Instant production URL & CD |
| **Netlify** | Static SPA | `netlify deploy` | Global CDN hosting |
| **Docker Container** | Containerized Image | `docker build -t aegisguard .` | Enterprise / Kubernetes |
| **GitHub Actions** | Automated CI/CD | `.github/workflows/deploy.yml` | Automatic build on `git push` |

---

## 1. Quick Local Production Build & Test

To build and test the production bundle locally:

```bash
# 1. Install dependencies
npm install

# 2. Build production assets
npm run build

# 3. Preview production build locally
npm run preview
```

The build output will be generated in the `./dist` folder.

---

## 2. Deploying to Vercel (Recommended)

AegisGuard AI includes a pre-configured `vercel.json` in the root directory.

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Deploy to Production
```bash
vercel --prod
```

Alternatively, push the repository to GitHub and import it directly into the [Vercel Dashboard](https://vercel.com). Vercel will automatically detect Vite and set:
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

---

## 3. Containerized Deployment with Docker & Nginx

The repository includes a multi-stage `Dockerfile` for containerized environments.

### Step 1: Build the Docker Image
```bash
docker build -t aegisguard-fraud-detection .
```

### Step 2: Run the Container
```bash
docker run -d -p 8080:80 --name aegisguard-app aegisguard-fraud-detection
```

Access the application at `http://localhost:8080`.

---

## 4. GitHub Actions CI/CD Workflow

A `.github/workflows/deploy.yml` file is provided in the repository. When you push to the `main` or `master` branch, GitHub Actions will:
1. Checkout the source code.
2. Setup Node.js environment.
3. Install project dependencies.
4. Execute `npm run build` to verify code integrity.
5. Publish dist artifact to GitHub Pages or cloud target.

---

## 5. API / Microservice Integration (Decoupled Engine)

The fraud scoring algorithm is located in `src/engine/fraudScoringEngine.js`. It is structured as a pure ES module:

```javascript
import { calculateFraudScore } from './engine/fraudScoringEngine';

const result = calculateFraudScore(transaction, activeRules, riskThreshold);
console.log(result.riskScore, result.riskLevel, result.factors);
```

To expose this engine as a standalone microservice endpoint:
- **Node.js / Express:** Wrap `calculateFraudScore` inside a `POST /api/score-transaction` route.
- **Python / FastAPI:** Use `PyExecJS` or export logic to Python `scikit-learn` / `xgboost` model server.
---
