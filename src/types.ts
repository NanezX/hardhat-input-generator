import "hardhat/types/config";

import { CompilerInput } from "hardhat/types";

export interface DataInput {
  [sourceName: string]: CompilerInput;
}

export interface InputDescriptionUserConfig {
  outDir?: string;
}

export interface InputDescriptionConfig {
  outDir: string;
}
