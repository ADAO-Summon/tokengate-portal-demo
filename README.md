To recreate, setup shadcn project:
```npx create-next-app@latest my-app --typescript --tailwind --eslint```

```npx shadcn-ui@latest init```


Install next-auth

```npm install next-auth```


Create app/api/auth/[...nextauth]/route.ts and copy content from here

Create lib/auth-options.ts and copy content from here

Create next-auth.d.ts and copy content from here

Create components/ui/next-auth-provider.tsx and copy content from here

Add next-auth provider to layout.tsx:
```<NextAuthProvider>{children}</NextAuthProvider```


Set your project's .env.local file to include the following:

```SUMMON_CLIENT_ID```
```SUMMON_CLIENT_SECRET```

```NEXTAUTH_URL``` -- your domain
```NEXTAUTH_SECRET``` -- your custom secret


Deploy to vercel and test

```vercel```


