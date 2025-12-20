import type { Route } from "./+types/home";
import { Form, Link, redirect } from "react-router";
import { Button } from "~/components/ui/button";
import { db } from "~/db/db.server";
import { theater } from "~/db/schema";
import { PlusIcon } from "lucide-react";
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
  const step = formData.get("step");
  const otp = formData.get("otp");

  if (step === "email") {
    await auth.api.sendVerificationOTP({
      body: {
        email: email as string,
        type: "sign-in",
      },
    });

    return { step: "otp-step" };
  }

  const result = await auth.api.signInEmailOTP({
    returnHeaders: true,
    body: {
      email: email as string,
      otp: otp as string,
    },
  });

  console.log(result);

  return redirect("/dashboard", { headers: result.headers });
}

export async function loader() {
  const data = await db.select().from(theater);
  return data;
}

export default function Home({ loaderData, actionData }: Route.ComponentProps) {
  const step = actionData?.step || "email";

  return (
    <main className="max-w-80 mx-auto grid gap-6 pt-16 pb-4">
      <div>
        <h1 className="text-5xl font-black">Movie Seat Tracker</h1>
      </div>
      <div className="p-6 flex-1 flex flex-col justify-center items-center h-screen">
        <h1 className="text-xl font-semibold mb-6">Login Form</h1>
        <Form method="post" className="w-full max-w-sm">
          <input type="hidden" value={step} name="step" />
          <Input name="email" placeholder="Enter your Email" />
          {step === "otp-step" && (
            <Input name="otp" placeholder="Enter your OTP" />
          )}
          <Button type="submit" className="w-full mt-4">
            Submit
          </Button>
        </Form>
      </div>
      <h2 className="font-bold text-3xl">Your theaters:</h2>
      {!(loaderData.length > 0) && <p>No theaters saved yet</p>}
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
