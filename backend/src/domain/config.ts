const getRequiredEnv = (variable: string): string => {
  const value = process.env[variable];

  if (!value) {
    throw new Error(`Missing required environment variable: ${variable}`);
  }

  return value;
};

export const config = {
  devBaseApi: getRequiredEnv("DEFECT_DETECTION_API_URL"),
};
