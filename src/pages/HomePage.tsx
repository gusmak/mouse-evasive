import { useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
    const navigate = useNavigate();
    const btnRef = useRef<HTMLButtonElement>(null);
    const btnRefPlaceholder = useRef<HTMLButtonElement>(null);
    const posRef = useRef({ x: -1, y: -1 });
    const velRef = useRef({ x: 0, y: 0 });
    const mouseRef = useRef({ x: -9999, y: -9999 });
    const mousePrevRef = useRef({ x: -9999, y: -9999 });
    const mouseVelRef = useRef({ x: 0, y: 0 });
    const rafRef = useRef<number>(0);

    // ── escape physics ───────────────────────────────────────────────────────
    const loop = useCallback(() => {
        const btn = btnRef.current;
        if (!btn) {
            rafRef.current = requestAnimationFrame(loop);
            return;
        }

        const bw = btn.offsetWidth,
            bh = btn.offsetHeight;
        const MARGIN = 28,
            THRESHOLD = 220;
        const minX = MARGIN + bw / 2,
            maxX = window.innerWidth - bw / 2 - MARGIN;
        const minY = MARGIN + bh / 2,
            maxY = window.innerHeight - bh / 2 - MARGIN;

        // init: snap to placeholder position
        if (posRef.current.x === -1) {
            const ph = document.querySelector(".btn-placeholder") as HTMLElement | null;
            if (ph) {
                const r = ph.getBoundingClientRect();
                posRef.current = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
            } else {
                posRef.current = { x: window.innerWidth / 2 + 120, y: window.innerHeight / 2 + 80 };
            }
        }

        mouseVelRef.current.x = mouseVelRef.current.x * 0.55 + (mouseRef.current.x - mousePrevRef.current.x) * 0.45;
        mouseVelRef.current.y = mouseVelRef.current.y * 0.55 + (mouseRef.current.y - mousePrevRef.current.y) * 0.45;
        mousePrevRef.current = { ...mouseRef.current };

        const predMX = mouseRef.current.x + mouseVelRef.current.x * 5;
        const predMY = mouseRef.current.y + mouseVelRef.current.y * 5;
        const { x: bx, y: by } = posRef.current;
        const dx = predMX - bx,
            dy = predMY - by;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < THRESHOLD && dist > 0.1) {
            const angle = Math.atan2(dy, dx);
            const force = Math.pow((THRESHOLD - dist) / THRESHOLD, 1.3) * 38;
            const cornerX = Math.max(0, 1 - (posRef.current.x - minX) / (bw * 2)) + Math.max(0, 1 - (maxX - posRef.current.x) / (bw * 2));
            const cornerY = Math.max(0, 1 - (posRef.current.y - minY) / (bh * 2)) + Math.max(0, 1 - (maxY - posRef.current.y) / (bh * 2));
            const cornered = Math.min(1, (cornerX + cornerY) / 2);
            const slideAngle = angle + (Math.PI / 2) * cornered * (Math.random() > 0.5 ? 1 : -1);
            const blended = angle * (1 - cornered * 0.85) + slideAngle * (cornered * 0.85);
            velRef.current.x -= Math.cos(blended) * force * (1 + cornered * 0.8);
            velRef.current.y -= Math.sin(blended) * force * (1 + cornered * 0.8);
        }

        velRef.current.x *= 0.76;
        velRef.current.y *= 0.76;
        posRef.current.x += velRef.current.x;
        posRef.current.y += velRef.current.y;

        if (posRef.current.x < minX) {
            posRef.current.x = minX;
            velRef.current.x *= -0.3;
        }
        if (posRef.current.x > maxX) {
            posRef.current.x = maxX;
            velRef.current.x *= -0.3;
        }
        if (posRef.current.y < minY) {
            posRef.current.y = minY;
            velRef.current.y *= -0.3;
        }
        if (posRef.current.y > maxY) {
            posRef.current.y = maxY;
            velRef.current.y *= -0.3;
        }

        btn.style.left = `${posRef.current.x - bw / 2}px`;
        btn.style.top = `${posRef.current.y - bh / 2}px`;
        rafRef.current = requestAnimationFrame(loop);
    }, []);

    useEffect(() => {
        rafRef.current = requestAnimationFrame(loop);

        return () => cancelAnimationFrame(rafRef.current);
    }, [loop]);

    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };
        window.addEventListener("mousemove", onMove);

        if (btnRefPlaceholder.current) {
            const sss = btnRefPlaceholder.current.getBoundingClientRect();
            console.log("a", sss);

            btnRef.current!.style.left = `${sss.left}px`;
            btnRef.current!.style.top = `${sss.top}px`;
        }
        return () => window.removeEventListener("mousemove", onMove);
    }, []);

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; }
        body { background:#050510; overflow:hidden; }

        .home-root {
          position:fixed; inset:0;
          font-family:'DM Sans',sans-serif;
          display:flex; flex-direction:column;
          align-items:center; justify-content:center;
          overflow:hidden;
        }

        /* deep space background */
        .bg { position:absolute; inset:0; z-index:0; background:#050510; }
        .bg::before {
          content:''; position:absolute; inset:0;
          background:
            radial-gradient(ellipse 80% 60% at 20% 30%, rgba(99,102,241,0.18) 0%, transparent 60%),
            radial-gradient(ellipse 60% 80% at 80% 70%, rgba(16,185,129,0.12) 0%, transparent 60%),
            radial-gradient(ellipse 70% 50% at 50% 10%, rgba(245,158,11,0.08) 0%, transparent 60%);
          animation:meshMove 12s ease-in-out infinite alternate;
        }
        .bg::after {
          content:''; position:absolute; inset:0;
          background-image:radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px);
          background-size:48px 48px;
        }
        @keyframes meshMove {
          0%   {opacity:.7;transform:scale(1) rotate(0deg);}
          50%  {opacity:1; transform:scale(1.05) rotate(1deg);}
          100% {opacity:.8;transform:scale(.97) rotate(-1deg);}
        }
        .orb {position:absolute;border-radius:50%;filter:blur(80px);opacity:.25;animation:orbFloat linear infinite;pointer-events:none;z-index:0;}
        .orb1{width:500px;height:500px;background:#6366f1;top:-100px;left:-100px;animation-duration:20s;}
        .orb2{width:400px;height:400px;background:#10b981;bottom:-80px;right:-80px;animation-duration:25s;animation-direction:reverse;}
        .orb3{width:300px;height:300px;background:#f59e0b;top:40%;left:60%;animation-duration:18s;animation-delay:-5s;}
        @keyframes orbFloat {
          0%  {transform:translate(0,0) scale(1);}
          33% {transform:translate(40px,-30px) scale(1.05);}
          66% {transform:translate(-20px,40px) scale(.97);}
          100%{transform:translate(0,0) scale(1);}
        }

        /* content */
        .content {
          position:relative; z-index:2;
          display:flex; flex-direction:column;
          align-items:center; gap:12px; text-align:center;
        }
        .eyebrow {
          font-size:11px; font-weight:500; letter-spacing:.2em; text-transform:uppercase;
          color:rgba(99,102,241,.9); padding:6px 16px;
          border:1px solid rgba(99,102,241,.3); border-radius:999px;
          background:rgba(99,102,241,.08); backdrop-filter:blur(8px);
          animation:fadeUp .6s ease both;
        }
        .title {
          font-family:'Syne',sans-serif;
          font-size:clamp(52px,8vw,96px); font-weight:800; line-height:1; letter-spacing:-.03em;
          color:#fff; animation:fadeUp .6s .1s ease both;
          text-shadow:0 0 60px rgba(99,102,241,.25);
        }
        .title span {
          background:linear-gradient(135deg,#6366f1,#10b981);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
        }
        .subtitle {
          font-size:16px; font-weight:300; color:rgba(255,255,255,.4);
          max-width:380px; line-height:1.7;
          animation:fadeUp .6s .2s ease both;
        }

        /* ── TWO BUTTONS ROW ── centered, vivid, same height ── */
        .btn-row {
          margin-top: 36px;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          gap: 16px;
          animation: fadeUp .6s .32s ease both;
        }

        /* Button 1 — solid vivid indigo */
        .btn-primary {
          padding: 10px 20px;
          font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 600;
          color: #fff; letter-spacing: .01em;
          background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
          border: none; border-radius: 14px; cursor: pointer;
          position: relative; overflow: hidden;
          box-shadow:
            0 0 0 1px rgba(99,102,241,.5),
            0 4px 16px rgba(99,102,241,.4),
            0 12px 40px rgba(99,102,241,.25);
          transition: transform .18s ease, box-shadow .18s ease;
          white-space: nowrap;
        }
        .btn-primary::before {
          content:''; position:absolute; inset:0;
          background:linear-gradient(135deg,rgba(255,255,255,.18),transparent);
          opacity:0; transition:opacity .2s;
        }
        .btn-primary:hover { transform:translateY(-3px); box-shadow:0 0 0 1px rgba(99,102,241,.7),0 8px 24px rgba(99,102,241,.5),0 20px 56px rgba(99,102,241,.3); }
        .btn-primary:hover::before { opacity:1; }
        .btn-primary:active { transform:translateY(0); }

        /* Button 2 — vivid emerald outline, matches height exactly */
        .btn-placeholder {
          padding: 10px 20px;
          font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 600;
          color: transparent;
          background: transparent;
          border: 2px solid transparent;
          border-radius: 14px;
          white-space: nowrap;
          pointer-events: none; user-select: none;
        }

        /* escape button — same visual style as btn-ghost but vivid */
        .btn-escape {
          position: fixed; z-index: 10;
          padding: 10px 20px;
          font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 600;
          color: #34d399;
          background: rgba(16,185,129,.08);
          border: 2px solid rgba(52,211,153,.45);
          border-radius: 14px; cursor: default; pointer-events: none;
          backdrop-filter: blur(16px);
          box-shadow:
            0 0 0 1px rgba(52,211,153,.15),
            0 4px 16px rgba(16,185,129,.2),
            0 0 40px rgba(16,185,129,.08);
          white-space: nowrap; will-change: left, top; user-select: none;
          letter-spacing: .01em;
        } 

        .hint {
          position:fixed; bottom:28px; left:50%; transform:translateX(-50%); z-index:3;
          font-size:11px; color:rgba(255,255,255,.18); letter-spacing:.12em; pointer-events:none;
          animation:pulse 3s ease-in-out infinite;
        }
        @keyframes pulse{0%,100%{opacity:.3}50%{opacity:.8}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
      `}</style>

            <div className="home-root">
                <div className="bg" />
                <div className="orb orb1" />
                <div className="orb orb2" />
                <div className="orb orb3" />

                <div className="content">
                    <div className="eyebrow">✦✦✦</div>
                    <h1 className="title">
                        HI<span>.</span>
                    </h1>
                    <p className="subtitle">Thật vui vì thấy bạn ở đây</p>

                    <div className="btn-row">
                        <button ref={btnRefPlaceholder} className="btn-primary" onClick={() => navigate("/detail")}>
                            Nhận một lời chúc 🌸
                        </button>
                        <button className="btn-placeholder">Nhận 💵 thay lời chúc</button>
                    </div>
                </div>

                <button ref={btnRef} className="btn-escape">
                    Nhận 💵 thay lời chúc
                </button>
            </div>
        </>
    );
}
