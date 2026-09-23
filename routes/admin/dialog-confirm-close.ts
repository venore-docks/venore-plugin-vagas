// Formulário de vaga é longo (salário, horário, 5 grupos de tags, campos customizados...) —
// clicar fora ou apertar Esc sem querer no meio do preenchimento fechava a dialog e descartava
// tudo, sem aviso (pedido explícito: "criar uma segurança pra não fechar de vez"). Handler único
// pros dois eventos que fecham a dialog por fora do fluxo normal (clique fora / Esc) — o botão de
// fechar (X) e o submit continuam fechando direto, sem confirmação, porque são ações explícitas.
const CONFIRM_CLOSE_MESSAGE = "Fechar sem salvar? As informações preenchidas neste formulário serão perdidas.";

export function confirmBeforeClose(event: { preventDefault: () => void }): void {
  if (!window.confirm(CONFIRM_CLOSE_MESSAGE)) {
    event.preventDefault();
  }
}
