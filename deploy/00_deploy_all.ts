// deploy/00_deploy_your_contract.js

import { HardhatRuntimeEnvironment } from "hardhat/types";
const localChainId = "31337";

module.exports = async ({
  getNamedAccounts,
  deployments,
  getChainId,
}: HardhatRuntimeEnvironment) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const result = await deploy("Marketplace", {
    from: deployer,
    log: true,
    waitConfirmations: 5,
  });

  await deploy("HeraCollection", {
    from: deployer,
    args: [result.address],
    log: true,
    waitConfirmations: 5,
  });
};
module.exports.tags = ["Marketplace"];
