import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList } from 'react-native';
import { GlassCard } from '../components/ui/GlassCard';
import { GlassButton } from '../components/ui/GlassButton';
import { db } from '../db/database';

export default function AuditScreen() {
  const [location, setLocation] = useState('Main cafe');
  const [items, setItems] = useState([
    { section: 'Espresso', item: 'Grind size', value: '', score: 0 },
    { section: 'Milk', item: 'Temperature', value: '', score: 0 },
    { section: 'Cleanliness', item: 'Counter', value: '', score: 0 },
  ]);

  const save = async () => {
    const date = new Date().toISOString();
    const { lastInsertRowId } = await db.runAsync('INSERT INTO audits(date, location) VALUES (?,?)', date, location);
    for (const i of items) {
      await db.runAsync('INSERT INTO audit_items(audit_id, section, item, value, score) VALUES (?,?,?,?,?)',
        lastInsertRowId, i.section, i.item, i.value, i.score);
    }
  };

  return (
    <View style={styles.container}>
      <GlassCard>
        <Text style={styles.h}>New Audit</Text>
        <TextInput placeholder="Location" value={location} onChangeText={setLocation} style={styles.input} />
        <FlatList
          data={items}
          keyExtractor={(x, idx) => idx.toString()}
          renderItem={({ item, index }) => (
            <View style={{ marginBottom: 12 }}>
              <Text style={styles.label}>{item.section} — {item.item}</Text>
              <TextInput placeholder="notes/value" style={styles.input} onChangeText={(t)=>{
                const arr=[...items]; arr[index].value=t; setItems(arr);
              }} />
            </View>
          )}
        />
        <GlassButton title="Save Audit" onPress={save} />
      </GlassCard>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#F8F5F0' },
  h: { fontSize: 20, fontWeight: '700', color: '#3B2B20', marginBottom: 12 },
  input: { backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: 14, padding: 12, marginBottom: 8 },
  label: { color: '#3B2B20', marginBottom: 6, fontWeight: '600' },
});
