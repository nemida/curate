import { relations } from "drizzle-orm";
import { boolean, integer, pgTable, serial, text, unique } from "drizzle-orm/pg-core";

export const blogs = pgTable("blogs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  author: text("author").notNull(),
  url: text("url").notNull(),
  userId: integer("user_id").notNull().references(() => users.id),
})

export const blogLikes = pgTable("blog_likes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  blogId: integer("blog_id").notNull().references(() => blogs.id),
}, (t) => [
  unique("blog_likes_user_blog_unique").on(t.userId, t.blogId),
])

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  name: text("name").notNull(),
  passwordHash: text("password_hash").notNull().default(""),
  token: text("token"),
})

export const readingList = pgTable("reading_list", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  blogId: integer("blog_id").notNull().references(() => blogs.id),
  read: boolean("read").notNull().default(false),
})

export const usersRelations = relations(users, ({ many }) => ({
  blogs: many(blogs),
  readingList: many(readingList),
  blogLikes: many(blogLikes),
}))

export const blogsRelations = relations(blogs, ({ one, many }) => ({
  user: one(users, {
    fields: [blogs.userId],
    references: [users.id],
  }),
  readingList: many(readingList),
  blogLikes: many(blogLikes),
}))

export const blogLikesRelations = relations(blogLikes, ({ one }) => ({
  user: one(users, {
    fields: [blogLikes.userId],
    references: [users.id],
  }),
  blog: one(blogs, {
    fields: [blogLikes.blogId],
    references: [blogs.id],
  }),
}))

export const readingListRelations = relations(readingList, ({ one }) => ({
  user: one(users, {
    fields: [readingList.userId],
    references: [users.id],
  }),
  blog: one(blogs, {
    fields: [readingList.blogId],
    references: [blogs.id],
  }),
}))
