# npm run dev が失敗する原因調査

- 再現手順: `npm run dev -- --clearScreen false --host 127.0.0.1 --port 5173` を起動し、`curl http://127.0.0.1:5173/` で初回リクエストを投げるとビルドが走りエラーが発生。
- 直近のログ抜粋:
  - `Pre-transform error: Failed to resolve import "./HistoryContext" from "src/contexts/HistoryProvider.jsx". Does the file exist?`
- 原因: `src/contexts/HistoryProvider.jsx` の2行目で存在しない `./HistoryContext` を import しており、Vite の import 解析で解決できず失敗する。さらに、`src/hooks/useHistory.js` も `HistoryContext` のエクスポートをこのファイルに期待しているが、`HistoryProvider.jsx` は `HistoryContext` をエクスポートしていないため現状のままでも解決しない。
- 対応案:
  1. `src/contexts/HistoryContext.js(x)` を作成し、`export const HistoryContext = createContext([]);` を定義して `HistoryProvider.jsx` と `useHistory.js` の import をそれに揃える。
  2. もしくは `HistoryProvider.jsx` 内で `HistoryContext` を定義・エクスポートし (`export const HistoryContext = createContext([]);`)、同ファイルを他から参照するように import を修正する。
