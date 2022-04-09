import { InputDescriptionUserConfig, InputDescriptionConfig } from "./types";

declare module "hardhat/types/config" {
  interface HardhatUserConfig {
    inputDescription?: InputDescriptionUserConfig;
  }

  interface HardhatConfig {
    inputDescription: InputDescriptionConfig;
  }
}
