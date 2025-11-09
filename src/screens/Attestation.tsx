import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, View, Text, TextInput, Alert } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { db } from '@/db/sqlite';
import { store } from '@/utils/webStore';
import { attHtml } from '@/utils/report';
import HapticPress from '@/components/HapticPress';
import { loadTheory, DEFAULT_THEORY } from '@/services/settings';

export default function Attestation(){
  const [cafe,setCafe]=useState('Кафе №1');
  const [date,setDate]=useState(new Date().toISOString().slice(0,10));
  const [fio,setFio]=useState('Иван Петров');
  const [target,setTarget]=useState('300'); // сек
  const [elapsed,setElapsed]=useState(0);
  const [running,setRunning]=useState(false);
  const [theory,setTheory]=useState(DEFAULT_THEORY);
  const [answers,setAnswers]=useState<Record<string,string[]>>({}); // per-block answers 'y'/'n'

  const database = db();

  useEffect(()=>{(async()=>{ setTheory(await loadTheory()); })();},[]);
  useEffect(()=>{
    if(!running) return;
    const id=setInterval(()=>setElapsed(e=>e+1),1000);
    return ()=>clearInterval(id);
  },[running]);

  const totalTheory = useMemo(()=>{
    // каждая правильная = 1 балл; здесь без проверки правильности — считаем по отмеченным 'y'
    const all = Object.values(theory).reduce((a,arr)=>a+arr.length,0);
    const got = Object.keys(theory).reduce((acc,block)=>acc + (answers[block]?.filter(x=>x==='y').length||0),0);
    const pct = all>0? Math.floor(100*got/all):0;
    return { all, got, pct };
  },[answers,theory]);

  const startTimer=()=>{ setElapsed(0); setRunning(true); };
  const stopTimer=()=>{ setRunning(false); };

  const save=async()=>{
    const prepScore=100; // упрощение: подготовка ок
    const practiceScore=100; // упрощение: практика ок
    const theoryScore=totalTheory.pct;
    const speedBonus = (elapsed<=parseInt(target||'0',10))?5:0;
    const totalPercent = min100(prepScore + practiceScore + theoryScore + speedBonus)/3; // условная метрика
    const category = totalPercent>=85? 'Сдано' : 'Не сдано';
    const payload:any = { cafe, date, fio, target_seconds:parseInt(target,10), practice_time_seconds:elapsed,
      theory_json: JSON.stringify(answers), scores_json: JSON.stringify({prepScore,practiceScore,theoryScore,speedBonus,totalPercent}), category, created_at:new Date().toISOString() };
    if(!database){ store.addAtt(payload); Alert.alert('Сохранено (web)'); return; }
    await database.runAsync?.('INSERT INTO attestations(cafe,date,fio,target_seconds,practice_time_seconds,theory_json,scores_json,category,created_at) VALUES (?,?,?,?,?,?,?,?,?)',[
      cafe,date,fio,payload.target_seconds,payload.practice_time_seconds,payload.theory_json,payload.scores_json,category,payload.created_at
    ]);
    Alert.alert('Сохранено');
  };

  const exportPdf=async()=>{
    const prepScore=100, practiceScore=100, theoryScore=totalTheory.pct, speedBonus=(elapsed<=parseInt(target||'0',10))?5:0;
    const totalPercent = Math.floor((prepScore+practiceScore+theoryScore+speedBonus)/3);
    const html = attHtml({ cafe, fio, date, practiceTime:elapsed, targetTime:parseInt(target||'0',10), prepScore, practiceScore, theoryScore, speedBonus, totalPercent, category: totalPercent>=85?'A':'B' });
    const { uri } = await Print.printToFileAsync({ html });
    const can = await Sharing.isAvailableAsync();
    if(can) await Sharing.shareAsync(uri); else Alert.alert('PDF готов', uri);
  };

  const togg=(block:string, idx:number, val:'y'|'n')=>{
    setAnswers(p=>{
      const arr = p[block]? [...p[block]] : Array(theory[block as keyof typeof theory].length).fill('n');
      arr[idx]=val; return {...p,[block]:arr};
    });
  };

  return (
    <ScrollView style={{ padding:16, backgroundColor:'#fff' }}>
      <Text style={{ fontSize:22, fontWeight:'700' }}>Аттестация</Text>
      <TextInput placeholder="Кафе" value={cafe} onChangeText={setCafe} style={{ borderWidth:1, borderColor:'#ccc', borderRadius:8, padding:10, marginTop:8 }} />
      <TextInput placeholder="Дата" value={date} onChangeText={setDate} style={{ borderWidth:1, borderColor:'#ccc', borderRadius:8, padding:10, marginTop:8 }} />
      <TextInput placeholder="ФИО" value={fio} onChangeText={setFio} style={{ borderWidth:1, borderColor:'#ccc', borderRadius:8, padding:10, marginTop:8 }} />
      <TextInput placeholder="Целевое время (сек)" value={target} onChangeText={setTarget} keyboardType="numeric" style={{ borderWidth:1, borderColor:'#ccc', borderRadius:8, padding:10, marginTop:8 }} />

      <View style={{ flexDirection:'row', gap:8 as any, marginTop:8 }}>
        <HapticPress style={{ padding:12, backgroundColor:'#3A5F0B', borderRadius:10, alignItems:'center' }} onPress={startTimer}><Text style={{ color:'#fff' }}>▶ Старт</Text></HapticPress>
        <HapticPress style={{ padding:12, backgroundColor:'#8B1E2D', borderRadius:10, alignItems:'center' }} onPress={stopTimer}><Text style={{ color:'#fff' }}>⏸ Стоп ({elapsed}s)</Text></HapticPress>
      </View>

      {Object.keys(theory).map((block)=>(
        <View key={block} style={{ borderWidth:1, borderColor:'#e5e7eb', borderRadius:12, padding:12, marginTop:12 }}>
          <Text style={{ fontWeight:'700', marginBottom:8 }}>{block.toUpperCase()}</Text>
          {theory[block as keyof typeof theory].map((q,idx)=>(
            <View key={idx} style={{ marginBottom:8 }}>
              <Text>{idx+1}. {q}</Text>
              <View style={{ flexDirection:'row', gap:8 as any, marginTop:4 }}>
                <HapticPress style={{ padding:8, backgroundColor:'#e5e7eb', borderRadius:8 }} onPress={()=>togg(block,idx,'y')}><Text>✅</Text></HapticPress>
                <HapticPress style={{ padding:8, backgroundColor:'#e5e7eb', borderRadius:8 }} onPress={()=>togg(block,idx,'n')}><Text>❌</Text></HapticPress>
              </View>
            </View>
          ))}
        </View>
      ))}

      <View style={{ height:10 }} />
      <HapticPress style={{ padding:12, backgroundColor:'#8B1E2D', borderRadius:10, alignItems:'center' }} onPress={save}><Text style={{ color:'#fff' }}>💾 Сохранить</Text></HapticPress>
      <View style={{ height:8 }} />
      <HapticPress style={{ padding:12, backgroundColor:'#3A5F0B', borderRadius:10, alignItems:'center' }} onPress={exportPdf}><Text style={{ color:'#fff' }}>📄 Экспорт PDF</Text></HapticPress>

      <View style={{ height:40 }} />
    </ScrollView>
  );
}
function min100(n:number){ return Math.max(0, Math.min(100, n)); }
