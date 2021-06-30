import { get_new_animes } from "../src/new.js";

describe("新番列表測試", () => {
    test("全部新番", async () => {
        const result = await get_new_animes();
        expect(result.length > 10).toBe(true);
    });
});
