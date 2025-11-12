import React, { useEffect } from 'react';
import { StyleSheet, ScrollView, Text } from 'react-native';
import { GlassCard } from '../components/ui/GlassCard';
import { GlassButton } from '../components/ui/GlassButton';
import { CoffeeHeader } from '../components/ui/CoffeeHeader';
import { init } from '../db/database';

export default function HomeScreen({ navigation }: any) {
  useEffect(() => { init(); }, []);
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <CoffeeHeader />
      <Text style={styles.title}>Welcome to Barista Pro</Text>
      <GlassCard style={styles.card}>
        <Text style={styles.cardTitle}>Today’s Espresso Audit</Text>
        <GlassButton title="Start Audit" onPress={() => navigation.navigate('Audit')} />
      </GlassCard>
      <GlassCard style={styles.card}>
        <Text style={styles.cardTitle}>Materials & Training</Text>
        <GlassButton title="Open" onPress={() => navigation.navigate('Materials')} />
      </GlassCard>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: { padding: 24, backgroundColor: '#F8F5F0' },
  title: { fontSize: 22, fontWeight: '700', color: '#3B2B20', marginBottom: 12 },
  card: { marginBottom: 20 },
  cardTitle: { fontSize: 18, fontWeight: '600', color: '#3B2B20', marginBottom: 8 },
});
