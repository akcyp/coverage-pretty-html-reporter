import fs from "node:fs";
import path from "node:path";

const coverageDirectory = path.join(__dirname, "../packages/example/coverage");
const outputDirectory = path.join(__dirname, "../dist");
fs.cpSync(coverageDirectory, outputDirectory, { recursive: true });

const indexHTMLPath = path.join(outputDirectory, "index.html");
const indexHTML = fs.readFileSync(indexHTMLPath, "utf-8");

fs.writeFileSync(
  indexHTMLPath,
  indexHTML.replace(
    "<head>",
    `
  <head>
    <base href="/coverage-pretty-html-reporter/" />  
`,
  ),
  "utf-8",
);
