# Localize.sh TXT Processor

TXT processor for the localize.sh ecosystem. This package parses plain text files into a localization-friendly AST (Abstract Syntax Tree) and stringifies them back, treating paragraphs as translatable segments.

## Installation

```bash
npm install @localizesh/processor-txt
```

## Usage

### As a Library

```typescript
import TxtProcessor from "@localizesh/processor-txt";

const processor = new TxtProcessor();

const content = "Hello world\n\nThis is a new paragraph.";
// Parse into a Document (AST + Segments)
const document = processor.parse(content);

// ... localize document segments ...

// Stringify back to string
const newContent = processor.stringify(document);
```

### As a CLI

This package provides a binary `localize-processor-txt` that works with standard I/O. It reads a protobuf `ParseRequest` or `StringifyRequest` from stdin and writes a `ParseResponse` or `StringifyResponse` to stdout, making it compatible with the localize.sh plugin system.

## Features

- **Paragraphs as Segments**: Splits text by newlines, treating each non-empty line as a segment.
- **Whitespace Preservation**: Preserves empty lines during round-trip.
- **Round-trip**: Ensures that parsing and then stringifying results in the original structure.

## Development

### Build

```bash
npm run build
```

### Test

```bash
npm test
```

## License

[Apache-2.0](LICENSE)
