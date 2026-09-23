import { getMediaAsset } from "@venore/plugin-sdk/media";
import type { PickableMedia } from "@venore/plugin-sdk/ui";

// Resolve um mediaAssetId solto (job.coverMediaAssetId, category.coverMediaAssetId) pro shape que
// MediaPickerField espera como seleção atual — sem isso, abrir o form de edição sem tocar no
// picker reenviaria coverMediaAssetId="" e apagaria a capa já cadastrada (ver initialMedia em
// venore-docks/src/components/media-picker-field.tsx).
export async function resolveMediaPickerValue(mediaAssetId: string | null): Promise<PickableMedia | null> {
  if (!mediaAssetId) return null;
  const result = await getMediaAsset({ id: mediaAssetId });
  if (!result.success || !result.data) return null;
  return { id: result.data.id, filename: result.data.filename, url: result.data.url, contentType: result.data.contentType };
}
