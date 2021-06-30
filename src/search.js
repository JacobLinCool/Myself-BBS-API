async function search(search_text = "") {
    let search_raw = await fetch("http://myself-bbs.com/search.php?mod=forum", {
        method: "POST",
        headers: {
            "content-type": "application/x-www-form-urlencoded",
            referer: "http://myself-bbs.com/search.php",
        },
        body: `srchtxt=${encodeURIComponent(search_text)}&searchsubmit=yes&srchfid%5B%5D=133&srchfid%5B%5D=113`,
    }).then((r) => r.text());

    let result_regex = new RegExp(
        `<li class="pbw"[^]+?<a href="forum.php\\?mod=viewthread&amp;tid=(\\d+?)&amp;highlight=${encodeURIComponent(
            search_text
        )}" target="_blank" >([^]+?)</a>\\s</h3>\\s<p class="xg1">\\d+? 個回復 - (\\d+?) 次查看</p>[^]+?完結動畫全集</a></span>\\s</p>\\s</li>`,
        "g"
    );

    let result = [...search_raw.matchAll(result_regex)]
        .map((x) => {
            return {
                id: x[1],
                name: x[2].replace(/<strong><font color="#ff0000">/g, "").replace(/<\/font><\/strong>/g, ""),
                view: +x[3],
            };
        })
        .sort((a, b) => b.view - a.view);
    return result;
}

export { search };
