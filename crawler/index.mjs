import fs from "node:fs";
import path from "node:path";
import { Pool } from "@jacoblincool/puddle";
import { get_airing_list } from "./airing.mjs";
import { get_completed_list } from "./completed.mjs";
import { dist } from "./constants.mjs";
import { get_details } from "./details.mjs";
import { get_m3u8 } from "./m3u8.mjs";

const indent = 0;

(async () => {
    if (!fs.existsSync(dist)) {
        fs.mkdirSync(dist, { recursive: true });
    }

    const airing_list = await get_airing_list();
    fs.writeFileSync(
        path.resolve(dist, "airing.json"),
        JSON.stringify({ meta: { time: Date.now() }, data: airing_list }, null, indent),
    );

    const completed_list = await get_completed_list();
    fs.writeFileSync(
        path.resolve(dist, "completed.json"),
        JSON.stringify({ meta: { time: Date.now() }, data: completed_list }, null, indent),
    );

    const details_dir = path.resolve(dist, "details");
    if (!fs.existsSync(details_dir)) {
        fs.mkdirSync(details_dir, { recursive: true });
    }

    const items = airing_list.concat(completed_list);
    const details_list = [];

    const pool = new Pool(16);
    let done = 0;
    for (const item of items) {
        pool.push(async () => {
            const details = await get_details(item.link);
            if (!details.title) {
                details.title = item.title;
            }
            details_list.push(details);
            fs.writeFileSync(
                path.resolve(details_dir, `${item.id}.json`),
                JSON.stringify(details, null, indent),
            );
            done++;
            console.log(
                `[ ${done.toString().padStart(Math.log10(items.length) + 1)} / ${items.length} ]`,
                `(${((done / items.length) * 100).toFixed(2)}%) ${item.id}. ${item.title}`,
            );
        });
    }
    await pool.run();

    fs.writeFileSync(
        path.resolve(dist, "details.json"),
        JSON.stringify({ meta: { time: Date.now() }, data: details_list }, null, indent),
    );

//     const m3u8_dir = path.resolve(dist, "m3u8");
//     if (!fs.existsSync(m3u8_dir)) {
//         fs.mkdirSync(m3u8_dir, { recursive: true });
//     }

//     const m3u8_pool = new Pool(30);
//     let m3u8_done = 0,
//         m3u8_total = 0;
//     for (const details of details_list) {
//         for (const key in details.episodes) {
//             const episode = details.episodes[key];
//             const dir = path.resolve(m3u8_dir, episode[0]);
//             if (!fs.existsSync(path.resolve(dir, `${episode[1]}.m3u8`))) {
//                 m3u8_pool.push(async () => {
//                     const m3u8 = await get_m3u8({ vid: episode[0], ep: episode[1] });
//                     if (m3u8) {
//                         if (!fs.existsSync(dir)) {
//                             fs.mkdirSync(dir, { recursive: true });
//                         }
//                         fs.writeFileSync(path.resolve(dir, `${episode[1]}.m3u8`), m3u8);
//                     }
//                     m3u8_done++;
//                     console.log(
//                         `[ ${m3u8_done
//                             .toString()
//                             .padStart(Math.log10(m3u8_total) + 1)} / ${m3u8_total} ]`,
//                         `(${((m3u8_done / m3u8_total) * 100).toFixed(2)}%) ${details.title} ${key}`,
//                     );
//                 });
//                 m3u8_total++;
//             }
//         }
//     }
//     await m3u8_pool.run();

    console.log("Done!");
})();
