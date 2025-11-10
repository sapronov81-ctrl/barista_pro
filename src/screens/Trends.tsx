import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, TextInput, ActivityIndicator } from 'react-native';
import * as rssParser from 'react-native-rss-parser';
import { summarizeTrends } from '@/services/ai';
import HapticPress from '@/components/HapticPress';

const defaultSources = [
  'https://sprudge.com/feed',
  'https://dailycoffeenews.com/feed',
];

export default function Trends() {
  const [sources, setSources] = useState(defaultSources.join('\n'));
  const [items, setItems] = useState<any[]>([]);
  const [summary, setSummary] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const list: any[] = [];

      const urls = sources
        .split('\n')
        .map((x) => x.trim())
        .filter(Boolean);

      for (const url of urls) {
        try {
          const response = await fetch(url);
          const xml = await response.text();
          const feed = await rssParser.parse(xml);

          feed.items.slice(0, 5).forEach((it: any) => {
            list.push({
              title: it.title,
              link: it.links?.[0]?.url,
              source: feed.title,
            });
          });
        } catch (err) {
          console.warn(`Ошибка загрузки RSS: ${url}`, err);
        }
      }

      setItems(list);
      const summaryResponse = await summarizeTrends(
        list.map((x) => ({ title: x.title, source: x.source }))
      );
      setSummary(summaryResponse);
    } catch (e) {
      console.error(e);
      setItems([]);
      setSummary([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <ScrollView style={{ padding: 16, backgroundColor: '#fff' }}>
      <Text style={{ fontSize: 22, fontWeight: '700' }}>Тренды</Text>

      <TextInput
        multiline
        numberOfLines={4}
        value={sources}
        onChangeText={setSources}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 8,
          padding: 10,
          marginTop: 8,
          fontFamily: 'monospace',
        }}
      />

      <View style={{ height: 8 }} />

      <HapticPress
        style={{
          padding: 10,
          backgroundColor: '#8B1E2D',
          borderRadius: 10,
          alignItems: 'center',
        }}
        onPress={load}
      >
        <Text style={{ color: '#fff', fontWeight: '600' }}>
          {loading ? 'Обновление...' : 'Обновить'}
        </Text>
      </HapticPress>

      {loading && (
        <ActivityIndicator
          size="large"
          color="#8B1E2D"
          style={{ marginTop: 16 }}
        />
      )}

      {summary && summary.length > 0 && (
        <View
          style={{
            borderWidth: 1,
            borderColor: '#e5e7eb',
            borderRadius: 12,
            padding: 12,
            marginTop: 12,
          }}
        >
          {summary.map((s, i) => (
            <Text key={i}>• {s}</Text>
          ))}
        </View>
      )}

      {items.map((it, i) => (
        <View
          key={i}
          style={{
            borderWidth: 1,
            borderColor: '#e5e7eb',
            borderRadius: 12,
            padding: 12,
            marginTop: 8,
          }}
        >
          <Text style={{ fontWeight: '700' }}>{it.title}</Text>
          <Text style={{ color: '#6b7280' }}>{it.source}</Text>
        </View>
      ))}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}
