# 問題 02: GitHub Actions で `npm ci` がエラーになる

## 概要

`feature/transition` ブランチにプッシュした際、GitHub Actions の CI で `npm ci` コマンドが失敗し、複数回にわたってエラーが発生した。エラー内容が段階的に変化し、最終的に `node_modules` と `package-lock.json` の両方に不整合があることが判明した。

---

## 問題発生までの経緯

### タイムライン

#### 2025-12-08 22:07 (JST)
**コミット: `1be7a41` - "fix:docs"**
- `feature/actions` ブランチで作業中
- この時点では `react-router-dom` は未導入
- `package.json` の dependencies:
  ```json
  {
    "react": "^19.1.1",
    "react-dom": "^19.1.1"
  }
  ```

#### 2025-12-09 13:53 (JST)
**コミット: `179dfb4` - "画面遷移する機能を付与"**

このコミットで画面遷移機能を実装するため、複数のファイルを変更：
- `src/App.jsx`: React Router の実装を追加
- `src/pages/Top.jsx`: タイマーで `/home` に遷移する処理を追加
- `src/pages/Home.jsx`: 新規作成（遷移先のページ）
- `package.json`: **`react-router-dom@^7.10.1` を手動で追加**
- `package-lock.json`: **579行削除、730行追加（計1309行の大幅な変更）**

**問題の種が撒かれた瞬間：**
```diff
   "dependencies": {
     "react": "^19.1.1",
-    "react-dom": "^19.1.1"
+    "react-dom": "^19.1.1",
+    "react-router-dom": "^7.10.1"
   },
```

このとき、以下のいずれかの操作を行った可能性が高い：
1. `package.json` を直接編集してから `npm install` を実行
2. すでに `node_modules` が不整合な状態だった
3. 異なる npm バージョンまたは環境で `npm install` を実行

**証拠：**
- `package-lock.json` の差分が異常に大きい（通常、1パッケージ追加で数百行も変わらない）
- この時点で既に依存関係ツリーに問題が発生していた可能性が高い

#### 2025-12-09 14:17〜14:26 (JST)
プッシュ後、GitHub Actions で CI が実行され、連続してエラーが発生
→ 以下「発生したエラーの経緯」で詳述

---

## 発生したエラーの経緯

### 第1回エラー: 2025-12-09 05:17 (JST 14:17)

#### エラー内容
```
npm error `npm ci` can only install packages when your package.json and package-lock.json are in sync.
npm error Missing: @esbuild/aix-ppc64@0.25.11 from lock file
npm error Missing: @esbuild/android-arm@0.25.11 from lock file
... (計25個のesbuild/rollupパッケージがmissing)
npm error Missing: fsevents@2.3.3 from lock file
```

#### 原因分析
- `package-lock.json` が古い形式または不完全な状態だった
- esbuild や rollup などのビルドツールには、プラットフォーム固有のオプショナルバイナリパッケージ（`@esbuild/linux-x64` など）が多数含まれる
- これらのパッケージが `package-lock.json` に正しく記録されていなかった
- `fsevents` は macOS 専用パッケージだが、ロックファイルに不整合な形で含まれていた

#### 初回対応
```bash
# package-lock.json を完全削除して再生成
rm -f package-lock.json
npm install
git commit -m "fix: regenerate package-lock.json for CI compatibility"
git push
```

結果: 752行の差分が発生し、依存関係ツリーが大幅に変更された

---

### 第2回エラー: 2025-12-09 05:23 (JST 14:23)

#### エラー内容
```
npm error `npm ci` can only install packages when your package.json and package-lock.json are in sync.
npm error Missing: es-abstract@1.24.0 from lock file
npm error Missing: es-abstract@1.24.0 from lock file
npm error Missing: es-abstract@1.24.0 from lock file
```

#### 原因分析
エラーが変化したことから、第1回の対応は部分的に成功したが、新たな問題が判明：

1. **ローカル環境の node_modules が壊れていた**
   ```bash
   npm ls es-abstract
   # 結果: es-abstract@ invalid: "^1.23.5" from node_modules/...
   ```
   - `es-abstract@1.24.0` がインストールされているのに、一部の依存パッケージが `^1.23.5` を要求
   - バージョンの不整合により、依存関係ツリーが破損していた

2. **破損した node_modules から package-lock.json を生成していた**
   - 第1回対応時、`node_modules` が不整合な状態で `npm install` を実行
   - そのため、生成された `package-lock.json` も不完全だった

#### 根本原因
`es-abstract` は ESLint 関連パッケージ（`eslint-plugin-react` など）の共通依存パッケージで、多くのパッケージから参照される。npm の依存関係解決アルゴリズムが、壊れた `node_modules` の状態を元に誤った解決をしてしまった。

---

