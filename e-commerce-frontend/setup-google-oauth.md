# Google OAuth Setup Guide

## Step 1: Create Google OAuth Credentials

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" in the left sidebar
5. Click "Create Credentials" → "OAuth 2.0 Client IDs"
6. Choose "Web application" as the application type
7. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (for development)
   - `https://yourdomain.com/api/auth/callback/google` (for production)
8. Copy the Client ID and Client Secret

## Step 2: Create Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# NextAuth Configuration
NEXTAUTH_SECRET=your-nextauth-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here

# Microservices URLs
NEXT_PUBLIC_AUTH_SERVICE_URL=http://localhost:8002
NEXT_PUBLIC_PRODUCT_SERVICE_URL=http://localhost:8001
NEXT_PUBLIC_CART_SERVICE_URL=http://localhost:8003
NEXT_PUBLIC_ORDER_SERVICE_URL=http://localhost:8004
NEXT_PUBLIC_PAYMENT_SERVICE_URL=http://localhost:8005
NEXT_PUBLIC_ADMIN_SERVICE_URL=http://localhost:8006
```

## Step 3: Generate NextAuth Secret

Generate a secure secret for NextAuth:

```bash
openssl rand -base64 32
```

Or use an online generator and replace `your-nextauth-secret-key-here` with the generated value.

## Step 4: Update Your Auth Microservice

Make sure your Auth microservice has a `/api/auth/google` endpoint that can handle Google OAuth requests. The endpoint should:

1. Accept POST requests with Google user data
2. Create or update user records
3. Return user data and access token

## Step 5: Test the Implementation

1. Start your development server: `npm run dev`
2. Navigate to `/auth/login` or `/auth/register`
3. Click "Continue with Google"
4. Complete the Google OAuth flow
5. Verify that you're redirected to the dashboard

## Troubleshooting

- Make sure all environment variables are set correctly
- Check that your Google OAuth redirect URIs match exactly
- Verify that your Auth microservice is running and accessible
- Check the browser console and server logs for any errors 