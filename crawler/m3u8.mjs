import fetch from "node-fetch";

export async function get_m3u8({ vid, ep }) {
    const source_url = `https://v.myself-bbs.com/vpx/${vid}/${ep}/`;
    try {
        const source = await fetch(source_url).then((r) => {
            if (r.ok) {
                return r.json();
            }
            throw new Error(`${r.status}: ${r.statusText}`);
        });

        const m3u8_path = source.video["720p"];
        const host = source.host.map((x) => x.host);

        let m3u8 = "";
        for (let j = 0; j < host.length; j++) {
            if (m3u8) {
                break;
            }
            m3u8 = await fetch(host[j] + m3u8_path).then((r) => r.text());
        }
        if (!m3u8 && m3u8_path.split("/")[1].includes("_")) {
            for (let j = 0; j < host.length; j++) {
                if (m3u8) {
                    break;
                }
                m3u8 = await fetch(host[j] + `${vid}/${ep}/` + "720p.m3u8").then((r) => r.text());
            }
        }

        if (!m3u8) {
            throw new Error("get_m3u8_failed");
        }

        return m3u8;
    } catch (err) {
        console.error(`${vid}_${ep}_${err.message}: ${source_url}`);
    }
}
