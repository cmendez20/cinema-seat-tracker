import type { Route } from "./+types/dashboard";
import { Form, Link, redirect } from "react-router";

import { eq } from "drizzle-orm";
import { PlusIcon } from "lucide-react";

import { Button } from "~/components/ui/button";
import { db } from "~/db/db.server";
import { seat, theater } from "~/db/schema";
import { auth } from "~/lib/auth.server";

export async function action({ request }: Route.ActionArgs) {
  const response = await auth.api.signOut({
    headers: request.headers,
    asResponse: true,
  });

  if (!response.ok) {
    return response;
  }

  return redirect("/", {
    headers: response.headers,
  });
}

export async function loader({ request }: Route.LoaderArgs) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session) return redirect("/");

  const theaters = await db
    .selectDistinct({ id: theater.id, theaterName: theater.theaterName })
    .from(theater)
    .innerJoin(seat, eq(theater.id, seat.theaterId))
    .where(eq(seat.userId, session.user.id))
    .orderBy(theater.theaterName);

  return { theaters };
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  const { theaters } = loaderData;

  return (
    <main className="max-w-80 mx-auto grid gap-6 pt-16 pb-4">
      <h1 className="text-5xl font-black">Movie Seat Tracker</h1>

      <h2 className="font-bold text-3xl">Your theaters:</h2>
      {theaters.length === 0 && <p>No theaters saved yet</p>}
      {theaters.map((theater) => {
        return (
          <Link
            key={theater.id}
            to={`/theaters/${theater.id}/my-seats`}
            className="bg-gray-200 px-8 py-2 rounded-b-md transition-colors hover:bg-gray-300 hover:cursor-pointer"
          >
            {theater.theaterName}
          </Link>
        );
      })}

      <Button
        asChild
        size="sm"
        variant="outline"
        className="items-center justify-start grow-0 shrink-0 max-w-min"
      >
        <Link to="/save-new-seat">
          <PlusIcon /> New seat
        </Link>
      </Button>

      <Form method="post">
        <Button type="submit">Sign out</Button>
      </Form>
    </main>
  );
}
