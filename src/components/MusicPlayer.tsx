/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music } from 'lucide-react';
import { Track, DUMMY_TRACKS } from '../constants';

interface MusicPlayerProps {
  currentTrackIndex: number;
  onTrackChange: (index: number) => void;
  isPlaying: boolean;
  onPlayPause: (playing: boolean) => void;
}

export default function MusicPlayer({ currentTrackIndex, onTrackChange, isPlaying, onPlayPause }: MusicPlayerProps) {
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback failed", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => onPlayPause(!isPlaying);

  const skipForward = () => {
    onTrackChange((currentTrackIndex + 1) % DUMMY_TRACKS.length);
    onPlayPause(true);
  };

  const skipBackward = () => {
    onTrackChange((currentTrackIndex - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    onPlayPause(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-between px-8 bg-bg-panel border border-border-dim rounded-xl">
      <audio 
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={skipForward}
      />
      
      {/* Track Info & Controls */}
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-6">
          <button onClick={skipBackward} className="text-[#666] hover:text-white transition-colors">
            <SkipBack size={20} />
          </button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={togglePlay}
            className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center shadow-lg"
          >
            {isPlaying ? <Pause size={24} className="fill-current" /> : <Play size={24} className="fill-current ml-1" />}
          </motion.button>
          <button onClick={skipForward} className="text-[#666] hover:text-white transition-colors">
            <SkipForward size={20} />
          </button>
        </div>

        <div className="flex flex-col min-w-[300px]">
          <div className="flex justify-between items-end mb-2">
            <div className="flex flex-col">
              <span className="text-[10px] text-[#666] uppercase font-bold tracking-tighter">Current Session</span>
              <span className="text-sm font-black flex items-center gap-2">
                {currentTrack.title} 
                <span className="text-neon-green font-normal text-[10px] italic opacity-80">- 128 BPM</span>
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#666] tracking-widest">
               {isPlaying ? 'ACTIVE_LINK' : 'SYNC_PAUSED'}
            </span>
          </div>
          <div className="w-full h-1.5 bg-[#1a1a1a] rounded-full relative overflow-hidden group">
            <motion.div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-neon-green to-neon-blue"
              initial={false}
              animate={{ width: `${progress}%` }}
              transition={{ type: "spring", bounce: 0, duration: 0.1 }}
            />
          </div>
        </div>
      </div>

      {/* Stats & Volume */}
      <div className="flex items-center gap-12">
        <div className="flex flex-col items-end">
          <span className="text-[10px] text-[#666] uppercase tracking-widest">Difficulty</span>
          <span className="text-xs font-bold text-neon-pink shadow-neon-pink tracking-widest uppercase italic">Overdrive</span>
        </div>
        
        <div className="flex items-center gap-4">
          <Volume2 size={16} className="text-[#666]" />
          <div className="w-24 h-1 bg-[#1a1a1a] rounded-full">
            <div className="w-2/3 h-full bg-[#666] rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
