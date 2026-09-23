"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Dialog,
  DialogContent,
} from "@venore/plugin-sdk/ui";

// Dialog que pede confirmação — via AlertDialog do shadcn, não window.confirm() — antes de
// fechar por clique fora ou Esc. Formulário de vaga é longo (salário, horário, 5 grupos de tags,
// campos customizados...), perder tudo por um clique sem querer não tem aviso nenhum por padrão.
// O botão de fechar (X) e o submit continuam fechando direto, sem confirmação — são ações
// explícitas do usuário, diferente de clique fora/Esc.
export function ConfirmCloseDialog({
  open,
  onOpenChange,
  trigger,
  contentClassName,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: ReactNode;
  contentClassName?: string;
  children: ReactNode;
}) {
  const [confirmingClose, setConfirmingClose] = useState(false);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        {trigger}
        <DialogContent
          className={contentClassName}
          onPointerDownOutside={(event) => {
            event.preventDefault();
            setConfirmingClose(true);
          }}
          onEscapeKeyDown={(event) => {
            event.preventDefault();
            setConfirmingClose(true);
          }}
        >
          {children}
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmingClose} onOpenChange={setConfirmingClose}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Fechar sem salvar?</AlertDialogTitle>
            <AlertDialogDescription>As informações preenchidas neste formulário serão perdidas.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continuar editando</AlertDialogCancel>
            <AlertDialogAction onClick={() => onOpenChange(false)}>Fechar sem salvar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
