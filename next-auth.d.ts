import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    accessToken: string;
    refreshToken: string;
    error: string;
    user: {
      id: string;
    } & DefaultSession['user'];
  }
}