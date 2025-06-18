from fastapi import APIRouter, HTTPException, Depends

from app.api.dependencies import get_current_user
from app.models.payment import PaymentVerification
from app.services.payment_service import PaymentService
from app.utils.logger import logger

router = APIRouter()
payment_service = PaymentService()

@router.post("/payments/create-order")
async def create_payment_order(current_user: dict = Depends(get_current_user)):
    """Create a new payment order"""
    user_id = current_user["user_id"]
    
    try:
        result = await payment_service.create_payment_order(user_id)
        return result
    except ValueError as e:
        logger.error(f"Payment order creation failed: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Payment order creation failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to create payment order")

@router.post("/payments/verify")
async def verify_payment(
    verification: PaymentVerification, 
    current_user: dict = Depends(get_current_user)
):
    """Verify payment and create order"""
    user_id = current_user["user_id"]
    
    try:
        result = await payment_service.verify_payment(verification, user_id)
        return result
    except ValueError as e:
        logger.error(f"Payment verification failed: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Payment verification failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Payment verification failed")