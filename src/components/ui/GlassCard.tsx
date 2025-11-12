import React from 'react';
import { ViewProps, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { colors } from '../../theme/colors';

export const GlassCard: React.FC<ViewProps> = ({ style, children }) => (
  <BlurView intensity={colors.blurIntensity} tint="light" style={[styles.card, style]}>
    {children}
  </BlurView>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.glassBg,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    shadowColor: colors.shadow,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    padding: 16,
    overflow: 'hidden',
  },
});
