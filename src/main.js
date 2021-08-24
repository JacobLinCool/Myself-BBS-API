import { Router } from "itty-router";
import { response } from "./response";
import { getAiringList, getCompletedList } from "./list";
import { getAnime } from "./anime";
import { search } from "./search";

const router = Router();

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

router.get("/anime/:id", async (request) => {
    const { query, params } = request;

    const data = await getAnime(params.id);

    return response({ data: JSON.stringify({ data }, null, query.min ? 0 : 2) });
});

router.get("/search/:query", async (request) => {
    const { query, params } = request;

    const data = await search(decodeURIComponent(params.query));

    return response({ data: JSON.stringify({ data }, null, query.min ? 0 : 2) });
});

router.all("*", async (request) => {
    const { query } = request;
    return response({ data: JSON.stringify({ error: "Unknown Request" }, null, query.min ? 0 : 2) });
});

async function main() {
    addEventListener("fetch", (event) => {
        try {
            event.respondWith(router.handle(event.request));
        } catch (err) {
            event.respondWith(response({ data: JSON.stringify({ error: err.message }, null, 2) }));
        }
    });

    addEventListener("scheduled", (event) => {
        event.waitUntil(handle_cron(event));
    });
}

export { main };
