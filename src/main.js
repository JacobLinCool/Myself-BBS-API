import { search } from "./search.js";

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

        default:
            content.msg = "你是不是不知道這個 API 怎麼用？但很抱歉，我文檔還沒寫，所以只能先請你自己摸索囉！";
            break;
    }

    const response = new Response(JSON.stringify(content, null, 2), {
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Cross-Origin-Resource-Policy": "cross-origin",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": "true",
            "Cache-Control": "max-age=300, s-maxage=300",
            "X-Location": event.request.cf.colo,
        },
    });
    return response;
}

export { main };
