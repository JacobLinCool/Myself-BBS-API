import { JSDOM } from "jsdom";
import fetch from "node-fetch";
import { airing_start } from "./constants.mjs";
import { extract_items, get_next } from "./utils.mjs";

export async function get_airing_list() {
    const list = [];
    console.log(`Crawling Airing List Page 1`);
    const dom = new JSDOM();
    const raw_html = await fetch(airing_start).then((res) => res.text());
    dom.window.document.write(raw_html);
    list.push(...extract_items(dom));

    let next_url = get_next(dom);
    let page = 1;
    while (next_url && page++ < 100) {
        console.log(`Crawling Airing List Page ${page}`);
        const raw_html = await fetch(next_url).then((res) => res.text());
        dom.window.document.write(raw_html);
        list.push(...extract_items(dom));
        next_url = get_next(dom);
    }
    return list;
}
