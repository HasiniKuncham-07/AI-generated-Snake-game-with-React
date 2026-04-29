import { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Pause, SkipForward, Music } from 'lucide-react';

const GRID_SIZE = 20;

const TRACKS = [
  { name: 'Neon Pulse', url: 'https://example.com/music1.mp3' },
  { name: 'Cyber Stream', url: 'https://example.com/music2.mp3' },
  { name: 'Synth Wave', url: 'https://example.com/music3.mp3' },
];

export default function App() {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState({ x: 0, y: -1 });
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const gameInterval = useRef<number | null>(null);

  const gameOver = () => {
    setSnake([{ x: 10, y: 10 }]);
    setScore(0);
    setDirection({ x: 0, y: -1 });
    setIsPaused(true);
  };

  const moveSnake = useCallback(() => {
    if (isPaused) return;

    setSnake((prev) => {
      const newSnake = [...prev];
      const head = { ...newSnake[0] };
      head.x += direction.x;
      head.y += direction.y;

      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE || 
          newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver();
        return prev;
      }

      newSnake.unshift(head);
      if (head.x === food.x && head.y === food.y) {
        setScore(s => s + 10);
        setFood({
          x: Math.floor(Math.random() * GRID_SIZE),
          y: Math.floor(Math.random() * GRID_SIZE),
        });
      } else {
        newSnake.pop();
      }
      return newSnake;
    });
  }, [direction, food, isPaused]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction.y === 0) setDirection({ x: 0, y: -1 }); break;
        case 'ArrowDown': if (direction.y === 0) setDirection({ x: 0, y: 1 }); break;
        case 'ArrowLeft': if (direction.x === 0) setDirection({ x: -1, y: 0 }); break;
        case 'ArrowRight': if (direction.x === 0) setDirection({ x: 1, y: 0 }); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (!isPaused) {
      gameInterval.current = window.setInterval(moveSnake, 150);
      return () => { if (gameInterval.current) clearInterval(gameInterval.current) };
    }
  }, [isPaused, moveSnake]);

  return (
    <div className="min-h-screen bg-black text-cyan-400 p-8 font-sans uppercase tracking-wider flex flex-col items-center border-[20px] border-slate-900">
      <h1 className="text-5xl font-black mb-12 glitch text-cyan-500 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]">
        NEON_BEATS_SNAKE
      </h1>

      <div className="flex gap-12 items-start bg-slate-950 p-6 border-2 border-cyan-900 rounded-none shadow-[inset_0_0_20px_rgba(6,182,212,0.2)]">
        <div className="p-1 border-4 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.4)] relative">
          <div className="grid grid-cols-[repeat(20,minmax(0,1fr))] gap-px bg-slate-900">
            {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
              const x = i % GRID_SIZE;
              const y = Math.floor(i / GRID_SIZE);
              const isSnake = snake.some(s => s.x === x && s.y === y);
              const isFood = food.x === x && food.y === y;
              return (
                <div key={i} className={`w-5 h-5 ${isSnake ? 'bg-cyan-400' : isFood ? 'bg-pink-500' : 'bg-slate-900'}`} />
              );
            })}
          </div>
          <div className="mt-4 text-center font-black text-2xl bg-cyan-950 p-2 text-cyan-200 border-2 border-cyan-800">
            SCORE: {score.toString().padStart(4, '0')}
          </div>
          <button 
            className="mt-4 w-full bg-cyan-500 text-black py-3 rounded-none font-black hover:bg-white transition-all hover:tracking-widest"
            onClick={() => setIsPaused(!isPaused)}
          >
            {isPaused ? 'INIT_GAME' : 'PAUSE_SYSTEM'}
          </button>
        </div>

        <div className="p-6 border-2 border-pink-500 rounded-none shadow-[0_0_20px_rgba(236,72,153,0.3)] flex flex-col gap-6 w-72 bg-slate-900">
          <div className="flex items-center gap-3 border-b-2 border-pink-800 pb-2">
            <Music className="text-pink-400 w-8 h-8" />
            <h2 className="text-2xl font-black text-pink-500">Audio_CTRL</h2>
          </div>
          <div className="text-lg font-bold text-pink-200 bg-black p-2 border border-pink-900">
            {'> ' + TRACKS[currentTrack].name}
          </div>
          <div className="flex justify-between gap-4">
            <button 
              className="bg-pink-600 text-black p-4 font-black flex-1 flex justify-center hover:bg-white"
              onClick={() => setIsPlayingMusic(!isPlayingMusic)}
            >
              {isPlayingMusic ? <Pause /> : <Play />}
            </button>
            <button 
              className="bg-pink-900 text-pink-200 p-4 font-black flex-1 flex justify-center hover:bg-pink-700"
              onClick={() => setCurrentTrack((currentTrack + 1) % TRACKS.length)}
            >
              <SkipForward />
            </button>
          </div>
        </div>
      </div>
      
      <footer className="mt-12 text-slate-700 font-bold text-xs tracking-[0.2em]">
        SYSTEM_ID: NEON_SNAKE_v1.0.3 // STATUS: OPERATIONAL
      </footer>
    </div>
  );
}
