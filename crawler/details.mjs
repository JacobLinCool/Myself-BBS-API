import { JSDOM } from "jsdom";
import fetch from "node-fetch";

export async function get_details(link) {
    const raw_html = await fetch(link).then((res) => res.text());
    const dom = new JSDOM(raw_html);
    const document = dom.window.document;
    const info_box = document.querySelector(".info_info");
    const info = info_box.querySelectorAll("ul >li");
    const full_title = document.querySelector("#pt a[href^=thread]").textContent;

    const id = +document.querySelector("#pt a[href^=thread]").href.match(/thread-(\d+)/)[1];
    const title =
        full_title.match(/([^]+?)【[^]+/) && full_title.match(/([^]+?)【[^]+/)[1]
            ? full_title.match(/([^]+?)【[^]+/)[1].trim()
            : "";
    const category = info[0].textContent
        .split(":")[1]
        .trim()
        .split(/[/／]/g)
        .map((x) => x.trim());
    const premiere = info[1].textContent.split(":")[1].trim()
        ? info[1].textContent.split(":")[1].match(/\d+/g).map(Number)
        : [0, 0, 0];
    const ep = info[2].textContent.split(":")[1].match(/\d+/)
        ? +info[2].textContent.split(":")[1].match(/\d+/)[0]
        : 0;
    const author = info[3].textContent.split(":")[1].trim();
    const website = info[4].textContent.substr(5).trim();
    const description = info_box.querySelector("#info_introduction > p").textContent.trim();
    const image = document.querySelector(".info_img_box > img").src;
    const episodes = [...document.querySelectorAll(".main_list > li")].reduce((obj, node) => {
        try {
            const name = node.querySelector("a").textContent.trim();
            const code = node
                .querySelector("a[data-href^='https://v.myself-bbs.com']")
                .dataset.href.trim()
                .match(/\d+/g);
            obj[name] = code;
        } catch (err) {
            console.error(err.message, link);
        }
        return obj;
    }, {});

    return { id, title, category, premiere, ep, author, website, description, image, episodes };
}
