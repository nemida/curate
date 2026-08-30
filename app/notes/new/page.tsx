"use client"
import { createNote } from "@/app/actions/notes"
import { useNotification } from "@/app/components/NotificationContext"
import { useRouter } from "next/navigation"
import { useActionState, useEffect } from "react"

const NewNote = () => {
  const [state, formAction] = useActionState(createNote, { error: "", values: {title: "", author: "", url: ""}, success: false})

  const { showNotification } = useNotification();
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      showNotification("Note created.")
      router.push("/notes")
    }
  }, [state, showNotification, router])

  return (
    <div>
      <h2>Create a new blog</h2>
      <form action = {formAction}>
        <div>
          <label>
            Title
            <input type="text" name="title" required minLength={5} defaultValue={state.values?.title}/>
          </label>
        </div>
        <div>
          <label>
            Author
            <input type="text" name="author" required minLength={5} defaultValue={state.values?.author}/>
          </label>
        </div>
        <div>
          <label>
            URL
            <input type="text" name="url" required minLength={5} defaultValue={state.values?.url}/>
          </label>
        </div>
        <button type="submit">Create</button>
        {state.error && <p style={{ color: "red" }}>{state.error}</p>}
      </form>
    </div>
  )
}

export default NewNote