import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { checkForDefects } from "./use-cases/check-for-defects";
import { logger } from "shared/logger";

/**
 * Lambda function handler for checking defects in an image.
 * @param event - The API Gateway event containing the request data.
 * @returns The API Gateway response with the defect detection results.
 */
export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const body = event.body;
  const contentType =
    event.headers["Content-Type"] ?? event.headers["content-type"];
  if (!body || !contentType) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "400: Body & Content-Type header are required",
      }),
    };
  }

  const decodedBody = event.isBase64Encoded
    ? body
    : Buffer.from(body).toString("base64");

  try {
    logger.info("Checking for defects", { APIGatewayEvent: event, EventBody: body, ContentType: contentType });
    const defects = await checkForDefects(decodedBody, contentType);
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "200: Defects retrieved successfully",
        defects,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "500: Error getting defects", error }),
    };
  }
};
