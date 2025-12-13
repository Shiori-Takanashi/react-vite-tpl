# なぜ animal 画像と page-title が表示されないのか？【基礎から完全解説】

## 🔴 現在の問題：2つのバグがあります

---

## 📌 問題1：`Children` が大文字になっている（致命的）

### コード

```jsx
// PageLayout.jsx の line 6
export default function PageLayout({ title, Children }) {
  // ❌ Children は大文字
  return (
    <>
      <Tracker />
      <div className="main-page">
        <Header />
        <main>
          <h1 className="page-title">{title}</h1>
          {Children} {/* ❌ Children が大文字 */}
          <History />
        </main>
      </div>
    </>
  );
}
```

### 何が起きているか？

#### 【基礎】JavaScript のオブジェクト分割代入

```javascript
// こういう感じで props を受け取ります
function MyComponent({ title, children }) {
  console.log(title); // "Loading..." ← 受け取れる
  console.log(children); // <img ... /> ← 受け取れる
}
```

**重要：`children` は小文字が約束！** React では `children` は特別な予約語で、小文字で統一されています。

#### PageLayout が受け取るもの

```jsx
// Loading.jsx から
<PageLayout title="Loading">
  <img src={animal} alt="ANIMAL IMG" />
</PageLayout>
```

これは以下と等価です：

```jsx
<PageLayout title="Loading" children={<img src={animal} alt="ANIMAL IMG" />} />
```

#### 現在の PageLayout

```jsx
export default function PageLayout({ title, Children }) {  // ❌ Children で受け取ろうとしている
```

**JavaScript では大文字小文字は区別されます！**

```javascript
const obj = { children: "小文字" };
console.log(obj.children); // ✅ "小文字" が出力される
console.log(obj.Children); // ❌ undefined が出力される
```

### 結果

- Loading が渡した `children` は受け取られない
- `Children` という変数は undefined になる
- `{Children}` は何も表示されない → **画像が消える**

---

## 📌 問題2：`title` は表示されているはずだが...

### 疑問

```jsx
<h1 className="page-title">{title}</h1>
```

`title` は小文字だから受け取られるはず... では？

実は **Loading.jsx の title がない場合もある**：

```jsx
// もし以前このように書いていたら
<PageLayout>
  {" "}
  {/* ← title を渡していない */}
  <img src={animal} alt="ANIMAL IMG" />
</PageLayout>
```

この場合 `title` は `undefined` になり、以下のように表示されます：

```jsx
<h1 className="page-title">undefined</h1>  {/* 画面に "undefined" と表示 */}
```

---

## 🔧 修正方法

### PageLayout.jsx を修正

```jsx
// ✅ 正しい書き方
export default function PageLayout({ title, children }) {
  // children は小文字！
  return (
    <>
      <Tracker />
      <div className="main-page">
        <Header />
        <main>
          <h1 className="page-title">{title}</h1>
          {children} {/* ✅ children は小文字 */}
          <History />
        </main>
      </div>
    </>
  );
}
```

### Loading.jsx は修正不要（既に正しい）

```jsx
return (
  <PageLayout title="Loading">
    <img src={animal} alt="ANIMAL IMG" />
  </PageLayout>
);
```

---

## 📚 【基礎知識】React の Props と children

### Props の基本構造

```jsx
// 親が子に データを渡す
<ChildComponent
  name="Taro"           {/* ← props */}
  age={25}              {/* ← props */}
>
  <p>これは children</p>  {/* ← 特別な props */}
</ChildComponent>

// 子が受け取る
function ChildComponent({ name, age, children }) {
  return (
    <>
      <p>名前: {name}</p>
      <p>年齢: {age}</p>
      <div>{children}</div>
    </>
  );
}
```

### children とは？

```jsx
// JSX のタグの間に入ったもの = children
<PageLayout title="Loading">
  <img src={animal} alt="..." /> {/* ← これが children */}
</PageLayout>
```

以下と完全に同じ意味：

```jsx
<PageLayout title="Loading" children={<img src={animal} alt="..." />} />
```

---

## 🎯 まとめ

| 項目                             | 原因                                   | 結果                                 |
| -------------------------------- | -------------------------------------- | ------------------------------------ |
| **画像が表示されない**           | `Children` が大文字 → undefined になる | `{undefined}` は何も表示されない     |
| **title が表示されない（かも）** | title が渡されていない場合             | `{undefined}` が表示されるか、欠ける |

**修正：`Children` → `children` に変更するだけ！**

---

## 🧪 検証コード

修正後、ブラウザの F12 開発者ツールで確認：

```javascript
// Console で以下を実行
console.log(document.querySelector(".page-title").innerText);
// → "Loading" と表示されるはず

console.log(document.querySelector('img[alt="ANIMAL IMG"]'));
// → <img src="..." /> と表示されるはず
```

表示されれば成功です！