## 最終的な解決方法

### 実施した手順

```bash
# 1. node_modules を完全削除
rm -rf node_modules

# 2. クリーンな状態から再インストール
npm install

# 3. 依存関係の整合性を確認
npm ls es-abstract
# 結果: すべて es-abstract@1.24.0 で統一され、エラーなし

# 4. npm ci でテスト（CIと同じコマンドで検証）
rm -rf node_modules
npm ci
# 結果: 成功

# 5. コミット＆プッシュ
git add package-lock.json
git commit -m "fix: resolve es-abstract dependency conflicts"
git push
```

### 変更内容
- `package-lock.json`: 207行追加、3行削除
- パッケージ数: 271 → 282 (11個追加)
- 主な変更: `es-abstract` とその依存パッケージの整合性が回復

---

## 技術的な詳細

### npm ci とは
- `package-lock.json` に記載された**完全一致の依存関係**をクリーンインストールするコマンド
- `node_modules` を削除してからインストールするため、環境の再現性が高い
- CI/CD での使用が推奨される

### npm install との違い
| コマンド | package.json | package-lock.json | node_modules | 用途 |
|---------|-------------|------------------|--------------|------|
| `npm install` | 読み取り | 更新する | 既存を維持/更新 | 開発環境 |
| `npm ci` | 読み取り | 読み取り専用 | 削除して再作成 | CI/CD |

### なぜローカルでは成功しCIで失敗したのか
1. ローカルでは既存の `node_modules` を使い続けることができた（不整合があっても動作する場合がある）
2. CI では毎回クリーンな状態から `npm ci` を実行するため、`package-lock.json` の不整合が厳密にチェックされた
3. ローカルの `node_modules` が壊れていても、それを基に生成した `package-lock.json` は形式的に正しく見えるため、問題に気づきにくかった

---

## 根本原因のまとめ

### 時系列での因果関係

```
2025-12-09 13:53 (コミット 179dfb4)
  ↓
  package.json に react-router-dom を追加
  ↓
  【問題発生ポイント】
  何らかの理由で node_modules が不整合な状態で npm install を実行
  または、package.json を直接編集後に不適切な方法で依存関係を解決
  ↓
  package-lock.json に異常な変更が記録される（730行削除、151行追加）
  ↓
  この時点で依存関係ツリーが破損
  ↓
  Git にコミット＆プッシュ
  ↓
2025-12-09 14:17 (第1回CI実行)
  ↓
  GitHub Actions で npm ci を実行
  ↓
  【第1回エラー】esbuild/rollup のプラットフォーム固有パッケージが missing
  ↓
  対応: package-lock.json のみを削除して再生成
  ↓
  しかし node_modules の破損は残ったまま
  ↓
  不完全な package-lock.json が生成される
  ↓
2025-12-09 14:23 (第2回CI実行)
  ↓
  【第2回エラー】es-abstract の依存関係が不整合
  ↓
  対応: node_modules を完全削除してクリーンインストール
  ↓
2025-12-09 14:26
  ↓
  ✅ 解決
```

### 3つの問題レイヤー

1. **初期状態（コミット 179dfb4）**:
   - 何らかの理由で `node_modules` が破損（依存関係のバージョン競合）
   - または、`package.json` を直接編集後に適切な手順を踏まなかった

2. **第1回エラー**:
   - 破損した状態で `package-lock.json` を生成したため、不完全なロックファイルができた
   - esbuild/rollup のプラットフォーム固有パッケージが正しく記録されなかった

3. **第2回エラー**:
   - 不完全な `package-lock.json` を修正したが、`node_modules` の破損は残っていたため、再度不整合が発生
   - `es-abstract` のバージョン競合が顕在化

4. **解決**:
   - `node_modules` を完全削除してクリーンな状態から再構築
   - 正常な依存関係ツリーで `package-lock.json` を生成

### なぜ最初のコミット（179dfb4）で問題が起きたのか？

**推測される原因：**

1. **package.json の直接編集**
   ```bash
   # やってはいけない手順
   # 1. エディタで package.json を編集
   # 2. npm install を実行

   # 正しい手順
   npm install react-router-dom
   ```

2. **node_modules の事前破損**
   - 過去の作業で `node_modules` が既に不整合な状態だった
   - その状態で新しいパッケージを追加したため、問題が悪化

3. **異なる環境での操作**
   - WSL（Ubuntu）と Windows など、異なる環境で `npm install` を実行した可能性
   - ファイルシステムの違いにより、依存関係の解決が不安定になった

**証拠：**
- 通常、1つのパッケージ追加で `package-lock.json` が730行も削除されることはない
- `react-router-dom` とその直接依存パッケージは10個程度のはずが、依存関係ツリー全体が再構築された形跡がある

---

