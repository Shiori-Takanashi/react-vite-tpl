# 2重ラップ（Double Wrap）の問題点【実装例と解析】

## 🔴 概要

React でレイアウトコンポーネントを複数回ネストさせることを「2重ラップ」と呼びます。このドキュメントでは、なぜ2重ラップがアンチパターンなのかを詳しく解説します。

ライブ例：http://localhost:5173/demo にアクセスして、開発者ツール（F12）で DOM 構造を確認してください。

---

## 📋 2重ラップの実装例

### ❌ 悪い例（2重ラップ）

```jsx
// src/layouts/DemoLayout.jsx
import PageLayout from "./PageLayout";

export default function DemoLayout({ children }) {
  return <PageLayout title="Demo - Double Wrap Example">{children}</PageLayout>;
}
```

```jsx
// src/pages/Demo.jsx
import DemoLayout from "../layouts/DemoLayout";

export default function Demo() {
  return (
    <DemoLayout>
      <p>このページは2重ラップされています</p>
    </DemoLayout>
  );
}
```

```jsx
// src/router/Routes.jsx
{
  element: ((<PageLayout />),
    {
      /* ← 1番目のラップ */
    });
  children: [
    { path: "/demo", element: <Demo /> },
    {
      /* ← Demo は DemoLayout（2番目のラップ）を通す */
    },
  ];
}
```

---

## 🔍 実際の DOM 構造

```
PageLayout (Routes.jsx の element)
  ├─ Tracker ※1回目
  ├─ div.main-page
  │  ├─ Header ※1回目
  │  ├─ main
  │  │  ├─ h1 "undefined"  ← ⚠️ title が渡されない！
  │  │  ├─ Outlet
  │  │  │  └─ Demo
  │  │  │    └─ DemoLayout
  │  │  │      └─ PageLayout ※2番目のラップ ❌
  │  │  │        ├─ Tracker ※2回目
  │  │  │        ├─ div.main-page
  │  │  │        │  ├─ Header ※2回目
  │  │  │        │  ├─ main
  │  │  │        │  │  ├─ h1 "Demo - Double Wrap Example"
  │  │  │        │  │  ├─ Outlet (空)
  │  │  │        │  │  └─ History
  │  │  │        │  └─ History
  │  │  │        └─ History ※2回目
  │  │  └─ History ※1回目
```

---

## ❌ 2重ラップによる問題

### 1️⃣ **Tracker の重複実行**

```jsx
// Tracker.jsx の useEffect
useEffect(() => {
  addHistory(location.pathname);
  {
    /* ← 同じパスが2回記録される！ */
  }
}, [addHistory, location.pathname]);
```

**結果：** `/demo` にアクセスすると、履歴に `/demo` が2回記録される

### 2️⃣ **UI の重複表示**

- Header が2回表示される
- History が2回表示される
- CSS クラスが干渉する可能性がある

**実際の見た目：**

```
┌─ Header (1回目) ─────────────┐
│ ナビゲーションバー            │
├─────────────────────────────┤
│ h1 "undefined"              │  ← title が渡されず
├─────────────────────────────┤
│ 画像またはコンテンツ          │
├─ Header (2回目) ─────────────┤  ← 重複！
│ ナビゲーションバー(重複)      │
├─────────────────────────────┤
│ h1 "Demo - Double Wrap..."  │
├─────────────────────────────┤
│ 検索履歴 (1回目)             │
├─ 検索履歴 (2回目) ────────────┤  ← 重複！
└─────────────────────────────┘
```

### 3️⃣ **パフォーマンス低下**

- 不要な DOM ノードが増加
- 不要な JS 実行（useEffect が複数回）
- Re-render のコストが増加

### 4️⃣ **Context や Hooks の共有問題**

```jsx
// HistoryContext を使っている場合
const { addHistory } = useHistory(); // ← どちらの Tracker が記録？
```

2つの Tracker が同じ Context を共有していると、予測不可能な動作が起こる

### 5️⃣ **デバッグの困難さ**

- どちらのコンポーネントが動いているのか不明確
- エラーメッセージが重複する
- パフォーマンスプロファイルが複雑になる

---

## ✅ 正しい設計パターン

### **パターン1：Outlet のみで統一（推奨）**

```jsx
// Routes.jsx
{
  element: <PageLayout />,
  children: [
    { path: "/demo", element: <Demo /> },  {/* ← DemoLayout は使わない */}
  ]
}
```

```jsx
// Demo.jsx（シンプル）
export default function Demo() {
  return (
    <div>
      <p>このページは1回のラップのみ</p>
    </div>
  );
}
```

**結果の DOM：**

```
PageLayout（1回のみ）
  ├─ Tracker （1回）
  ├─ Header （1回）
  ├─ Outlet
  │  └─ Demo
  │    └─ <p>...</p>
  └─ History （1回）
```

---

### **パターン2：特殊なレイアウトが必要な場合**

特殊なレイアウトが必要な場合は、**PageLayout を使わない独立したレイアウト** を作成：

```jsx
// src/layouts/SpecialLayout.jsx
import Tracker from "../components/Tracker";

export default function SpecialLayout({ children, title }) {
  return (
    <>
      <Tracker />
      <div className="special-page">
        {" "}
        {/* 異なるスタイル */}
        <h1>{title}</h1>
        {children}
      </div>
    </>
  );
}
```

```jsx
// Routes.jsx
{
  element: <SpecialLayout />,
  children: [
    { path: "/special", element: <SpecialPage /> },
  ]
}
```

**ポイント：** PageLayout を再利用せず、独立したコンポーネントを作成する

---

## 🎯 まとめ

| パターン                 | 構造                                                  | 推奨度        | 理由                         |
| ------------------------ | ----------------------------------------------------- | ------------- | ---------------------------- |
| **2重ラップ**            | PageLayout → PageLayout → コンテンツ                  | ❌ 推奨しない | 重複が発生、バグの原因       |
| **単一ラップ**           | PageLayout → コンテンツ                               | ⭐⭐⭐        | シンプル、効率的             |
| **複数の独立レイアウト** | SpecialLayout → コンテンツ<br>PageLayout → コンテンツ | ⭐⭐          | 異なるレイアウトが必要な場合 |

---

## 🔗 関連資料

- [Outlet の使い方](page01.md)
- [React Router の構造設計](page02.md)
