// src/pages/Demo.jsx
import PageLayout from "../layouts/PageLayout";

export default function Demo() {
  return (
    <PageLayout title="Demo - Double Wrap Example">
      <div
        style={{
          padding: "20px",
          backgroundColor: "#ffebee",
          border: "2px solid red",
          borderRadius: "8px",
        }}
      >
        <h2 style={{ color: "#d32f2f" }}>🔴 これは2重ラップの例です</h2>
        <p>このページは PageLayout で2重にラップされています。</p>
        <p>
          DOM をブラウザの開発者ツールで確認すると、以下の構造になっています：
        </p>
        <pre
          style={{
            backgroundColor: "#f5f5f5",
            padding: "10px",
            borderRadius: "4px",
            overflowX: "auto",
          }}
        >
          {`MainLayout
  ├─ Tracker
  └─ PageLayout (1回目 - Routes で定義)
    ├─ Header (1回目)
    ├─ main
    │  ├─ h1 "undefined"
    │  ├─ Outlet
    │  │  └─ Demo
    │  │    └─ PageLayout (2回目 - 2重ラップ！)
    │  │      ├─ Header (2回目 - 重複)
    │  │      ├─ main
    │  │      │  ├─ h1 "Demo - Double Wrap Example"
    │  │      │  └─ History (2回目)
    │  └─ History (1回目)
`}
        </pre>
        <h3 style={{ color: "#d32f2f" }}>問題点：</h3>
        <ul>
          <li>Tracker が2回実行される → 履歴が重複記録</li>
          <li>Header が2回レンダリングされる</li>
          <li>History が2回表示される</li>
          <li>CSS スタイルが競合する可能性</li>
          <li>パフォーマンスが低下</li>
        </ul>
      </div>
    </PageLayout>
  );
}
