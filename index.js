import { main } from "./src/main.js";

let PROGRAM_START_TIME = Date.now();

main().then(() => {
    console.log(`程式執行時間： ${((Date.now() - PROGRAM_START_TIME) / 1000).toFixed(1)} 秒`);
});
