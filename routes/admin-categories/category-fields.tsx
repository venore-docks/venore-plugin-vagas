import { Input } from "@venore/plugin-sdk/ui";
import { MediaPickerField, type PickableMedia } from "@venore/plugin-sdk/ui";

export function CategoryFields({
  defaultName = "",
  defaultCoverMedia = null,
}: {
  defaultName?: string;
  defaultCoverMedia?: PickableMedia | null;
}) {
  return (
    <>
      <label className="flex flex-col gap-1 text-sm text-muted-foreground">
        Nome da categoria
        <Input name="name" defaultValue={defaultName} placeholder="ex.: Pedagógico" required />
      </label>
      <MediaPickerField name="coverMediaAssetId" label="Imagem de capa padrão" initialMedia={defaultCoverMedia} />
    </>
  );
}
