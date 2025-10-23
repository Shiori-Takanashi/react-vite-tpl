import '../styles/top.css'

export default function Top() {
    return (
        <>
            <h1 className="loading-title">React & Vite & Vercel</h1>
            <div className="loading-container">

                {/* ロゴ */}
                {/* <div className="logo-container">
                    <img src="/tiger.svg" alt="Logo" className="logo" />
                </div> */}

                <h2 className="loading-text">Loading...</h2>
                <p className="loading-description">
                    アプリケーションを読み込んでいます...<br />
                    しばらくお待ちください
                </p>

                <div className="dots-container">
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                </div>
            </div></>
    )
};
