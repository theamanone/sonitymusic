import { NextAuthOptions } from "next-auth";
import crypto from "crypto";

// Extend the session types
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string;
      email?: string;
      avatar?: string;
      role: string;
      sessionId?: string;
    };
    expires: string;
    success?: boolean;
    timestamp?: string;
    requestId?: string;
    meta?: {
      apiVersion: string;
      license: string;
      encryption: string;
      serverRegion: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    email?: string;
    role: string;
    sessionId?: string;
  }
}

// Extend the User type
declare module 'next-auth' {
  interface User {
    id: string;
    name?: string;
    email?: string;
    avatar?: string;
    role: string;
  }
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || 'your-256-bit-secret', // Fallback for development
  providers: [
    // Add any providers you need here
  ],
  debug: false, // Disable debug to remove warnings
  pages: {
    signIn: `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/auth/signin`,
    signOut: `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/auth/signout`,
    error: `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/auth/error`,
    verifyRequest: `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/auth/verify-request`,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.name = user.name;
        token.avatar = user.avatar;
        token.email = user.email;
        token.sessionId = crypto.randomUUID();
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        // Create a new session object with all required fields
        const enhancedSession = {
          ...session,
          user: {
            ...session.user,
            id: token.id as string,
            name: (token.name ?? undefined) as string | undefined,
            email: (token.email ?? undefined) as string | undefined,
            avatar: (token.picture || token.avatar) as string | undefined,
            // Back-compat for components expecting `image`
            image: (token.picture || (token as any).image || token.avatar) as string | undefined,
            role: token.role as string,
            sessionId: token.sessionId as string | undefined
          },
          expires: token.exp ? new Date(Number(token.exp) * 1000).toISOString() : new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
          success: true,
          timestamp: new Date().toISOString(),
          requestId: crypto.randomUUID(),
          meta: {
            apiVersion: "1.0",
            license: "Veliessa Proprietary",
            encryption: "AES-256",
            serverRegion: "global"
          }
        };
        return enhancedSession;
      }
      return session;
    },
  },
  // Configure the session and cookie settings
  session: {
    strategy: "jwt",
    maxAge: 60 * 24 * 60 * 60, // 60 days
    updateAge: 24 * 60 * 60, // Update session every 24 hours
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax", // Changed from "none" for local development with different ports
        path: "/",
        // In development with different ports, we can't use secure cookies
        secure: process.env.NODE_ENV === "production",
        // For local development with different ports, don't set domain
        // This will allow the browser to store separate cookies for each port
        // In production, you'll want to set the domain to ".veliessa.com"
        domain: undefined // Remove domain for development
      }
    },
    callbackUrl: {
      name: `next-auth.callback-url`,
      options: {
        httpOnly: true,
        sameSite: "lax", // Changed for development
        path: "/",
        secure: process.env.NODE_ENV === "production",
        domain: undefined // Remove domain for development
      }
    },
    csrfToken: {
      name: `next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: "lax", // Changed for development
        path: "/",
        secure: process.env.NODE_ENV === "production",
        domain: undefined // Remove domain for development
      }
    }
  },
  // For development, debug mode
  // debug: process.env.NODE_ENV === 'development',
};
