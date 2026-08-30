"use client";
import { useActionState } from "react";
import { registerUser } from "../actions/users";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RegisterPage() {
  const [state, formAction] = useActionState(registerUser, {
    error: "",
    values: { username: "", name: "" },
  });

  return (
    <div className="max-w-sm mx-auto mt-16">
      <h2 className="text-2xl font-bold mb-6">Register</h2>
      <Card>
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Username</label>
              <Input type="text" name="username" required defaultValue={state.values?.username} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Name</label>
              <Input type="text" name="name" required defaultValue={state.values?.name} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Password</label>
              <Input type="password" name="password" required />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Confirm Password</label>
              <Input type="password" name="confirmpass" required />
            </div>
            {state.error && <p className="text-destructive text-sm">{state.error}</p>}
            <Button type="submit">Register</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
