import * as z from "zod";

const defectType = z.enum(["EROSION", "CRACK", "UNKNOWN"]);

export const defects = z.object({
  x: z.number(),
  y: z.number(),
  width: z.number(),
  height: z.number(),
  type: defectType,
});

export const defectDetectionResult = z.object({
  status: z.string(),
  data: z.array(defects),
});

export type defectDetectionResult = z.infer<typeof defectDetectionResult>;
export type defects = z.infer<typeof defects>;
