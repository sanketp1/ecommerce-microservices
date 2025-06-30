const fs = require('fs');

const envContent = `# Service URLs
PRODUCT_SERVICE_URL=http://localhost
AUTH_SERVICE_URL=http://localhost
CART_SERVICE_URL=http://localhost
ORDER_SERVICE_URL=http://localhost
PAYMENT_SERVICE_URL=http://localhost
ADMIN_SERVICE_URL=http://localhost

# Google OAuth Configuration
GOOGLE_CLIENT_ID=829203699628-t5h8vm6epgcmessd22t7324ojtk3pohk.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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

# Payment Gateway (Razorpay)
RAZORPAY_KEY_ID=rzp_test_xz0v4fasV1baMZ
RAZORPAY_KEY_SECRET=vKhmjFR6uo5DLW7BpK7TJU6V

# Other Configuration
NODE_ENV=development
`;

fs.writeFileSync('.env.local', envContent, 'utf8');
console.log('.env.local file created with all necessary environment variables'); 