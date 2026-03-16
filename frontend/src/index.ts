import { fileURLToPath } from "url";
import { join, dirname } from "path";
import { checkForDefects } from "backend/src/use-cases/check-for-defects";

const __dirname = dirname(fileURLToPath(import.meta.url));
const result = await checkForDefects(join(__dirname, "./tmp/test-image.png"));

console.log("Defect detection results:", { result });

//Build local frontend for user to upload the image to (basic one with html?)
//Saves image in tmp folder <- might be in the backend?
//calls backend function to post the image to the defect detection API and retrieve results
//Displays results on the local frontend
