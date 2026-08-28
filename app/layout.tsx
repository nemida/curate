import Link from "next/link"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <nav>
          <Link href="/">home</Link>
          {" | "}
          <Link href="/notes">notes</Link>
          {" | "}
          <Link href="/notes/new">create new</Link>
        </nav>
        {children}
      </body>
    </html>
  )
}