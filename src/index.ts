import {Processor, Context, Document} from "@localizesh/sdk";
import {stringToHast} from "./utils.js";

class TxtProcessor implements Processor {
    parse(res: string, ctx?: Context): Document {

        const hast = stringToHast(res);

        return {layout: {type: "root", children: []}, segments: []}
    }
    stringify(document: Document, ctx?: Context): string {

        return "";
    }
}

export default TxtProcessor;
