import Link from 'next/link';
import { getNotes } from '../services/notes';

type NotesPageProps = {
  searchParams: Promise<{ filter?: string }>;
};


const Notes = async ( {searchParams} : NotesPageProps ) => {

  const { filter } = await searchParams;
  const rawNotes = await getNotes();
  const sortedNotes = [...rawNotes].sort((a, b) => b.likes - a.likes)

  const displayNotes = filter ? sortedNotes.filter((note) => note.title.toLowerCase().includes(filter.toLowerCase())) : sortedNotes;

  return (
    <div>
      <h2>Notes</h2>
      <form action="/notes" method="GET" style={{ marginBottom: '2rem' }}>
        <input 
          type="text" 
          name="filter" 
          defaultValue={filter} 
          placeholder="Search notes..." 
        />
        <button type="submit">Search</button>
      </form>
      <ul>
        {displayNotes.map(note => (
          <li key={note.id} style={{ marginBottom: '1rem' }}>
            <article style={{ border: '1px solid #ccc', padding: '1rem' }}>
              <Link href={`/notes/${note.id}`}>Go to it!</Link>
              <h3>{note.title}</h3>
              
              <p>
                Author: {note.author}
                <br />
                {note.url && <a href={note.url}>Read more</a>}
              </p>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notes;