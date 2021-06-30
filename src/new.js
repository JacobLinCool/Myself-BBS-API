import fetch from "node-fetch";

async function get_new_animes() {
    let list = [];
    let page1 = await fetch("https://myself-bbs.com/forum-133-1.html?forumdefstyle=yes").then((r) => r.text());

    let total_regexp = new RegExp(`<span title="共 (\\d) 頁">`, "g");
    let total = +[...page1.matchAll(total_regexp)][0][1];

    let item_regexp = new RegExp(
        `<em>\\[<a href="forum.php\\?mod=forumdisplay&fid=133&amp;filter=typeid&amp;typeid=(\\d+?)">([^]+?)<\\/a>]<\\/em> <a href="thread-(\\d+?)-1-1.html" onclick="atarget\\(this\\)" class="xst" >([^]+?)<\\/a>`,
        "g"
    );

    [...page1.matchAll(item_regexp)].map((x) => {
        list.push({
            id: x[3].trim(),
            name: x[4].trim(),
            type: x[2].trim(),
            type_id: x[1].trim(),
        });
    });

    for (let i = 2; i <= total; i++) {
        let page = await fetch(`https://myself-bbs.com/forum-133-${i}.html?forumdefstyle=yes`).then((r) => r.text());
        [...page.matchAll(item_regexp)].map((x) => {
            list.push({
                id: x[3].trim(),
                name: x[4].trim(),
                type: x[2].trim(),
                type_id: x[1].trim(),
            });
        });
    }

    return list;
}

export { get_new_animes };
