# Myself-BBS API
 myself-bbs.com JSON API

# Endpoints
```bash
https://myself-bbs.jacob.workers.dev/
```

## List
### 連載列表
```bash
https://myself-bbs.jacob.workers.dev/list/airing
```

### 完結列表
```bash
https://myself-bbs.jacob.workers.dev/list/completed
```

Response Example
```javascript
{
  "data": {
    "meta": {
      "time": 1630391759999, // 快取時間
      "length": 1753 // 物件數量
    },
    "data": [
      {
        "id": 12345, // 站內 ID
        "title": "TITLE", // 作品名稱
        "link": "myself-bbs.com link url", // 站內連結
        "ep": 12, // 集數
        "image": "half cover image url", // 上半封面連結
        "watch": 148111 // 觀看數
      },
      ...
    ]
}
```

## Anime
### 特定動畫資訊
```bash
https://myself-bbs.jacob.workers.dev/anime/${id}
```
Response Example
```javascript
{
  "data": {
    "id": 12345,
    "title": "TITLE",
    "category": [
      "科幻",
      "冒險"
    ],
    "premiere": [
      2010,
      6,
      12
    ],
    "ep": 1,
    "author": "Author",
    "website": "website link",
    "description": "Description",
    "image": "cover image url",
    "episodes": {
      "第 01 話": [
        "12345",
        "001"
      ]
    }
  }
}
```


### 全部動畫資訊
```bash
https://myself-bbs.jacob.workers.dev/anime/all
```

## Search
```bash
https://myself-bbs.jacob.workers.dev/search/${query}
```


## M3U8
```bash
https://myself-bbs.jacob.workers.dev/m3u8/${id}/${ep}
```

# Optional Query String
minify output json:
```
?min=1
```