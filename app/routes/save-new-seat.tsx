import { Form, useNavigate } from "react-router";
import type { Route } from "./+types/save-new-seat";
import { seat, type InsertSeat } from "~/db/schema";
import { db } from "~/db/db";
import { Button } from "~/components/ui/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "~/components/ui/field";
import { Textarea } from "~/components/ui/textarea";
import { Input } from "~/components/ui/input";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const newSeat = Object.fromEntries(formData);
  // const insertSeat = db.insert(seat).values(newSeat)
  console.log(newSeat);
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
                  onBlur={(e) => {
                    const isValid = e.target.value.trim().length > 3;
                    e.target.setCustomValidity(
                      isValid
                        ? ""
                        : "Theater name must be at least 3 non-whitespace characters",
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
                  pattern="[/a-z/i]"
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
