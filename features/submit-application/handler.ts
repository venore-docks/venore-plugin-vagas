import { submitApplication } from "./service";
import { validateSubmitApplicationInput } from "./validation";
import type { SubmitApplicationInput, SubmitApplicationResult } from "./types";

// Sem authorizeActor de propósito — candidatura pública, sem login (mesmo racional de
// get-job-by-slug/get-disc-instance-by-slug).
export async function submitApplicationHandler(input: SubmitApplicationInput): Promise<SubmitApplicationResult> {
  const validationError = validateSubmitApplicationInput(input);
  if (validationError) {
    return { success: false, error: validationError };
  }

  return submitApplication(input);
}
