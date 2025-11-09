export function violationsFromChecks(checks: Record<string, boolean>, title: string) {
  return Object.entries(checks).filter(([_,v])=>v===false).map(([k])=>`${title}: ${k}`);
}
export function esc(s:string){return (s||'').replace(/[&<>"']/g,(m)=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]!));}
export function auditHtml(a:any){
  const v=[
    ...violationsFromChecks(a.drinks?.checks||{},'Drinks'),
    ...violationsFromChecks(a.standards?.checks||{},'Standards'),
    ...violationsFromChecks(a.cleanliness?.checks||{},'Cleanliness'),
    ...violationsFromChecks(a.expiry?.checks||{},'Expiry'),
  ];
  const comments=[a.espresso?.comments,a.drinks?.comment,a.standards?.comment,a.cleanliness?.comment,a.expiry?.comment]
    .filter((x:string)=>x&&x.trim().length>0);
  return `<html><head><meta charset='utf-8'/><style>body{font-family:system-ui;padding:16px}</style></head><body>
  <h1>Отчёт аудита</h1><p>Кафе: <b>${esc(a.cafe||'')}</b> · ${esc(a.date||'')}</p>
  <h2>Нарушения</h2>${v.length?`<ul>${v.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:'<p>Нарушений нет</p>'}
  ${comments.length?`<h2>Комментарии</h2>${comments.map(c=>`<p>${esc(c)}</p>`).join('')}`:''}
  </body></html>`;
}
export function attHtml(t:any){
  const ok = t.totalPercent>=85;
  return `<html><head><meta charset='utf-8'/><style>body{font-family:system-ui;padding:16px}</style></head><body>
  <h1>Отчёт аттестации</h1>
  <p>Кафе: <b>${esc(t.cafe||'')}</b> · Сотрудник: <b>${esc(t.fio||'')}</b> · Дата: ${esc(t.date||'')}</p>
  <p>Время: ${t.practiceTime}s / целевое ${t.targetTime}s; Баллы: подготовка ${t.prepScore}%, практика ${t.practiceScore}%, теория ${t.theoryScore}%, бонус ${t.speedBonus}%</p>
  <h2>Итог</h2><p>${ok?'Сдано':'Не сдано'} — ${t.totalPercent}% · Категория ${esc(t.category||'')}</p>
  </body></html>`;
}
