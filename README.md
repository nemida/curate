# Curate

A quiet place on the internet to collect and share the essays, articles, and blog posts that actually matter to you.

This project was built to solve a simple problem: the internet is too loud, and our bookmarks are too scattered. Curate provides a minimalist, text-focused environment where you can save what you want to read, discover what others find valuable, and keep a personal record of your reading list.

## Architecture

Curate is built on a modern, server-first React stack designed for speed and simplicity.

- **Framework**: Next.js (App Router)
- **Database**: PostgreSQL (hosted on Neon)
- **ORM**: Drizzle ORM
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS with shadcn/ui components

## Setup

1. **Clone the repository**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment variables**
   Create a `.env.local` file in the root directory with the following variables:
   ```
   DATABASE_URL=your_neon_postgres_connection_string
   AUTH_SECRET=a_random_secure_string_for_nextauth
   ```

4. **Database schema**
   Push the schema to your database:
   ```bash
   npx drizzle-kit migrate
   ```

5. **Seed the database (Optional)**
   If you want to start with sample users and reading lists:
   ```bash
   npx tsx seed.ts
   ```

6. **Run the development server**
   ```bash
   npm run dev
   ```

## License

This project is open-source and available under the MIT License.
