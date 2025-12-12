# 修正内容: Tracker.jsx のエクスポート形式

## 問題

App.jsx を修正後、`npm run dev` で何も表示されなかった。

## 原因

**src/components/Tracker.jsx** でのエクスポート形式と、**src/layouts/MainLayout.jsx** での import 形式が一致していなかった。

### 詳細

- **Tracker.jsx**: `export function Tracker()` （名前付きエクスポート）
- **MainLayout.jsx**: `import Tracker from "../components/Tracker"` （default import）

この不一致により、Tracker コンポーネントが正しく読み込まれず、アプリケーションが表示されない状態になっていた。

## 修正内容

**src/components/Tracker.jsx** の 5 行目を変更：

```diff
- export function Tracker() {
+ export default function Tracker() {
```

## 修正の理由

MainLayout.jsx で default import として使用しているため、Tracker.jsx でも **default export** に統一する必要があった。このことで、コンポーネントが正しくインポートされ、アプリケーションが正常に表示されるようになった。

## 修正後の動作

- `npm run dev` で正常にアプリケーションが表示される
- Tracker コンポーネントが MainLayout に正しく組み込まれた
