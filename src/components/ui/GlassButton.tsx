import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';

type Props = { title: string; onPress: () => void; };

export const GlassButton: React.FC<Props> = ({ title, onPress }) => (
  <Pressable
    onPress={() => { Haptics.selectionAsync(); onPress(); }}
    style={({ pressed }) => [styles.container, pressed && styles.pressed]}
  >
    <BlurView intensity={colors.blurIntensity} style={styles.inner}>
      <Text style={styles.text}>{title}</Text>
    </BlurView>
  </Pressable>
);

const styles = StyleSheet.create({
  container: { borderRadius: 30, overflow: 'hidden', marginVertical: 8 },
  inner: {
    alignItems: 'center', justifyContent: 'center',
    paddingVertical: 14, paddingHorizontal: 32, borderRadius: 30,
    borderColor: colors.glassBorder, borderWidth: 1
  },
  text: { color: colors.textPrimary, fontSize: 16, fontWeight: '600' },
  pressed: { opacity: 0.85 },
});
