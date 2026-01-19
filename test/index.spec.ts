import { assert, describe, it } from "vitest";
import fs from "fs";
import path from "path";
import TxtProcessor from "../src/index.js";

const processor = new TxtProcessor();

function processAndCompare(filename: string) {
  const fixturePath = path.join("test", "fixtures", filename);
  const inDoc = fs.readFileSync(fixturePath, {
    encoding: "utf-8",
  });

  const doc = processor.parse(inDoc);
  const outDocStr = processor.stringify(doc);

  // For TXT, we expect exact roundtrip
  assert.equal(outDocStr, inDoc);

  console.log(`${filename} passed`);
}

describe("Fixture Round-trip", function () {
  const fixtures = ["typical.txt", "empty.txt", "multiline.txt"];

  fixtures.forEach((filename) => {
    it(`should match original structure for ${filename}`, function () {
      processAndCompare(filename);
    });
  });
});
