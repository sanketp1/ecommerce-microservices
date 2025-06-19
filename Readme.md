# 🛍️ E-commerce Microservices Platform

[![Python](https://img.shields.io/badge/python-v3.10+-blue.svg)](https://www.python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-v0.95+-green.svg)](https://fastapi.tiangolo.com)
[![Docker](https://img.shields.io/badge/docker-v20.10+-blue.svg)](https://www.docker.com)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

> A modern, scalable e-commerce platform built with Python FastAPI and microservices architecture, designed for high performance and maintainability.

## 🌟 Features

- 🔐 **Authentication Service** - JWT-based auth with OAuth2 support
- 👤 **Admin Service** - Comprehensive admin panel for store management
- 📦 **Product Service** - Complete product lifecycle management
- 🛒 **Cart Service** - Real-time shopping cart operations
- 💳 **Payment Service** - Secure payment processing with Razorpay
- 📦 **Order Service** - Order processing and management
- 🔄 **API Gateway** - Traefik-based routing and load balancing
- 📊 **Monitoring** - Health checks and service monitoring
- 🎯 **Scalability** - Containerized services with Docker

## 🚀 Live Demo

**API Gateway:** [http://api.yourdomain.com](http://api.yourdomain.com)

**Admin Panel:** [http://admin.yourdomain.com](http://admin.yourdomain.com)

**API Documentation:** [http://api.yourdomain.com/docs](http://api.yourdomain.com/docs)

## 🛠️ Tech Stack

### Backend & Services
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)

### DevOps & Infrastructure
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Docker Compose](https://img.shields.io/badge/Docker%20Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Traefik](https://img.shields.io/badge/Traefik-24A1C1?style=for-the-badge&logo=traefik&logoColor=white)

### Payment Integration
![Razorpay](https://img.shields.io/badge/Razorpay-2C2F33?style=for-the-badge&logo=razorpay&logoColor=white)

## 🏗️ Architecture Overview

\`\`\`mermaid
graph TB
    Client[Client] --> ReverseProxy[Traefik Reverse Proxy]
    ReverseProxy --> AuthService[Auth Service]
    ReverseProxy --> AdminService[Admin Service]
    ReverseProxy --> ProductService[Product Service]
    ReverseProxy --> CartService[Cart Service]
    ReverseProxy --> PaymentService[Payment Service]
    ReverseProxy --> OrderService[Order Service]
    
    AuthService --> MongoDB[(MongoDB)]
    AdminService --> MongoDB
    ProductService --> MongoDB
    CartService --> MongoDB
    PaymentService --> MongoDB
    OrderService --> MongoDB
    
    CartService --> ProductService
    PaymentService --> CartService
    OrderService --> ProductService
    
    PaymentService --> RazorpayAPI[Razorpay API]
\`\`\`

## 🗄️ Database Schema

### Users Collection
\`\`\`json
{
  "_id": "ObjectId",
  "email": "String (unique)",
  "password": "String (hashed)",
  "role": "enum: ['user', 'admin']",
  "full_name": "String",
  "phone": "String",
  "active": "Boolean",
  "created_at": "DateTime",
  "updated_at": "DateTime"
}
\`\`\`

### Products Collection
\`\`\`json
{
  "_id": "ObjectId",
  "name": "String",
  "description": "String",
  "price": "Decimal",
  "category": "String",
  "stock": "Integer",
  "images": ["String (URLs)"],
  "active": "Boolean",
  "created_at": "DateTime",
  "updated_at": "DateTime"
}
\`\`\`

### Orders Collection
\`\`\`json
{
  "_id": "ObjectId",
  "user_id": "ObjectId (ref: Users)",
  "items": [
    {
      "product_id": "ObjectId (ref: Products)",
      "quantity": "Integer",
      "price": "Decimal"
    }
  ],
  "total_amount": "Decimal",
  "status": "enum: ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled']",
  "payment_id": "String (Razorpay ID)",
  "shipping_address": {
    "street": "String",
    "city": "String",
    "state": "String",
    "country": "String",
    "zip_code": "String"
  },
  "created_at": "DateTime",
  "updated_at": "DateTime"
}
\`\`\`

## 📚 API Documentation

### Auth Service Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | User login | No |
| POST | `/api/auth/logout` | User logout | Yes |
| GET | `/api/auth/me` | Get current user | Yes |

### Product Service Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/products` | List all products | No |
| GET | `/api/products/{id}` | Get product details | No |
| POST | `/api/products` | Create product | Yes (Admin) |
| PUT | `/api/products/{id}` | Update product | Yes (Admin) |
| DELETE | `/api/products/{id}` | Delete product | Yes (Admin) |

For complete API documentation, visit the Swagger UI at: [/api/docs](http://api.yourdomain.com/docs)

## 🚀 Installation & Setup

### Prerequisites
- Docker 20.10+
- Docker Compose 2.0+
- Python 3.10+ (for local development)
- Git

### 🐳 Docker Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/yourusername/ecommerce-microservices.git
   cd ecommerce-microservices
   \`\`\`

2. **Set up environment variables**
   
   Create a \`.env\` file in the root directory:
   \`\`\`env
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

   # OAuth (Optional)
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   \`\`\`

3. **Start the services**
   \`\`\`bash
   # Build and start all services
   docker-compose up -d --build

   # Check service status
   docker-compose ps

   # View logs
   docker-compose logs -f
   \`\`\`

4. **Access the services**
   - API Gateway: http://localhost:80
   - Traefik Dashboard: http://monitor.localhost:8080
   - Swagger Documentation: http://localhost/docs

### 💻 Local Development

1. **Create a Python virtual environment**
   \`\`\`bash
   python -m venv venv
   source venv/bin/activate  # Linux/macOS
   .\\venv\\Scripts\\activate  # Windows
   \`\`\`

2. **Install dependencies for each service**
   \`\`\`bash
   for service in auth-service product-service cart-service payment-service order-service admin-service; do
     cd $service
     pip install -r requirements.txt
     cd ..
   done
   \`\`\`

3. **Run services individually**
   \`\`\`bash
   # Example for running auth-service
   cd auth-service
   uvicorn app.main:app --reload --port 8000
   \`\`\`

## 🧪 Testing

\`\`\`bash
# Run tests for each service
for service in auth-service product-service cart-service payment-service order-service admin-service; do
  cd $service
  python -m pytest
  cd ..
done
\`\`\`

## 🔍 Monitoring

- **Health Checks**: Each service exposes a `/api/health` endpoint
- **Traefik Dashboard**: Available at http://monitor.localhost:8080
- **Logs**: Use \`docker-compose logs\` to view service logs

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit your changes (\`git commit -m 'Add some AmazingFeature'\`)
4. Push to the branch (\`git push origin feature/AmazingFeature\`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Future Roadmap

- [ ] Add Redis for caching
- [ ] Implement event-driven architecture using message queues
- [ ] Add Elasticsearch for product search
- [ ] Implement service discovery
- [ ] Add metrics collection with Prometheus
- [ ] Set up CI/CD pipeline
- [ ] Add rate limiting
- [ ] Implement WebSocket notifications
- [ ] Add data analytics service

---

<div align="center">
  <h3>Made with ❤️ by Sanket</h3>
  <p>
    <a href="https://github.com/sanket">GitHub</a> •
    <a href="https://linkedin.com/in/sanket">LinkedIn</a> •
    <a href="https://twitter.com/sanket">Twitter</a>
  </p>
</div>
