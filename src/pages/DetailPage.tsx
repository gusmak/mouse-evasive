import { useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

export default function DetailPage() {
  const navigate = useNavigate()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  type Petal = {
    x: number; y: number; vx: number; vy: number
    size: number; rotation: number; rotSpeed: number
    opacity: number; color: string; wobble: number; wobbleSpeed: number
  }
  const petalsRef = useRef<Petal[]>([])
  const COLORS = ['#ffb7c5','#ff85a1','#ff4d8d','#ffd6e0','#ff69b4','#ffaec9','#ffe0ec','#e75480']

  const spawnPetal = useCallback((canvas: HTMLCanvasElement): Petal => ({
    x: Math.random() * canvas.width, y: -20,
    vx: (Math.random() - 0.5) * 1.2,
    vy: 0.6 + Math.random() * 1.0,
    size: 6 + Math.random() * 12,
    rotation: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.06,
    opacity: 0.6 + Math.random() * 0.4,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    wobble: Math.random() * Math.PI * 2,
    wobbleSpeed: 0.02 + Math.random() * 0.02,
  }), [])

  const drawPetal = useCallback((ctx: CanvasRenderingContext2D, p: Petal) => {
    ctx.save()
    ctx.translate(p.x, p.y)
    ctx.rotate(p.rotation)
    ctx.globalAlpha = p.opacity
    ctx.fillStyle = p.color
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.bezierCurveTo( p.size * 0.5, -p.size * 0.8,  p.size * 1.2, -p.size * 0.2,  0,  p.size)
    ctx.bezierCurveTo(-p.size * 1.2, -p.size * 0.2, -p.size * 0.5, -p.size * 0.8,  0,  0)
    ctx.fill()
    ctx.restore()
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)
    for (let i = 0; i < 40; i++) {
      const p = spawnPetal(canvas); p.y = Math.random() * canvas.height
      petalsRef.current.push(p)
    }
    let frame = 0; let animId: number
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      frame++
      if (frame % 8 === 0 && petalsRef.current.length < 80) petalsRef.current.push(spawnPetal(canvas))
      petalsRef.current = petalsRef.current.filter(p => {
        p.wobble += p.wobbleSpeed; p.x += p.vx + Math.sin(p.wobble) * 0.8
        p.y += p.vy; p.rotation += p.rotSpeed
        drawPetal(ctx, p); return p.y < canvas.height + 30
      })
      animId = requestAnimationFrame(animate)
    }
    animate()
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [spawnPetal, drawPetal])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; }
        body { background: #0e0008; overflow: hidden; }
        .detail-root {
          position: fixed; inset: 0;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          font-family: 'DM Sans', sans-serif;
          gap: 28px;
        }
        .detail-bg {
          position: absolute; inset: 0; z-index: 0;
          background:
            radial-gradient(ellipse 90% 70% at 50% 0%,   #3d0028 0%, transparent 60%),
            radial-gradient(ellipse 70% 60% at 10% 80%,  #2a001a 0%, transparent 55%),
            radial-gradient(ellipse 60% 50% at 90% 60%,  #1f0033 0%, transparent 55%),
            #0e0008;
        }
        .detail-bg::after {
          content:''; position:absolute; inset:0;
          background-image: radial-gradient(circle, rgba(255,182,193,0.04) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        .orb { position:absolute; border-radius:50%; filter:blur(90px); pointer-events:none; z-index:0; animation:orbPulse ease-in-out infinite alternate; }
        .orb1 { width:600px;height:600px; background:radial-gradient(circle,#c2185b,transparent 70%); top:-200px;left:-150px; opacity:.18; animation-duration:8s; }
        .orb2 { width:500px;height:500px; background:radial-gradient(circle,#e91e8c,transparent 70%); bottom:-150px;right:-100px; opacity:.15; animation-duration:10s; animation-delay:-3s; }
        @keyframes orbPulse { from{transform:scale(1)} to{transform:scale(1.15)} }
        canvas { position:absolute; inset:0; z-index:1; pointer-events:none; }
        .welcome-text {
          position: relative; z-index: 2;
          font-family: 'Playfair Display', serif;
          font-size: clamp(48px, 8vw, 88px);
          font-weight: 700; line-height: 1.05;
          color: #fff; letter-spacing: -.02em;
          animation: fadeUp 0.7s ease both;
          text-shadow: 0 0 60px rgba(255,105,148,.35);
        }
        .welcome-text em {
          font-style: italic; font-weight: 400;
          background: linear-gradient(135deg, #ff80ab, #f48fb1, #ffb7c5);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .back-btn {
          position: relative; z-index: 2;
          padding: 12px 32px;
          font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500;
          color: rgba(255,183,197,.7);
          background: rgba(255,105,148,.08);
          border: 1px solid rgba(255,183,197,.22);
          border-radius: 12px; cursor: pointer;
          backdrop-filter: blur(12px);
          transition: color .2s, border-color .2s, transform .2s, background .2s;
          animation: fadeUp 0.7s 0.15s ease both;
        }
        .back-btn:hover {
          color: #fff; border-color: rgba(255,183,197,.5);
          background: rgba(255,105,148,.15); transform: translateY(-2px);
        }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
      <div className="detail-root">
        <div className="detail-bg" />
        <div className="orb orb1" /><div className="orb orb2" />
        <canvas ref={canvasRef} />
        <h1 className="welcome-text">Wel<em>come</em> 🌸</h1>
        <button className="back-btn" onClick={() => navigate('/')}>← Quay lại</button>
      </div>
    </>
  )
}
