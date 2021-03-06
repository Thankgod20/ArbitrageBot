const BN = require("bn.js");
const Flashswap = artifacts.require("BakeryFlashswap");
const WETH = artifacts.require("WETH");


contract("Flashswap Test",(accounts)=> {
    let flashSwap = null;
    let weth = null;
    let contractAddr = null;
    before(async() => {
        flashSwap = await Flashswap.new("0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c","0xc35DADB65012eC5796536bD9864eD8773aBc74C4");//,"0x10ED43C718714eb63d5aA57B78B54704E256024E","0xe9e7cea3dedca5984780bafc599bd69add087d56");
        weth = await WETH.at("0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c");
        contractAddr = flashSwap.address;
        console.log("Contract Address:-",contractAddr);
    });
    it ("Deposit WBNB", async() =>{
        let deposit = await weth.deposit({from:accounts[0],value:"2000000000000000000"});
        let trans = await weth.transfer(contractAddr,"1500000000000000000");
        let balance = await weth.balanceOf(contractAddr);
        console.log("Balance of FlashLoan:-",balance.toString())
    })
    it ("Set Token Borrow Address", async() => {
        let setAddr = await flashSwap.setTokenBorrow("0xe9e7cea3dedca5984780bafc599bd69add087d56");
        console.log("Print Token to Borrow",setAddr);
    })
    it ("Check if pair exist", async() => {
        let checkPair = await flashSwap.getTokenPair("0xe9e7cea3dedca5984780bafc599bd69add087d56");//BUSD mainnet address
        console.log("Pair:-",checkPair);
    })

    it ("initiate Flashswap", async()=> {
        let initiateSwap = await flashSwap.initFlashloan("0xe9e7cea3dedca5984780bafc599bd69add087d56","10000000000000000000",["0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c","0xe9e7cea3dedca5984780bafc599bd69add087d56"],["0xe9e7cea3dedca5984780bafc599bd69add087d56","0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"],0);
        for (let x in initiateSwap.logs){
            if(initiateSwap.logs[x].event=='log')
                console.log("FlashLoan Report:-",initiateSwap.logs[x].args.message,"Value:-",initiateSwap.logs[x].args.val.toString());
            else
                console.log("FlashLoan Report:-",initiateSwap.logs[x].args.message,"Value:-",initiateSwap.logs[x].args.path);       
        }

            
    } );

    


})