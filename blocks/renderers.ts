import type { BlockRendererComponent } from "@venore/plugin-sdk";
import { VagasOpenPositionsBlock } from "./vagas-open-positions-block";

export const blockRenderers: Record<string, BlockRendererComponent> = {
  "vagas.open-positions": VagasOpenPositionsBlock,
};
