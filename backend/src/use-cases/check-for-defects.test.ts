import { describe, it, vi, expect, Mock } from "vitest";
import { checkForDefects } from "@backend/src/use-cases/check-for-defects";
import { retrieveDefectDetectionResults } from "@backend/src/adapters/retrieve-defect-detection.outbound";
import { validateDefectResults } from "@backend/src/use-cases/validate-defect-results";
import { logger } from "@shared/logger";

vi.mock("@backend/src/adapters/retrieve-defect-detection.outbound", () => ({
  retrieveDefectDetectionResults: vi.fn().mockResolvedValue({
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
  }),
}));

vi.mock("@backend/src/use-cases/validate-defect-results", () => ({
  validateDefectResults: vi.fn().mockReturnValue({
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
  }),
}));

const mockBody = "test-image.png";
const mockContentType = "image/png";

const mockResult = {
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
};

describe("checkForDefects", () => {
  describe("Successfully checks for defects", () => {
    it("should check for defects successfully", async () => {
      const loggerSpy = vi.spyOn(logger, "info");
      const result = await checkForDefects(mockBody, mockContentType);

      expect(result).toEqual(mockResult.data);

      expect(loggerSpy).toHaveBeenCalledWith(
        "Successfully retrieved and validated defects",
        { validatedResponse: mockResult },
      );
    });
  });

  describe("Error checking for defects", () => {
    it("should throw an error when there is an issue retrieving defects", async () => {
      const loggerSpy = vi.spyOn(logger, "error");
      (retrieveDefectDetectionResults as Mock).mockRejectedValueOnce(
        new Error("Retrieval failed"),
      );

      await expect(checkForDefects(mockBody, mockContentType)).rejects.toThrow(
        "Error retrieving and validating defects",
      );
      expect(loggerSpy).toHaveBeenCalledWith(
        "Error retrieving and validating defects",
        { error: new Error("Retrieval failed") },
      );
    });

    it("should throw an error when there is an issue validating defects", async () => {
      const loggerSpy = vi.spyOn(logger, "error");
      (validateDefectResults as Mock).mockImplementationOnce(() => {
        throw new Error("Validation failed");
      });

      await expect(checkForDefects(mockBody, mockContentType)).rejects.toThrow(
        "Error retrieving and validating defects",
      );

      expect(loggerSpy).toHaveBeenCalledWith(
        "Error retrieving and validating defects",
        { error: new Error("Validation failed") },
      );
    });
  });
});
