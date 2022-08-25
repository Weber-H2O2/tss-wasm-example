const { gg18 } = require("@ieigen/tss-wasm-node");

var items = [{ idx: 0 }, { idx: 1 }, { idx: 2 }];

var results = [];

let t = 1;
let n = 3;

async function keygen(arg) {
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

async function sign(arg, key_store) {
  let context = await gg18.gg18_sign_client_new_context(
    "http://127.0.0.1:8000",
    t,
    n,
    key_store,
    "Hello Eigen"
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

async function main() {
  items.forEach(async function (item) {
    let res = await keygen(item);
    results.push(res);

    if (results.length == items.length) {
      console.log(results.length);
      items.forEach(async function (item) {
        if (item.idx < t + 1) {
          console.log(item.idx, " ", results[item.idx]);
          res = await sign(item, results[item.idx]);
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