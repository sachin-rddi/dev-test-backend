import { retrieveDefectDetectionResults } from "@backend/src/adapters/retrieve-defect-detection.outbound";
import { defects } from "@backend/src/domain/models";
import { validateDefectResults } from "@backend/src/use-cases/validate-defect-results";
import { logger } from "@shared/logger";

/**
 * Checks for defects in the given image file.
 * It does this by retrieving defect detection results (via an API) and validating them.
 * @param body The body of the request containing the image file to check for defects.
 * @param contentType The Content-Type header from the original request.
 * @returns An array of defect information found in the image.
 */
export const checkForDefects = async (body: string, contentType: string): Promise<defects[]> => {
  try {
    const response = await retrieveDefectDetectionResults(body, contentType);
    const validatedResponse = validateDefectResults(response);
    logger.info("Successfully retrieved and validated defects", {
      validatedResponse,
    });
    return validatedResponse.data;
  } catch (error) {
    logger.error("Error retrieving and validating defects", { error });
    throw new Error("Error retrieving and validating defects");
  }
};