## 予防策

### 1. 依存関係の追加・変更は npm コマンド経由で行う
```bash
# 良い例
npm install <package-name>
npm uninstall <package-name>

# 悪い例
# package.json を直接編集してから npm install
```

### 2. トラブル時の標準手順
```bash
# ステップ1: node_modules と package-lock.json を削除
rm -rf node_modules package-lock.json

# ステップ2: クリーンインストール
npm install

# ステップ3: npm ci でテスト
rm -rf node_modules
npm ci
```

### 3. PR作成前のチェック
```bash
# CI環境と同じコマンドでテスト
rm -rf node_modules
npm ci
npm run build
npm run lint
```

### 4. package-lock.json は必ず Git 管理
- `.gitignore` に `package-lock.json` を含めない
- チーム全体で同じ依存関係を使用するため

---

## 学んだこと

1. **`npm ci` エラーは `package-lock.json` だけの問題とは限らない**
   - ローカルの `node_modules` が破損している可能性も考慮する
   - エラーメッセージに表示されるパッケージ名は「症状」であり、「原因」ではない

2. **エラーメッセージの変化に注目**
   - 第1回と第2回でエラー内容が変わったことは、部分的な進展を示していた
   - 段階的に問題を切り分けることが重要
   - `@esbuild/*` → `es-abstract` と変化したことで、問題の層が深まっていることが分かった

3. **クリーンな状態からの再構築が確実**
   - 中途半端な修正よりも、完全削除→再インストールの方が確実
   - 特に依存関係の問題は複雑に絡み合うため、リセットが効果的

4. **ローカルとCIの差異**
   - ローカルで動いていても CI で失敗する場合、環境の再現性に問題がある
   - `npm ci` でテストすることで、CI環境をローカルで再現できる
   - CI は「厳格な審査員」として機能し、ローカルでは見逃される問題を検出する

5. **package.json の編集方法が重要**
   - 直接編集ではなく、`npm install <package>` を使うべき
   - コミット前に `npm ls` でエラーがないか確認する習慣が大切
   - 大きな差分が出たら一度立ち止まって原因を考える

6. **package-lock.json の差分サイズに注意**
   - 1パッケージ追加で数百行の削除が発生 → 異常な状態
   - 正常なら、追加するパッケージとその直接依存のみが増える（通常50〜150行程度）

7. **複数ブランチでの依存関係管理**
   - `feature/actions` と `feature/transition` で `package.json` が異なる状態だった
   - ブランチごとに CI が実行されるため、どちらのブランチも健全に保つ必要がある
   - 依存関係の変更はマージ前に他のブランチにも反映する必要がある

---

## 今後の改善アクション

### 1. 依存関係追加の標準手順を確立

```bash
# ❌ 避けるべき手順
# 1. package.json をエディタで直接編集
# 2. npm install

# ✅ 推奨される手順
# 1. npm コマンドで追加
npm install react-router-dom

# 2. 依存関係ツリーをチェック
npm ls

# 3. npm ci でテスト
rm -rf node_modules
npm ci

# 4. 動作確認
npm run dev
npm run build

# 5. コミット
git add package.json package-lock.json
git commit -m "feat: add react-router-dom for page navigation"
```

### 2. CI エラー発生時のデバッグフロー

```bash
# ステップ1: ローカルで再現
rm -rf node_modules
npm ci
# エラーが出るか確認

# ステップ2: 依存関係の健全性チェック
npm ls
# invalid や missing がないか確認

# ステップ3: クリーンインストール
rm -rf node_modules package-lock.json
npm install

# ステップ4: 再度テスト
rm -rf node_modules
npm ci

# ステップ5: コミット
git add package-lock.json
git commit -m "fix: resolve dependency conflicts"
```

### 3. プロジェクトに追加すべきドキュメント

`README.md` や `CONTRIBUTING.md` に以下を追加：

```markdown
## 依存関係の追加方法

新しいパッケージを追加する場合：

1. npm コマンドを使用してインストール
   \`\`\`bash
   npm install <package-name>
   \`\`\`

2. 依存関係に問題がないか確認
   \`\`\`bash
   npm ls
   \`\`\`

3. CI と同じ環境でテスト
   \`\`\`bash
   rm -rf node_modules && npm ci
   \`\`\`

4. package.json と package-lock.json の両方をコミット

## トラブルシューティング

CI で npm ci エラーが出た場合：

\`\`\`bash
rm -rf node_modules package-lock.json
npm install
rm -rf node_modules
npm ci
\`\`\`
```

---

## 発生日時
2025年12月9日 14:17〜14:26 (JST)

## ステータス
✅ **解決済み** (2025-12-09 14:26)

最終コミット: `b6b83bd` - "fix: resolve es-abstract dependency conflicts"
