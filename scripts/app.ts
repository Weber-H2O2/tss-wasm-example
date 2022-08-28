import "dotenv/config";
const { gg18 } = require("@ieigen/tss-wasm-node");

var items = [{ idx: 0 }, { idx: 1 }, { idx: 2 }];

var results: any = [];

let t = 1;
let n = 3;

async function keygen() {
  let context = await gg18.gg18_keygen_client_new_context(
    "http://127.0.0.1:8000",
    t,
    n
  );
  console.log("keygen new context: ", context);
  context = await gg18.gg18_keygen_client_round1(context);
  console.log("keygen round1: ", context);
  context = await gg18.gg18_keygen_client_round2(context);
  console.log("keygen round2: ", context);
  context = await gg18.gg18_keygen_client_round3(context);
  console.log("keygen round3: ", context);
  context = await gg18.gg18_keygen_client_round4(context);
  console.log("keygen round4: ", context);
  const keygen_json = await gg18.gg18_keygen_client_round5(context);
  console.log("keygen json: ", keygen_json);
  return keygen_json;
}

async function sign(key_store: string, message: string) {
  let context = await gg18.gg18_sign_client_new_context(
    "http://127.0.0.1:8000",
    t,
    n,
    key_store,
    message
  );
  console.log("sign new context: ", context);
  context = await gg18.gg18_sign_client_round0(context);
  console.log("sign round0: ", context);
  context = await gg18.gg18_sign_client_round1(context);
  console.log("sign round1: ", context);
  context = await gg18.gg18_sign_client_round2(context);
  console.log("sign round2: ", context);
  context = await gg18.gg18_sign_client_round3(context);
  console.log("sign round3: ", context);
  context = await gg18.gg18_sign_client_round4(context);
  console.log("sign round4: ", context);
  context = await gg18.gg18_sign_client_round5(context);
  console.log("sign round5: ", context);
  context = await gg18.gg18_sign_client_round6(context);
  console.log("sign round6: ", context);
  context = await gg18.gg18_sign_client_round7(context);
  console.log("sign round7: ", context);
  context = await gg18.gg18_sign_client_round8(context);
  console.log("sign round8: ", context);
  const sign_json = await gg18.gg18_sign_client_round9(context);
  console.log("keygen json: ", sign_json);
  return sign_json;
}

const { ethers } = require("ethers");

const INFURA_ID = process.env.INFURA_ID;
const provider = new ethers.providers.JsonRpcProvider(
  `https://ropsten.infura.io/v3/${INFURA_ID}`
);

const privateKey1 = process.env.DEVNET_PRIVKEY; // Private key of account 1

const wallet = new ethers.Wallet(privateKey1, provider);
const account1 = wallet.address;
const account2 = wallet.address;

const test_send = async () => {
  console.log("Test send by ethers");
  const senderBalanceBefore = await provider.getBalance(account1);
  const recieverBalanceBefore = await provider.getBalance(account2);

  console.log(
    `\nSender balance before: ${ethers.utils.formatEther(senderBalanceBefore)}`
  );
  console.log(
    `reciever balance before: ${ethers.utils.formatEther(
      recieverBalanceBefore
    )}\n`
  );

  // const tx = await wallet.sendTransaction({
  //   to: account2,
  //   value: ethers.utils.parseEther("0.025"),
  // });

  // await tx.wait();
  // console.log(tx);

  // const senderBalanceAfter = await provider.getBalance(account1);
  // const recieverBalanceAfter = await provider.getBalance(account2);

  // console.log(
  //   `\nSender balance after: ${ethers.utils.formatEther(senderBalanceAfter)}`
  // );
  // console.log(
  //   `reciever balance after: ${ethers.utils.formatEther(
  //     recieverBalanceAfter
  //   )}\n`
  // );
  const txCount = await provider.getTransactionCount(account1);

  console.log("txCount (aka nonce): ", txCount);

  let transaction = {
    to: account2.address,
    value: ethers.utils.parseEther("0.1"),
    gasLimit: "21000",
    maxPriorityFeePerGas: ethers.utils.parseUnits("5", "gwei"),
    maxFeePerGas: ethers.utils.parseUnits("20", "gwei"),
    nonce: ethers.utils.hexlify(txCount),
    type: 2,
    chainId: 3,
  };
  // sign and serialize the transaction
  let rawTransaction = await wallet
    .signTransaction(transaction)
    .then(ethers.utils.serializeTransaction(transaction));

  // print the raw transaction hash
  console.log("Raw txhash string " + rawTransaction);

  await provider.waitForTransaction(rawTransaction);
};

async function main() {
  await test_send();
  return;

  items.forEach(async function (item) {
    let res: any = await keygen();
    results.push(res);

    if (results.length == items.length) {
      console.log(results.length);
      items.forEach(async function (item) {
        if (item.idx < t + 1) {
          console.log(item.idx, " ", results[item.idx]);
          res = await sign(results[item.idx], "");
          console.log("Sign result: ", res);
        }
      });
    }
  });
}

main()
  .then(() => {})
  .catch((error) => {
    console.error(error);
    {
    }
  });
