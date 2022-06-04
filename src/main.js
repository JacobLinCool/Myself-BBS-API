import { Router } from "itty-router";
import { getAnime, getM3U8 } from "./anime";
import { BASE } from "./constants";
import { getAiringList, getCompletedList } from "./list";
import { response } from "./response";
import { search } from "./search";

const router = Router();

// list
router.get("/list", async (request) => {
    const { query, url } = request;

    const origin = new URL(url).origin;

    const data = {
        completed: origin + "/list/completed",
        airing: origin + "/list/airing",
    };

    return response({ data: JSON.stringify({ data }, null, query.min ? 0 : 2) });
});
router.get("/list/completed", async (request) => {
    const { query } = request;

    const data = await getCompletedList();

    return response({ data: JSON.stringify({ data }, null, query.min ? 0 : 2) });
});
router.get("/list/airing", async (request) => {
    const { query } = request;

    const data = await getAiringList();

    return response({ data: JSON.stringify({ data }, null, query.min ? 0 : 2) });
});

// anime
router.get("/anime/all", async (request) => {
    const { query } = request;

    const data = await fetch(`${BASE}details.json`).then((r) => r.json());

    return response({ data: JSON.stringify({ data }, null, query.min ? 0 : 2) });
});
router.get("/anime/:id", async (request) => {
    const { query, params } = request;

    const data = await getAnime(params.id);

    return response({ data: JSON.stringify({ data }, null, query.min ? 0 : 2) });
});
router.get("/m3u8/:id/:ep", async (request) => {
    const { query, params } = request;

    const data = await getM3U8(params.id, params.ep);

    return response({ data: JSON.stringify({ data }, null, query.min ? 0 : 2) });
});

// search
router.get("/search/:query", async (request) => {
    const { query, params } = request;

    const data = await search(decodeURIComponent(params.query));

    return response({ data: JSON.stringify({ data }, null, query.min ? 0 : 2) });
});

// unknown request
router.all("*", async (request) => {
    const { query } = request;
    return response({
        data: JSON.stringify({ error: "Unknown Request" }, null, query.min ? 0 : 2),
    });
});

export default {
    async fetch(request, environment, context) {
        try {
            return await router.handle(request);
        } catch (err) {
            console.error(err);
            return response({ data: JSON.stringify({ error: err.message }, null, 2) });
        }
    },
    async scheduled(controller, environment, context) {
        // await dosomething();
    },
};
