import "dotenv/config";
const { ethers } = require("ethers");
const { Transaction } = require("ethereumjs-tx");
import { bufferToHex } from "ethereumjs-util";

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

const INFURA_ID = process.env.INFURA_ID;
const provider = new ethers.providers.JsonRpcProvider(
  `https://ropsten.infura.io/v3/${INFURA_ID}`
);

const privateKey1: string | undefined = process.env.DEVNET_PRIVKEY; // Private key of account 1

const wallet = new ethers.Wallet(privateKey1, provider);
const from = wallet.address;
const to = wallet.address;

const test_sign_by_private_key = async () => {
  console.log("Test send by ethers");
  const senderBalanceBefore = await provider.getBalance(from);
  const recieverBalanceBefore = await provider.getBalance(to);

  console.log(
    `\nSender balance before: ${ethers.utils.formatEther(senderBalanceBefore)}`
  );
  console.log(
    `reciever balance before: ${ethers.utils.formatEther(
      recieverBalanceBefore
    )}\n`
  );

  const tx1 = await wallet.sendTransaction({
    to,
    value: ethers.utils.parseEther("0.025"),
  });

  await tx1.wait();
  console.log(tx1);

  const senderBalanceAfter = await provider.getBalance(from);
  const recieverBalanceAfter = await provider.getBalance(to);

  console.log(
    `\nSender balance after: ${ethers.utils.formatEther(senderBalanceAfter)}`
  );
  console.log(
    `reciever balance after: ${ethers.utils.formatEther(
      recieverBalanceAfter
    )}\n`
  );

  const txCount = await provider.getTransactionCount(from);

  let data = "";

  // Sign the string message
  let flatSig = await wallet.signMessage(data);

  // For Solidity, we need the expanded-format of a signature
  let sig = ethers.utils.splitSignature(flatSig);

  const rawTx = [
    ethers.utils.hexlify(txCount), // nonce
    "0x09184e72a000", // gasPrice
    "0x2710", // gasLimit
    to, // to
    ethers.utils.hexlify(ethers.utils.parseEther("0.1")), // value
    "0x", // data
    ethers.utils.hexlify(sig.v), // v
    sig.r, // r
    sig.s, // s
  ];

  console.log("Raw tx: ", rawTx);

  const tx2 = new Transaction(rawTx);

  console.log("Senders Address: " + tx2.getSenderAddress().toString("hex"));

  if (tx2.getSenderAddress().toString("hex") != from) {
    console.error("The raw transatcion is error");
    return;
  }

  if (tx2.verifySignature()) {
    console.log("Signature Checks out!");
  }

  const { hash } = await provider.sendTransaction(
    "0x" + tx2.serialize().toString("hex")
  );

  console.log("Raw txhash string: " + hash);

  await provider.waitForTransaction(hash);
};

const test_sign_by_gg18 = async () => {
  console.log("Test send by ethers");
  const senderBalanceBefore = await provider.getBalance(from);
  const recieverBalanceBefore = await provider.getBalance(to);

  console.log(
    `\nSender balance before: ${ethers.utils.formatEther(senderBalanceBefore)}`
  );
  console.log(
    `reciever balance before: ${ethers.utils.formatEther(
      recieverBalanceBefore
    )}\n`
  );

  const tx1 = await wallet.sendTransaction({
    to,
    value: ethers.utils.parseEther("0.025"),
  });

  await tx1.wait();
  console.log(tx1);

  const senderBalanceAfter = await provider.getBalance(from);
  const recieverBalanceAfter = await provider.getBalance(to);

  console.log(
    `\nSender balance after: ${ethers.utils.formatEther(senderBalanceAfter)}`
  );
  console.log(
    `reciever balance after: ${ethers.utils.formatEther(
      recieverBalanceAfter
    )}\n`
  );

  const txCount = await provider.getTransactionCount(from);

  let data = "";

  await items.forEach(async function (item) {
    let res: any = await keygen();
    results.push(res);

    if (results.length == items.length) {
      console.log(results.length);
      items.forEach(async function (item) {
        if (item.idx < t + 1) {
          console.log(item.idx, " ", results[item.idx]);
          res = await sign(results[item.idx], data);
          console.log("Sign result: ", res);
        }
      });
    }
  });

  const rawTx = [
    ethers.utils.hexlify(txCount), // nonce
    "0x09184e72a000", // gasPrice
    "0x2710", // gasLimit
    to, // to
    ethers.utils.hexlify(ethers.utils.parseEther("0.1")), // value
    "0x", // data
    results.v, // v
    results.r,
    results.s, // r // s
  ];

  console.log("Raw tx: ", rawTx);

  const tx2 = new Transaction(rawTx);

  console.log("Senders Address: " + tx2.getSenderAddress().toString("hex"));

  if (tx2.getSenderAddress().toString("hex") != from) {
    console.error("The raw transatcion is error");
    return;
  }

  if (tx2.verifySignature()) {
    console.log("Signature Checks out!");
  }

  const { hash } = await provider.sendTransaction(
    "0x" + tx2.serialize().toString("hex")
  );

  console.log("Raw txhash string: " + hash);

  await provider.waitForTransaction(hash);
};

async function main() {
  // items.forEach(async function (item) {
  //   let res: any = await keygen();
  //   results.push(res);

  //   if (results.length == items.length) {
  //     console.log(results.length);
  //     items.forEach(async function (item) {
  //       if (item.idx < t + 1) {
  //         console.log(item.idx, " ", results[item.idx]);
  //         res = await sign(results[item.idx], "");
  //         console.log("Sign result: ", res);
  //       }
  //     });
  //   }
  // });

  await test_sign_by_private_key();
  await test_sign_by_gg18();
}

main()
  .then(() => {})
  .catch((error) => {
    console.error(error);
    {
    }
  });
