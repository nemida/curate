import { test, expect } from "@playwright/test"
import { resetDatabase, createUser, loginUser, createBlog } from "./helpers"

test.beforeEach(async () => {
  await resetDatabase()
})

test.describe("Auth", () => {
  test("user can register and is redirected to login", async ({ page }) => {
    await page.goto("/register")
    await page.getByLabel("Username", { exact: true }).fill("testuser")
    await page.getByLabel("Name", { exact: true }).fill("Test User")
    await page.getByLabel("Password", { exact: true }).fill("testpass123")
    await page.getByLabel("Confirm Password", { exact: true }).fill("testpass123")
    await page.getByTestId("register-button").click()
    await expect(page).toHaveURL("/login")
  })

  test("registration shows error for short username", async ({ page }) => {
    await page.goto("/register")
    await page.getByLabel("Username", { exact: true }).fill("usr")
    await page.getByLabel("Name", { exact: true }).fill("Test User")
    await page.getByLabel("Password", { exact: true }).fill("testpass123")
    await page.getByLabel("Confirm Password", { exact: true }).fill("testpass123")
    await page.getByTestId("register-button").click()
    await expect(page.getByTestId("username-error")).toBeVisible()
  })

  test("registration shows error for mismatched passwords", async ({ page }) => {
    await page.goto("/register")
    await page.getByLabel("Username", { exact: true }).fill("testuser")
    await page.getByLabel("Name", { exact: true }).fill("Test User")
    await page.getByLabel("Password", { exact: true }).fill("testpass123")
    await page.getByLabel("Confirm Password", { exact: true }).fill("different")
    await page.getByTestId("register-button").click()
    await expect(page.getByTestId("passwordConfirm-error")).toBeVisible()
  })

  test("user can log in and out", async ({ page }) => {
    await createUser("testuser", "Test User", "testpass123")
    await loginUser(page, "testuser", "testpass123")

    await expect(page).toHaveURL("/")
    await expect(page.getByTestId("notification")).toBeVisible()
    await expect(page.getByRole("link", { name: "me", exact: true })).toBeVisible()

    await page.getByRole("button", { name: /logout/i }).click()
    await expect(page.getByRole("link", { name: "login", exact: true })).toBeVisible()
  })

  test("login fails with wrong credentials", async ({ page }) => {
    await createUser("testuser", "Test User", "testpass123")
    await page.goto("/login")
    await page.getByLabel("Username", { exact: true }).fill("testuser")
    await page.getByLabel("Password", { exact: true }).fill("wrongpassword")
    await page.getByTestId("login-button").click()
    await expect(page.getByTestId("error-message")).toBeVisible()
  })

  test("unauthenticated user is redirected from /me to login", async ({ page }) => {
    await page.goto("/me")
    await expect(page).toHaveURL("/login")
  })

  test("unauthenticated user is redirected from /feed to login", async ({ page }) => {
    await page.goto("/feed")
    await expect(page).toHaveURL("/login")
  })
})

