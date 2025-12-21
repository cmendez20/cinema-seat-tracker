import type { Route } from "./+types/home";
import { Form, redirect } from "react-router";

import { Button } from "~/components/ui/button";
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

export async function loader({ request }: Route.LoaderArgs) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (session) return redirect("/dashboard");

  return {};
}

export default function Home({ actionData }: Route.ComponentProps) {
  const step = actionData?.step || "email";

  return (
    <main className="max-w-80 mx-auto grid gap-6 pt-16 pb-4">
      <h1 className="text-5xl font-black text-center">Movie Seat Tracker</h1>

      <div className="p-6 flex flex-col gap-3 justify-center items-center">
        <h2 className="text-xl font-semibold">Login</h2>
        <Form method="post" className="w-full max-w-sm grid gap-3">
          <input type="hidden" value={step} name="step" />
          <Input name="email" placeholder="Enter your Email" required />
          {step === "otp-step" && (
            <Input name="otp" placeholder="Enter your OTP" required />
          )}
          <Button type="submit">Submit</Button>
        </Form>
      </div>
    </main>
  );
}
