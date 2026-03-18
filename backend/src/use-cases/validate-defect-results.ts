import { defectDetectionResult } from "@backend/src/domain/models";
import zod from "zod";
import { logger } from "@shared/logger";

/**
 * Validates the defect detection results against the expected schema.
 * @param responseData - The response data to validate.
 * @returns The validated defect detection results.
 */
export const validateDefectResults = (
  responseData: unknown,
): defectDetectionResult => {
  const parsedResult = defectDetectionResult.safeParse(responseData);
  if (!parsedResult.success) {
    logger.error(
      "Failed to validate defect detection API response",
      zod.treeifyError(parsedResult.error),
    );
    throw new Error("Failed to validate defect detection API response");
  }
  return parsedResult.data;
};
