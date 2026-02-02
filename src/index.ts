import {
  Document,
  Segment,
  Context,
  Processor,
  IdGenerator,
  visitParents,
  root,
  LayoutNode,
  element,
  text,
  segment,
  LayoutText,
  LayoutElement,
  LayoutSegment
} from "@localizesh/sdk";
import eol from "eol";

export default class TxtProcessor extends Processor {
  parse(res: string, ctx?: Context): Document {
    // stringToHast
    const children = eol
      .lf(res)
      .split("\n")
      .reduce((accum: Array<LayoutNode>, paragraph: string) => {
        if (paragraph.trim()) {
          accum.push(element("p", paragraph));
        } else {
          accum.push(text());
        }

        return accum;
      }, []);

    const hastRoot = root(children);

    // hastToDocument
    const idGenerator = new IdGenerator();
    const segments: Segment[] = [];

    const setSegment = (node: LayoutElement) => {
      const text = (node.children[0] as LayoutText).value;

      const id: string = idGenerator.generateId(text, {}, ctx);
      segments.push({ id, text });

      node.children = [segment(id)];
    };

    visitParents(
      hastRoot,
      (node): node is LayoutElement =>
        node.type === "element" && (node as LayoutElement).tagName === "p",
      (element: LayoutElement) => {
        const textNode = element.children[0] as LayoutText | undefined;

        if (textNode?.type === "text" && textNode?.value.trim()) {
          setSegment(element);
        }
      },
    );

    return { layout: hastRoot, segments };
  }

  stringify(document: Document, ctx?: Context): string {
    // documentToHast
    const segmentsMap: Record<string, Segment> = {};

    document.segments.forEach((segment: Segment): void => {
      segmentsMap[segment.id] = segment;
    });

    visitParents(
      document.layout,
      { type: "segment" },
      (node: LayoutSegment, parents: Array<LayoutNode>) => {
        const currentParent = parents[parents.length - 1] as LayoutElement;

        if (segmentsMap[node.id]) {
          currentParent.children = [text(segmentsMap[node.id].text)];
        }
      },
    );

    const hast = document.layout;

    // hastToString
    return hast.children
      .map((child) => {
        if (child.type === "element") {
          const element = child as LayoutElement;
          const content = element.children[0] as LayoutText | undefined;
          return content ? content.value : "";
        } else if (child.type === "text") {
          return (child as LayoutText).value;
        }
        return "";
      })
      .join("\n");
  }
}
