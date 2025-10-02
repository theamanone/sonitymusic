import { getServerSession } from 'next-auth';
import { authOptions } from './auth.config';
import { NextApiRequest, NextApiResponse } from 'next';

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user || null;
}

export async function requireAuth(
  req: NextApiRequest,
  res: NextApiResponse,
  roles: string[] = []
) {
  const session = await getServerSession(req, res, authOptions);
  
  if (!session?.user) {
    return { 
      error: 'Unauthorized',
      status: 401,
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    };
  }

  if (roles.length > 0 && !roles.includes(session.user.role)) {
    return { 
      error: 'Forbidden',
      status: 403,
      redirect: {
        destination: '/dashboard',
        permanent: false,
      },
    };
  }

  return { user: session.user };
}

export { signIn, signOut } from 'next-auth/react';
