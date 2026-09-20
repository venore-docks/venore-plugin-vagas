import type { BreadcrumbSegmentDefinition } from "@venore/plugin-sdk";
import { staticBreadcrumbSegment } from "@venore/plugin-sdk";

export const vagasBreadcrumbSegments: BreadcrumbSegmentDefinition[] = [
  staticBreadcrumbSegment({ key: "vagas.public", segments: ["vagas"], label: "Vagas de emprego" }),
  staticBreadcrumbSegment({ key: "vagas.admin", segments: ["admin", "vagas"], label: "Vagas de emprego" }),
];
