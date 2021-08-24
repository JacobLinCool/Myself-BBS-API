import { getAiringList, getCompletedList } from "./list";

async function search(query) {
    const list = [...(await getAiringList()).data, ...(await getCompletedList()).data];
    const results = list
        .filter((anime) => {
            return anime.title.toLowerCase().indexOf(query.toLowerCase()) !== -1;
        })
        .sort((a, b) => b.watch / b.ep - a.watch / a.ep);
    return results;
}

export { search };
