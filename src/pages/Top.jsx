import '../styles/top.css';
import cat from '../assets/cat.svg';
import tiger from '../assets/tiger.svg';

export default function Top() {
    const animal = import.meta.env.DEV ? cat : tiger;

    return (
        <>
            <h1 className="loading-title">React & Vite & Vercel</h1>
            <div className="loading-container">

                {/* ロゴ */}
                <div className="logo-container">
                    <img src={animal} alt="Logo" className="logo" />
                </div>

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
