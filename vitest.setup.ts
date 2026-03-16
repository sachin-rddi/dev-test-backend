import { expect } from "vitest";
import { toHaveReceivedCommandWith } from "aws-sdk-client-mock-vitest";

expect.extend({
  toHaveReceivedCommandWith,
});
