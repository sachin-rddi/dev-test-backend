import { describe, it, expect, vi, Mock } from "vitest";
import { validateDefectResults } from "@backend/src/use-cases/validate-defect-results";
import { defectDetectionResult } from "@backend/src/domain/models";
import { logger } from "@shared/logger";

vi.mock("zod", () => ({
  default: { treeifyError: vi.fn().mockReturnValue({}) },
}));

vi.mock("../domain/models", () => ({
  defectDetectionResult: {
    safeParse: vi.fn().mockReturnValue({
      success: true,
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

const mockResponseData = {
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

describe("validateDefectResults", () => {
  it("should validate defect detection results successfully", async () => {
    const result = await validateDefectResults(mockResponseData);

    expect(result).toEqual(mockResponseData);
  });

  it("should throw an error when validation fails", async () => {
    const loggerSpy = vi.spyOn(logger, "error");
    (defectDetectionResult.safeParse as Mock).mockReturnValueOnce({
      success: false,
      error: new Error("Validation failed"),
    });

    expect(() => validateDefectResults(mockResponseData)).toThrow(
      "Failed to validate defect detection API response",
    );

    expect(loggerSpy).toHaveBeenCalledWith("Failed to validate defect detection API response", { });
  });
});
