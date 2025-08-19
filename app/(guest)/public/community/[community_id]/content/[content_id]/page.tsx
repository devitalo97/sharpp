import { ContentDetail } from "./components/detail";
import { Button } from "@/app/lib/frontend/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { findOneByIdContentAction } from "@/app/lib/backend/action/content.action";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ community_id: string; content_id: string }>;
}) {
  const { content_id, community_id } = await params;
  const content = await findOneByIdContentAction(content_id);
  if (!content) {
    notFound();
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/public/community/${community_id}/content`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para conteúdos
            </Link>
          </Button>
        </div>

        {/* Content Detail */}
        <ContentDetail content={content} />
      </div>
    </div>
  );
}
