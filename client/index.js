const WETH = require("../build/contracts/WETH.json");
const PancakeRouter = require("../build/contracts/IPancakeRouter02.json");
const Web3 = require('web3');
const ganache = require("ganache");
const ERC20 = require("../build/contracts/IERC20UNISWAP.json");
const prompt = require('prompt');

//0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c,0x26193c7fa4354ae49ec53ea2cebc513dc39a10aa
//0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56,0x26193c7fa4354ae49ec53ea2cebc513dc39a10aa
const options = {"fork":"https://bsc.getblock.io/mainnet/?api_key=3a7a0d72-40df-4821-9250-14e0495414bb"}; 
const provider = ganache.provider(options);

const web3 = new Web3(provider);
let address = null;
let amount = null;
let path = [];
let pathTwo = []

prompt.start();
prompt.get(['amount', 'path','pathT'], function (err, result) {

    if (err) {
      return onErr(err);
    }
    console.log('Command-line input received:');
    amount = parseFloat(result.amount);
    console.log('  amount: ' + amount);
    let tokenFirstPath = result.path
    path = Array.from(tokenFirstPath.split(','));
    console.log('  path: ' , path);
    let tokenSecondPath = result.pathT;
    pathTwo = Array.from(tokenSecondPath.split(","));
    console.log("Slippage:-",pathTwo)

    init(amount,path,pathTwo);
  });
  
  function onErr(err) {
    console.log(err);
    return 1;
  }

const init = async(amountIn,path,pathT) => {
    address = await web3.eth.getAccounts();
    let router = new web3.eth.Contract(
        PancakeRouter.abi,
        "0x10ED43C718714eb63d5aA57B78B54704E256024E"
    );



 
    //WBNB to BUSD 

    let arbTwo = await router.methods.getAmountsOut(
        web3.utils.toWei(amountIn.toString(),'ether') ,
        [path[0],pathT[0]]
    ).call({from:address[0]});
    console.log("Result:-",arbTwo);
    console.log("WBNB/BUSD:-",web3.utils.fromWei(arbTwo[1].toString(),'ether'));

    let BusdEquivalent = arbTwo[1];
    // WBNB to TOken

    let arbOne = await router.methods.getAmountsOut(
        web3.utils.toWei(amountIn.toString(),'ether') ,
        path
    ).call({from:address[0]});
    console.log("Result:-",arbOne);
    console.log("Result:-",web3.utils.fromWei(arbOne[1].toString(),'ether'));
    
    let fromBNBAmount = arbOne[1];
    let fromBNB = parseFloat(web3.utils.fromWei(arbOne[1].toString(),'ether'));
        // BUSD to TOken

    let arbBusdOne = await router.methods.getAmountsOut(
            BusdEquivalent.toString() ,
            [pathT[0],path[0],path[1]]
        ).call({from:address[0]});
        console.log("Result:-",arbBusdOne);
        console.log("Result:-",web3.utils.fromWei(arbBusdOne[arbBusdOne.length-1].toString(),'ether'));
    
    let fromBusdAmount  = arbBusdOne[arbBusdOne.length-1];
    let fromBusd = parseFloat(web3.utils.fromWei(arbBusdOne[arbBusdOne.length-1].toString(),'ether'));

    if (fromBusd<fromBNB) {
        swaptoWbnb(router,address,fromBusdAmount,path)
    } else {
        swaptoBUSD(router,address,fromBNBAmount,path,pathT)
    }
}

const swaptoWbnb = async(router,address,token,path) => {
    console.log("--------------------------Swap to WBNB------------------------------------------");
    let toBnB = await router.methods.getAmountsOut(
        token.toString() ,
        [path[1],path[0]]
    ).call({from:address[0]});

    console.log("Result:-",toBnB);
    console.log("Result:-",web3.utils.fromWei(toBnB[toBnB.length-1].toString(),'ether'));

}
const swaptoBUSD = async(router,address,token,path,pathT) => {
    console.log("--------------------------Swap to BUSD------------------------------------------");
    let toBnB = await router.methods.getAmountsOut(
        token.toString() ,
        [path[1],path[0],pathT[0]]
    ).call({from:address[0]});

    console.log("Result:-",toBnB);
    console.log("Result:-",web3.utils.fromWei(toBnB[toBnB.length-1].toString(),'ether'));

}