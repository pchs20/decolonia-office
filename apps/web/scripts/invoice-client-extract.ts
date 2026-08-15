import fs from "node:fs";
import path from "node:path";
// Node runs this source file directly with type stripping, so it requires the .ts specifier.
import {
  clientRows,
  extractDirectory,
  reviewRows,
  toCsv,
  CLIENT_CSV_COLUMNS,
  REVIEW_CSV_COLUMNS
// @ts-ignore The package compiler resolves the source module without the runtime extension.
} from "./invoice-client-extractor.ts";

function printUsage(): void {
  console.error("Usage: pnpm invoice:extract -- <input-directory> <output-directory>");
}

function main(): void {
  const argumentsList = process.argv.slice(2).filter((argument) => argument !== "--");
  const [inputDirectory, outputDirectory] = argumentsList;
  if (!inputDirectory || !outputDirectory) {
    printUsage();
    process.exitCode = 1;
    return;
  }

  if (!fs.existsSync(inputDirectory) || !fs.statSync(inputDirectory).isDirectory()) {
    throw new Error(`Input directory does not exist: ${inputDirectory}`);
  }

  const result = extractDirectory(inputDirectory);
  fs.mkdirSync(outputDirectory, { recursive: true });
  fs.writeFileSync(
    path.join(outputDirectory, "clients.csv"),
    toCsv(CLIENT_CSV_COLUMNS, clientRows(result.importReady)),
    "utf8"
  );
  fs.writeFileSync(
    path.join(outputDirectory, "clients-review.csv"),
    toCsv(REVIEW_CSV_COLUMNS, reviewRows(result.review)),
    "utf8"
  );

  console.log(`Processed ${result.candidates.length} unique client candidates.`);
  console.log(`Import-ready: ${result.importReady.length}. Review required: ${result.review.length}.`);
}

main();