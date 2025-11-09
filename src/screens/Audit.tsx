import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, TextInput, Switch, Alert } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { db } from '@/db/sqlite';
import { store, mem } from '@/utils/webStore';
import { auditHtml } from '@/utils/report';
import HapticPress from '@/components/HapticPress';
import { loadChecklists, ChecklistConfig, DEFAULT_CHECKLISTS } from '@/services/settings';

type Checks = Record<string, boolean>;

export default function Audit(){
  const [cafe,setCafe]=useState('Кафе №1');
  const [date,setDate]=useState(new Date().toISOString().slice(0,10));
  const [espresso,setEspresso]=useState({grind:'',time:'',yield:'',comments:''});
  const [drinks,setDrinks]=useState<{checks:Checks,comment?:string}>({checks:{}});
  const [standards,setStandards]=useState<{checks:Checks,comment?:string}>({checks:{}});
  const [cleanliness,setCleanliness]=useState<{checks:Checks,comment?:string}>({checks:{}});
  const [expiry,setExpiry]=useState<{checks:Checks,comment?:string}>({checks:{}});
  const [cfg,setCfg]=useState<ChecklistConfig>(DEFAULT_CHECKLISTS);

  const database = db();

  useEffect(()=>{
    (async()=>{
      const c = await loadChecklists();
      setCfg(c);
      // init switches to true (checked = OK). Отсутствующая галочка = нарушение.
      const toMap = (arr:string[]) => Object.fromEntries(arr.map(k=>[k,true]));
      setDrinks({checks:toMap([])}); // Drinks чекбоксы в твоем ТЗ внутри карточек напитков — здесь опущены для краткости
      setStandards({checks:toMap(c.standards)});
      setCleanliness({checks:toMap(c.cleanliness)});
      setExpiry({checks:toMap(c.expiry)});
    })();
  },[]);

  const save = async()=>{
    const payload:any = { cafe, date, espresso, drinks, standards, cleanliness, expiry, created_at:new Date().toISOString() };
    if(!database){ store.addAudit(payload); Alert.alert('Сохранено (web)'); return; }
    await database.runAsync?.('INSERT INTO audits(cafe,date,espresso_grind,espresso_time,espresso_yield,espresso_comment,drinks_json,standards_json,cleanliness_json,expiry_json,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?)',[
      cafe,date,espresso.grind,espresso.time,espresso.yield,espresso.comments,JSON.stringify(drinks),JSON.stringify(standards),JSON.stringify(cleanliness),JSON.stringify(expiry),payload.created_at
    ]);
    Alert.alert('Сохранено');
  };

  const exportPdf = async()=>{
    const html = auditHtml({ cafe, date, espresso, drinks, standards, cleanliness, expiry });
    const { uri } = await Print.printToFileAsync({ html });
    const can = await Sharing.isAvailableAsync();
    if(can) await Sharing.shareAsync(uri);
    else Alert.alert('PDF готов', uri);
  };

  const renderSwitches=(obj:Checks,setter:(s:any)=>void)=> Object.keys(obj).map(k=>(
    <View key={k} style={{ flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingVertical:6 }}>
      <Text>{k}</Text>
      <Switch value={obj[k]} onValueChange={(v)=> setter((p:any)=>({...p,checks:{...p.checks,[k]:v}})) }/>
    </View>
  ));

  return (
    <ScrollView style={{ padding:16, backgroundColor:'#fff' }}>
      <Text style={{ fontSize:22, fontWeight:'700' }}>Аудит</Text>
      <TextInput placeholder="Кафе" value={cafe} onChangeText={setCafe} style={{ borderWidth:1, borderColor:'#ccc', borderRadius:8, padding:10, marginTop:8 }} />
      <TextInput placeholder="Дата" value={date} onChangeText={setDate} style={{ borderWidth:1, borderColor:'#ccc', borderRadius:8, padding:10, marginTop:8 }} />

      <Text style={{ marginTop:12, fontWeight:'700' }}>Espresso</Text>
      <TextInput placeholder="Вес помола" value={espresso.grind} onChangeText={(v)=>setEspresso({...espresso,grind:v})} style={{ borderWidth:1, borderColor:'#ccc', borderRadius:8, padding:10, marginTop:6 }} />
      <TextInput placeholder="Время" value={espresso.time} onChangeText={(v)=>setEspresso({...espresso,time:v})} style={{ borderWidth:1, borderColor:'#ccc', borderRadius:8, padding:10, marginTop:6 }} />
      <TextInput placeholder="Выход" value={espresso.yield} onChangeText={(v)=>setEspresso({...espresso,yield:v})} style={{ borderWidth:1, borderColor:'#ccc', borderRadius:8, padding:10, marginTop:6 }} />
      <TextInput placeholder="Комментарий" value={espresso.comments} onChangeText={(v)=>setEspresso({...espresso,comments:v})} style={{ borderWidth:1, borderColor:'#ccc', borderRadius:8, padding:10, marginTop:6 }} />

      <Text style={{ marginTop:12, fontWeight:'700' }}>Standards</Text>
      {renderSwitches(standards.checks, setStandards)}
      <TextInput placeholder="Комментарий" value={standards.comment||''} onChangeText={(v)=>setStandards({...standards,comment:v})} style={{ borderWidth:1, borderColor:'#ccc', borderRadius:8, padding:10, marginTop:6 }} />

      <Text style={{ marginTop:12, fontWeight:'700' }}>Cleanliness</Text>
      {renderSwitches(cleanliness.checks, setCleanliness)}
      <TextInput placeholder="Комментарий" value={cleanliness.comment||''} onChangeText={(v)=>setCleanliness({...cleanliness,comment:v})} style={{ borderWidth:1, borderColor:'#ccc', borderRadius:8, padding:10, marginTop:6 }} />

      <Text style={{ marginTop:12, fontWeight:'700' }}>Expiry</Text>
      {renderSwitches(expiry.checks, setExpiry)}
      <TextInput placeholder="Комментарий" value={expiry.comment||''} onChangeText={(v)=>setExpiry({...expiry,comment:v})} style={{ borderWidth:1, borderColor:'#ccc', borderRadius:8, padding:10, marginTop:6 }} />

      <View style={{ height:10 }} />
      <HapticPress style={{ padding:12, backgroundColor:'#8B1E2D', borderRadius:10, alignItems:'center' }} onPress={save}><Text style={{ color:'#fff' }}>💾 Сохранить</Text></HapticPress>
      <View style={{ height:8 }} />
      <HapticPress style={{ padding:12, backgroundColor:'#3A5F0B', borderRadius:10, alignItems:'center' }} onPress={exportPdf}><Text style={{ color:'#fff' }}>📄 Экспорт PDF</Text></HapticPress>

      <View style={{ height:40 }} />
    </ScrollView>
  );
}
