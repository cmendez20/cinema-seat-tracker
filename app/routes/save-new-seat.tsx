import { Form, redirect, useNavigate } from "react-router";
import type { Route } from "./+types/save-new-seat";
import { theater, auditorium, seat, type InsertSeat } from "~/db/schema";
import { db } from "~/db/db.server";
import { eq, and } from "drizzle-orm";
import { Button } from "~/components/ui/button";
import { z } from "zod";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "~/components/ui/field";
import { Textarea } from "~/components/ui/textarea";
import { Input } from "~/components/ui/input";

const saveSeatSchema = z.object({
  "theater-name": z.string().trim().min(3, "Theater name too short"),
  "auditorium-number": z.coerce.number().min(1).max(30),
  "seat-row": z.string().trim().length(1),
  "seat-number": z.coerce.number().min(1).max(35),
  "seat-description": z.string().trim().max(300, "Description too long"),
});

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const zodResult = saveSeatSchema.safeParse(Object.fromEntries(formData));

  let theaterExists = await db
    .select({ theaterId: theater.id })
    .from(theater)
    .where(eq(theater.theaterName, `${zodResult.data?.["theater-name"]}`));

  if (!(theaterExists.length > 0)) {
    theaterExists = await db
      .insert(theater)
      .values({ theaterName: `${zodResult.data?.["theater-name"]}` })
      .returning({ theaterId: theater.id });
  }

  let auditoriumExists = await db
    .select({ auditoriumId: auditorium.id })
    .from(auditorium)
    .where(
      and(
        eq(auditorium.theaterId, theaterExists[0].theaterId),
        eq(
          auditorium.number,
          Number(`${zodResult.data?.["auditorium-number"]}`)
        )
      )
    );

  if (!(auditoriumExists.length > 0)) {
    auditoriumExists = await db
      .insert(auditorium)
      .values({
        theaterId: theaterExists[0].theaterId,
        number: Number(`${zodResult.data?.["auditorium-number"]}`),
        type: "digital",
      })
      .returning({ auditoriumId: auditorium.id });
  }

  const newSeat = {
    auditoriumId: auditoriumExists[0].auditoriumId,
    row: `${zodResult.data?.["seat-row"]}`,
    seatNumber: Number(`${zodResult.data?.["seat-number"]}`),
    description: `${zodResult.data?.["seat-description"]}`,
  };

  await db.insert(seat).values(newSeat);

  return redirect(`/theaters/${theaterExists[0].theaterId}/my-seats`);
}

export default function NewSeat() {
  const navigate = useNavigate();

  return (
    <div className="max-w-80 mx-auto grid gap-6 pt-16 pb-4">
      {/* seat row, seat number, seat description */}
      <Form method="POST" id="save-seat-form">
        <FieldGroup>
          <FieldSet>
            <FieldLegend>Save a new seat</FieldLegend>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="theaterName">Theater</FieldLabel>
                <Input
                  id="theaterName"
                  aria-label="Theater Name"
                  name="theater-name"
                  placeholder="Theater Name"
                  type="text"
                  minLength={5}
                  onBlur={e => {
                    const isValid = e.target.value.trim().length > 3;
                    e.target.setCustomValidity(
                      isValid
                        ? ""
                        : "Theater name must be at least 3 non-whitespace characters"
                    );
                  }}
                  required
                />
                <FieldLabel htmlFor="auditoriumNumber">
                  Auditorium Number
                </FieldLabel>
                <Input
                  id="auditoriumNumber"
                  aria-label="Auditorium Number"
                  placeholder="1"
                  name="auditorium-number"
                  type="number"
                  min={1}
                  max={30}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="seatRow">Seat Row</FieldLabel>
                <Input
                  id="seatRow"
                  placeholder="A"
                  name="seat-row"
                  required
                  type="text"
                  pattern="[A-Za-z]"
                  maxLength={1}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="seatNumber">Seat Number</FieldLabel>
                <Input
                  id="seatNumber"
                  name="seat-number"
                  placeholder="67"
                  required
                  type="number"
                  min={1}
                  max={35}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="seatDescription">Comments</FieldLabel>
                <Textarea
                  id="seatDescription"
                  name="seat-description"
                  placeholder="Great view, clean seat :)"
                  maxLength={300}
                  required
                />
              </Field>
            </FieldGroup>
          </FieldSet>
          <Field orientation="horizontal">
            <Button type="submit">Save seat</Button>
            <Button
              variant="outline"
              type="button"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
          </Field>
        </FieldGroup>
      </Form>
    </div>
  );
}
