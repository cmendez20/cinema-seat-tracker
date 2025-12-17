import { Form } from "react-router";
import { Button } from "~/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";

export default function NewSeat() {
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
                  name="theaterName"
                  placeholder="Theater Name"
                  type="text"
                  required
                />
                <FieldLabel htmlFor="auditoriumNumber">
                  Auditorium Number
                </FieldLabel>
                <Input
                  id="auditoriumNumber"
                  aria-label="Auditorium Number"
                  placeholder="1"
                  name="auditoriumNumber"
                  type="text"
                  required
                />
              </Field>
            </FieldGroup>
          </FieldSet>
          <Field orientation="horizontal">
            <Button type="submit">Submit</Button>
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </Field>
        </FieldGroup>
      </Form>
    </div>
  );
}
