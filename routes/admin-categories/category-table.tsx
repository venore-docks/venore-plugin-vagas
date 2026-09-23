import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@venore/plugin-sdk/ui";
import type { PickableMedia } from "@venore/plugin-sdk/ui";
import type { JobCategoryRecord } from "../../contracts/types";
import { DeleteCategoryButton } from "./delete-category-button";
import { EditCategoryDialog } from "./edit-category-dialog";

export function CategoryTable({
  categories,
  coverMediaByCategoryId,
}: {
  categories: JobCategoryRecord[];
  coverMediaByCategoryId: Map<string, PickableMedia | null>;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Capa</TableHead>
          <TableHead>Nome</TableHead>
          <TableHead className="w-24 text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {categories.map((category) => {
          const cover = coverMediaByCategoryId.get(category.id) ?? null;
          return (
            <TableRow key={category.id}>
              <TableCell>
                {cover ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={cover.url} alt="" className="size-9 rounded-lg object-cover" />
                ) : (
                  <span className="block size-9 rounded-lg bg-muted" />
                )}
              </TableCell>
              <TableCell className="font-medium text-foreground">{category.name}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <EditCategoryDialog category={category} coverMedia={cover} />
                  <DeleteCategoryButton categoryId={category.id} name={category.name} />
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
