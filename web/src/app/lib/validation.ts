import { z } from "zod";

export const interactionRequestSchema = z
  .object({
    medA: z.string().min(1, "First medication is required").trim(),
    medB: z.string().min(1, "Second medication is required").trim(),
  })
  .refine(
    (data) => {
      const medicineA = data.medA.toLowerCase();
      const medicineB = data.medB.toLowerCase();
      return medicineA !== medicineB;
    },
    {
      message: "medications must be different",
      path: ["medB"],
    }
  );

export type InteractionRequest = z.infer<typeof interactionRequestSchema>;
