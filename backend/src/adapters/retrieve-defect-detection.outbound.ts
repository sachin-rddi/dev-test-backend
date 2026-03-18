import { config } from "@backend/src/domain/config";
import { logger } from "@shared/logger";
import axios from "axios";

/**
 * Retrieves defect detection results from the defect detection API.
 * @param body - The base64-encoded body from the API Gateway event.
 * @param contentType - The Content-Type header from the original request.
 * @returns The defect detection results.
 */
export const retrieveDefectDetectionResults = async (
  body: string,
  contentType: string,
): Promise<unknown> => {
  const defectDetectionUrl = `${config.devBaseApi}/defect-detection`;
  logger.info("Retrieving defect detection results");

  let response;
  try {
    response = await axios.post(
      defectDetectionUrl,
      Buffer.from(body, "base64"),
      { headers: { "Content-Type": contentType } },
    );
    logger.info("Successfully retrieved defect detection results", {
      responseData: response.data,
    });
  } catch (error) {
    logger.error("Error retrieving defect detection results", { error });
    throw new Error("Error retrieving defect detection results");
  }
  return response.data;
};
