const fs = require("fs");
const fetch = require("node-fetch");

const P = 30;

console.time("M3U8 CACHE PROGRAM");
const list = JSON.parse(fs.readFileSync("./file/details.json")).reduce((arr, detail) => {
    Object.values(detail.episodes).forEach(([realVid, realEp]) => {
        arr.push({
            title: detail.title,
            realVid,
            realEp,
            total: Object.keys(detail.episodes).length,
        });
    });
    return arr;
}, []);
const total = list.length;
let finished = 0;
const failed = [];

const running = {};
const interval = setInterval(() => {
    console.log(running);
    if (Object.keys(running).length === 0) clearInterval(interval);
}, 30000);
for (let i = 0; i < P; i++) Next();
setTimeout(() => {
    process.exit(0);
}, 25 * 60 * 1000);

async function Next() {
    if (list.length) {
        const item = list.shift();
        cacheM3U8(item).then(() => {
            Next();
        });
    } else if (finished >= total) {
        fs.writeFileSync("./file/m3u8/failed.json", JSON.stringify(failed, null, 2));
        console.timeEnd("M3U8 CACHE PROGRAM");
    }
}

async function cacheM3U8({ title, realVid, realEp, total: t }) {
    const runningKey = `${title}-${realVid}-${realEp}`;
    running[runningKey] = 0;
    if (!fs.existsSync(`./file/m3u8/${realVid}/${realEp}.m3u8`)) {
        const sourcePath = `https://v.myself-bbs.com/vpx/${realVid}/${realEp}/`;
        try {
            const source = await fetch(sourcePath).then((r) => {
                if (r.status === 200) return r.json();
                throw new Error(`get_source_failed_${r.status}: ${r.statusText}`);
            });

            const m3u8Path = source.video["720p"];
            const host = source.host.map((x) => x.host);
            running[runningKey]++;

            let m3u8;
            for (let j = 0; !m3u8 && j < host.length; j++) {
                if (m3u8) break;
                running[runningKey]++;
                m3u8 = await fetch(host[j] + m3u8Path)
                    .then((r) => {
                        if (r.ok) return r.text();
                        else return null;
                    })
                    .catch((err) => null);
            }
            if (!m3u8 && m3u8Path.split("/")[1].includes("_")) {
                for (let j = 0; !m3u8 && j < host.length; j++) {
                    if (m3u8) break;
                    running[runningKey]++;
                    m3u8 = await fetch(host[j] + `${realVid}/${realEp}/` + "720p.m3u8")
                        .then((r) => {
                            if (r.ok) return r.text();
                            else return null;
                        })
                        .catch((err) => null);
                }
            }
            if (!m3u8) throw new Error("get_m3u8_failed");

            if (!fs.existsSync(`./file/m3u8/${realVid}`)) fs.mkdirSync(`./file/m3u8/${realVid}`, { recursive: true });
            fs.writeFileSync(`./file/m3u8/${realVid}/${realEp}.m3u8`, m3u8);
        } catch (err) {
            console.error(`${realVid}_${realEp}_${err.message}: ${sourcePath}`);
            failed.push(`${realVid}_${realEp}_${err.message}`);
        }
    }
    finished++;
    console.log(`M3U8: ${finished}/${total} ${title}(${realVid}) EP${realEp}`);
    delete running[runningKey];
}
