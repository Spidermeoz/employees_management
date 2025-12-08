from fastapi import Request, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from .jwt_handler import decode_access_token


class JWTBearer(HTTPBearer):
    async def __call__(self, request: Request):
        credentials: HTTPAuthorizationCredentials = await super().__call__(request)

        if not credentials:
            raise HTTPException(status_code=403, detail="Không có token")

        token = credentials.credentials
        payload = decode_access_token(token)

        if payload is None:
            raise HTTPException(status_code=403, detail="Token không hợp lệ hoặc đã hết hạn")

        # trả payload để các dependency khác có thể dùng
        return payload
