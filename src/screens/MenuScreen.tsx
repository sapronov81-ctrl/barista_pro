import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GlassCard } from '../components/ui/GlassCard';

export default function MenuScreen() {
  return (
    <View style={styles.container}>
      <GlassCard>
        <Text style={styles.h}>Menu</Text>
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#F8F5F0' },
  h: { fontSize: 20, fontWeight: '700', color: '#3B2B20' },
});
