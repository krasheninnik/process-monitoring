import { Tedis, TedisPool } from "tedis";

main()
  .then((text) => {
    console.log(text);
  })
  .catch((err) => {
    // Deal with the fact the chain failed
  });

async function main() {
  const tedis = new Tedis({
    host: "127.0.0.1",
    port: 6379,
  });

  console.log("started");

  console.log(`set key: ${await tedis.set("abc", "user_wanna_play123")}`);
  console.log("get keys");
  console.log(await tedis.keys("*"));
  //console.log(`set key: ${await tedis.set("abc", "user_wanna_play")}`);
  console.log(`get by key: ${await tedis.get("abc")}`);
}
