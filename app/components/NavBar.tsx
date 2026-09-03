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
          
        </Link>
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          home
        </Link>
        <Link href="/blogs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          blogs
        </Link>
        <Link href="/users" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          users
        </Link>
      </div>

      <div className="flex items-center gap-3">
        {session ? (
          <>
            <Link href="/me" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              me
            </Link>
            <Link href="/feed" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              feed
            </Link>
            <Link href="/blogs/new" className={cn(buttonVariants({ size: "sm" }))}>
              + new
            </Link>
            <Button variant="ghost" size="sm" onClick={() => signOut()}>
              logout
            </Button>
          </>
        ) : (
          <>
            <Link href="/login" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
              login
            </Link>
            <Link href="/register" className={cn(buttonVariants({ size: "sm" }))}>
              register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
