const fs = require("fs");
const fetch = require("node-fetch");
const { JSDOM } = require("jsdom");

getList().then((list) => {
    if (!fs.existsSync("./file/")) fs.mkdirSync("./file/");
    fs.writeFileSync(
        "./file/serializing.json",
        JSON.stringify(
            {
                meta: {
                    time: Date.now(),
                    length: list.length,
                },
                data: list,
            },
            null,
            2
        )
    );
});

async function getList(maxDepth = 1000) {
    const list = [];
    const startUrl = "https://myself-bbs.com/forum-133-1.html";
    console.log("Serializing Page: 1");
    const raw = await fetch(startUrl).then((res) => res.text());
    const dom = new JSDOM(raw);
    list.push(...getItems(dom));

    let next = getNext(dom);
    let page = 1;
    while (next && page++ < maxDepth) {
        console.log("Serializing Page: " + page);
        const raw = await fetch(next).then((res) => res.text());
        const dom = new JSDOM(raw);
        list.push(...getItems(dom));
        next = getNext(dom);
    }

    return list;
}

function getNext(dom) {
    try {
        const document = dom.window.document;
        const next = document.querySelector("a.nxt");
        if (next) return next.href;
        return null;
    } catch (err) {
        return null;
    }
}

function getItems(dom) {
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