test.describe("Blogs", () => {
  test.beforeEach(async () => {
    await createUser("testuser", "Test User", "testpass123")
  })

  test("logged in user can create a blog and it appears in the list", async ({ page }) => {
    await loginUser(page, "testuser", "testpass123")
    await createBlog(page, "My First Post", "Test User", "http://example.com")
    await expect(page).toHaveURL("/blogs")
    await expect(page.getByTestId("blogs-list")).toContainText("My First Post")
  })

  test("blog detail shows title, author, and like button", async ({ page }) => {
    await loginUser(page, "testuser", "testpass123")
    await createBlog(page, "Detail Test", "Test Author")
    await page.goto("/blogs")
    await page.getByRole("link", { name: "Detail Test" }).click()
    await page.waitForURL(/\/blogs\/\d+/)
    await expect(page.getByTestId("blog-title")).toContainText("Detail Test")
    await expect(page.getByTestId("blog-author")).toContainText("Test Author")
    await expect(page.getByTestId("like-button")).toBeVisible()
  })

  test("markdown content renders as HTML on detail page", async ({ page }) => {
    await loginUser(page, "testuser", "testpass123")
    await createBlog(page, "Markdown Post", "Test Author", "", "## Hello\n\nThis is **bold**.")
    await page.goto("/blogs")
    await page.getByRole("link", { name: "Markdown Post" }).click()
    await page.waitForURL(/\/blogs\/\d+/)
    const content = page.getByTestId("blog-content")
    await expect(content.locator("h2")).toContainText("Hello")
    await expect(content.locator("strong")).toContainText("bold")
  })

  test("blogs can be filtered by title", async ({ page }) => {
    await loginUser(page, "testuser", "testpass123")
    await createBlog(page, "React Tutorial", "Author One")
    await createBlog(page, "Node.js Guide", "Author Two")
    await page.goto("/blogs")
    await page.getByTestId("filter-input").fill("React")
    await page.getByTestId("search-button").click()
    await expect(page.getByTestId("blogs-list")).toContainText("React Tutorial")
    await expect(page.getByTestId("blogs-list")).not.toContainText("Node.js Guide")
  })

  test("owner sees edit and delete buttons, non-owner does not", async ({ page }) => {
    await createUser("owner", "Owner User", "password123")
    await loginUser(page, "owner", "password123")
    await createBlog(page, "Owner Blog", "Owner User")

    await page.goto("/blogs")
    await page.getByRole("link", { name: "Owner Blog" }).click()
    await page.waitForURL(/\/blogs\/\d+/)
    await expect(page.getByTestId("edit-blog-button")).toBeVisible()
    await expect(page.getByTestId("delete-blog-button")).toBeVisible()

    await loginUser(page, "testuser", "testpass123")
    await page.goto("/blogs")
    await page.getByRole("link", { name: "Owner Blog" }).click()
    await page.waitForURL(/\/blogs\/\d+/)
    await expect(page.getByTestId("edit-blog-button")).not.toBeVisible()
    await expect(page.getByTestId("delete-blog-button")).not.toBeVisible()
  })

  test("owner can edit a blog", async ({ page }) => {
    await loginUser(page, "testuser", "testpass123")
    await createBlog(page, "Original Title", "Original Author")
    await page.goto("/blogs")
    await page.getByRole("link", { name: "Original Title" }).click()
    await page.waitForURL(/\/blogs\/\d+/)
    await page.getByTestId("edit-blog-button").click()
    await page.waitForURL(/\/blogs\/\d+\/edit/)
    await expect(page.getByLabel("Title", { exact: true })).toHaveValue("Original Title")
    await page.getByLabel("Title", { exact: true }).fill("Updated Title")
    await page.getByTestId("save-blog-button").click()
    await page.waitForURL(/\/blogs\/\d+$/)
    await expect(page.getByTestId("blog-title")).toContainText("Updated Title")
  })

  test("owner can delete a blog", async ({ page }) => {
    await loginUser(page, "testuser", "testpass123")
    await createBlog(page, "Delete Me", "Test Author")
    await page.goto("/blogs")
    await page.getByRole("link", { name: "Delete Me" }).click()
    await page.waitForURL(/\/blogs\/\d+/)
    await page.getByTestId("delete-blog-button").click()
    await page.waitForURL("/blogs")
    await expect(page.getByTestId("blogs-list")).not.toContainText("Delete Me")
  })
})

test.describe("Likes", () => {
  test("user can like and unlike a blog", async ({ page }) => {
    await createUser("owner", "Owner", "password123")
    await createUser("liker", "Liker", "password123")

    await loginUser(page, "owner", "password123")
    await createBlog(page, "Likeable Post", "Owner")

    await loginUser(page, "liker", "password123")
    await page.goto("/blogs")
    await page.getByRole("link", { name: "Likeable Post" }).click()
    await page.waitForURL(/\/blogs\/\d+/)

    await expect(page.getByTestId("like-button")).toContainText("0 likes")
    await page.getByTestId("like-button").click()
    await expect(page.getByTestId("like-button")).toContainText("1 like")

    await page.getByTestId("like-button").click()
    await expect(page.getByTestId("like-button")).toContainText("0 likes")
  })

  test("two different users liking increments count to 2", async ({ page }) => {
    await createUser("owner", "Owner", "password123")
    await createUser("liker2", "Liker Two", "password123")

    await loginUser(page, "owner", "password123")
    await createBlog(page, "Popular Post", "Owner")

    await loginUser(page, "liker2", "password123")
    await page.goto("/blogs")
    await page.getByRole("link", { name: "Popular Post" }).click()
    await page.waitForURL(/\/blogs\/\d+/)
    await page.getByTestId("like-button").click()
    await expect(page.getByTestId("like-button")).toContainText("1 like")

    await loginUser(page, "owner", "password123")
    await page.goto("/blogs")
    await page.getByRole("link", { name: "Popular Post" }).click()
    await page.waitForURL(/\/blogs\/\d+/)
    await page.getByTestId("like-button").click()
    await expect(page.getByTestId("like-button")).toContainText("2 likes")
  })
})

