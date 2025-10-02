import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth/auth.config";

// Configure the handler with debug mode for development
const handler = NextAuth({
  ...authOptions,
  // debug: process.env.NODE_ENV === 'development',
});

export { handler as GET, handler as POST };
