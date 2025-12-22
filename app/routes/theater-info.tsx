import type { Route } from "./+types/theater-info";
import { Link, redirect } from "react-router";

import { and, eq } from "drizzle-orm";
import { ArrowLeftIcon } from "lucide-react";

import { Button } from "~/components/ui/button";
import { db } from "~/db/db.server";
import { seat, theater } from "~/db/schema";
import { auth } from "~/lib/auth.server";

export async function loader({ params, request }: Route.LoaderArgs) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session) return redirect("/");

  const theaterId = Number(params.theaterId);

  if (Number.isNaN(theaterId)) {
    throw new Response("Not Found", { status: 404 });
  }

  const query = await db
    .select()
    .from(theater)
    .innerJoin(seat, eq(theater.id, seat.theaterId))
    .where(and(eq(theater.id, theaterId), eq(seat.userId, session.user.id)));

  if (query.length === 0) {
    throw new Response("Not Found", { status: 404 });
  }

  const savedSeats = query.map((record) => {
    return {
      seatId: record.seat.id,
      theaterName: record.theater.theaterName,
      auditoriumNumber: record.seat.auditoriumNumber,
      screenType: record.seat.screenType,
      seatRow: record.seat.row,
      seatNumber: record.seat.seatNumber,
      seatDescription: record.seat.description,
    };
  });

  return { savedSeats };
}

export default function TheaterInfo({ loaderData }: Route.ComponentProps) {
  const { savedSeats } = loaderData;

  return (
    <div className="max-w-80 mx-auto pt-16 pb-4">
      <div className="flex items-center gap-6 mb-6 max-w-72">
        <Button
          asChild
          size="icon"
          type="button"
          className="rounded-full hover:cursor-pointer"
        >
          <Link to="/dashboard">
            <ArrowLeftIcon />
          </Link>
        </Button>
        <p className="text-2xl font-bold text-pretty">
          My saved seats at <br /> {savedSeats[0].theaterName}
        </p>
      </div>

      <div className="grid gap-6">
        {savedSeats.map((seatInfo) => {
          return (
            <div key={seatInfo.seatId} className="bg-slate-100 rounded-xl">
              <div className="flex p-6 flex-wrap gap-x-12 gap-y-8">
                <div>
                  <p className="font-semibold text-xl">AUDITORIUM</p>
                  <p className="text-lg">{seatInfo.auditoriumNumber}</p>
                </div>
                <div>
                  <p className="font-semibold text-xl">SEAT</p>
                  <p className="text-lg">
                    {seatInfo.seatRow}
                    {seatInfo.seatNumber}
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-xl">Screen Type</p>
                  <p className="text-lg">{seatInfo.screenType}</p>
                </div>
              </div>
              <p className="px-6 pb-6 text-pretty">
                {seatInfo.seatDescription}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
