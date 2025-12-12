# プロジェクト仕組み概要

## プロジェクト構造

このプロジェクトは React + Vite + React Router で構成されたシングルページアプリケーション（SPA）です。

## アーキテクチャ

### 1. ルーティング層 (router/Routes.jsx)

- **React Router v7** を使用してルーティングを管理
- メインレイアウトは `MainLayout` コンポーネント
- 5つのページルートを定義：
  - `/` → Loading ページ
  - `/home` → Home ページ
  - `/about` → About ページ
  - `/news` → News ページ
  - `/culture` → Culture ページ

### 2. レイアウト層

#### MainLayout（src/layouts/MainLayout.jsx）

```
MainLayout
├── Tracker（URL変更を監視）
└── Outlet（各ページを表示）
```

#### PageLayout（src/layouts/PageLayout.jsx）

```
PageLayout
├── Header（ヘッダー）
├── main
│   ├── h1（ページタイトル）
│   └── History（履歴表示）
```

### 3. コンポーネント層

#### Tracker (src/components/Tracker.jsx)

- **役割**: URL変更を監視して履歴に記録
- **使用フック**:
  - `useLocation()` - 現在のパスを取得
  - `useHistory()` - HistoryContextを通じて履歴を追加
- **動作**: ページ遷移時に `addHistory()` を呼び出し、パスを保存

#### Header (src/components/Header.jsx)

- ページのヘッダーを表示

#### History (src/components/History.jsx)

- 訪問履歴を表示

### 4. 状態管理層 (contexts/HistoryContext.jsx)

- **useHistory フック**を提供
- `addHistory()` メソッドで訪問パスを記録
- `Tracker` と `History` コンポーネント間でデータを共有

### 5. ページ層 (pages/)

- `Home.jsx` - PageLayout をラップして表示
- `About.jsx` - PageLayout をラップして表示
- `News.jsx` - PageLayout をラップして表示
- `Culture.jsx` - PageLayout をラップして表示
- `Loading.jsx` - 初期ロードページ

## データフロー

```
ユーザー操作
    ↓
React Router が URL を変更
    ↓
MainLayout に含まれる Tracker が useLocation で変更を検知
    ↓
HistoryContext の addHistory() を呼び出す
    ↓
各ページ内の History コンポーネントが履歴を表示
```

## スタイリング

### CSS 構成

- `src/styles/global-reset.css` - グローバルリセット
- `src/styles/components/` - コンポーネント別スタイル
  - `header.css`
  - `history.css`
- `src/styles/pages/` - ページ別スタイル
  - `base.css`
  - `loading.css`

## 主な技術スタック

| 技術           | 用途                     |
| -------------- | ------------------------ |
| React 19       | UI フレームワーク        |
| Vite 7         | ビルドツール             |
| React Router 7 | ルーティング             |
| ESLint         | コード品質管理           |
| Prettier       | コードフォーマッティング |

## 初期化の流れ

1. **main.jsx** → App.jsx をレンダリング
2. **App.jsx** → RouterProvider でアプリケーションをラップ
3. **Routes** → MainLayout をレイアウトとして使用
4. **MainLayout** → Tracker コンポーネントを常に実行し、各ページを Outlet に表示
5. **各ページ** → PageLayout をラップして、ヘッダーと履歴表示を統一
