import { useEffect, useRef, useState } from "react";

const GAME_W = 480;
const GAME_H = 160;
const GROUND_Y = 115;
const DINO_W = 28;
const DINO_H = 36;
const OBS_W = 18;
const OBS_H = 36;
const TARGET_SCORE = 100;

function DinoGame({ onClose, onWin }) {
  const canvasRef = useRef(null);
  const [displayScore, setDisplayScore] = useState(0);
  const [phase, setPhase] = useState("idle"); // idle | playing | dead | won

  // All mutable game state lives in a single ref — no re-render side-effects
  const g = useRef({
    dinoY: GROUND_Y,
    vy: 0,
    onGround: true,
    obstacleX: GAME_W + 60,
    nextObs: GAME_W + 60,
    score: 0,
    frame: 0,
    speed: 4,
    leg: 0,
    legTimer: 0,
    phase: "idle", // mirror for use inside rAF closure
  });

  const rafRef = useRef(null);
  const phaseRef = useRef("idle");

  const setPhaseSync = (p) => {
    phaseRef.current = p;
    g.current.phase = p;
    setPhase(p);
  };

  const jump = () => {
    const s = g.current;
    if (s.phase === "idle") setPhaseSync("playing");
    if (s.onGround && s.phase === "playing") {
      s.vy = -12;
      s.onGround = false;
    }
    if (s.phase === "dead") resetGame();
  };

  const resetGame = () => {
    const s = g.current;
    s.dinoY = GROUND_Y;
    s.vy = 0;
    s.onGround = true;
    s.obstacleX = GAME_W + 60;
    s.nextObs = GAME_W + 60;
    s.score = 0;
    s.frame = 0;
    s.speed = 4;
    s.leg = 0;
    s.legTimer = 0;
    setDisplayScore(0);
    setPhaseSync("idle");
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const drawDino = (x, y, leg, dead) => {
      ctx.fillStyle = dead ? "#e03131" : "#1a1a2e";
      // body
      ctx.fillRect(x + 4, y + 8, 18, 16);
      // head
      ctx.fillRect(x + 12, y, 14, 12);
      // eye
      ctx.fillStyle = dead ? "#fff" : "#c8fa5f";
      ctx.fillRect(x + 22, y + 3, 3, 3);
      // tail
      ctx.fillStyle = dead ? "#e03131" : "#1a1a2e";
      ctx.fillRect(x, y + 12, 8, 6);
      // legs
      if (!dead) {
        if (leg === 0) {
          ctx.fillRect(x + 8, y + 24, 5, 10);
          ctx.fillRect(x + 16, y + 24, 5, 6);
        } else {
          ctx.fillRect(x + 8, y + 24, 5, 6);
          ctx.fillRect(x + 16, y + 24, 5, 10);
        }
      } else {
        ctx.fillRect(x + 6, y + 24, 14, 8);
      }
    };

    const drawCactus = (x) => {
      ctx.fillStyle = "#1a1a2e";
      ctx.fillRect(x + 5, GROUND_Y + DINO_H - OBS_H, OBS_W - 10, OBS_H);
      ctx.fillRect(x, GROUND_Y + DINO_H - 24, OBS_W, 6);
      ctx.fillRect(x, GROUND_Y + DINO_H - 30, 5, 10);
      ctx.fillRect(x + OBS_W - 5, GROUND_Y + DINO_H - 28, 5, 8);
    };

    const loop = () => {
      const s = g.current;
      ctx.clearRect(0, 0, GAME_W, GAME_H);

      // Background
      ctx.fillStyle = "#f0ece0";
      ctx.fillRect(0, 0, GAME_W, GAME_H);

      // Ground
      ctx.fillStyle = "#1a1a2e";
      ctx.fillRect(0, GROUND_Y + DINO_H, GAME_W, 3);

      // Ground dashes
      ctx.fillStyle = "#c8bfa8";
      const dashOffset = (s.frame * s.speed * 0.5) % 40;
      for (let gx = -dashOffset; gx < GAME_W; gx += 40) {
        ctx.fillRect(gx, GROUND_Y + DINO_H + 6, 20, 2);
      }

      const isPlaying = s.phase === "playing";
      const isDead = s.phase === "dead";

      if (isPlaying) {
        s.frame++;
        const newScore = Math.floor(s.frame / 6);
        if (newScore !== s.score) {
          s.score = newScore;
          setDisplayScore(newScore);
          
          if (newScore >= TARGET_SCORE) {
            setPhaseSync("won");
            onWin?.();
            
            // Automatically close the modal shortly after the win state shows
            setTimeout(() => {
              if (onClose) {
                onClose();
              }
            }, 1500);

            rafRef.current = requestAnimationFrame(loop);
            return;
          }
        }

        // Speed ramp
        s.speed = 4 + s.score / 50;

        // Gravity
        s.vy += 0.65;
        s.dinoY += s.vy;
        if (s.dinoY >= GROUND_Y) {
          s.dinoY = GROUND_Y;
          s.vy = 0;
          s.onGround = true;
        }

        // Leg animation
        s.legTimer++;
        if (s.legTimer > 8) {
          s.leg = s.leg === 0 ? 1 : 0;
          s.legTimer = 0;
        }

        // Obstacle movement
        s.obstacleX -= s.speed;
        if (s.obstacleX < -OBS_W) {
          s.obstacleX = GAME_W + Math.random() * 120 + 40;
        }

        // Collision (slightly forgiving hitbox)
        const dinoLeft = 50 + 6;
        const dinoRight = 50 + DINO_W - 4;
        const dinoTop = s.dinoY + 6;
        const dinoBottom = s.dinoY + DINO_H;
        const obsLeft = s.obstacleX + 3;
        const obsRight = s.obstacleX + OBS_W - 3;
        const obsTop = GROUND_Y + DINO_H - OBS_H + 4;

        if (dinoRight > obsLeft && dinoLeft < obsRight && dinoBottom > obsTop) {
          setPhaseSync("dead");
        }
      }

      // Draw obstacle
      if (s.phase !== "won") drawCactus(s.obstacleX);

      // Draw dino
      drawDino(50, s.dinoY, isPlaying ? s.leg : 0, isDead);

      // Score display
      ctx.font = "bold 12px 'Courier New', monospace";
      ctx.fillStyle = "#1a1a2e";
      ctx.fillText(`${String(s.score).padStart(3, "0")} / ${TARGET_SCORE}`, GAME_W - 80, 18);

      // Overlays
      if (s.phase === "idle") {
        ctx.fillStyle = "rgba(26,26,46,0.72)";
        ctx.fillRect(GAME_W / 2 - 130, GAME_H / 2 - 22, 260, 44);
        ctx.fillStyle = "#c8fa5f";
        ctx.font = "bold 13px 'Courier New', monospace";
        ctx.textAlign = "center";
        ctx.fillText("SPACE / CLICK  TO  START", GAME_W / 2, GAME_H / 2 + 5);
        ctx.textAlign = "left";
      }

      if (s.phase === "dead") {
        ctx.fillStyle = "rgba(26,26,46,0.78)";
        ctx.fillRect(GAME_W / 2 - 140, GAME_H / 2 - 26, 280, 52);
        ctx.fillStyle = "#ff6b6b";
        ctx.font = "bold 13px 'Courier New', monospace";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", GAME_W / 2, GAME_H / 2 - 4);
        ctx.fillStyle = "#f0ece0";
        ctx.font = "11px 'Courier New', monospace";
        ctx.fillText("SPACE /CL ICK to try again", GAME_W / 2, GAME_H / 2 + 16);
        ctx.textAlign = "left";
      }

      if (s.phase === "won") {
        ctx.fillStyle = "rgba(26,46,26,0.82)";
        ctx.fillRect(GAME_W / 2 - 140, GAME_H / 2 - 26, 280, 52);
        ctx.fillStyle = "#c8fa5f";
        ctx.font = "bold 13px 'Courier New', monospace";
        ctx.textAlign = "center";
        ctx.fillText("🎉 YOU WIN! EXAM DELETED", GAME_W / 2, GAME_H / 2 + 5);
        ctx.textAlign = "left";
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // ← Runs ONCE only; all state lives in g.current

  useEffect(() => {
    const handleKey = (e) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        jump();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="dino-overlay">
      <div className="dino-modal">
        <div className="dino-header">
          <span className="dino-title">⚡ DELETE CHALLENGE</span>
          <span className="dino-subtitle">Reach {TARGET_SCORE} pts to confirm deletion</span>
        </div>

        <canvas
          ref={canvasRef}
          width={GAME_W}
          height={GAME_H}
          className="dino-canvas"
          onClick={jump}
          style={{ cursor: "pointer" }}
        />

        <div className="dino-footer">
          <span className="dino-score-label">
            Score: <strong>{displayScore}</strong> / {TARGET_SCORE}
          </span>
        </div>
      </div>
    </div>
  );
}

export default DinoGame;