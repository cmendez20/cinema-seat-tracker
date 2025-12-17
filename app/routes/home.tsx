import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import { db } from "~/db/db";
import { auditorium } from "~/db/schema";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader() {
  console.log(await db.select().from(auditorium).execute());
}

export default function Home() {
  return <Welcome />;
}
