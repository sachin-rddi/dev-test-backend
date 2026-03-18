import { describe, it, expect, vi, Mock } from "vitest";
import { retrieveDefectDetectionResults } from "@backend/src/adapters/retrieve-defect-detection.outbound";
import axios from "axios";
import { logger } from "@shared/logger";

vi.mock("axios", () => ({
  default: {
    post: vi.fn().mockResolvedValue({
      data: {
        status: "OK",
        data: [
          {
            x: 0,
            y: 0,
            width: 100,
            height: 100,
            type: "EROSION",
          },
        ],
      },
    }),
  },
}));

vi.mock("../domain/config", () => ({
  config: {
    devBaseApi: "http://localhost:3000",
  },
}));

const mockData = {
  x: 0,
  y: 0,
  width: 100,
  height: 100,
  type: "EROSION",
};

const mockBody = "test-image.png";
const mockContentType = "image/png";

describe("retrieveDefectDetectionResults", () => {
  it("should retrieve defect detection results successfully", async () => {
    const loggerSpy = vi.spyOn(logger, "info");

    const result = await retrieveDefectDetectionResults(
      mockBody,
      mockContentType,
    );

    expect(loggerSpy).toHaveBeenCalledWith(
      "Successfully retrieved defect detection results",
      {
        responseData: {
          status: "OK",
          data: [mockData],
        },
      },
    );

    expect(result).toEqual({
      status: "OK",
      data: [mockData],
    });
  });

  it("should throw an error when there is an issue retrieving defect detection results", async () => {
    const loggerSpy = vi.spyOn(logger, "error");
    (axios.post as Mock).mockRejectedValueOnce(new Error("POST failed"));

    await expect(
      retrieveDefectDetectionResults(mockBody, mockContentType),
    ).rejects.toThrow("Error retrieving defect detection results");

    expect(loggerSpy).toHaveBeenCalledWith(
      "Error retrieving defect detection results",
      { error: new Error("POST failed") },
    );
  });
});
