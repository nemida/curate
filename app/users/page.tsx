import Link from "next/link";
import { getUsers } from "../services/users";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const Users = async () => {
  const users = await getUsers();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Users</h2>
      <ul className="flex flex-col gap-3">
        {users.map((user) => (
          <li key={user.id}>
            <Link href={`/users/${user.username}`}>
              <Card className="hover:ring-foreground/20 transition-all cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-sm font-semibold">
                      {user.name[0].toUpperCase()}
                    </div>
                    <div>
                      <CardTitle>{user.name}</CardTitle>
                      <CardDescription>@{user.username}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Users;
