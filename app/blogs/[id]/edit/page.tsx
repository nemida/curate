import { notFound, redirect } from "next/navigation";
import { getBlogById } from "@/app/services/blogs";
import { getCurrentUser } from "@/app/services/session";
import EditBlogForm from "./EditBlogForm";

type EditBlogPageProps = {
  params: Promise<{ id: string }>;
};

const EditBlogPage = async ({ params }: EditBlogPageProps) => {
  const { id } = await params;
  const blog = await getBlogById(Number(id));

  if (!blog) notFound();

  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.id !== blog.userId) {
    redirect(`/blogs/${id}`);
  }

  return (
    <EditBlogForm
      id={blog.id}
      initialTitle={blog.title}
      initialAuthor={blog.author}
      initialUrl={blog.url ?? ""}
      initialContent={blog.content ?? ""}
    />
  );
};

export default EditBlogPage;
