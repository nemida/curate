import { notFound } from "next/navigation";
import { getNoteById } from "../../services/notes";
import { increaseLikes } from "@/app/actions/notes";


const NotePage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const note = getNoteById(Number(id));

  if (!note) {
    notFound();
  }

  return (
    <div>
      <article
        style={{
          border: "1px solid #ccc",
          padding: "1rem",
          marginBottom: "1rem",
        }}
      >
        <h3>{note.title}</h3>

        <p>
          Author: {note.author}
          <br />
          {note.url && <a href={note.url}>Read more</a>}
        </p>
        <form action={increaseLikes}>
          <input type="hidden" name="id" value={note.id} />
          <button type="submit">
            Likes: {note.likes}
          </button>
        </form>
      </article>
    </div>
  );
};

export default NotePage;
