import * as core from "@actions/core";
import { readFile } from "node:fs/promises";
import VError from "verror";

/**
 * The input type is string or undefined.
 *
 * Unlike core.getInput, we return undefined when the environment variable isn't provided.
 *
 * @see getInput
 */
export type Input = string | undefined;

/**
 * Returns the value of the input, as found in the environment.
 *
 * This function parses the environment the same as core.getInput(). However, core.getInput()
 * returns an empty string when the environment variable isn't defined. The GitHub Actions engine does the
 * same when no value is provided.
 *
 * This function uses a different approach. It returns undefined if the input is not set in the environment,
 * *or if the environment variable is an empty string*. This can make it easier to set default values
 * using validation frameworks.
 *
 * @param name - The input name.
 */
export function getInput(name: string): Input {
  const value = process.env[`INPUT_${name.replace(/ /g, "_").toUpperCase()}`];
  return value === "" ? undefined : value;
}

/**
 * Typesafe object when getting multiple inputs at once.
 */
export type GetInputsResult<I> = {
  [K in keyof I]: Input;
};

/**
 * Gets a set of inputs and returns their values in a typesafe object.
 *
 * @param inputs - The inputs to parse from the environment.
 */
export function getInputs<I>(...inputs: Array<keyof I>): GetInputsResult<I> {
  const result = {} as GetInputsResult<I>;

  for (const input of inputs) {
    result[input] = getInput(input.toString());
  }

  return result;
}

/**
 * Parses the Github Actions outputs from the provided file as written by the core.setOutput
 * utility.
 *
 * The core.setOutput utility stores the outputs as heredocs with randomly generated delimiters.
 * This function parses those out and returns the remaining key value pairs as an object.
 *
 * If a key is provided more than once, the last value takes precedence.
 *
 * @param filePath - The outputs file path. Defaults to GITHUB_OUTPUT. Throws if neither the
 *  parameter and the environment variable are provided.
 *
 * @return The outputs as a record of string.
 */
export async function parseOutputs(
  filePath?: string
): Promise<Record<string, string>> {
  const outputsPath = filePath || process.env.GITHUB_OUTPUT;
  if (outputsPath == null) {
    throw new Error(
      `no output file path provided as argument nor through the GITHUB_OUTPUT environment variable`
    );
  }

  const result: Record<string, string> = {};
  const fileContents = await readFile(outputsPath, { encoding: "utf-8" });
  const outputRegex =
    /(?<key>.+?)<<(?<delimiter>.*?)\n(?<value>.*)\n\k<delimiter>\n/g;

  let captures = outputRegex.exec(fileContents);
  while (captures != null && captures.groups != null) {
    result[captures.groups.key] = captures.groups.value;
    captures = outputRegex.exec(fileContents);
  }

  return result;
}

/**
 * This function does away with the common boilerplate code related to running a GitHub Actions
 * handler.
 *
 * It wraps the whole process with convenient debug statements that are turned on
 * by setting ACTIONS_STEP_DEBUG to true.
 *
 * The handler can return outputs and those are forwarded automatically to core.setOutput at the
 * end of the run. core.setOutput JSON stringifies everything.
 *
 * Any runtime errors occurring during this function's execution results in a call to core.setFailed.
 *
 * @param handler - The GitHub Actions handler.
 *
 * @see https://docs.github.com/en/actions/monitoring-and-troubleshooting-workflows/enabling-debug-logging
 */
export function runActionHandler(handler: () => Promise<unknown>) {
  try {
    if (core.isDebug()) {
      core.debug(`received env: ${JSON.stringify(process.env, null, 2)}`);
      core.debug(`received context: ${JSON.stringify(context, null, 2)}`);
    }

    handler()
      .then((outputs) => {
        if (outputs == null) {
          return;
        }
        for (const [key, value] of Object.entries(outputs)) {
          if (core.isDebug()) {
            core.debug(`setting output ${key}=${JSON.stringify(value)}`);
          }
          core.setOutput(key, value);
        }
      })
      .catch((err) => core.setFailed(VError.fullStack(err as Error)));
  } catch (err) {
    core.setFailed(VError.fullStack(err as Error));
  }
}