test.describe("Tags", () => {
  test.beforeEach(async () => {
    await createUser("testuser", "Test User", "testpass123")
  })

  test("tags appear on blog detail page after creation", async ({ page }) => {
    await loginUser(page, "testuser", "testpass123")
    await createBlog(page, "Tagged Post", "Test Author", "", "", ["javascript", "react"])
    await page.goto("/blogs")
    await page.getByRole("link", { name: "Tagged Post" }).click()
    await page.waitForURL(/\/blogs\/\d+/)
    const tags = page.getByTestId("blog-tags")
    await expect(tags).toContainText("javascript")
    await expect(tags).toContainText("react")
  })

  test("clicking a tag filters the blog list", async ({ page }) => {
    await loginUser(page, "testuser", "testpass123")
    await createBlog(page, "JS Post", "Author", "", "", ["javascript"])
    await createBlog(page, "CSS Post", "Author", "", "", ["css"])
    await page.goto("/blogs")
    await page.getByTestId("card-tag-javascript").first().click()
    await page.waitForURL(/\/blogs\?tag=javascript/)
    await expect(page.getByTestId("blogs-list")).toContainText("JS Post")
    await expect(page.getByTestId("blogs-list")).not.toContainText("CSS Post")
    await expect(page.getByTestId("active-tag-filter")).toContainText("javascript")
  })

  test("clearing tag filter restores full list", async ({ page }) => {
    await loginUser(page, "testuser", "testpass123")
    await createBlog(page, "JS Post", "Author", "", "", ["javascript"])
    await createBlog(page, "CSS Post", "Author", "", "", ["css"])
    await page.goto("/blogs?tag=javascript")
    await expect(page.getByTestId("blogs-list")).not.toContainText("CSS Post")
    await page.getByTestId("clear-tag-filter").click()
    await page.waitForURL("/blogs")
    await expect(page.getByTestId("blogs-list")).toContainText("JS Post")
    await expect(page.getByTestId("blogs-list")).toContainText("CSS Post")
  })
})

test.describe("Comments", () => {
  test.beforeEach(async () => {
    await createUser("author", "Author", "password123")
    await createUser("commenter", "Commenter", "password123")
  })

  test("logged in user can post a comment", async ({ page }) => {
    await loginUser(page, "author", "password123")
    await createBlog(page, "Comment Test Post", "Author")
    await loginUser(page, "commenter", "password123")
    await page.goto("/blogs")
    await page.getByRole("link", { name: "Comment Test Post" }).click()
    await page.waitForURL(/\/blogs\/\d+/)
    await page.getByTestId("comment-input").fill("Great post!")
    await page.getByTestId("submit-comment-button").click()
    await expect(page.getByTestId("comments-section")).toContainText("Great post!")
  })

  test("comment author sees delete button, others do not", async ({ page }) => {
    await loginUser(page, "author", "password123")
    await createBlog(page, "Comment Ownership Post", "Author")
    await loginUser(page, "commenter", "password123")
    await page.goto("/blogs")
    await page.getByRole("link", { name: "Comment Ownership Post" }).click()
    await page.waitForURL(/\/blogs\/\d+/)
    await page.getByTestId("comment-input").fill("My comment")
    await page.getByTestId("submit-comment-button").click()
    await expect(page.getByTestId("comments-section")).toContainText("My comment")
    const deleteBtn = page.locator('[data-testid^="delete-comment-"]').first()
    await expect(deleteBtn).toBeVisible()

    await loginUser(page, "author", "password123")
    await page.goto("/blogs")
    await page.getByRole("link", { name: "Comment Ownership Post" }).click()
    await page.waitForURL(/\/blogs\/\d+/)
    await expect(page.locator('[data-testid^="delete-comment-"]')).not.toBeVisible()
  })

  test("user can delete their own comment", async ({ page }) => {
    await loginUser(page, "author", "password123")
    await createBlog(page, "Delete Comment Post", "Author")
    await loginUser(page, "commenter", "password123")
    await page.goto("/blogs")
    await page.getByRole("link", { name: "Delete Comment Post" }).click()
    await page.waitForURL(/\/blogs\/\d+/)
    await page.getByTestId("comment-input").fill("Delete me")
    await page.getByTestId("submit-comment-button").click()
    await expect(page.getByTestId("comments-section")).toContainText("Delete me")
    await page.locator('[data-testid^="delete-comment-"]').first().click()
    await expect(page.getByTestId("comments-section")).not.toContainText("Delete me")
    await expect(page.getByTestId("no-comments")).toBeVisible()
  })
})

