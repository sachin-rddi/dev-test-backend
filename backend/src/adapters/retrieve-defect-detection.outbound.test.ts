import { describe, it, expect, vi, Mock } from "vitest";
import { retrieveDefectDetectionResults } from "./retrieve-defect-detection.outbound";
import axios from "axios";
import { logger } from "shared/logger";

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

const mockFileName = "test-image.jpg";

const mockData = {
  x: 0,
  y: 0,
  width: 100,
  height: 100,
  type: "EROSION",
};

describe("retrieveDefectDetectionResults", () => {
  it("should retrieve defect detection results successfully", async () => {
    const loggerSpy = vi.spyOn(logger, "info");

    const result = await retrieveDefectDetectionResults(mockFileName);

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

    await expect(retrieveDefectDetectionResults(mockFileName)).rejects.toThrow(
      "Error retrieving defect detection results",
    );

    expect(loggerSpy).toHaveBeenCalledWith(
      "Error retrieving defect detection results",
      { error: new Error("POST failed") },
    );
  });
});
