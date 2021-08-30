import Fuse from "fuse.js";
import { getAiringList, getCompletedList } from "./list";

async function search(query) {
    const list = [...(await getAiringList()).data, ...(await getCompletedList()).data];

    const options = {
        includeScore: true,
        keys: ["title"],
    };

    const fuse = new Fuse(list, options);

    const result = fuse.search(query);
    return result.map((x) => x.item);
}

export { search };
