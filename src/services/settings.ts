import { Platform } from 'react-native';
import { db } from '@/db/sqlite';
import { mem } from '@/utils/webStore';

export type TheoryConfig = { coffee:string[]; milk:string[]; menu:string[]; equipment:string[] };
export type ChecklistConfig = { espresso:string[]; standards:string[]; cleanliness:string[]; expiry:string[] };

export const DEFAULT_THEORY: TheoryConfig = {
  coffee: ['Что такое эспрессо?','Сколько секунд пролив?','Температура воды?'],
  milk: ['Какая температура вспенивания?','Что влияет на текстуру?','Как чистить питчер?'],
  menu: ['Какие напитки в линейке?','Объём капучино?','Особенности альтернативы?'],
  equipment: ['Как промыть группу?','Как чистить кофемолку?','Как проверить давление?'],
};
export const DEFAULT_CHECKLISTS: ChecklistConfig = {
  espresso: ['Вес помола','Время','Выход'],
  standards: ['Форма','Приветствие/скорость','Организация места'],
  cleanliness: ['Поверхности','Оборудование','Инвентарь','Хранение'],
  expiry: ['Маркировка','Просрочка','FIFO','Холодильники'],
};

export async function loadTheory(): Promise<TheoryConfig>{
  if(Platform.OS==='web'){ return mem.settings?.theory||DEFAULT_THEORY; }
  const database = db();
  if(!database) return DEFAULT_THEORY;
  const row = await database.getFirstAsync?.('SELECT theory_config_json FROM settings WHERE id=1');
  if(row?.theory_config_json){
    try{ return JSON.parse(row.theory_config_json); }catch{}
  }
  return DEFAULT_THEORY;
}

export async function saveTheory(cfg: TheoryConfig){
  if(Platform.OS==='web'){ mem.settings = mem.settings||{}; mem.settings.theory = cfg; return; }
  const database = db(); if(!database) return;
  await database.runAsync?.('UPDATE settings SET theory_config_json=? WHERE id=1',[JSON.stringify(cfg)]);
}

export async function loadChecklists(): Promise<ChecklistConfig>{
  if(Platform.OS==='web'){ return mem.settings?.checklists||DEFAULT_CHECKLISTS; }
  const database = db();
  if(!database) return DEFAULT_CHECKLISTS;
  const row = await database.getFirstAsync?.('SELECT checklist_config_json FROM settings WHERE id=1');
  if(row?.checklist_config_json){
    try{ return JSON.parse(row.checklist_config_json); }catch{}
  }
  return DEFAULT_CHECKLISTS;
}

export async function saveChecklists(cfg: ChecklistConfig){
  if(Platform.OS==='web'){ mem.settings = mem.settings||{}; mem.settings.checklists = cfg; return; }
  const database = db(); if(!database) return;
  await database.runAsync?.('UPDATE settings SET checklist_config_json=? WHERE id=1',[JSON.stringify(cfg)]);
}
