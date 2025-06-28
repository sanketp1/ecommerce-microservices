db = db.getSiblingDB('ecommerce');

// Create application user
db.createUser({
  user: 'ecomm',
  pwd: 'securePassword123',
  roles: [{ role: 'readWrite', db: 'ecommerce' }]
});

// Ensure required collections exist
const collectionsToEnsure = ['payments', 'orders', 'cart'];
collectionsToEnsure.forEach((name) => {
  if (!db.getCollectionNames().includes(name)) {
    db.createCollection(name);
  }
});

// Create admin user
db.users.insertOne({
  id: "admin-1",
  email: "admin@ecommerce.com",
  password: "$2b$12$P1krn6/hpk3SERvGnkbcse2y8Xr6LrmUBx1I1oBCK6EtWquZoCqZ6", // bcrypt hash for 'Admin@123456'
  full_name: "System Administrator",
  is_admin: true,
  created_at: new Date()
});

// Sample products
db.products.insertMany([
  {
    "id": "1",
    "name": "Premium Wireless Headphones",
    "description": "High-quality wireless headphones with noise cancellation",
    "price": 199.99,
    "category": "Electronics",
    "image_url": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
    "stock": 50
  },
  {
    "id": "2",
    "name": "Stylish Laptop Backpack",
    "description": "Durable and stylish backpack perfect for laptops and daily use",
    "price": 79.99,
    "category": "Accessories",
    "image_url": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
    "stock": 30
  },
  {
    "id": "3",
    "name": "Smart Fitness Watch",
    "description": "Advanced fitness tracking with heart rate monitoring",
    "price": 249.99,
    "category": "Electronics",
    "image_url": "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500",
    "stock": 25
  },
  {
    "id": "4",
    "name": "Organic Coffee Blend",
    "description": "Premium organic coffee beans from sustainable farms",
    "price": 24.99,
    "category": "Food",
    "image_url": "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=500",
    "stock": 100
  },
  {
    "id": "5",
    "name": "Modern Desk Lamp",
    "description": "LED desk lamp with adjustable brightness and USB charging",
    "price": 89.99,
    "category": "Home",
    "image_url": "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500",
    "stock": 40
  },
  {
    "id": "6",
    "name": "Yoga Mat Pro",
    "description": "Non-slip yoga mat for all types of yoga practice",
    "price": 49.99,
    "category": "Sports",
    "image_url": "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500",
    "stock": 60
  }
]);
