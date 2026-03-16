import { retrieveDefectDetectionResults } from "../adapters/retrieve-defect-detection.outbound";
import { defects } from "../domain/models";
import { validateDefectResults } from "./validate-defect-results";
import { logger } from "../../../shared/logger";

/**
 * Checks for defects in the given image file.
 * It does this by retrieving defect detection results (via an API) and validating them.
 * @param filename The filename of the image file to check for defects.
 * @returns An array of defect information found in the image.
 */
export const checkForDefects = async (filename: string): Promise<defects[]> => {
  try {
    const response = await retrieveDefectDetectionResults(filename);
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
