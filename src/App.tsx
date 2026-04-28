/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'motion/react';
import { Cpu, Terminal, History, Activity, Share2 } from 'lucide-react';
import { DUMMY_TRACKS } from './constants';

export default function App() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="w-full min-h-screen bg-[#050505] text-[#e0e0e0] font-sans p-6 overflow-hidden flex flex-col gap-6 select-none relative">
      {/* Background Decoration */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="scanline" />
      </div>

      {/* Header Section */}
      <header className="relative z-10 flex justify-between items-end border-b border-[#1a1a1a] pb-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-neon-blue italic">
            SYNTH-SNAKE V1.0
          </h1>
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#666] font-bold">Neural Audio-Link & Kinetic Interface</p>
        </div>
        <div className="flex gap-12 text-[11px] font-mono">
          <div className="flex flex-col items-end">
            <span className="text-[#333]">CONNECTION</span>
            <span className="text-neon-green font-bold">STABLE.OS</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[#333]">LATENCY</span>
            <span className="text-neon-blue font-bold tracking-widest">0.024MS</span>
          </div>
        </div>
      </header>

      {/* Bento Grid Main Content */}
      <div className="flex-1 grid grid-cols-12 grid-rows-6 gap-4 relative z-10">
        
        {/* Left Column: Playlist (3 cols) */}
        <div className="col-span-3 row-span-4 border-panel rounded-xl p-5 flex flex-col group overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
            <Terminal size={48} />
          </div>
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#666] mb-6 flex items-center gap-2">
             <History size={12} />
             Audio Stream
          </h2>
          <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {DUMMY_TRACKS.map((track, index) => (
              <motion.div 
                key={track.id}
                onClick={() => {
                  setCurrentTrackIndex(index);
                  setIsPlaying(true);
                }}
                whileHover={{ x: 4 }}
                className={`p-3 rounded-lg cursor-pointer border transition-all ${
                  currentTrackIndex === index 
                    ? 'bg-[#111] border-neon-green/30 text-neon-green' 
                    : 'bg-transparent border-transparent text-[#666] hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="text-xs font-bold truncate tracking-tight">{track.title}</div>
                <div className="text-[9px] uppercase tracking-widest opacity-60 mt-0.5">{track.artist}</div>
              </motion.div>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t border-[#1a1a1a]">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded bg-gradient-to-br from-neon-green to-[#004400] relative overflow-hidden group">
                 <img 
                    src={DUMMY_TRACKS[currentTrackIndex].cover} 
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" 
                    alt="cover"
                    referrerPolicy="no-referrer"
                 />
                 {isPlaying && (
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-neon-green animate-pulse" />
                 )}
              </div>
              <div className="min-w-0">
                <div className="text-[9px] text-[#444] uppercase font-bold tracking-widest mb-0.5">Linked Core</div>
                <div className="text-xs font-bold truncate pr-2">{DUMMY_TRACKS[currentTrackIndex].title}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Center Column: Snake Game (6 cols) */}
        <div className="col-span-6 row-span-4 bg-black border border-[#1a1a1a] rounded-xl relative overflow-hidden flex flex-col items-center justify-center group">
          <div className="absolute top-4 left-6 flex items-center gap-2 z-10">
            <div className="w-2 h-2 rounded-full bg-neon-pink shadow-neon-pink animate-ping" />
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#666]">Field Dynamics: Active</span>
          </div>
          
          <SnakeGame />
          
          <div className="absolute bottom-4 inset-x-0 text-center pointer-events-none opacity-20 group-hover:opacity-50 transition-opacity">
            <span className="text-[8px] font-mono text-white uppercase tracking-[0.6em]">GRID_COORD_MAPPING: ENABLED</span>
          </div>
        </div>

        {/* Right Column: Performance & System (3 cols) */}
        <div className="col-span-3 row-span-4 flex flex-col gap-4">
          <div className="flex-1 border-panel rounded-xl p-5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
              <Activity size={48} />
            </div>
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#666] mb-6">Performance</h2>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-[10px] mb-2 font-mono">
                  <span className="text-[#444]">NEURAL SYNC</span>
                  <span className="text-neon-blue">98.4%</span>
                </div>
                <div className="h-1 bg-[#1a1a1a] rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '98.4%' }}
                    className="h-full bg-neon-blue shadow-neon-blue" 
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] mb-2 font-mono">
                  <span className="text-[#444]">REACTION</span>
                  <span className="text-neon-pink">ULTRASONIC</span>
                </div>
                <div className="h-1 bg-[#1a1a1a] rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '75%' }}
                    className="h-full bg-neon-pink shadow-neon-pink" 
                  />
                </div>
              </div>
            </div>

            <div className="mt-8">
               <div className="text-[9px] text-[#333] uppercase font-bold tracking-widest mb-3">System Logs</div>
               <div className="font-mono text-[9px] space-y-1.5 opacity-40">
                  <div className="text-neon-green">INIT_SNAKE_CORE... OK</div>
                  <div>BUFFER_ALLOCATION... COMPLETE</div>
                  <div>SCANNING_NODES... [24] ACTIVE</div>
               </div>
            </div>
          </div>
          
          <div className="border-panel rounded-xl p-5 flex flex-col gap-3">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#666] mb-2">Controls</h2>
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 p-3 bg-[#111] border border-white/5 text-[9px] font-bold rounded uppercase hover:bg-white hover:text-black transition-all">
                <Cpu size={12} />
                Hard Reset
              </button>
              <button className="flex items-center justify-center gap-2 p-3 bg-[#111] border border-white/5 text-[9px] font-bold rounded uppercase hover:bg-[#222] transition-all">
                <Share2 size={12} />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Row: Global Music Controls (12 cols) */}
        <div className="col-span-12 row-span-2">
          <MusicPlayer 
            currentTrackIndex={currentTrackIndex}
            onTrackChange={setCurrentTrackIndex}
            isPlaying={isPlaying}
            onPlayPause={setIsPlaying}
          />
        </div>

      </div>

      {/* Footer Details */}
      <footer className="relative z-10 flex justify-between items-center text-[9px] text-[#333] uppercase tracking-[0.4em] font-mono">
        <div>Operator: USER_NODE_0x{Math.floor(Math.random()*10000)}</div>
        <div className="flex gap-8">
           <span>&copy; 2026 NEURALNET ENTERTAINMENT SYSTEM</span>
           <span className="text-white opacity-20">V-Sync Priority: 1</span>
        </div>
        <div className="flex gap-4">
           <span className="text-neon-green">ENCRYPTION: AES_256</span>
           <span>SECURE_LINK</span>
        </div>
      </footer>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1a1a1a;
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #333;
        }
      `}</style>
    </div>
  );
}
