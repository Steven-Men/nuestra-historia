import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import GradientBackground from '../components/GradientBackground';
import PhotoFrame from '../components/PhotoFrame';
import MiniPlayer from '../components/MiniPlayer';
import EmptyState from '../components/EmptyState';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { listenToPhotos, pickAndUploadPhoto } from '../services/gallery';

const SPACING = 12;

export default function GalleryScreen() {
  const navigation = useNavigation();
  const [photos, setPhotos] = useState([]);
  const [loadingPhotos, setLoadingPhotos] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const unsub = listenToPhotos((items) => {
      setPhotos(items);
      setLoadingPhotos(false);
    });
    return unsub;
  }, []);

  const handleAdd = async () => {
    setUploading(true);
    try {
      await pickAndUploadPhoto();
    } catch (e) {
      // el usuario canceló el picker o negó el permiso
    } finally {
      setUploading(false);
    }
  };

  return (
    <GradientBackground>
      <View style={styles.header}>
        <Text style={styles.title}>Galería</Text>
        <TouchableOpacity style={styles.addBtn} onPress={handleAdd} disabled={uploading}>
          <Ionicons name={uploading ? 'hourglass' : 'add'} size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {!loadingPhotos && photos.length === 0 ? (
        <EmptyState
          icon="images-outline"
          title="Aún no hay fotos"
          subtitle="Toca + para subir la primera foto de ustedes dos"
        />
      ) : (
        <FlatList
          data={photos}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={{ gap: SPACING }}
          ItemSeparatorComponent={() => <View style={{ height: SPACING + 8 }} />}
          renderItem={({ item }) => (
            <PhotoFrame
              uri={item.url}
              size={160}
              onPress={() => navigation.navigate('PhotoViewer', { photos, startId: item.id })}
            />
          )}
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
  grid: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 100 },
});
