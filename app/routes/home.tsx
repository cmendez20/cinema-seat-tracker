import type { Route } from "./+types/home";
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
import { auth } from "~/lib/auth.server";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Movie Seat Tracker" },
    { name: "description", content: "Track your seats!" },
  ];
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  console.log(password);

  const response = await auth.api.signInEmail({
    body: {
      email: email as string, // required
      password: password as string, // required
      rememberMe: true,
      callbackURL: "/dashboard",
    },
    asResponse: true,
  });

  if (!response.ok) {
    return response;
  }

  return redirect("/dashboard", {
    headers: response.headers,
  });
}

export async function loader({ request }: Route.LoaderArgs) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (session) return redirect("/dashboard");

  return {};
}

export default function Home({ actionData }: Route.ComponentProps) {
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
                Sign in to view your saved seats
              </FieldLegend>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    required
                  />
                </Field>
                <Button type="submit">Continue</Button>
                <Button variant="link" asChild>
                  <Link to="new-user">Create an account</Link>
                </Button>
              </FieldGroup>
            </FieldSet>
          </FieldGroup>
        </Form>
      </div>
    </main>
  );
}
