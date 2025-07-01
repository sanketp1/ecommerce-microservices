# MongoDB Atlas Connection Troubleshooting

## Common SSL/TLS Issues

### 1. SSL Handshake Failed Error
If you're getting `SSL handshake failed` or `TLSV1_ALERT_INTERNAL_ERROR`, this is usually due to:
- Incorrect SSL configuration
- Network connectivity issues
- Firewall blocking the connection

### 2. Updated Connection Configuration
The connection has been updated with proper SSL parameters:

```python
client = AsyncIOMotorClient(
    settings.MONGO_URL,
    serverSelectionTimeoutMS=30000,
    connectTimeoutMS=30000,
    socketTimeoutMS=30000,
    maxPoolSize=10,
    minPoolSize=1,
    maxIdleTimeMS=30000,
    retryWrites=True,
    retryReads=True,
    tls=True,
    tlsAllowInvalidCertificates=False,
    tlsAllowInvalidHostnames=False,
    tlsInsecure=False
)
```

### 3. Testing the Connection
Run the test script to verify your connection:

```bash
cd auth-service
python test_connection.py
```

### 4. Environment Variables
Make sure your `.env` file contains the correct MongoDB Atlas connection string:

```env
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
DATABASE_NAME=ecommerce
```

### 5. Common Solutions

#### A. Check MongoDB Atlas Network Access
1. Go to MongoDB Atlas dashboard
2. Navigate to Network Access
3. Add your IP address to the IP Access List
4. Or add `0.0.0.0/0` for all IPs (not recommended for production)

#### B. Verify Connection String
1. Get the connection string from MongoDB Atlas
2. Make sure it includes the correct username, password, and cluster name
3. Ensure the connection string starts with `mongodb+srv://`

#### C. Check Firewall Settings
- Ensure port 27017 is not blocked
- Check if your network allows outbound HTTPS connections

#### D. Update Dependencies
Make sure you have the latest versions:
```bash
pip install --upgrade pymongo motor
```

### 6. Alternative Connection String Format
If you're still having issues, try this format:
```
mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority&ssl=true&ssl_cert_reqs=CERT_NONE
```

### 7. Debug Mode
To get more detailed error information, you can temporarily enable debug logging:

```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

### 8. Contact Support
If the issue persists:
1. Check MongoDB Atlas status page
2. Contact MongoDB Atlas support
3. Check your cluster's logs in the Atlas dashboard 