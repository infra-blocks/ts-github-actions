# ts-github-actions

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

## Development

### Repo init

This repository leverages [nvm](https://github.com/nvm-sh/nvm) and users should have it installed in their local environment.
In addition, it is recommended that users install a [shell hook](https://github.com/nvm-sh/nvm#deeper-shell-integration)
so that `nvm use` is run upon changing into a project that utilises `nvm`.

Upon checking out the repository, run the following commands:
```shell
nvm install
npm install
npm run compile
npm run lint
npm run test
```

### Package publication

This package leverages the [npm-publish-from-label](https://github.com/infrastructure-blocks/npm-publish-from-label-action) action
as a turnkey, automated mechanism for publishing packages. Refer to its documentation to understand its capabilities.

Packages should therefore not be published manually, as these tasks are automated by the CI.
