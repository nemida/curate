import Link from "next/link"
import { notFound } from "next/navigation"
import { getUserByUsername } from "../../services/users"


const userPage = async ({ params }: { params: Promise<{ username: string }> }) => {
  const { username } = await params
  const user = await getUserByUsername(username);
  if (!user) {
    notFound();
  }
  

  return (
     <div>
       <h2>{user.name}</h2>
       <p>Username: {user.username}</p>
       <h3>Notes</h3>
       <ul>
         {user.notes.map(note => (
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
   )
}

export default userPage;