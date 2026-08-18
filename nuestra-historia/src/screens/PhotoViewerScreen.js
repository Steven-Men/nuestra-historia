import React, { useRef } from 'react';
import { View, FlatList, Image, Dimensions, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import MiniPlayer from '../components/MiniPlayer';
import { colors } from '../theme/colors';

const { width, height } = Dimensions.get('window');

export default function PhotoViewerScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { photos = [], startId } = route.params || {};
  const startIndex = Math.max(
    0,
    photos.findIndex((p) => p.id === startId)
  );
  const listRef = useRef(null);

  return (
    <View style={styles.container}>
      <FlatList
        ref={listRef}
        data={photos}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        initialScrollIndex={startIndex}
        getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
        renderItem={({ item }) => (
          <View style={{ width, height, alignItems: 'center', justifyContent: 'center' }}>
            <Image source={{ uri: item.url }} style={styles.image} resizeMode="contain" />
          </View>
        )}
      />
      <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
        <Ionicons name="close" size={26} color="#fff" />
      </TouchableOpacity>
      <View style={styles.playerWrap}>
        <MiniPlayer />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.tintaNoche },
  image: { width: width - 24, height: height * 0.75, borderRadius: 20 },
  closeBtn: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: '#ffffff33',
    borderRadius: 20,
    padding: 8,
  },
  playerWrap: { position: 'absolute', bottom: 24, left: 0, right: 0 },
});
