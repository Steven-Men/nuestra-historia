import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GradientBackground from '../components/GradientBackground';
import MiniPlayer from '../components/MiniPlayer';
import EmptyState from '../components/EmptyState';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { listenToSongs, pickAndUploadSong } from '../services/music';
import { useAudio } from '../context/AudioContext';

export default function MusicScreen() {
  const [songs, setSongs] = useState([]);
  const [loadingSongs, setLoadingSongs] = useState(true);
  const [uploading, setUploading] = useState(false);
  const { current, isPlaying, play, toggle } = useAudio();

  useEffect(() => {
    const unsub = listenToSongs((items) => {
      setSongs(items);
      setLoadingSongs(false);
    });
    return unsub;
  }, []);

  const handleAdd = async () => {
    setUploading(true);
    try {
      await pickAndUploadSong();
    } catch (e) {
      // el usuario canceló el picker
    } finally {
      setUploading(false);
    }
  };

  const handlePlay = (song) => {
    if (current?.id === song.id) toggle();
    else play(song);
  };

  return (
    <GradientBackground>
      <View style={styles.header}>
        <Text style={styles.title}>Canciones</Text>
        <TouchableOpacity style={styles.addBtn} onPress={handleAdd} disabled={uploading}>
          <Ionicons name={uploading ? 'hourglass' : 'add'} size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {!loadingSongs && songs.length === 0 ? (
        <EmptyState
          icon="musical-notes-outline"
          title="Aún no hay canciones"
          subtitle="Sube la canción que los represente como pareja"
        />
      ) : (
        <FlatList
          data={songs}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }}
          renderItem={({ item }) => {
            const active = current?.id === item.id;
            return (
              <TouchableOpacity style={styles.row} onPress={() => handlePlay(item)}>
                <View style={[styles.playIcon, active && { backgroundColor: colors.rosaNube }]}>
                  <Ionicons
                    name={active && isPlaying ? 'pause' : 'play'}
                    size={16}
                    color={active ? '#fff' : colors.tintaNoche}
                  />
                </View>
                <Text
                  style={[styles.songTitle, active && { color: colors.rosaNube }]}
                  numberOfLines={1}
                >
                  {item.title}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      )}
      <MiniPlayer />
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 6,
  },
  title: { fontFamily: fonts.display, fontSize: 26, color: colors.tintaNoche },
  addBtn: {
    backgroundColor: colors.rosaNube,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffffaa',
    borderRadius: 14,
    padding: 12,
    marginTop: 10,
    gap: 12,
  },
  playIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  songTitle: { fontFamily: fonts.bodySemi, fontSize: 14, color: colors.tintaNoche, flex: 1 },
});
