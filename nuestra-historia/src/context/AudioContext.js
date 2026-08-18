import React, { createContext, useContext, useRef, useState, useCallback } from 'react';
import { Audio } from 'expo-av';

const AudioContext = createContext(null);

export function AudioProvider({ children }) {
  const soundRef = useRef(null);
  const [current, setCurrent] = useState(null); // { id, title, url }
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const onStatusUpdate = useCallback((status) => {
    if (!status.isLoaded) return;
    setIsPlaying(status.isPlaying);
    setProgress(status.positionMillis || 0);
    setDuration(status.durationMillis || 0);
  }, []);

  const play = useCallback(
    async (song) => {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
      });
      const { sound } = await Audio.Sound.createAsync(
        { uri: song.url },
        { shouldPlay: true },
        onStatusUpdate
      );
      soundRef.current = sound;
      setCurrent(song);
    },
    [onStatusUpdate]
  );

  const toggle = useCallback(async () => {
    if (!soundRef.current) return;
    const status = await soundRef.current.getStatusAsync();
    if (status.isPlaying) await soundRef.current.pauseAsync();
    else await soundRef.current.playAsync();
  }, []);

  const stop = useCallback(async () => {
    if (soundRef.current) {
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }
    setCurrent(null);
    setIsPlaying(false);
  }, []);

  return (
    <AudioContext.Provider value={{ current, isPlaying, progress, duration, play, toggle, stop }}>
      {children}
    </AudioContext.Provider>
  );
}

export const useAudio = () => useContext(AudioContext);
