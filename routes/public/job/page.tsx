import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@venore/plugin-sdk/ui";
import { isPluginActive } from "@venore/plugin-sdk";
import { getJobBySlug } from "../../../index";
import { ApplyForm } from "./apply-form";

export const dynamic = "force-dynamic";

export default async function VagasPublicJobPage({ params }: { params: Promise<{ slug: string }> }) {
  if (!(await isPluginActive("vagas"))) {
    notFound();
  }

  const { slug } = await params;
  const result = await getJobBySlug({ slug });
  if (!result.success || !result.data) {
    notFound();
  }

  const job = result.data;

  return (
    <div className="mx-auto max-w-2xl space-y-6 py-10">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/vagas">
          <ArrowLeft className="size-4" />
          Voltar para vagas
        </Link>
      </Button>

      {job.coverImageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={job.coverImageUrl} alt="" className="aspect-[2/1] w-full rounded-panel object-cover" />
      )}

      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">{job.title}</h1>
        {(job.department || job.location) && (
          <p className="text-sm text-muted-foreground">{[job.department, job.location].filter(Boolean).join(" · ")}</p>
        )}
      </div>

      <section className="space-y-2">
        <h2 className="text-sm font-semibold uppercase tracking-caps text-muted-foreground">Descrição</h2>
        <p className="whitespace-pre-line text-sm text-foreground">{job.description}</p>
      </section>

      {job.requirements && (
        <section className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-caps text-muted-foreground">Requisitos</h2>
          <p className="whitespace-pre-line text-sm text-foreground">{job.requirements}</p>
        </section>
      )}

      <ApplyForm jobId={job.id} customFormFields={job.customFormFields} />

      {job.applyContact && (
        <p className="text-center text-xs text-muted-foreground">
          Dúvidas sobre esta vaga? Entre em contato: <span className="font-medium">{job.applyContact}</span>
        </p>
      )}
    </div>
  );
}
