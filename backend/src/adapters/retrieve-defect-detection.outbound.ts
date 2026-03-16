import { config } from "../domain/config";
import { logger } from "../../../shared/logger";
import axios from "axios";
import FormData from "form-data";
import fs from "fs";

/**
 * Retrieves defect detection results from the defect detection API.
 * @param filepath - The path to the image file to post to the defect detection API.
 * @returns The defect detection results.
 */
export const retrieveDefectDetectionResults = async (
  filepath: string,
): Promise<unknown> => {
  const defectDetectionUrl = `${config.devBaseApi}/defect-detection`;
  logger.info("Retrieving defect detection results", {
    filepath,
    defectDetectionUrl,
  });

  let response;
  try {
    response = await axios.post(defectDetectionUrl, buildRequestBody(filepath));
    logger.info("Successfully retrieved defect detection results", {
      responseData: response.data,
    });
  } catch (error) {
    logger.error("Error retrieving defect detection results", { error });
    throw new Error("Error retrieving defect detection results");
  }
  return response.data;
};

/**
 * Builds the request body for the defect detection API.
 * @param filepath - The path to the image file to include in the request body.
 * @returns The request body as a FormData object.
 */
const buildRequestBody = (filepath: string) => {
  var bodyFormData = new FormData();
  bodyFormData.append("image", fs.createReadStream(filepath));
  return bodyFormData;
};
