import { AuthOptions } from "next-auth";

const domain = process.env.NEXTAUTH_URL;
const redirect_uri = `${domain}/api/auth/callback/summon`;


async function refreshAccessToken(token: any) {
  try {
    const url = `https://testnetapi.summonplatform.io/v1/oauth/token`;

    const clientCredentials = Buffer.from(`${process.env.SUMMON_CLIENT_ID}:${process.env.SUMMON_CLIENT_SECRET}`).toString("base64"); 

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${clientCredentials}`
      },
      method: "POST",
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: token.refreshToken,
        redirect_uri: redirect_uri
      })
    });

    if (!response.ok) {
      const err = await response.text();
      console.log('refresh error', err);
      throw err;
    }

    const refreshedTokens = await response.json();

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, 
    };
  } catch (error) {
    console.log(error);

    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export const authOptions: AuthOptions = {
  callbacks: {
    session: async ({ session, token }) => {
      if (session?.user) {
        session.accessToken = (token.accessToken as any).toString();
        const refreshToken = (token.refreshToken as any);
        if(refreshToken) session.refreshToken = refreshToken.toString();
        const error = (token.error as any);
        if(error) session.error = error.toString();
        session.user.id = token.uid;
      }
      return session;
    },
    jwt: async ({ user, account, token }) => {
      if (user) {
        token.accessToken = account?.access_token;
        token.refreshToken = account?.refresh_token;
        token.accessTokenExpires = Date.now() + (account?.expires_in ? Number(account.expires_in) : 0) * 1000
        token.uid = user.id;
      }
      if (Date.now() < (token.accessTokenExpires as number)) {
        return token
      }

      return refreshAccessToken(token);
    },
  },
  providers: [
    {
      id: "summon",
      type: "oauth",
      version: "2.0",
      name: "summon",
      issuer: "https://testnetapi.summonplatform.io/v1",
      clientId: process.env.SUMMON_CLIENT_ID,
      clientSecret: process.env.SUMMON_CLIENT_SECRET,
      authorization: {
        url: `https://testnetapi.summonplatform.io/v1/oauth/authorize`,
        params: {
          response_type: "code",
          scope: "user:profile",
        },
      },

      token: {
        url: `https://testnetapi.summonplatform.io/v1/oauth/token`,
      },
      userinfo: `https://testnetapi.summonplatform.io/v1/oauth/userinfo`,
      async profile(profile) {

        return { id: profile.id, name: profile.handle || profile.name };
      },
    },
  ],

  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
};


