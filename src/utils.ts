import {LayoutRoot, LayoutElement, Document, IdGenerator, Segment, Context} from "@localizesh/sdk";
import {visitParents} from "unist-util-visit-parents";
import {Text} from "hast";
import eol from "eol";

export const stringToHast = (rootString: string): LayoutRoot => {

    const rootChildren = eol.lf(rootString)
        .split("\n")
        .reduce((accum: Array<LayoutElement | Text>, paragraph: string) => {

            if (paragraph.trim()) {
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

export const hastToDocument = (hastRoot: LayoutRoot, ctx: Context): Document => {

    const idGenerator: IdGenerator = new IdGenerator();
    const segments: Segment[] = [];

    const setSegment = (node: any) => {
        const value = node.children[0].value;

        const id: string = idGenerator.generateId(value, {}, ctx)
        const segment: Segment = {
            id,
            text: value,
        };

        segments.push(segment);
        node.children = [{type: "segment", id}]
    }

    visitParents(hastRoot,
        (node: any) => node.tagName === "p",
        (node: any) => {

            const textNode = node.children[0];

            if (textNode?.type === "text" || textNode?.value.trim()) {
                setSegment(node);
            }
        }
    )

    return {layout: hastRoot, segments};
}

type SegmentsMap = {
    [id: string]: Segment;
};

export const documentToHast = (document: Document): LayoutRoot => {
    const segmentsMap: SegmentsMap = {};

    document.segments.forEach((segment: Segment): void => {
        segmentsMap[segment.id] = segment;
    });

    visitParents(document.layout, { type: "segment" }, (node: any, parent) => {
        const currentParent = parent[parent.length - 1];

        currentParent.children = [{type: "text", value: segmentsMap[node.id].text}]
    });

    return document.layout;
}

export const hastToString = (hast: LayoutRoot): string => {
    return hast.children.reduce((accum: "", child: any, index: number) => {

        if (child.type === "element") {
            if(child.children[0].value) {
                const isLast = index === hast.children.length - 1;
                accum += child.children[0].value + (isLast ? "" : "\n");
            }
        } else if (child.type === "text") {
            accum += child.value;
        }

        return accum;
    }, "")
}