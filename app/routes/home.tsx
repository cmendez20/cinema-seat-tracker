import type { Route } from "./+types/home";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { db } from "~/db/db";
import { auditorium, theater } from "~/db/schema";
import { PlusIcon } from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Movie Seat Tracker" },
    { name: "description", content: "Track your seats!" },
  ];
}

export async function loader() {
  // console.log(await db.select().from(theater));
  const data = await db.select().from(theater);
  return data;
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <main className="max-w-80 mx-auto grid gap-6 pt-16 pb-4">
      <div>
        <h1 className="text-5xl font-black">Movie Seat Tracker</h1>
      </div>
      <h2 className="font-bold text-3xl">Your theaters:</h2>

      {loaderData.map((theater) => {
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
        <Link to={"save-new-seat"}>
          <PlusIcon /> New seat
        </Link>
      </Button>
    </main>
  );
}
