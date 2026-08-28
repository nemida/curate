import { createNote } from "@/app/actions/notes"



const NewNote = () => {
  return (
    <div>
      <h2>Create a new blog</h2>
      <form action = {createNote}>
        <div>
          <label>
            Title
            <input type="text" name="title" required />
          </label>
        </div>
        <div>
          <label>
            Author
            <input type="text" name="author" />
          </label>
        </div>
        <div>
          <label>
            URL
            <input type="text" name="url" />
          </label>
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
  )
}

export default NewNote