test.describe("Follows and Feed", () => {
  test.beforeEach(async () => {
    await createUser("writer", "Writer", "password123")
    await createUser("reader", "Reader", "password123")
  })

  test("user can follow and unfollow another user", async ({ page }) => {
    await loginUser(page, "reader", "password123")
    await page.goto("/users/writer")
    await expect(page.getByTestId("follow-button")).toContainText("Follow")
    await page.getByTestId("follow-button").click()
    await expect(page.getByTestId("follow-button")).toContainText("Unfollow")
    await expect(page.getByTestId("follower-count")).toContainText("1")
    await page.getByTestId("follow-button").click()
    await expect(page.getByTestId("follow-button")).toContainText("Follow")
    await expect(page.getByTestId("follower-count")).toContainText("0")
  })

  test("own profile does not show follow button", async ({ page }) => {
    await loginUser(page, "writer", "password123")
    await page.goto("/users/writer")
    await expect(page.getByTestId("follow-button")).not.toBeVisible()
  })

  test("feed shows posts from followed users only", async ({ page }) => {
    await loginUser(page, "writer", "password123")
    await createBlog(page, "Writer Post", "Writer")

    await loginUser(page, "reader", "password123")
    await page.goto("/feed")
    await expect(page.locator("text=Nothing here yet")).toBeVisible()

    await page.goto("/users/writer")
    await page.getByTestId("follow-button").click()
    await expect(page.getByTestId("follow-button")).toContainText("Unfollow")

    await page.goto("/feed")
    await expect(page.getByTestId("blogs-list")).toContainText("Writer Post")
  })

  test("feed is empty after unfollowing all users", async ({ page }) => {
    await loginUser(page, "writer", "password123")
    await createBlog(page, "Writer Post", "Writer")

    await loginUser(page, "reader", "password123")
    await page.goto("/users/writer")
    await page.getByTestId("follow-button").click()
    await expect(page.getByTestId("follow-button")).toContainText("Unfollow")

    await page.goto("/feed")
    await expect(page.getByTestId("blogs-list")).toContainText("Writer Post")

    await page.goto("/users/writer")
    await page.getByTestId("follow-button").click()
    await expect(page.getByTestId("follow-button")).toContainText("Follow")

    await page.goto("/feed")
    await expect(page.locator("text=Nothing here yet")).toBeVisible()
  })
})

test.describe("Reading List", () => {
  test.beforeEach(async () => {
    await createUser("author", "Author", "password123")
    await createUser("reader", "Reader", "password123")
  })

  test("user can add a blog to reading list and see it on /me", async ({ page }) => {
    await loginUser(page, "author", "password123")
    await createBlog(page, "Reading List Post", "Author")
    await loginUser(page, "reader", "password123")
    await page.goto("/blogs")
    await page.getByRole("link", { name: "Reading List Post" }).click()
    await page.waitForURL(/\/blogs\/\d+/)
    await page.waitForSelector('[data-testid="add-to-reading-list-button"]')
    await page.getByTestId("add-to-reading-list-button").click()
    await expect(page.getByTestId("add-to-reading-list-button")).toContainText("✓ In reading list")
    await page.goto("/me")
    await expect(page.getByTestId("unread-section")).toContainText("Reading List Post")
  })

  test("user can mark a blog as read", async ({ page }) => {
    await loginUser(page, "author", "password123")
    await createBlog(page, "Mark Read Post", "Author")
    await loginUser(page, "reader", "password123")
    await page.goto("/blogs")
    await page.getByRole("link", { name: "Mark Read Post" }).click()
    await page.waitForURL(/\/blogs\/\d+/)
    await page.waitForSelector('[data-testid="add-to-reading-list-button"]')
    await page.getByTestId("add-to-reading-list-button").click()
    await expect(page.getByTestId("add-to-reading-list-button")).toContainText("✓ In reading list")
    await page.goto("/me")
    await page.waitForSelector('[data-testid^="mark-read-"]')
    await page.locator('[data-testid^="mark-read-"]').first().click()
    await expect(page.getByTestId("no-unread-blogs")).toBeVisible()
  })
})
