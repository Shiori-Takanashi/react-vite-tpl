# History が増えると画面の横幅が増える問題【CSS レイアウトの基礎】

## 🔴 問題の症状

訪問履歴（History コンポーネント）が増えると、画面全体の横幅が広がり、横スクロールバーが表示される。

---

## 🔍 原因の詳細解析

### 1️⃣ **History コンポーネントの構造**

```jsx
// src/components/History.jsx
export default function History() {
  const { history } = useHistory();

  return (
    <div>
      <ul>
        {history.map((path, index) => (
          <li key={index}>{path}</li>
        ))}
      </ul>
    </div>
  );
}
```

### 2️⃣ **CSS の問題**

```css
/* src/styles/components/history.css */
li {
  color: black;
  list-style: none;
}

ul {
  padding: 10px;
}
```

**問題点：**

- `<li>` に **width の制限がない**
- `<li>` に **word-wrap や overflow の設定がない**
- `<ul>` が **横並びになっていないか？**（display: flex などがあるか要確認）

---

## 📚 【基礎知識】なぜ横幅が増えるのか？

### **HTML/CSS の基本動作**

1. **デフォルトの挙動**
   - `<li>` 要素は、中のテキストが長いと **そのまま横に伸びる**
   - 親要素（`<ul>`）も子要素に合わせて横に伸びる
   - 最終的に `<body>` や `.main-page` も横に伸びる

2. **例：長いパスの場合**

```html
<ul>
  <li>/home</li>
  <li>/about</li>
  <li>
    /news/category/technology/article/very-long-url-path-that-exceeds-screen-width
  </li>
</ul>
```

最後の `<li>` が画面幅を超えると、全体が横に伸びる。

---

## 🎯 具体的な原因

### パターン1：`<li>` が横並びになっている

もし CSS のどこかで以下のような設定があると：

```css
ul {
  display: flex; /* ← 横並び */
  flex-direction: row;
}
```

履歴が増えるたびに横に並び、画面幅を超える。

### パターン2：テキストが折り返されない

```css
li {
  white-space: nowrap; /* ← 折り返し禁止 */
}
```

長いパスがそのまま1行で表示され、横幅が増える。

### パターン3：親要素の幅制限がない

```css
.main-page {
  width: 100vw; /* ← 100vw は初期値だが、子要素が広がると親も広がる */
}
```

`100vw` は「ビューポート幅」を意味するが、子要素がそれを超えると親も広がる。

---

## ✅ 解決方法

### **修正1：History の幅を制限**

```css
/* src/styles/components/history.css */
ul {
  padding: 10px;
  max-width: 100%; /* ← 親要素を超えない */
  overflow-x: auto; /* ← 横スクロールを許可 */
}

li {
  color: black;
  list-style: none;
  word-wrap: break-word; /* ← 長い単語を折り返す */
  overflow-wrap: break-word;
  max-width: 100%;
}
```

### **修正2：History コンテナに幅制限を追加**

```jsx
// src/components/History.jsx
export default function History() {
  const { history } = useHistory();

  return (
    <div className="history-container">
      {" "}
      {/* ← クラス追加 */}
      <ul>
        {history.map((path, index) => (
          <li key={index}>{path}</li>
        ))}
      </ul>
    </div>
  );
}
```

```css
/* src/styles/components/history.css */
.history-container {
  max-width: 100%;
  overflow-x: auto; /* 横スクロール */
  padding: 10px;
}

ul {
  padding: 0;
  margin: 0;
}

li {
  color: black;
  list-style: none;
  word-break: break-all; /* すべての文字で折り返し可能 */
  padding: 5px 0;
}
```

### **修正3：`.main-page` の overflow を制御**

```css
/* src/styles/pages/base.css */
.main-page {
  background-color: rgb(242, 251, 235);
  color: rgb(15, 23, 42);
  min-height: 100vh;
  width: 100vw;
  max-width: 100vw; /* ← 追加：ビューポート幅を超えない */
  overflow-x: hidden; /* ← 追加：横スクロールを隠す */
  margin: 0;
  padding: 0;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-sizing: border-box; /* ← 追加：padding を含めて幅を計算 */
}
```

---

## 📊 CSS プロパティの解説

### **width と max-width の違い**

| プロパティ         | 意味                     | 挙動                       |
| ------------------ | ------------------------ | -------------------------- |
| `width: 100vw`     | ビューポート幅と同じ     | 子要素が広がると親も広がる |
| `max-width: 100vw` | ビューポート幅を超えない | 子要素が広がっても親は固定 |

### **overflow-x の設定**

| 値                      | 意味                                        |
| ----------------------- | ------------------------------------------- |
| `visible`（デフォルト） | はみ出た部分が表示される → 画面が横に広がる |
| `hidden`                | はみ出た部分を隠す                          |
| `auto`                  | 必要に応じてスクロールバーを表示            |
| `scroll`                | 常にスクロールバーを表示                    |

### **word-wrap / word-break の違い**

| プロパティ                  | 効果                                                         |
| --------------------------- | ------------------------------------------------------------ |
| `word-wrap: break-word`     | 単語の途中で折り返す（空白があれば優先的にそこで折り返す）   |
| `word-break: break-all`     | すべての文字で折り返し可能（単語の途中でも容赦なく折り返す） |
| `overflow-wrap: break-word` | `word-wrap` の標準版                                         |

---

## 🧪 デバッグ方法

### **ブラウザ開発者ツールで確認**

1. **F12 → Elements タブ**
2. History の `<ul>` または `<li>` を選択
3. **Computed タブ** で以下を確認：
   - `width` の値は？
   - `max-width` が設定されているか？
   - `overflow-x` の値は？

4. **Styles タブ** で以下を確認：
   - どの CSS ファイルから `display: flex` などが適用されているか？
   - `white-space: nowrap` が設定されているか？

### **幅を視覚的に確認**

開発者ツールの Elements タブで要素をホバーすると、青いハイライトで実際の幅が表示されます。

---

## 🎯 まとめ

| 原因                             | 解決策                                      |
| -------------------------------- | ------------------------------------------- |
| **li の幅制限なし**              | `max-width: 100%` + `word-wrap: break-word` |
| **ul が横並び**                  | `flex-direction: column` に変更             |
| **親要素の overflow 未設定**     | `.main-page` に `overflow-x: hidden`        |
| **長いテキストが折り返されない** | `word-break: break-all`                     |

**推奨修正：**

```css
.history-container {
  max-width: 100%;
  overflow-x: auto;
}

li {
  word-break: break-all;
  max-width: 100%;
}

.main-page {
  max-width: 100vw;
  overflow-x: hidden;
  box-sizing: border-box;
}
```

これで History が増えても画面幅が固定されます！
