import * as core from "@actions/core";
import { awaiter, expect, resetEnvFixture } from "@infra-blocks/test";
import { withFile } from "tmp-promise";
import { getInputs, parseOutputs, runActionHandler } from "../../src/index.js";
import sinon from "sinon";

describe("index", function () {
  function setInput(name: string, value: string) {
    process.env[`INPUT_${name.replace(/ /g, "_").toUpperCase()}`] = value;
  }

  describe(getInputs.name, function () {
    afterEach("reset process.env", resetEnvFixture());

    it("should work without inputs", function () {
      expect(getInputs()).to.deep.equal({});
    });
    it("should work with one undefined input", function () {
      const inputs = getInputs("toto");
      expect(inputs.toto).to.be.undefined;
    });
    it("should work with one undefined input", function () {
      setInput("toto", "tata");
      const inputs = getInputs("toto");
      expect(inputs.toto).to.equal("tata");
    });
    it("should work with a mix of inputs", function () {
      setInput("defined-input", "definitely defined");
      setInput("7ee1_InPuT", "7331");
      const inputs = getInputs(
        "defined-input",
        "undefined-input",
        "7ee1_InPuT",
        "Vo1D"
      );
      expect(inputs["defined-input"]).to.equal("definitely defined");
      expect(inputs["undefined-input"]).to.be.undefined;
      expect(inputs["7ee1_InPuT"]).to.equal("7331");
      expect(inputs.Vo1D).to.be.undefined;
    });
  });

  describe(parseOutputs.name, function () {
    afterEach("reset process.env", resetEnvFixture());

    it("should work with an empty file", async function () {
      await withFile(async (tempFile) => {
        const filePath = tempFile.path;
        expect(await parseOutputs(filePath)).to.deep.equal({});
      });
    });
    it("should work with a single string output", async function () {
      await withFile(async (tempFile) => {
        process.env.GITHUB_OUTPUT = tempFile.path;
        const stringValue = "tata";
        core.setOutput("toto", stringValue);
        expect(await parseOutputs()).to.deep.equal({
          toto: stringValue,
        });
      });
    });
    it("should work with weird keys", async function () {
      await withFile(async (tempFile) => {
        process.env.GITHUB_OUTPUT = tempFile.path;
        const stringValue = "   anything    ";
        core.setOutput("  t_0/T-o  ", stringValue);
        expect(await parseOutputs()).to.deep.equal({
          "  t_0/T-o  ": stringValue,
        });
      });
    });
    it("should work with a JSON array output", async function () {
      await withFile(async (tempFile) => {
        process.env.GITHUB_OUTPUT = tempFile.path;
        const arrayValue = ["one", 2, false, null];
        core.setOutput("array", arrayValue);
        expect(await parseOutputs()).to.deep.equal({
          array: JSON.stringify(arrayValue),
        });
      });
    });
    it("should work with a JSON object output", async function () {
      await withFile(async (tempFile) => {
        process.env.GITHUB_OUTPUT = tempFile.path;
        const objectValue = {
          string: "hello",
          number: 5,
          boolean: true,
          array: ["1", 2, false, null],
          null: null,
        };
        core.setOutput("object", objectValue);
        expect(await parseOutputs()).to.deep.equal({
          object: JSON.stringify(objectValue),
        });
      });
    });
    it("should work with several outputs", async function () {
      await withFile(async (tempFile) => {
        process.env.GITHUB_OUTPUT = tempFile.path;
        const stringValue = "Hello World!";
        const arrayValue = [1, "two", true, null];
        const objectValue = {
          string: "hello",
          number: 5,
          boolean: true,
          array: ["1", 2, false, null],
          null: null,
        };
        core.setOutput("string", stringValue);
        core.setOutput("array", arrayValue);
        core.setOutput("object", objectValue);
        expect(await parseOutputs()).to.deep.equal({
          string: stringValue,
          array: JSON.stringify(arrayValue),
          object: JSON.stringify(objectValue),
        });
      });
    });
    it("should work with repeating outputs", async function () {
      await withFile(async (tempFile) => {
        process.env.GITHUB_OUTPUT = tempFile.path;
        const firstStringValue = "Hello World!";
        const secondStringValue = "Anybody here?";
        const thirdStringValue = "You want that output or what?";

        core.setOutput("string", firstStringValue);
        core.setOutput("string", secondStringValue);
        core.setOutput("string", thirdStringValue);
        expect(await parseOutputs()).to.deep.equal({
          string: thirdStringValue,
        });
      });
    });
    it("should throw if no file path could be determined", async function () {
      delete process.env.GITHUB_OUTPUT;
      await expect(parseOutputs()).to.be.rejected;
    });
  });
  describe(runActionHandler.name, function () {
    afterEach("reset process.env", resetEnvFixture());

    it("should work without inputs and outputs", async function () {
      await withFile(async (tempFile) => {
        process.env.GITHUB_OUTPUT = tempFile.path;
        const handler = sinon.fake.resolves<
          [{ inputs: Record<string, never> }],
          Promise<undefined>
        >(undefined);
        const { func, promise } = awaiter(handler);

        runActionHandler(func);
        await promise;
        expect(handler).to.have.been.calledOnceWith();
        expect(await parseOutputs()).to.deep.equal({});
      });
    });
    it("should work with outputs", async function () {
      interface TestOutputs {
        "my-beautiful-output": string;
      }
      const outputs: TestOutputs = {
        "my-beautiful-output": "word",
      };
      await withFile(async (tempFile) => {
        process.env.GITHUB_OUTPUT = tempFile.path;
        const handler = sinon.fake.resolves<[], Promise<TestOutputs>>(outputs);
        const { func, promise } = awaiter(handler);

        runActionHandler(func);
        await promise;
        expect(handler).to.have.been.calledOnceWith();
        expect(await parseOutputs()).to.deep.equal(outputs);
      });
    });
  });
});
