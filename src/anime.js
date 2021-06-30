import fetch from "node-fetch";

async function get_anime(id = "44627") {
    console.log("Task: Get Anime");
    let raw = await fetch(`https://myself-bbs.com/thread-${id}-1-1.html`).then((r) => r.text());

    console.time("Task: Get Anime");
    let rex_name = /<meta name="keywords" content="([^]*?)"/g;
    let name = [...raw.matchAll(rex_name)][0][1];

    let rex_description = /<p style="line-height:23px;">([^]*?)<\/p>/g;
    let description = [...raw.matchAll(rex_description)][0][1].replace(/<br \/>/g, "").replace(/\r/g, "");

    let rex_image = /<div class="info_img_box fl">\s<img src="([^]+?)" alt="[^]*?">\s<\/div>/g;
    let image = [...raw.matchAll(rex_image)][0][1];

    let rex_ep = /<a href="javascript:;">([^]+?)<\/a>/g;
    let ep = [...raw.matchAll(rex_ep)].map((x) => x[1].trim());

    console.timeEnd("Task: Get Anime");
    return {
        name: name,
        description: description,
        image: image,
        ep: ep,
    };
}

export { get_anime };
