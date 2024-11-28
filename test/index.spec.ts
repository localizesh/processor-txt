import {assert} from "chai";
import eol from "eol";
import fs from "fs";
import path from "path";

import TxtProcessor from "../src/index.js";

const processor = new TxtProcessor();

function processAndCompare(filename: string) {
    const inDoc = eol.lf(fs.readFileSync(path.join('test', 'fixtures', filename), { encoding: 'utf-8' }));

    const doc = processor.parse(inDoc);
    const docStr = JSON.stringify(doc);

    const outDoc = eol.lf(processor.stringify(doc));
    const outDocStructure = processor.parse(outDoc);

    const outDocStructureStr = JSON.stringify(outDocStructure);

    assert.equal(outDocStructureStr, docStr);
    console.log(filename);
}

describe('TxtProcessorTest', function() {
    it('documents should be equal', function() {
        processAndCompare('typical.txt');
    });
});



