import path from "path";
import fs from "fs";

import { HardhatConfig, HardhatUserConfig } from "hardhat/types";
import {
  extendConfig,
  task,
  // subtask,
  // extendEnvironment,
  // types,
} from "hardhat/config";
import {
  TASK_COMPILE,
  // TASK_COMPILE_SOLIDITY_COMPILE_JOBS,
  // TASK_CLEAN,
} from "hardhat/builtin-tasks/task-names";
// import { lazyObject } from "hardhat/plugins";

import "./type-extensions";
import { DataInput } from "./types";

export const TASK_INPUT_GENERATOR = "MyTask";

task(TASK_INPUT_GENERATOR, "Generate Input JSON Description").setAction(
  async (taskArgs, hre) => {
    // Run the compiler to generate buildInfo
    await hre.run(TASK_COMPILE, { quiet: true });

    const artifacts = hre.artifacts;
    const values = await artifacts.getAllFullyQualifiedNames();

    const dataInput: DataInput = {};

    console.log("length: ", values.length);

    for (let i = 0; i < values.length; i++) {
      const data = await artifacts.getBuildInfo(values[i]);
      if (data !== undefined) {
        dataInput[values[i]] = data.input;
      }
    }

    const pathFile = path.resolve(__dirname, `./file.json`);
    writeFile(pathFile, JSON.stringify(dataInput, null, 2));
  }
);

extendConfig(
  (config: HardhatConfig, userConfig: Readonly<HardhatUserConfig>) => {
    const userOutDir = userConfig.inputDescription?.outDir;
    let newOutDir: string;

    if (userOutDir === undefined) {
      console.log("yes, undefined");
      newOutDir = path.join(config.paths.root, "solc-inputs-json");
    } else {
      if (path.isAbsolute(userOutDir)) {
        newOutDir = userOutDir;
      } else {
        newOutDir = path.normalize(path.join(config.paths.root, userOutDir));
      }
    }
    config.inputDescription = {
      outDir: newOutDir,
    };
  }
);

/**
 * Write a file
 * @param _path Location of the file
 * @param file The file
 */
export const writeFile = (
  _path: string,
  file: string | NodeJS.ArrayBufferView
): void => {
  try {
    fs.writeFileSync(_path, file);
  } catch (error) {
    console.log(error);
  }
};
