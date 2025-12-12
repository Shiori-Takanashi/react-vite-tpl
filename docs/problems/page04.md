# 問題 04: プロジェクト構成の問題点と改善点

## 現在のプロジェクト構成の問題点

### 1. Context の命名と役割の不一致

**問題点:**
- `HistoryContext` と `HistoryProvider` が分離されているが、両方とも同じ機能を提供している
- ファイルが2つに分かれているため、メンテナンスが煩雑

**現状:**
```
src/contexts/
  ├── HistoryContext.jsx    # createContextのみ
  └── HistoryProvider.jsx   # Provider実装
```

**改善案:**
- 1つのファイルに統合する（例: `HistoryContext.jsx` にProviderも含める）
- または、より明確な命名規則を採用（例: `history/context.js` と `history/provider.js`）

### 2. Hooks の配置

**問題点:**
- `useHistory` フックが独立したファイルになっているが、単に `useContext` をラップしているだけ
- 実質的な付加価値がない薄いラッパー

**現状:**
```javascript
// src/hooks/useHistory.js
export function useHistory() {
  return useContext(HistoryContext);
}
```

**改善案:**
- `HistoryContext.jsx` 内で export する
- または、フックに追加機能を持たせる（履歴のクリア、特定履歴の削除など）

### 3. Router の構成

**問題点:**
- `Layout` コンポーネントが `Routes.jsx` 内で定義されている
- ルート定義とレイアウトロジックが混在している

**現状:**
```jsx
// src/router/Routes.jsx
function Layout() {
  return (
    <>
      <Tracker />
      <Outlet />
    </>
  );
}
```

**改善案:**
- `Layout` を別ファイルに分離（例: `src/layouts/MainLayout.jsx`）
- ルート定義をよりクリーンに保つ

### 4. Styles の管理方法

**問題点:**
- `base-pages.css` にページ固有のスタイルとベーススタイルが混在
- CSS ファイルが各コンポーネントで個別にインポートされている
- グローバルリセット (`global-reset.css`) の配置が不明確

**現状:**
```
src/styles/
  ├── base-pages.css      # ページベーススタイル
  ├── global-reset.css    # グローバルリセット
  ├── header.css          # コンポーネント固有
  ├── history.css         # コンポーネント固有
  └── loading.css         # ページ固有
```

**改善案:**
```
src/styles/
  ├── global.css          # グローバルスタイル・リセット
  ├── components/
  │   ├── header.css
  │   └── history.css
  └── pages/
      ├── base.css        # 共通ページスタイル
      └── loading.css
```

### 5. ページコンポーネントの重複コード

**問題点:**
- Home, About, News, Culture ページで同じ構造が繰り返されている
- `main-page` クラスと各テーマクラスが不要（現在は全て同じ背景色）

**現状:**
```jsx
// 各ページで同じパターン
<div className="main-page home-theme">
  <Header />
  <main>
    <h1 className="page-title">home</h1>
    <History />
  </main>
</div>
```

**改善案:**
- 共通の `PageLayout` コンポーネントを作成
- テーマクラス（home-theme等）を削除し、シンプル化

```jsx
// src/layouts/PageLayout.jsx
export function PageLayout({ title, children }) {
  return (
    <div className="main-page">
      <Header />
      <main>
        <h1 className="page-title">{title}</h1>
        {children}
      </main>
    </div>
  );
}

// src/pages/Home.jsx
export default function Home() {
  return (
    <PageLayout title="home">
      <History />
    </PageLayout>
  );
}
```

### 6. Tracker の配置

**問題点:**
- `Tracker` が `router/` ディレクトリに配置されているが、実際にはルーティングロジックではなくコンテキストの副作用処理
- 役割と配置が一致していない

**改善案:**
- `src/components/Tracker.jsx` に移動
- または `src/contexts/history/Tracker.jsx` に配置

### 7. インポートパスの一貫性

**問題点:**
- 相対インポートが多用されている（`../../../`）
- プロジェクトが大きくなると管理が困難

**改善案:**
- エイリアスを設定する（`vite.config.js`）

```javascript
// vite.config.js
export default {
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@contexts': '/src/contexts',
      '@hooks': '/src/hooks',
      '@pages': '/src/pages',
      '@styles': '/src/styles',
    }
  }
}
```

使用例:
```javascript
import Header from '@components/Header';
import { useHistory } from '@hooks/useHistory';
```

## 推奨される改善後の構成

```
src/
  ├── App.jsx
  ├── main.jsx
  ├── components/
  │   ├── Header.jsx
  │   ├── History.jsx
  │   └── Tracker.jsx          # 移動
  ├── contexts/
  │   └── HistoryContext.jsx   # Provider + hooks も含む
  ├── layouts/
  │   ├── MainLayout.jsx       # Routes用
  │   └── PageLayout.jsx       # ページ共通レイアウト
  ├── pages/
  │   ├── About.jsx
  │   ├── Culture.jsx
  │   ├── Home.jsx
  │   ├── Loading.jsx
  │   └── News.jsx
  ├── router/
  │   └── Routes.jsx
  └── styles/
      ├── global.css
      ├── components/
      │   ├── header.css
      │   └── history.css
      └── pages/
          ├── base.css
          └── loading.css
```

## 優先度別改善リスト

### 高優先度（すぐに実施可能）
1. テーマクラス（home-theme等）の削除
2. `PageLayout` コンポーネントの作成
3. Context関連ファイルの統合

### 中優先度（リファクタリング）
4. Trackerの配置変更
5. Layoutコンポーネントの分離
6. スタイルディレクトリの整理

### 低優先度（プロジェクト成長時）
7. インポートエイリアスの設定
8. より高度な状態管理（必要に応じて）

## まとめ

現在のプロジェクトは機能的には正常に動作していますが、構成の一貫性とメンテナンス性に改善の余地があります。特に、重複コードの削減とファイル配置の論理的整理を優先的に行うことで、より保守しやすいコードベースになります。
