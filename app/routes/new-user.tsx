import { Form, Link, redirect } from "react-router";
import { Button } from "~/components/ui/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import type { Route } from "./+types/new-user";
import { auth } from "~/lib/auth.server";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");

  const data = await auth.api.signUpEmail({
    returnHeaders: true,
    body: {
      name: name as string, // required
      email: email as string, // required
      password: password as string, // required
      callbackURL: "/",
    },
  });

  return redirect("/");
}

export default function NewUser() {
  return (
    <main className="max-w-80 mx-auto grid pt-16 pb-4">
      <h1 className="text-5xl font-black text-center mb-7">
        Movie Seat Tracker
      </h1>

      <div className="p-6">
        <Form method="post" className="max-w-sm">
          <FieldGroup>
            <FieldSet>
              <FieldLegend className="text-center mb-7">
                Create a new account
              </FieldLegend>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="name">Name</FieldLabel>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Name"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="email">Email Address</FieldLabel>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Email Address"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Password"
                    required
                  />
                </Field>
                <Button type="submit">Continue</Button>
                <div>
                  <span className="font-semibold text-sm">
                    Already have an account?
                  </span>
                  <Button variant="link" asChild>
                    <Link to="/">Sign in</Link>
                  </Button>
                </div>
              </FieldGroup>
            </FieldSet>
          </FieldGroup>
        </Form>
      </div>
    </main>
  );
}
