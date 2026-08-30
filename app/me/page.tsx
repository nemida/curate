import { redirect } from "next/navigation";
import { getCurrentUser } from "../services/session";
import { generateAPIToken } from "../actions/users";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Profile = async () => {
  const user = await getCurrentUser();

  if (!user) redirect("/login");

  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>My Profile</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <p className="text-sm"><span className="font-medium">Name:</span> {user!.name}</p>
            <p className="text-sm"><span className="font-medium">Username:</span> {user!.username}</p>
          </div>

          <div className="border-t pt-4 flex flex-col gap-3">
            <p className="text-sm font-medium">API Token</p>
            {user!.token ? (
              <p className="text-sm font-mono bg-muted px-3 py-2 rounded-md break-all">{user!.token}</p>
            ) : (
              <p className="text-sm text-muted-foreground">No token generated yet.</p>
            )}
            <form action={generateAPIToken}>
              <Button type="submit" variant="outline" size="sm">
                {user!.token ? "Regenerate token" : "Generate token"}
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
