import { db } from "~/db/db";
import { theater, auditorium, seat } from "~/db/schema";
import { eq, and, isNotNull } from "drizzle-orm";
import type { Route } from "./+types/theater-info";

export async function loader({ params }: Route.LoaderArgs) {
  const theaterId = Number(params.theaterId);

  let query = await db
    .select()
    .from(theater)
    .leftJoin(auditorium, eq(theater.id, auditorium.theaterId))
    .leftJoin(seat, eq(auditorium.id, seat.auditoriumId))
    .where(and(eq(theater.id, theaterId), isNotNull(seat.id)));

  const savedSeats = query.map(record => {
    return {
      seatId: record.seat?.id,
      theaterName: record.theater.theaterName,
      auditoriumNumber: record.auditorium?.number,
      seatRow: record.seat?.row,
      seatNumber: record.seat?.seatNumber,
      seatDescription: record.seat?.description,
    };
  });

  if (!query) {
    throw new Response("Not Found", { status: 404 });
  }

  // console.log(savedSeats);

  return { savedSeats };
}

export default function TheaterInfo({ loaderData }: Route.ComponentProps) {
  const { savedSeats } = loaderData;

  return (
    <div className="max-w-80 mx-auto pt-16 pb-4">
      <p className="mb-5 text-2xl font-bold text-pretty">
        My saved seats at <br /> {savedSeats[0].theaterName}
      </p>

      <div className="grid gap-6">
        {savedSeats.map(seatInfo => {
          return (
            <div key={seatInfo.seatId} className="bg-slate-100 rounded-xl">
              <div className="flex justify-between p-6">
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
