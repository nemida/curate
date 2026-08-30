import AuthSessionProvider from "./components/SessionProvider";
import NavBar from "./components/NavBar";
import { NotificationProvider } from "./components/NotificationContext";
import Notification from "./components/Notification";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground">
        <AuthSessionProvider>
          <NotificationProvider>
            <NavBar />
            <Notification />
            {children}
          </NotificationProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
