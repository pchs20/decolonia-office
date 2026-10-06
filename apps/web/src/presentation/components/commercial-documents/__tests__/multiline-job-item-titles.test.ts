import fs from "node:fs";
import path from "node:path";

const jobItemForm = fs.readFileSync(
  path.resolve(__dirname, "../JobItemForm.tsx"),
  "utf8"
);
const jobItemsTable = fs.readFileSync(
  path.resolve(__dirname, "../JobItemsTable.tsx"),
  "utf8"
);
const pdfJobItemsTable = fs.readFileSync(
  path.resolve(__dirname, "../../pdf/JobItemsTable.tsx"),
  "utf8"
);

describe("multiline job-item titles", () => {
  it("uses a textarea and keeps Enter available for title newlines", () => {
    expect(jobItemForm).toContain("const titleRef = useRef<HTMLTextAreaElement>(null);");
    expect(jobItemForm).toContain('<textarea\n          ref={titleRef}');
    expect(jobItemForm).toContain("e.key === \"Enter\" && !(e.target instanceof HTMLTextAreaElement)");
  });

  it("preserves title line breaks in web and PDF tables", () => {
    expect(jobItemsTable).toContain("font-medium whitespace-pre-wrap break-words");
    expect(pdfJobItemsTable).toContain("{item.title}");
  });
});
