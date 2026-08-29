import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { eq } from "drizzle-orm"
import bcrypt from "bcryptjs"
import { db } from "./db"
import { users } from "./db/schema"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null
        }

        const user = await db.query.users.findFirst({
          where: eq(users.username, credentials.username as string),
        })

        if (!user || !user.passwordHash) {
          return null
        }

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash,
        )

        if (!isValid) {
          return null
        }

        return {
          id: String(user.id),
          name: user.name,
          email: user.username,
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
})


/*

You write          next-auth does                    Next.js does
──────────         ─────────────────────────────     ──────────────
authorize()   →    calls it, takes your return       nothing
                   value, creates + signs JWT,
                   sets the cookie

auth()        →    reads the cookie, verifies        nothing
                   the JWT signature, returns
                   the session object

signIn()      →    sends credentials to              nothing
                   /api/auth/[...nextauth],
                   orchestrates the whole flow

*/