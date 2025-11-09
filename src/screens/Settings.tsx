import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, TextInput, Alert } from 'react-native';
import { db } from '@/db/sqlite';
import HapticPress from '@/components/HapticPress';
import { DEFAULT_THEORY, DEFAULT_CHECKLISTS, loadTheory, saveTheory, loadChecklists, saveChecklists } from '@/services/settings';

export default function Settings(){
  const database = db();
  const [locale,setLocale]=useState('ru');
  const [threshold,setThreshold]=useState('85');

  const [theoryText,setTheoryText]=useState(JSON.stringify(DEFAULT_THEORY, null, 2));
  const [checklistsText,setChecklistsText]=useState(JSON.stringify(DEFAULT_CHECKLISTS, null, 2));

  useEffect(()=>{
    (async()=>{
      if(database){
        const row = await database.getFirstAsync?.('SELECT locale, pass_threshold, theory_config_json, checklist_config_json FROM settings WHERE id=1');
        if(row){ setLocale(row.locale||'ru'); setThreshold(String(row.pass_threshold||85)); }
        const t = await loadTheory(); setTheoryText(JSON.stringify(t,null,2));
        const c = await loadChecklists(); setChecklistsText(JSON.stringify(c,null,2));
      }else{
        const t = await loadTheory(); setTheoryText(JSON.stringify(t,null,2));
        const c = await loadChecklists(); setChecklistsText(JSON.stringify(c,null,2));
      }
    })();
  },[]);

  const saveBasics=async()=>{
    if(!database){ Alert.alert('Web-режим: базовые настройки не сохраняются в БД'); return; }
    await database.runAsync?.('UPDATE settings SET locale=?, pass_threshold=? WHERE id=1',[locale, parseInt(threshold||'85',10)]);
    Alert.alert('Сохранено');
  };

  const saveTheoryJson=async()=>{
    try{
      const parsed = JSON.parse(theoryText);
      await saveTheory(parsed);
      Alert.alert('Вопросы теории сохранены');
    }catch(e:any){ Alert.alert('Ошибка JSON', String(e)); }
  };
  const resetTheory=()=> setTheoryText(JSON.stringify(DEFAULT_THEORY,null,2));

  const saveChecklistsJson=async()=>{
    try{
      const parsed = JSON.parse(checklistsText);
      await saveChecklists(parsed);
      Alert.alert('Чек-листы сохранены');
    }catch(e:any){ Alert.alert('Ошибка JSON', String(e)); }
  };
  const resetChecklists=()=> setChecklistsText(JSON.stringify(DEFAULT_CHECKLISTS,null,2));

  return (
    <ScrollView style={{ padding:16, backgroundColor:'#fff' }}>
      <Text style={{ fontSize:22, fontWeight:'700' }}>Настройки</Text>
      <Text>Язык (ru/en)</Text>
      <TextInput value={locale} onChangeText={setLocale} style={{ borderWidth:1, borderColor:'#ccc', borderRadius:8, padding:10, marginTop:6 }} />
      <Text style={{ marginTop:8 }}>Порог сдачи (%)</Text>
      <TextInput value={threshold} onChangeText={setThreshold} keyboardType="numeric" style={{ borderWidth:1, borderColor:'#ccc', borderRadius:8, padding:10, marginTop:6 }} />
      <View style={{ height:8 }} />
      <HapticPress style={{ padding:10, backgroundColor:'#8B1E2D', borderRadius:10, alignItems:'center' }} onPress={saveBasics}><Text style={{ color:'#fff' }}>Сохранить</Text></HapticPress>

      <View style={{ height:16 }} />
      <Text style={{ fontSize:18, fontWeight:'700' }}>Конфиги</Text>

      <View style={{ borderWidth:1, borderColor:'#e5e7eb', borderRadius:12, padding:12, marginTop:8 }}>
        <Text style={{ fontWeight:'700' }}>Вопросы теории (JSON)</Text>
        <TextInput multiline numberOfLines={12} value={theoryText} onChangeText={setTheoryText} style={{ borderWidth:1, borderColor:'#ccc', borderRadius:8, padding:10, marginTop:8, fontFamily:'monospace' }} />
        <View style={{ flexDirection:'row', gap:8 as any, marginTop:8 }}>
          <HapticPress style={{ padding:10, backgroundColor:'#3A5F0B', borderRadius:10, alignItems:'center' }} onPress={saveTheoryJson}><Text style={{ color:'#fff' }}>Сохранить</Text></HapticPress>
          <HapticPress style={{ padding:10, backgroundColor:'#4B2E2B', borderRadius:10, alignItems:'center' }} onPress={resetTheory}><Text style={{ color:'#fff' }}>Сбросить</Text></HapticPress>
        </View>
      </View>

      <View style={{ borderWidth:1, borderColor:'#e5e7eb', borderRadius:12, padding:12, marginTop:12 }}>
        <Text style={{ fontWeight:'700' }}>Чек-листы аудита (JSON)</Text>
        <TextInput multiline numberOfLines={12} value={checklistsText} onChangeText={setChecklistsText} style={{ borderWidth:1, borderColor:'#ccc', borderRadius:8, padding:10, marginTop:8, fontFamily:'monospace' }} />
        <View style={{ flexDirection:'row', gap:8 as any, marginTop:8 }}>
          <HapticPress style={{ padding:10, backgroundColor:'#3A5F0B', borderRadius:10, alignItems:'center' }} onPress={saveChecklistsJson}><Text style={{ color:'#fff' }}>Сохранить</Text></HapticPress>
          <HapticPress style={{ padding:10, backgroundColor:'#4B2E2B', borderRadius:10, alignItems:'center' }} onPress={resetChecklists}><Text style={{ color:'#fff' }}>Сбросить</Text></HapticPress>
        </View>
      </View>

      <View style={{ height:40 }} />
    </ScrollView>
  );
}
