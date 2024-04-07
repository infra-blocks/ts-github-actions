# ts-github-actions
[![Build](https://github.com/infrastructure-blocks/ts-github-actions/actions/workflows/build.yml/badge.svg)](https://github.com/infrastructure-blocks/ts-github-actions/actions/workflows/build.yml)
[![NPM Publish Release From Label](https://github.com/infrastructure-blocks/ts-github-actions/actions/workflows/npm-publish-release-from-label.yml/badge.svg)](https://github.com/infrastructure-blocks/ts-github-actions/actions/workflows/npm-publish-release-from-label.yml)
[![Update From Template](https://github.com/infrastructure-blocks/ts-github-actions/actions/workflows/update-from-template.yml/badge.svg)](https://github.com/infrastructure-blocks/ts-github-actions/actions/workflows/update-from-template.yml)
[![codecov](https://codecov.io/gh/infrastructure-blocks/ts-github-actions/graph/badge.svg?token=EATDOV78XS)](https://codecov.io/gh/infrastructure-blocks/ts-github-actions)

This package provides a set of utilities to improve developer UX while writing GitHub Actions in Typescript.

## Usage

The entrypoint to a GitHub Action should look like this:

```typescript
import { getInputs, runActionHandler } from "@infra-blocks/github-actions";
// You are free to use your favorite validation library. We like zod.
import { z } from "zod";

interface Outputs {
  "example-output": string;
}

async function handler(config: {exampleInput: string; bigInput: number}): Promise<Outputs> {
  // The business goes here.
}

runActionHandler(() => {
  const inputs = getInputs("example-input", "bigInput");
  const config = z.object({
    "example-input": z.string(),
    bigInput: z.number()
  }).transform((parsed) => ({
    exampleInput: parsed["example-input"],
    bigInput: parse.bigInput
  })).parse(inputs);
  return handler(config);
});
```
