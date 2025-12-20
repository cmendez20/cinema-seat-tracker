import { auth } from "~/lib/auth.server";
import type { Route } from "./+types/dashboard";
import { redirect } from "react-router";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session) return redirect("/");

  return {};
}

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome to your dashboard</p>
    </div>
  );
}
