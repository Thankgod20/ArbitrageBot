const BakeryFlashswap = artifacts.require("BakeryFlashswap");

module.exports = function (deployer) {
  deployer.deploy(BakeryFlashswap,"0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c","0xc35DADB65012eC5796536bD9864eD8773aBc74C4");
};
