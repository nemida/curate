"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NavBar() {
  const { data: session } = useSession();

  return (
    <nav className="border-b bg-card px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <Link href="/" className="text-lg font-semibold">
          blogapp
        </Link>
        <Link href="/notes" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          Notes
        </Link>
        <Link href="/users" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          Users
        </Link>
      </div>

      <div className="flex items-center gap-3">
        {session ? (
          <>
            <span className="text-sm text-muted-foreground">{session.user?.name}</span>
            <Link href="/notes/new" className={cn(buttonVariants({ size: "sm" }))}>
              + New
            </Link>
            <Button variant="ghost" size="sm" onClick={() => signOut()}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Link href="/login" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
              Login
            </Link>
            <Link href="/register" className={cn(buttonVariants({ size: "sm" }))}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
