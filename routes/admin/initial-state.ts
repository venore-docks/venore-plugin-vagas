export type VagasActionState = { error: string | null };

export function vagasInitialActionState(): VagasActionState {
  return { error: null };
}
