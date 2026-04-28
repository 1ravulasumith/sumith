/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GRID_SIZE, INITIAL_SPEED, MIN_SPEED, SPEED_INCREMENT } from '../constants';
import { Trophy, RefreshCw, Play } from 'lucide-react';

interface Point {
  x: number;
  y: number;
}

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<string>('RIGHT');
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(true);
  const [speed, setSpeed] = useState<number>(INITIAL_SPEED);

  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // Check if food spawned on snake
      const onSnake = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!onSnake) break;
    }
    return newFood;
  }, []);

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (direction) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      // Check collisions
      if (
        newHead.x < 0 || newHead.x >= GRID_SIZE ||
        newHead.y < 0 || newHead.y >= GRID_SIZE ||
        prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
      ) {
        setGameOver(true);
        setIsPaused(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => {
          const newScore = s + 10;
          if (newScore > highScore) setHighScore(newScore);
          return newScore;
        });
        setFood(generateFood(newSnake));
        setSpeed(prev => Math.max(MIN_SPEED, prev - SPEED_INCREMENT));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, isPaused, generateFood, highScore]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') setDirection('UP'); break;
        case 'ArrowDown': if (direction !== 'UP') setDirection('DOWN'); break;
        case 'ArrowLeft': if (direction !== 'RIGHT') setDirection('LEFT'); break;
        case 'ArrowRight': if (direction !== 'LEFT') setDirection('RIGHT'); break;
        case ' ': setIsPaused(p => !p); break;
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction]);

  useEffect(() => {
    if (!isPaused && !gameOver) {
      gameLoopRef.current = setInterval(moveSnake, speed);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [isPaused, gameOver, moveSnake, speed]);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 5, y: 5 });
    setDirection('RIGHT');
    setGameOver(false);
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setIsPaused(false);
  };

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      {/* Stats Header */}
      <div className="flex justify-between w-full text-neon-green font-mono text-sm uppercase tracking-widest mb-2">
        <div className="flex items-center gap-2">
          <Trophy size={16} className="text-neon-pink" />
          <span className="opacity-60">High: {highScore}</span>
        </div>
        <div className="text-neon-green shadow-neon-green font-black text-xl">
          {score.toString().padStart(5, '0')}
        </div>
      </div>

      {/* Game Board */}
      <div 
        className="relative border border-[#1a1a1a] bg-black overflow-hidden rounded-lg"
        style={{ 
          width: GRID_SIZE * 20, 
          height: GRID_SIZE * 20,
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
        }}
      >
        {/* Grid lines for aesthetic */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

        {/* Snake Body */}
        {snake.map((segment, i) => (
          <motion.div
            key={`${i}-${segment.x}-${segment.y}`}
            className={`absolute w-5 h-5 ${i === 0 ? 'bg-neon-green shadow-[0_0_15px_#00FF00] z-10' : 'bg-neon-green/40 shadow-[0_0_5px_rgba(0,255,0,0.2)]'}`}
            initial={false}
            animate={{ 
              left: segment.x * 20, 
              top: segment.y * 20,
              scale: 1
            }}
            transition={{ duration: 0.05 }}
          />
        ))}

        {/* Food */}
        <motion.div
          className="absolute w-5 h-5 bg-neon-pink rounded-full shadow-[0_0_15px_#FF00FF]"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [1, 0.8, 1]
          }}
          transition={{
            repeat: Infinity,
            duration: 0.8
          }}
          style={{
            left: food.x * 20,
            top: food.y * 20
          }}
        />

        {/* Overlays */}
        <AnimatePresence>
          {gameOver && (
            <motion.div 
              className="absolute inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center z-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h2 className="text-3xl font-black text-neon-pink mb-2 tracking-tighter italic">GAME CRITICAL</h2>
              <div className="text-[#666] font-mono mb-6 uppercase tracking-widest text-xs">Final Score: {score}</div>
              <button 
                onClick={resetGame}
                className="flex items-center gap-2 bg-[#1a1a1a] text-white border border-white/10 px-8 py-3 font-bold hover:bg-white hover:text-black transition-all rounded"
              >
                <RefreshCw size={18} />
                RESTART_SYSTEM
              </button>
            </motion.div>
          )}

          {isPaused && !gameOver && (
            <motion.div 
              className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex flex-col items-center justify-center z-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsPaused(false)}
                className="w-16 h-16 rounded-full bg-neon-green text-black flex items-center justify-center shadow-neon-green"
              >
                <Play size={24} className="fill-current ml-1" />
              </motion.button>
              <p className="mt-4 text-[10px] text-[#666] font-mono tracking-[0.3em] uppercase animate-pulse">Press Space to Resume</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls Hint */}
      <div className="text-[9px] text-[#333] font-mono flex gap-8 uppercase tracking-widest mt-2">
        <span>WASD / ARROWS : NAV</span>
        <span>SPACE : PAUSE</span>
      </div>
    </div>
  );
}
