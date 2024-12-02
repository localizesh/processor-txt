import {Processor, Context, Document} from "@localizesh/sdk";
import {documentToHast, hastToDocument, hastToString, stringToHast} from "./utils.js";

class TxtProcessor implements Processor {
    parse(res: string, ctx?: Context): Document {

        const hast = stringToHast(res);

        return hastToDocument(hast, ctx);
    }
    stringify(document: Document, ctx?: Context): string {

        const hast = documentToHast(document);

        return hastToString(hast);
    }
}

export default TxtProcessor;
