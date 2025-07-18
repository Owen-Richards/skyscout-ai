import { jwtVerify } from 'jose';
import { config } from '../config';

export async function verifyJWT(token: string) {
  const secret = new TextEncoder().encode(config.JWT_SECRET);

  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    throw new Error('Invalid token');
  }
}
