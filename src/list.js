import { BASE, CACHE_CONTROL } from "./constants";

let airing = null;
let completed = null;

const cacheTime = 300; // second

async function getAiringList() {
    if (airing === null) {
        const res = await fetch(`${BASE}airing.json`, {
            headers: {
                "Cache-Control": CACHE_CONTROL,
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
        const res = await fetch(`${BASE}completed.json`, {
            headers: {
                "Cache-Control": CACHE_CONTROL,
            },
        });
        if (res.status === 200) {
            completed = await res.json();
        }
    }
    return completed;
}

export { getAiringList, getCompletedList };
