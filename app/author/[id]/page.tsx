import { notFound, redirect } from "next/navigation";
import { currentAuthor } from "@/lib/author-auth";
import { authorGet } from "@/lib/author-data";
import Editor from "@/components/author/Editor";

export const dynamic = "force-dynamic";

export default async function EditArticle({ params }: { params: Promise<{ id: string }> }) {
  if (!(await currentAuthor())) redirect("/author");
  const { id } = await params;
  const row = await authorGet(id);
  if (!row) notFound();
  return <Editor initial={row} />;
}
