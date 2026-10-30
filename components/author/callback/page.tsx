import CallbackClient from "@/components/author/CallbackClient";

export const dynamic = "force-dynamic";

export default function Callback() {
  return (
    <div className="mx-auto max-w-md px-5 py-14">
      <h1 className="mb-4 font-serif text-4xl font-light text-navy-deep">Signing in</h1>
      <CallbackClient />
    </div>
  );
}
