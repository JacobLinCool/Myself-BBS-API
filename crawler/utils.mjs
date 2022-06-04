export function get_next(dom) {
    try {
        const document = dom.window.document;
        const next = document.querySelector("a.nxt");
        if (next) {
            return next.href;
        }
        return null;
    } catch (err) {
        return null;
    }
}

export function extract_items(dom) {
    try {
        const document = dom.window.document;
        const list = document.querySelector("form > ul");
        const boxes = list.querySelectorAll("li");
        const items = [];
        for (const box of boxes) {
            const id = +box.querySelector(".ptn > a").href.match(/thread-(\d+)/)[1];
            const title = box.querySelector(".ptn > a").textContent;
            const link = box.querySelector(".ptn > a").href;
            const ep = +box.querySelector(".ep_info").textContent.match(/\d+/)[0];
            const image = box.querySelector("img").src;
            const watch = +box.querySelector("em[title$='查看']").textContent;
            items.push({ id, title, link, ep, image, watch });
        }
        return items;
    } catch (err) {
        return [];
    }
}
