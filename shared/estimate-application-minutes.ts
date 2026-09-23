// Estimativa grosseira pro aviso de "quanto tempo isso leva" antes do candidato começar — não
// precisa ser exata, só dar uma ideia honesta. Baseline cobre nome/e-mail/telefone + anexar o
// currículo; cada 3 campos extras soma +1min; Test DISC (20 perguntas, 2 respostas por pergunta)
// soma um bloco fixo à parte.
const BASE_MINUTES = 3;
const DISC_MINUTES = 8;

export function estimateApplicationMinutes(customFieldCount: number, requiresDisc: boolean): number {
  const formMinutes = BASE_MINUTES + Math.ceil(customFieldCount / 3);
  return requiresDisc ? formMinutes + DISC_MINUTES : formMinutes;
}
