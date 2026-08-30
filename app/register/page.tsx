"use client"
import { useActionState } from "react"
import { registerUser } from "../actions/users"

export default function RegisterPage() {
  const [state, formAction] = useActionState(registerUser, {error: "", values: {username:"", name:""}})
  return (
    <div>
      <h2>Register</h2>
      {state.error && <p style={{ color: "red" }}>{state.error}</p>}
      <form action={formAction}>
        <div>
          <label>
            Username
            <input type="text" name="username" required defaultValue={state.values?.username}/>
          </label>
        </div>
        <div>
          <label>
            Name
            <input type="text" name="name" required defaultValue={state.values?.name} />
          </label>
        </div>
        <div>
          <label>
            Password
            <input type="password" name="password" required />
          </label>
        </div>
        <div>
          <label>
            Confirm Password
            <input type="password" name="confirmpass" required />
          </label>
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  )
}