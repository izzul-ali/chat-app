import jwt from 'jsonwebtoken';

// Access token email verification
export function generateAccessToken(email: string) {
  const jwtVerifySecret = process.env.JWT_VERIFY_SECRET;

  if (!jwtVerifySecret) {
    throw new Error('Failed to get jwt verify secret key');
  }

  const expirationDate = new Date();

  // expired in 5 minutes
  expirationDate.setMinutes(new Date().getMinutes() + 5);

  const token = jwt.sign({ email, expirationDate }, jwtVerifySecret, { algorithm: 'HS256' });

  return token;
}

export function verifyJwtToken(token: string, secretKey?: string): string | jwt.JwtPayload {
  if (!secretKey) {
    throw new Error('Secret key is not define');
  }

  const tokenPayload = jwt.verify(token, secretKey, { algorithms: ['HS256'] });
  return tokenPayload;
}
