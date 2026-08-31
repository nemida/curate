import { getBlogs } from "../services/blogs";
import BlogFilter from "./BlogFilter";
import BlogsListClient from "./BlogsListClient";

type BlogsPageProps = {
  searchParams: Promise<{ filter?: string }>;
};

const Blogs = async ({ searchParams }: BlogsPageProps) => {
  const { filter } = await searchParams;
  const rawBlogs = await getBlogs(filter);
  const sortedBlogs = [...rawBlogs].sort((a, b) => b.likes - a.likes);

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Blogs</h2>

      <BlogFilter defaultValue={filter} />

      <BlogsListClient blogs={sortedBlogs} />
    </div>
  );
};

export default Blogs;
