import { redirect } from "next/navigation";
import { currentAuthor } from "@/lib/author-auth";
import { EMPTY_ARTICLE } from "@/lib/author-types";
import Editor from "@/components/author/Editor";

export const dynamic = "force-dynamic";

export default async function NewArticle() {
  if (!(await currentAuthor())) redirect("/author");
  return <Editor initial={EMPTY_ARTICLE} />;
}
