# 🛒 E-commerce Microservices Platform

[![Build Status](https://img.shields.io/github/workflow/status/yourusername/your-repo/CI)](https://github.com/yourusername/your-repo/actions)
[![Coverage Status](https://img.shields.io/codecov/c/github/yourusername/your-repo)](https://codecov.io/gh/yourusername/your-repo)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.0.0-green.svg)](package.json)
[![Python Version](https://img.shields.io/badge/python-%3E%3D3.10-blue.svg)](https://www.python.org)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

> A modern, scalable, microservices-based e-commerce platform built with Python, FastAPI, and Docker for seamless online shopping experiences.

## 🌟 Features

- 🔐 **Authentication & Authorization** - JWT-based secure user authentication
- 🛍️ **Product Management** - Complete CRUD operations for products
- 🛒 **Shopping Cart** - Real-time cart management with persistent storage
- 💳 **Payment Integration** - Secure payment processing with Razorpay
- 📊 **Admin Dashboard** - Comprehensive admin panel for store management
- 🚚 **Order Management** - Complete order tracking and management system
- 🔔 **Real-time Notifications** - Live updates for orders and inventory
- 📈 **Analytics** - Sales and user behavior analytics
- 🧩 **Microservices** - Modular, independently deployable services
- 🐳 **Dockerized** - Easy deployment and scaling

## 🚀 Live Demo

**Frontend:** [https://your-ecommerce-frontend.vercel.app](https://your-ecommerce-frontend.vercel.app)

**Admin Panel:** [https://your-ecommerce-admin.vercel.app](https://your-ecommerce-admin.vercel.app)

**API Documentation:** [https://your-api-docs.com](https://your-api-docs.com)

## 🛠️ Tech Stack

### Backend
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Uvicorn](https://img.shields.io/badge/Uvicorn-000000?style=for-the-badge&logo=uvicorn&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)

### Database
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)

### Cloud & DevOps
![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)
![Traefik](https://img.shields.io/badge/Traefik-24A1C1?style=for-the-badge&logo=traefik&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white)

### Payment & Tools
![Razorpay](https://img.shields.io/badge/Razorpay-2C2F33?style=for-the-badge&logo=razorpay&logoColor=white)

---

## 🏗️ Architecture Overview

```mermaid
graph TB
    A[Client/Browser] --> B[Traefik Load Balancer]
    B --> C[Frontend (React/Vercel)]
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

## 🗄️ Database Schema

### Users Collection
```json
{
  "_id": "ObjectId",
  "name": "String",
  "email": "String (unique)",
  "password": "String (hashed)",
  "role": "enum: ['user', 'admin']",
  "avatar": "String (URL)",
  "addresses": [
    {
      "street": "String",
      "city": "String",
      "state": "String",
      "zipCode": "String",
      "country": "String",
      "isDefault": "Boolean"
    }
  ],
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Products Collection
```json
{
  "_id": "ObjectId",
  "name": "String",
  "description": "String",
  "price": "Number",
  "discountPrice": "Number",
  "category": "ObjectId (ref: Category)",
  "brand": "String",
  "images": ["String (URLs)"],
  "inventory": {
    "quantity": "Number",
    "lowStockThreshold": "Number"
  },
  "specifications": "Object",
  "ratings": {
    "average": "Number",
    "count": "Number"
  },
  "isActive": "Boolean",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Orders Collection
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (ref: User)",
  "items": [
    {
      "productId": "ObjectId (ref: Product)",
      "quantity": "Number",
      "price": "Number"
    }
  ],
  "totalAmount": "Number",
  "status": "enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']",
  "shippingAddress": "Object",
  "paymentInfo": {
    "method": "String",
    "transactionId": "String",
    "status": "String"
  },
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

---

## 📚 API Documentation

### Authentication Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | ❌ |
| POST | `/api/auth/login` | User login | ❌ |
| POST | `/api/auth/logout` | User logout | ✅ |
| GET | `/api/auth/me` | Get current user | ✅ |

### Product Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/products` | Get all products | ❌ |
| GET | `/api/products/:id` | Get single product | ❌ |
| POST | `/api/products` | Create product | ✅ (Admin) |
| PUT | `/api/products/:id` | Update product | ✅ (Admin) |
| DELETE | `/api/products/:id` | Delete product | ✅ (Admin) |

### Order Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/orders` | Get user orders | ✅ |
| POST | `/api/orders` | Create new order | ✅ |
| GET | `/api/orders/:id` | Get single order | ✅ |
| PUT | `/api/orders/:id` | Update order status | ✅ (Admin) |

For complete API documentation, visit: [API Docs](https://your-api-docs.com)

---

## 🚀 Installation & Setup

### Prerequisites
- Python 3.10+
- Docker & Docker Compose
- MongoDB (if running locally)
- Git

### 📦 Manual Installation

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
   ```

3. **Environment Configuration**
   
   Create a `.env` file in the root directory:
   ```env
   # MongoDB
   MONGO_ROOT_USER=root
   MONGO_ROOT_PASSWORD=your_root_password
   MONGO_USER=ecommerce_user
   MONGO_PASSWORD=your_password

   # JWT
   JWT_SECRET=your_jwt_secret_key

   # Razorpay
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret

   # Admin
   DEFAULT_ADMIN_EMAIL=admin@example.com
   DEFAULT_ADMIN_PASSWORD=admin_password
   ```

4. **Database Setup**
   ```bash
   # Start MongoDB service (if not using Docker)
   sudo systemctl start mongod
   ```

5. **Run the application**
   ```bash
   # Start each service (example for auth-service)
   cd auth-service
   uvicorn app.main:app --reload --port 8000
   ```

6. **Access the application**
   - API Gateway: http://localhost:80
   - Swagger Docs: http://localhost/docs
   - Admin Panel: http://localhost:3000/admin

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
   - API Gateway: http://localhost:80
   - Traefik Dashboard: http://monitor.localhost:8080
   - MongoDB: localhost:27017

### ☁️ Cloud Deployment (AWS/Vercel)

#### Frontend Deployment (Vercel)
```bash
npm i -g vercel
vercel --prod
```

#### Backend Deployment (AWS EC2/ECS)
```bash
docker build -t your-ecommerce-api .
docker tag your-ecommerce-api:latest your-account.dkr.ecr.region.amazonaws.com/your-ecommerce-api:latest
docker push your-account.dkr.ecr.region.amazonaws.com/your-ecommerce-api:latest
```

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

## 📊 Performance

- **Lighthouse Score**: 95+ (Performance, Accessibility, Best Practices, SEO)
- **Time to First Byte (TTFB)**: < 200ms
- **First Contentful Paint (FCP)**: < 1.5s
- **Largest Contentful Paint (LCP)**: < 2.5s

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

## 🎯 Roadmap

- [ ] Mobile app (React Native)
- [ ] AI-powered product recommendations
- [ ] Multi-vendor marketplace
- [ ] Inventory management system
- [ ] Advanced analytics dashboard
- [ ] Internationalization (i18n)
- [ ] Progressive Web App (PWA)

---

<div align="center">
  <h3>Made with ❤️ by Sanket</h3>
  <p>
    <a href="https://github.com/sanket">GitHub</a> •
    <a href="https://linkedin.com/in/sanket">LinkedIn</a> •
    <a href="https://twitter.com/sanket">Twitter</a>
  </p>
</div>
