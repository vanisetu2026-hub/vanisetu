import { Request, Response, NextFunction } from 'express';
import { adminAuth, isFirebaseAdminConfigured } from '../config/firebaseAdmin.js';

export interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email?: string;
    name?: string;
  };
}

export const authenticateUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // Check if guest token or dev bypass
    req.user = {
      uid: 'guest_user_demo',
      email: 'guest@vanisetu.org',
      name: 'Guest Learner',
    };
    return next();
  }

  const token = authHeader.split('Bearer ')[1];

  if (isFirebaseAdminConfigured && adminAuth) {
    try {
      const decodedToken = await adminAuth.verifyIdToken(token);
      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email,
        name: decodedToken.name,
      };
      return next();
    } catch (err) {
      console.warn('Firebase token verification error (falling back to user payload):', err);
    }
  }

  // Fallback: extract payload or assign session user
  req.user = {
    uid: 'learner_' + token.substring(0, 10),
    email: 'learner@vanisetu.org',
    name: 'Tribal Learner',
  };
  next();
};
