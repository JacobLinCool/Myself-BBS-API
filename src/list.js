let airing = null;
let completed = null;

const cacheTime = 300; // second

async function getAiringList() {
    if (airing === null) {
        const res = await fetch("https://raw.githubusercontent.com/JacobLinCool/Myself-BBS-API/data/serializing.json", {
            headers: {
                "Cache-Control": `max-age=${cacheTime}, s-maxage=${cacheTime}`,
            },
        });
        if (res.status === 200) {
            airing = await res.json();
        }
    }
    return airing;
}

async function getCompletedList() {
    if (completed === null) {
        const res = await fetch("https://raw.githubusercontent.com/JacobLinCool/Myself-BBS-API/data/completed.json", {
            headers: {
                "Cache-Control": `max-age=${cacheTime}, s-maxage=${cacheTime}`,
            },
        });
        if (res.status === 200) {
            completed = await res.json();
        }
    }
    return completed;
}

export { getAiringList, getCompletedList };
