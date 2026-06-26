const admin = require('firebase-admin');
import prisma from '../config/database';
import jwt from 'jsonwebtoken';
import { JWT, FIREBASE } from '../constants';

let firebaseApp: any;
try {
  firebaseApp = admin.app();
} catch (err) {
  if (!FIREBASE.PROJECT_ID || !FIREBASE.CLIENT_EMAIL || !FIREBASE.PRIVATE_KEY) {
    // Defer initialization until googleAuth is called with proper config
    firebaseApp = null;
  } else {
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: FIREBASE.PROJECT_ID,
        clientEmail: FIREBASE.CLIENT_EMAIL,
        privateKey: FIREBASE.PRIVATE_KEY,
      }),
    });
  }
}

export const googleAuth = async (idToken: string) => {
  if (!FIREBASE.PROJECT_ID || !FIREBASE.CLIENT_EMAIL || !FIREBASE.PRIVATE_KEY) {
    throw new Error('Firebase admin configuration is not set');
  }

  const decodedToken = await admin.auth(firebaseApp).verifyIdToken(idToken);

  const email = decodedToken.email;
  const name = decodedToken.name || 'Google User';
  const googleId = decodedToken.uid;
  const emailVerified = decodedToken.email_verified || false;
  const avatar = decodedToken.picture || null;

  if (!email) {
    throw new Error('Firebase token did not contain an email');
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    const token = jwt.sign({ userId: existingUser.id, role: existingUser.role }, JWT.SECRET, {
      expiresIn: JWT.EXPIRES_IN as any,
    });

    const { password: _, ...userWithoutPassword } = existingUser;
    return { user: userWithoutPassword, token };
  }

  const user = await prisma.user.create({
    data: {
      email,
      password: '',
      name,
      role: 'CUSTOMER',
      googleId,
      avatar,
      provider: 'google',
      emailVerified,
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      phone: true,
      createdAt: true,
    },
  });

  const token = jwt.sign({ userId: user.id, role: user.role }, JWT.SECRET, {
    expiresIn: JWT.EXPIRES_IN as any,
  });

  return { user, token };
};
