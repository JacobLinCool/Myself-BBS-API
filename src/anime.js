const anime = {};

const cacheTime = 300; // second

async function getAnime(id) {
    if (!anime[id]) {
        const res = await fetch(`https://raw.githubusercontent.com/JacobLinCool/Myself-BBS-API/data/details/${id}.json`, {
            headers: {
                "Cache-Control": `max-age=${cacheTime}, s-maxage=${cacheTime}`,
            },
        });
        if (res.status === 200) {
            anime[id] = await res.json();
        }
    }
    return anime[id];
}

async function getM3U8(vid, ep) {
    const res = await fetch(`https://raw.githubusercontent.com/JacobLinCool/Myself-BBS-API/data/m3u8/${vid}/${ep}.m3u8`, {
        headers: {
            "Cache-Control": `max-age=${cacheTime}, s-maxage=${cacheTime}`,
        },
    });
    if (res.status === 200) {
        return await res.text();
    }
    return null;
}

export { getAnime, getM3U8 };
