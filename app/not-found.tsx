import { PageHero, Button } from "@/components/ui";

export default function NotFound() {
  return (
    <>
      <PageHero eyebrow="Not found" title="This page could not be found.">The address may have changed.</PageHero>
      <div className="px-5 sm:px-8 pb-20 mx-auto max-w-4xl"><Button href="/">Back to the homepage</Button></div>
    </>
  );
}
