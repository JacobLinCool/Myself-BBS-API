import { search } from "../src/search.js";

describe("搜尋測試", () => {
    test("無搜尋內容", async () => {
        const result = await search();
        expect(result).toEqual([]);
    });
    test("搜尋「關於我轉生變成史萊姆這檔事」", async () => {
        const result = await search("關於我轉生變成史萊姆這檔事");
        expect(result.length).toBe(2);
    });
    test("搜尋「ABCABCCBACBA」", async () => {
        const result = await search("ABCABCCBACBA");
        expect(result).toEqual([]);
    });
});
