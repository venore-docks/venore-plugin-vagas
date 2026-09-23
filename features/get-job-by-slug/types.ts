import type { OperationResult } from "@venore/plugin-sdk";
import type { CustomApplicationField } from "../../contracts/types";

// Projeção pública — não é o JobRecord cru (evita vazar createdByUserId, categoryId interno
// etc.), e já vem com a capa resolvida e os campos que a página de candidatura precisa renderizar.
export type PublicJobDetailView = {
  id: string;
  title: string;
  slug: string;
  department: string | null;
  location: string | null;
  description: string;
  requirements: string | null;
  applyContact: string | null;
  coverImageUrl: string | null;
  customFormFields: CustomApplicationField[];
  requiresDisc: boolean;
  publishedAt: Date | null;
};

export type GetJobBySlugInput = { slug: string };
export type GetJobBySlugResult = OperationResult<PublicJobDetailView | null>;
