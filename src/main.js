import { search } from "./search.js";
import { get_new_animes } from "./new.js";
import { get_anime } from "./anime.js";

async function main() {
    addEventListener("fetch", (event) => {
        event.respondWith(handle_request(event));
    });

    addEventListener("scheduled", (event) => {
        event.waitUntil(handle_cron(event));
    });
}

async function handle_request(event) {
    let url = new URL(event.request.url);
    let query = new URLSearchParams(url.search);

    let endpoint = url.pathname.split("/")[1] || "";

    let content = { data: null };

    switch (endpoint) {
        case "search":
            content.data = await search(query.get("anime") || "");
            break;

        case "new":
            content.data = await get_new_animes();
            break;

        case "anime":
            content.data = await get_anime(query.get("id") || "44627");
            break;

        default:
            content.msg = "你是不是不知道這個 API 怎麼用？但很抱歉，我文檔還沒寫，所以只能先請你自己摸索囉！";
            break;
    }

    const response = new Response(JSON.stringify(content, null, query.get("indent") ? +query.get("indent") || 2 : 0), {
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Cross-Origin-Resource-Policy": "cross-origin",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": "true",
            "Cache-Control": "max-age=300, s-maxage=300",
        },
    });
    return response;
}

export { main };
