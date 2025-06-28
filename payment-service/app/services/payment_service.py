import uuid
import httpx
import razorpay
import jwt
from datetime import datetime
from typing import Dict, Any, Optional
from app.api.dependencies import get_current_user_token
from app.config.settings import settings
from app.database.repositories.payment_repository import PaymentRepository
from app.models.payment import PaymentVerification
from app.utils.logger import logger
from fastapi import Depends

class PaymentService:
    """Service for handling payment operations"""
    
    def __init__(self):
        self.payment_repository = PaymentRepository()
        logger.info("Initializing Razorpay client")
        self.razorpay_client = razorpay.Client(
            auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
        )
        # logger.info("Razorpay client initialized"+str(settings.RAZORPAY_KEY_ID)+" "+str(settings.RAZORPAY_KEY_SECRET))
    
    async def get_cart(self, user_id: str, token:str) -> Optional[Dict[str, Any]]:
        """Get user's cart from cart service"""
        try:
            
            logger.info(token)
            async with httpx.AsyncClient() as client:
                logger.info(f"Calling cart service: {settings.CART_SERVICE_URL}/cart")
                headers = {
                "accept": "application/json",
                "Authorization": f"Bearer {token}"
            }
                response = await client.get(f"{settings.CART_SERVICE_URL}/cart/", headers=headers)

                if response.status_code == 200:
                    return response.json()
                return None
        except Exception as e:
            logger.error(f"Error fetching cart: {str(e)}")
            return None
    
    async def create_payment_order(self, user_id: str, token:str) -> Dict[str, Any]:
        """Create a new payment order"""
        # Get cart
        cart = await self.get_cart(user_id,token)
        if not cart or not cart.get("items"):
            raise ValueError("Cart is empty")
        
        # Calculate total in paisa (Razorpay uses smallest currency unit)
        total_amount = int(cart["total"] * 100)
        
        logger.info("Creating order...")

        # Create Razorpay order
        order_data = {
            "amount": total_amount,
            "currency": "INR",
            "payment_capture": "1"
        }
        
        razorpay_order = self.razorpay_client.order.create(data=order_data)
        
        logger.info("Order created successfully")
      
        # Store payment record
        payment_id = str(uuid.uuid4())
        payment_record = {
            "id": payment_id,
            "user_id": user_id,
            "razorpay_order_id": razorpay_order["id"],
            "amount": cart["total"],
            "currency": "INR",
            "status": "created",
            "cart_items": cart["items"],
            "created_at": datetime.utcnow()
        }
        self.payment_repository.create_payment_record(payment_record)
        
        return {
            "order_id": razorpay_order["id"],
            "amount": total_amount,
            "currency": "INR",
            "key_id": settings.RAZORPAY_KEY_ID
        }
    
    async def verify_payment(self, verification: PaymentVerification, user_id: str) -> Dict[str, Any]:
        """Verify payment and create order"""
        # Verify payment signature
        params_dict = {
            'razorpay_order_id': verification.razorpay_order_id,
            'razorpay_payment_id': verification.razorpay_payment_id,
            'razorpay_signature': verification.razorpay_signature
        }
        
        try:
            self.razorpay_client.utility.verify_payment_signature(params_dict)
        except razorpay.errors.SignatureVerificationError:
            raise ValueError("Payment signature verification failed")
        
        # Get payment record
        payment_record = self.payment_repository.find_payment_by_order_id(
            verification.razorpay_order_id
        )
        if not payment_record:
            raise ValueError("Payment record not found")
        
        # Create order
        order_id = str(uuid.uuid4())
        order = {
            "id": order_id,
            "user_id": user_id,
            "items": payment_record["cart_items"],
            "total": payment_record["amount"],
            "payment_id": verification.razorpay_payment_id,
            "payment_status": "paid",
            "status": "confirmed",
            "created_at": datetime.utcnow()
        }
        self.payment_repository.create_order(order)
        
        # Update payment status
        self.payment_repository.update_payment_status(
            verification.razorpay_order_id,
            "completed",
            verification.razorpay_payment_id
        )
        
        # Clear cart
        self.payment_repository.clear_user_cart(user_id)
        
        return {"message": "Payment verified successfully", "order_id": order_id}