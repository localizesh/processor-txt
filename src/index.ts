import {
  Document,
  LayoutRoot,
  SegmentNode,
  Segment,
  Context,
  Processor,
  IdGenerator,
  visitParents,
} from "@localizesh/sdk";
import type { Element, Text, RootContent, Node } from "hast";
import eol from "eol";
import { h } from "hastscript";
import { u } from "unist-builder";

export default class TxtProcessor extends Processor {
  parse(res: string, ctx?: Context): Document {
    // stringToHast
    const children = eol
      .lf(res)
      .split("\n")
      .reduce((accum: Array<RootContent>, paragraph: string) => {
        if (paragraph.trim()) {
          accum.push(h("p", paragraph));
        } else {
          accum.push(u("text", ""));
        }

        return accum;
      }, []);

    const hastRoot = h(null, children);

    // hastToDocument
    const idGenerator = new IdGenerator();
    const segments: Segment[] = [];

    const setSegment = (node: Element) => {
      const value = (node.children[0] as Text).value;

      const id: string = idGenerator.generateId(value, {}, ctx);
      const segment: Segment = {
        id,
        text: value,
      };

      segments.push(segment);

      node.children = [u("segment", { id })];
    };

    visitParents(
      hastRoot,
      (node: Node) =>
        node.type === "element" && (node as Element).tagName === "p",
      (element: Element) => {
        const textNode = element.children[0] as Text | undefined;

        if (textNode?.type === "text" || textNode?.value.trim()) {
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
      (node: SegmentNode, parents: Array<Node>) => {
        const currentParent = parents[parents.length - 1] as Element;

        if (segmentsMap[node.id]) {
          currentParent.children = [u("text", segmentsMap[node.id].text)];
        }
      },
    );

    const hast = document.layout;

    // hastToString
    return hast.children
      .map((child: RootContent) => {
        if (child.type === "element") {
          const element = child as Element;
          const content = element.children[0] as Text | undefined;
          return content ? content.value : "";
        } else if (child.type === "text") {
          return (child as Text).value;
        }
        return "";
      })
      .join("\n");
  }
}
