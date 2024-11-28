import {LayoutRoot, LayoutElement} from "@localizesh/sdk";
import {Text} from "hast";
import eol from "eol";

export const stringToHast = (rootString: string): LayoutRoot => {

    const rootChildren = eol.lf(rootString)
        .split("\n")
        .reduce((accum: Array<LayoutElement | Text>, paragraph: string) => {

            if(paragraph.trim()) {
                accum.push({
                    type: "element",
                    tagName: "p",
                    properties: {},
                    children: [
                        {type: "text", value: paragraph}
                    ]
                })
            } else {
                accum.push({type: "text", value: "\n"})
            }

            return accum;
        }, [])

    return {type: "root", children: rootChildren}
}