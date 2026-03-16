import middy from "@middy/core";
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { checkForDefects } from "./use-cases/check-for-defects";

export const handler = middy<APIGatewayProxyEvent, APIGatewayProxyResult>(async (event: APIGatewayProxyEvent) => {
    const filename = event.queryStringParameters?.filename;
    if (!filename) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Filename is required" }),
      };
    }

    try {
      const defects = await checkForDefects(filename);
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Defects retrieved successfully", defects }),
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Error getting defects:", error }),
      };
    }
  });
