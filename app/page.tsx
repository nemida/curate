import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import ScatterTitle from "./components/ScatterTitle";

const Home = () => {
  return (
    <div className="flex flex-col items-center text-center py-24 gap-6 overflow-hidden">
      <div className="inline-block bg-muted text-muted-foreground text-xs font-medium px-3 py-1 rounded-full mb-2">
        made by adi, with love
      </div>

      <div className="flex flex-col items-center gap-2">
        <ScatterTitle />
        <h2 className="text-2xl md:text-3xl font-bold leading-tight max-w-lg text-foreground/80">
          A place for blogs that matter
        </h2>
      </div>

      <p className="text-muted-foreground text-lg max-w-md">
        Save, share, and discover blog posts and articles. Like the ones you love. Find new ones.
      </p>

      <div className="flex gap-3 mt-2">
        <Link href="/register" className={cn(buttonVariants({ size: "lg" }))}>
          Get started
        </Link>
        <Link href="/blogs" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
          Browse blogs
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-20 w-full max-w-2xl text-center">
        <Card>
          <CardHeader>
            <CardTitle>Save anything</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Bookmark articles, tutorials, and blog posts you want to remember.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Like what you love</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            The best blogs rise to the top. Discover what others find valuable.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Find fast</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Search across all blogs instantly to find exactly what you need.
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Home;
