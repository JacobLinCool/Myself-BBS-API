const fs = require("fs");
const fetch = require("node-fetch");
const { JSDOM } = require("jsdom");

const completed = JSON.parse(fs.readFileSync("./file/completed.json")).data;
const serializing = JSON.parse(fs.readFileSync("./file/serializing.json")).data;
const urls = [...completed.map((x) => x.link), ...serializing.map((x) => x.link)];

(async () => {
    const details = [];
    if (!fs.existsSync("./file/details/")) fs.mkdirSync("./file/details/");
    for (let i = 0; i < urls.length; i++) {
        const url = urls[i];
        try {
            await getDetails(url).then((data) => {
                if (!data.title) {
                    if (serializing.find((x) => x.link === url)) {
                        data.title = serializing.find((x) => x.link === url).title;
                    } else if (completed.find((x) => x.link === url)) {
                        data.title = completed.find((x) => x.link === url).title;
                    }
                }
                fs.writeFileSync(`./file/details/${data.id}.json`, JSON.stringify(data, null, 2));
                console.log(`Details: ${i + 1}/${urls.length} ${data.title}`);
                details.push(data);
            });
        } catch (err) {
            console.error(url);
            console.error(err);
        }
    }
    fs.writeFileSync("./file/details.json", JSON.stringify(details, null, 2));
})();

async function getDetails(url) {
    const raw = await fetch(url).then((res) => res.text());
    const dom = new JSDOM(raw);
    const document = dom.window.document;
    const infoBox = document.querySelector(".info_info");
    const infos = infoBox.querySelectorAll("ul >li");
    const id = +document.querySelector("#pt a[href^=thread]").href.match(/thread-(\d+)/)[1];
    const fullTitle = document.querySelector("#pt a[href^=thread]").textContent;
    const title = fullTitle.match(/([^]+?)【[^]+/) && fullTitle.match(/([^]+?)【[^]+/)[1] ? fullTitle.match(/([^]+?)【[^]+/)[1].trim() : "";
    const category = infos[0].textContent
        .split(":")[1]
        .trim()
        .split(/[/／]/g)
        .map((x) => x.trim());
    const premiere = infos[1].textContent.split(":")[1].trim() ? infos[1].textContent.split(":")[1].match(/\d+/g).map(Number) : [0, 0, 0];
    const ep = infos[2].textContent.split(":")[1].match(/\d+/) ? +infos[2].textContent.split(":")[1].match(/\d+/)[0] : 0;
    const author = infos[3].textContent.split(":")[1].trim();
    const website = infos[4].textContent.substr(5).trim();
    const description = infoBox.querySelector("#info_introduction > p").textContent.trim();
    const image = document.querySelector(".info_img_box > img").src;
    const episodes = [...document.querySelectorAll(".main_list > li")].map((node) => node.querySelector("a").textContent.trim());

    return {
        id,
        title,
        category,
        premiere,
        ep,
        author,
        website,
        description,
        image,
        episodes,
    };
}
