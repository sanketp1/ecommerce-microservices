# 🛒 E-commerce Microservices Platform

[![Build Status](https://img.shields.io/github/actions/workflow/status/sanketp1/ecommerce-microservices/ci.yml?branch=master)](https://github.com/sanketp1/ecommerce-microservices/actions)
[![Coverage Status](https://img.shields.io/codecov/c/github/sanketp1/ecommerce-microservices)](https://codecov.io/gh/sanketp1/ecommerce-microservices)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.0.0-green.svg)](package.json)
[![Python Version](https://img.shields.io/badge/python-%3E%3D3.10-blue.svg)](https://www.python.org)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

> A modern, scalable microservices-based e-commerce platform built using **FastAPI**, **Next.js**, **Docker**, and **MongoDB** — optimized for modularity, performance, and developer experience.

---

## 🚀 Live Preview

* **Frontend:** [ecommerce-microservices-two.vercel.app](https://ecommerce-microservices-two.vercel.app/)
* **Demo Video:** *Coming Soon or insert your actual video URL*

---

## 🛠️ Tech Stack

![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge\&logo=python\&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge\&logo=fastapi\&logoColor=white)
![Next JS](https://img.shields.io/badge/Next.js-000000?style=for-the-badge\&logo=nextdotjs\&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge\&logo=tailwind-css\&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge\&logo=mongodb\&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge\&logo=docker\&logoColor=white)
![Traefik](https://img.shields.io/badge/Traefik-24B3A8?style=for-the-badge\&logo=traefikproxy\&logoColor=white)
![Kubernetes](https://img.shields.io/badge/Kubernetes-326CE5?style=for-the-badge\&logo=kubernetes\&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge\&logo=render\&logoColor=black)
![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-2088FF?style=for-the-badge\&logo=github-actions\&logoColor=white)

---

## 🗂️ Microservices & API Docs

| Service | Documentation URL                                                                   |
| ------- | ----------------------------------------------------------------------------------- |
| Auth    | [Auth Service Docs](https://auth-service-v19t.onrender.com/auth/docs)               |
| Product | [Product Service Docs](https://product-service-i3pr.onrender.com/api/products/docs) |
| Cart    | [Cart Service Docs](https://cart-service-g9v1.onrender.com/api/cart/docs)           |
| Payment | [Payment Service Docs](https://payment-service-2bg9.onrender.com/api/payments/docs) |
| Order   | [Order Service Docs](https://order-service-34yt.onrender.com/api/orders/docs)       |
| Admin   | [Admin Service Docs](https://admin-service-553d.onrender.com/api/admin/docs)        |

---

## 🌟 Key Features

* 🔐 **Authentication & Authorization** – JWT, Google OAuth2
* 🛍️ **Product Catalog & Search** – Admin-managed listings with filters
* 🛒 **Persistent Shopping Cart** – Real-time updates per user session
* 💳 **Payments Integration** – Secure checkout via Razorpay
* 📊 **Admin Dashboard** – Analytics, user/order/product management
* 🚚 **Order Tracking** – End-to-end delivery flow
* 🧠 **Scalable Microservices Architecture** – Independent deployments
* 🐳 **Docker-First Development** – Built for containerization

---

## 🏗️ Architecture Diagram

```mermaid
graph TD
  A["Client/Browser"] --> B["Traefik Load Balancer"]
  B --> C["Frontend (Next.js/Vercel)"]
  C --> D["API Gateway"]
  D --> E["Auth Service"]
  D --> F["Product Service"]
  D --> G["Order Service"]
  D --> H["Payment Service"]
  D --> I["Cart Service"]
  D --> J["Admin Service"]
  E --> K["User Database"]
  F --> L["Product Database"]
  G --> M["Order Database"]
  H --> N["Razorpay API"]
  F --> O["Cache/Queue (future)"]
  G --> P["Email Service (future)"]
  C --> Q["CDN - Static Assets"]
```

---

## 🚀 Getting Started

### Prerequisites

* Python 3.10+
* Node.js 18+
* Docker & Docker Compose
* MongoDB (if running locally)
* Git

### Manual Setup

```bash
git clone https://github.com/sanketp1/ecommerce-microservices.git
cd ecommerce-microservices
```

Install service dependencies:

```bash
for service in auth-service product-service cart-service payment-service order-service admin-service; do
  cd $service
  pip install -r requirements.txt
  cd ..
done
cd e-commerce-frontend
npm install
```

Run MongoDB and start services:

```bash
sudo systemctl start mongod
uvicorn app.main:app --reload  # per service
npm run dev  # for frontend
```

### Docker Quick Start

```bash
docker-compose up -d --build
docker-compose logs -f
docker-compose down
```

Access:

* Frontend: [http://localhost:3000](http://localhost:3000)
* Traefik Dashboard: [http://monitor.localhost:8080](http://monitor.localhost:8080)

---

## 🧪 Testing

```bash
for service in auth-service product-service cart-service payment-service order-service admin-service; do
  cd $service
  python -m pytest
  cd ..
done
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your branch (`git checkout -b feature/AmazingFeature`)
3. Commit and push your changes
4. Open a Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

---

## 📝 License

Licensed under the MIT License. See the [LICENSE](LICENSE) file.

---

## 🙏 Acknowledgments

* Thanks to all contributors
* Inspired by modern e-commerce platforms
* Powered by open source

---

## 📞 Support

* GitHub Issues
* Email: [psanket18052001@gmail.com](mailto:psanket18052001@gmail.com)

---

<div align="center">
  <h3>Made with ❤️ by Sanket</h3>
  <p>
    <a href="https://github.com/sanketp1">GitHub</a> •
    <a href="https://linkedin.com/in/psanket18">LinkedIn</a> •
    <a href="https://twitter.com/p_sanket18">Twitter/X</a>
  </p>
</div>
