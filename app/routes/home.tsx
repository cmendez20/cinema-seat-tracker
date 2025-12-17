import type { Route } from "./+types/home";
import { Link } from "react-router";
import { db } from "~/db/db";
import { auditorium, theater } from "~/db/schema";

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

      {loaderData.map(theater => {
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

      <Link to={"save-new-seat"}>Add new seat</Link>
    </main>
  );
}
