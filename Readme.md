# 🛒 E-commerce Microservices Platform

[![Build Status](https://img.shields.io/github/workflow/status/yourusername/your-repo/CI)](https://github.com/yourusername/your-repo/actions)
[![Coverage Status](https://img.shields.io/codecov/c/github/yourusername/your-repo)](https://codecov.io/gh/yourusername/your-repo)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.0.0-green.svg)](package.json)
[![Python Version](https://img.shields.io/badge/python-%3E%3D3.10-blue.svg)](https://www.python.org)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

> A modern, scalable, microservices-based e-commerce platform built with Python, FastAPI, Next.js, and Docker for seamless online shopping experiences.

---

## 🚀 Live Preview

**Frontend:** [https://ecommerce-microservices-two.vercel.app/](https://ecommerce-microservices-two.vercel.app/)

**Preview:**

https://github.com/yourusername/ecommerce-microservices/assets/demo.mp4

---

## 🗂️ Microservices & Documentation

| Service         | Docs URL                                                                 |
|----------------|--------------------------------------------------------------------------|
| Product        | [Product Service Docs](https://product-service-i3pr.onrender.com/api/products/docs) |
| Cart           | [Cart Service Docs](https://cart-service-g9v1.onrender.com/api/cart/docs)         |
| Payment        | [Payment Service Docs](https://payment-service-2bg9.onrender.com/api/payments/docs) |
| Order          | [Order Service Docs](https://order-service-34yt.onrender.com/api/orders/docs)      |
| Auth           | [Auth Service Docs](https://auth-service-v19t.onrender.com/auth/docs)             |
| Admin          | [Admin Service Docs](https://admin-service-553d.onrender.com/admin/docs)          |

---

## 🌟 Features

- 🔐 **Authentication & Authorization** (JWT-based, Google OAuth)
- 🛍️ **Product Management** (CRUD, categories, admin panel)
- 🛒 **Shopping Cart** (real-time, persistent)
- 💳 **Payment Integration** (Razorpay, secure)
- 📊 **Admin Dashboard** (orders, users, analytics)
- 🚚 **Order Management** (tracking, status updates)
- 🔔 **Real-time Notifications**
- 📈 **Analytics** (sales, user behavior)
- 🧩 **Microservices** (modular, scalable)
- 🐳 **Dockerized** (easy deployment)

---

## 🏗️ Architecture Overview

```mermaid
graph TB
    A[Client/Browser] --> B[Traefik Load Balancer]
    B --> C[Frontend (Next.js/Vercel)]
    C --> D[API Gateway]
    D --> E[Auth Service]
    D --> F[Product Service]
    D --> G[Order Service]
    D --> H[Payment Service]
    D --> I[Cart Service]
    D --> J[Admin Service]
    E --> K[(User Database)]
    F --> L[(Product Database)]
    G --> M[(Order Database)]
    H --> N[Razorpay API]
    F --> O[Cache/Queue (future)]
    G --> P[Email Service (future)]
    C --> Q[CDN - Static Assets]
```

---

## 🛠️ Tech Stack

- **Frontend:** Next.js, React, Tailwind CSS, Vercel
- **Backend:** Python, FastAPI, Uvicorn
- **Database:** MongoDB
- **Payments:** Razorpay
- **DevOps:** Docker, Traefik, AWS (optional)

---

## 📚 API Documentation

Each microservice exposes its own OpenAPI/Swagger documentation:

- [Product Service Docs](https://product-service-i3pr.onrender.com/api/products/docs)
- [Cart Service Docs](https://cart-service-g9v1.onrender.com/api/cart/docs)
- [Payment Service Docs](https://payment-service-2bg9.onrender.com/api/payments/docs)
- [Order Service Docs](https://order-service-34yt.onrender.com/api/orders/docs)
- [Auth Service Docs](https://auth-service-v19t.onrender.com/auth/docs)
- [Admin Service Docs](https://admin-service-553d.onrender.com/admin/docs)

---

## 🧩 Microservices Overview

### Product Service
- Product CRUD, categories, search, filtering
- [API Docs](https://product-service-i3pr.onrender.com/api/products/docs)

### Cart Service
- Add/remove/update cart items, persistent cart
- [API Docs](https://cart-service-g9v1.onrender.com/api/cart/docs)

### Payment Service
- Payment order creation, verification (Razorpay)
- [API Docs](https://payment-service-2bg9.onrender.com/api/payments/docs)

### Order Service
- Order creation, status, user order history
- [API Docs](https://order-service-34yt.onrender.com/api/orders/docs)

### Auth Service
- JWT authentication, Google OAuth, user management
- [API Docs](https://auth-service-v19t.onrender.com/auth/docs)

### Admin Service
- Admin dashboard, user/order/product management
- [API Docs](https://admin-service-553d.onrender.com/admin/docs)

---

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- Docker & Docker Compose
- MongoDB (if running locally)
- Git

### Manual Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ecommerce-microservices.git
   cd ecommerce-microservices
   ```

2. **Install dependencies for each service**
   ```bash
   for service in auth-service product-service cart-service payment-service order-service admin-service; do
     cd $service
     pip install -r requirements.txt
     cd ..
   done
   cd e-commerce-frontend
   npm install
   ```

3. **Environment Configuration**
   - Create a `.env` file in the root directory and each service as needed (see sample in repo)

4. **Database Setup**
   ```bash
   # Start MongoDB service (if not using Docker)
   sudo systemctl start mongod
   ```

5. **Run the application**
   ```bash
   # Start each backend service (example for auth-service)
   cd auth-service
   uvicorn app.main:app --reload --port 8000
   # Start frontend
   cd ../e-commerce-frontend
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Swagger Docs: http://localhost:<service-port>/docs

### 🐳 Docker Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ecommerce-microservices.git
   cd ecommerce-microservices
   ```

2. **Create environment files**
   ```bash
   cp .env.example .env
   # Edit the .env file with your configuration
   ```

3. **Run with Docker Compose**
   ```bash
   docker-compose up -d --build
   docker-compose logs -f
   docker-compose down
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Traefik Dashboard: http://monitor.localhost:8080
   - MongoDB: localhost:27017

---

## 🧪 Testing

```bash
# Run tests for each service
for service in auth-service product-service cart-service payment-service order-service admin-service; do
  cd $service
  python -m pytest
  cd ..
done
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Thanks to all contributors who helped build this project
- Inspired by modern e-commerce platforms
- Special thanks to the open-source community

---

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Contact: your-email@example.com
- Join our Discord: [Discord Link]

---


<div align="center">
  <h3>Made with ❤️ by Sanket</h3>
  <p>
    <a href="https://github.com/sanket">GitHub</a> •
    <a href="https://linkedin.com/in/sanket">LinkedIn</a> •
    <a href="https://twitter.com/sanket">Twitter</a>
  </p>
</div>
