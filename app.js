'use strict';
const $=id=>document.getElementById(id), esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const KEY='ubion-schedule-studio-v1', DAYS=['일','월','화','수','목','금','토'];
const PALETTE=[['#e8f4ee','#447b63','#82b59a'],['#edf0fa','#6574a2','#9caadb'],['#fff3e5','#a68351','#e3bd85'],['#e7f4f6','#54828c','#8cbac3'],['#f3edfa','#8b70a2','#c1a5d6'],['#f8ecee','#a46d7a','#d6a1ad']];
function today(){const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
function add(date,n){const d=new Date(date+'T00:00:00Z');d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10);}
function monthAdd(month,n){const d=new Date(month+'-01T00:00:00Z');d.setUTCMonth(d.getUTCMonth()+n);return d.toISOString().slice(0,7);}
const number=d=>Date.parse(d+'T00:00:00Z')/86400000;
const validDate=d=>typeof d==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(d)&&Number.isFinite(number(d))&&new Date(d+'T00:00:00Z').toISOString().slice(0,10)===d;
const style=i=>{const c=PALETTE[i%PALETTE.length];return `--bar-bg:${c[0]};--bar-ink:${c[1]};--bar-accent:${c[2]}`;};
const uid=()=>crypto.randomUUID();
const baseHolidays=[['2026-01-01','신정'],['2026-02-16','설 연휴'],['2026-02-17','설날'],['2026-02-18','설 연휴'],['2026-03-01','삼일절'],['2026-03-02','삼일절 대체공휴일'],['2026-05-05','어린이날'],['2026-05-24','부처님오신날'],['2026-05-25','대체공휴일'],['2026-06-03','전국동시지방선거'],['2026-06-06','현충일'],['2026-08-15','광복절'],['2026-08-17','광복절 대체공휴일'],['2026-09-24','추석 연휴'],['2026-09-25','추석'],['2026-09-26','추석 연휴'],['2026-10-03','개천절'],['2026-10-05','개천절 대체공휴일'],['2026-10-09','한글날'],['2026-12-25','성탄절']].map(([date,name])=>({date,name}));
// Source: KASA, 2027 calendar announcement, 2026-06-29 (plcyBrfNo=431).
const holidays2027=[['2027-01-01','신정'],['2027-02-06','설 연휴'],['2027-02-07','설날'],['2027-02-08','설 연휴'],['2027-02-09','설날 대체공휴일'],['2027-03-01','삼일절'],['2027-05-01','노동절'],['2027-05-03','노동절 대체공휴일'],['2027-05-05','어린이날'],['2027-05-13','부처님오신날'],['2027-06-06','현충일'],['2027-07-17','제헌절'],['2027-07-19','제헌절 대체공휴일'],['2027-08-15','광복절'],['2027-08-16','광복절 대체공휴일'],['2027-09-14','추석 연휴'],['2027-09-15','추석'],['2027-09-16','추석 연휴'],['2027-10-03','개천절'],['2027-10-04','개천절 대체공휴일'],['2027-10-09','한글날'],['2027-10-11','한글날 대체공휴일'],['2027-12-25','성탄절'],['2027-12-27','성탄절 대체공휴일']].map(([date,name])=>({date,name}));
baseHolidays.push(...holidays2027);
function demo(){return {version:1,holidayCatalogVersion:2027,demo:true,holidays:baseHolidays.map(h=>({...h})),cohorts:[
{id:'demo1',name:'금융 빅데이터 12기',start:'2026-09-01',hours:8,weekdays:[1,2,3,4,5],curriculum:[{subject:'Python & 데이터 기초',instructor:'김민수',days:20},{subject:'금융 데이터 분석',instructor:'이지은',days:25},{subject:'머신러닝 실무',instructor:'박준호',days:25},{subject:'기업 연계 프로젝트',instructor:'김민수',days:40}]},
{id:'demo2',name:'AI 서비스 개발 3기',start:'2026-09-21',hours:8,weekdays:[1,2,3,4,5],curriculum:[{subject:'Python 프로그래밍',instructor:'김민수',days:15},{subject:'딥러닝 & 생성형 AI',instructor:'최서연',days:30},{subject:'AI 서비스 개발',instructor:'정우진',days:25},{subject:'실무 프로젝트',instructor:'최서연',days:35}]},
{id:'demo3',name:'에듀테크 기획 7기',start:'2026-10-12',hours:7,weekdays:[1,2,3,4,5],curriculum:[{subject:'서비스 기획 기초',instructor:'한지수',days:18},{subject:'UX 리서치 & 설계',instructor:'윤수빈',days:22},{subject:'데이터 기반 기획',instructor:'이지은',days:20},{subject:'기획 프로젝트',instructor:'한지수',days:30}]},
{id:'demo4',name:'금융 AI 실무 · 재직자',start:'2026-11-07',hours:6,weekdays:[6],curriculum:[{subject:'생성형 AI 활용',instructor:'정우진',days:5},{subject:'업무 자동화',instructor:'박준호',days:6},{subject:'미니 프로젝트',instructor:'정우진',days:4}]}]};}
function normalize(raw){
 if(!raw||!Array.isArray(raw.cohorts)||raw.cohorts.length>100)throw Error('기수 데이터 형식이 올바르지 않습니다. 최대 100개 기수를 지원합니다.');
 const legacy=raw.cohorts.some(c=>'startDate'in c)||('customHolidays'in raw);
 const cohorts=raw.cohorts.map(c=>{
  const start=c.start||c.startDate, weekdays=c.weekdays||(c.includeWeekends?[0,1,2,3,4,5,6]:[1,2,3,4,5]), hours=Number(c.hours??8);
  if(typeof c.name!=='string'||!c.name.trim()||c.name.length>100||!validDate(start)||start<'2000-01-01'||start>'2090-12-31'||!Array.isArray(weekdays)||!weekdays.length||weekdays.some(x=>!Number.isInteger(x)||x<0||x>6)||!Number.isFinite(hours)||hours<1||hours>24||!Array.isArray(c.curriculum)||!c.curriculum.length||c.curriculum.length>100)throw Error('기수명, 개강일, 수업 요일, 교육시간, 커리큘럼을 확인해주세요.');
  const curriculum=c.curriculum.map(s=>{if(typeof s.subject!=='string'||!s.subject.trim()||typeof s.instructor!=='string'||!s.instructor.trim()||s.subject.length>100||s.instructor.length>100||!Number.isInteger(s.days)||s.days<1||s.days>1000)throw Error('과목과 강사명, 1~1000의 정수 수업일수가 필요합니다.');return {subject:s.subject.trim(),instructor:s.instructor.trim(),days:s.days};});
  if(curriculum.reduce((n,s)=>n+s.days,0)>1500)throw Error('기수별 수업일수 합계는 1500일 이하여야 합니다.');
  return {id:typeof c.id==='string'&&c.id.length<100?c.id:uid(),name:c.name.trim(),start,hours,weekdays:[...new Set(weekdays)],curriculum};
 });
 const ids=new Set();cohorts.forEach(c=>{if(ids.has(c.id))c.id=uid();ids.add(c.id);});
 const holidayInput=legacy?[...baseHolidays,...(raw.customHolidays||[])]:raw.holidays;
 if(!Array.isArray(holidayInput)||holidayInput.length>2000)throw Error('휴일 목록을 확인해주세요.');
 const holidayMap=new Map();holidayInput.forEach(h=>{if(!validDate(h.date)||typeof h.name!=='string'||!h.name.trim()||h.name.length>100)throw Error('휴일 날짜와 이름을 확인해주세요.');holidayMap.set(h.date,{date:h.date,name:h.name.trim()});});
 // Apply the new year only once; keep user names and later intentional deletions.
 if(raw.holidayCatalogVersion!==2027)holidays2027.forEach(h=>{if(!holidayMap.has(h.date))holidayMap.set(h.date,{...h});});
 return {version:1,holidayCatalogVersion:2027,demo:raw.demo===true,cohorts,holidays:[...holidayMap.values()].sort((a,b)=>a.date.localeCompare(b.date))};
}
function calculate(data){
 const holidays=new Set(data.holidays.map(h=>h.date)), counts=new Map();
 const cohorts=data.cohorts.map((c,ci)=>{
  let date=c.start; const schedule=[];
  const subjects=c.curriculum.map((s,si)=>{const dates=[];let guard=0;while(dates.length<s.days){if(++guard>20000)throw Error('일정 범위가 너무 큽니다. 수업일과 휴일을 확인해주세요.');if(c.weekdays.includes(new Date(date+'T00:00:00Z').getUTCDay())&&!holidays.has(date)){dates.push(date);schedule.push({date,...s,si,ci});const key=JSON.stringify([date,s.instructor]);counts.set(key,(counts.get(key)||0)+1);}date=add(date,1);}return {...s,dates,start:dates[0],end:dates.at(-1),si};});
  return {...c,ci,subjects,schedule,map:new Map(schedule.map(s=>[s.date,s])),end:schedule.at(-1)?.date};
 });
 const conflicts=[...counts].filter(([,n])=>n>1).map(([key,count])=>{const [date,instructor]=JSON.parse(key);return {date,instructor,count};}).sort((a,b)=>a.date.localeCompare(b.date));
 return {cohorts,counts,conflicts};
}
let data, loadError=false;try{const saved=localStorage.getItem(KEY);data=saved?normalize(JSON.parse(saved)):demo();}catch{data=demo();loadError=true;}
let model=calculate(data), view='overview', filter='all', anchor=today().slice(0,7), range='3', tableRange='month', hideOff=true, holidayYear='2026', toastTimer;
let cohortSearch='', cohortStatus='all', deletedCohort=null;
function notify(msg){$('toast').textContent=msg;$('toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('show'),4000);}
function save(next){const clean=normalize(next), nextModel=calculate(clean);try{localStorage.setItem(KEY,JSON.stringify(clean));$('saveState').textContent='● 저장됨';}catch{notify('저장 공간을 사용할 수 없습니다. 지금 백업을 다운로드해주세요.');$('saveState').textContent='저장 실패 · 백업 필요';}data=clean;model=nextModel;render();}
function instructors(){return [...new Set(data.cohorts.flatMap(c=>c.curriculum.map(s=>s.instructor)))].sort();}
function clash(date,name){return model.counts.get(JSON.stringify([date,name]))>1;}
function setView(v){view=v;render();}
function filterControl(){return `<select id="instructorFilter" aria-label="강사 필터"><option value="all">모든 강사</option>${instructors().map(n=>`<option ${filter===n?'selected':''} value="${esc(n)}">${esc(n)}</option>`).join('')}</select>`;}
function render(){
 const t=today();if(filter!=='all'&&!instructors().includes(filter))filter='all';
 $('demoBanner').hidden=!data.demo;$('demoBanner').style.display=data.demo?'flex':'none';
 const titles={cohorts:['기수 관리','기수 관리를 더 간편하게.','추가부터 수정·복제·삭제까지, 한곳에서 관리하세요.'],overview:['전체 흐름','교육의 흐름을 한눈에.','기수별 일정부터 강사 배정까지, 긴 스크롤 없이 확인하세요.'],month:['월별 시간표','이번 달 수업을 나란히.','필요한 한 달만, 여러 기수의 일정을 함께 비교하세요.'],instructors:['강사 배정','겹치는 일정 없이, 명확하게.','강사별 투입일과 중복 배정을 확인하세요.'],holidays:['휴일 관리','쉬는 날까지 계획에 담다.','휴일을 변경하면 모든 기수의 교육 일정이 다시 계산됩니다.']};
 $('crumb').textContent=titles[view][0];$('pageTitle').textContent=titles[view][1];$('pageSubtitle').textContent=titles[view][2];
 document.querySelectorAll('[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===view));
 const active=model.cohorts.filter(c=>c.schedule[0]?.date<=t&&c.end>=t).length, upcoming=model.cohorts.filter(c=>c.schedule[0]?.date>t).length;
 const clashDays=new Set(model.conflicts.map(c=>c.date)).size;
 $('stats').innerHTML=[['운영 중인 기수',active,'개',`전체 ${data.cohorts.length}개 중 · 개강 예정 ${upcoming}개`,'▦'],['함께하는 강사',instructors().length,'명','전체 기수 배정 강사 기준','♧'],['오늘의 수업',model.cohorts.filter(c=>c.map.has(t)).length,'개','오늘 날짜에 배정된 기수 수','▤'],['중복 배정 확인',clashDays,'일','전체 기간 · 같은 날짜 / 같은 강사','↗']].map(([label,n,unit,note,icon],i)=>`<div class="stat ${i===3&&n?'warn':''}"><div class="stat-top">${label}<span class="stat-icon">${icon}</span></div><div class="stat-value">${n}<em>${unit}</em></div><div class="stat-note">${note}</div></div>`).join('');
 $('conflictBanner').innerHTML=clashDays?`<div class="conflict-banner"><span>◉ &nbsp; ${clashDays}일에 강사 중복이 있습니다. 일정 조정이 필요합니다.</span><button id="goConflict">첫 중복 확인 →</button></div>`:'';
 if($('goConflict'))$('goConflict').onclick=()=>{anchor=model.conflicts[0].date.slice(0,7);filter=model.conflicts[0].instructor;view='month';tableRange='month';hideOff=true;render();};
 $('todayLabel').textContent=`오늘 ${t.replaceAll('-','.')} · 예정 일정 기준`;
 if(view==='overview'||view==='month')renderSchedule();else if(view==='instructors')renderInstructors();else if(view==='cohorts')renderCohortManager();else renderHolidays();
}
function bounds(){const dates=model.cohorts.flatMap(c=>[c.schedule[0]?.date,c.end]).filter(Boolean).sort();return {start:dates[0],end:dates.at(-1)};}
function renderSchedule(){
 const overview=view==='overview', fullTable=!overview&&tableRange==='all', noMonthNav=(overview&&range==='all')||fullTable;
 $('toolbar').innerHTML=`<div class="board-title"><strong>${overview?'기수별 교육 로드맵':fullTable?'전체 기간 시간표':`${anchor.replace('-','년 ')}월 시간표`}</strong><small>${overview?'과목을 클릭해 상세 일정 확인':fullTable?'첫 수업일부터 마지막 수업일까지 연속 보기':'날짜별 과목 · 강사 배정'}</small></div><div class="controls">${!overview?`<select id="tableRange" aria-label="시간표 조회 범위"><option value="month" ${!fullTable?'selected':''}>월별 보기</option><option value="all" ${fullTable?'selected':''}>전체 기간 보기</option></select>`:''}${filterControl()}${overview?`<select id="range" aria-label="조회 기간"><option value="3" ${range==='3'?'selected':''}>3개월</option><option value="6" ${range==='6'?'selected':''}>6개월</option><option value="all" ${range==='all'?'selected':''}>전체 기간</option></select>`:''}<button id="prev" aria-label="이전 기간" ${noMonthNav?'disabled':''}>‹</button><input id="monthPick" type="month" min="2000-01" max="2100-12" value="${anchor}" aria-label="조회 시작 월" ${noMonthNav?'disabled':''}><button id="next" aria-label="다음 기간" ${noMonthNav?'disabled':''}>›</button><button id="todayBtn">오늘</button>${!overview?`<label><input id="hideOff" type="checkbox" ${hideOff?'checked':''}> 비수업일 숨기기</label>`:''}</div>`;
 if(!overview)$('tableRange').onchange=e=>{tableRange=e.target.value;render();};
 $('instructorFilter').onchange=e=>{filter=e.target.value;render();};
 $('prev').onclick=()=>{anchor=monthAdd(anchor,-(overview?Number(range):1));render();};$('next').onclick=()=>{anchor=monthAdd(anchor,overview?Number(range):1);render();};
 $('monthPick').onchange=e=>{if(e.target.value){anchor=e.target.value;render();}};$('todayBtn').onclick=()=>{anchor=today().slice(0,7);if(!overview)tableRange='month';if(range==='all')range='3';render();};
 if(overview)$('range').onchange=e=>{range=e.target.value;render();};else $('hideOff').onchange=e=>{hideOff=e.target.checked;render();};
 if(!data.cohorts.length){$('content').innerHTML='<div class="empty"><strong>첫 번째 기수를 만들어보세요.</strong>개강일과 커리큘럼만 입력하면 전체 일정이 만들어집니다.<br><button id="emptyAdd" class="button primary">＋ 새 기수</button></div>';$('emptyAdd').onclick=()=>openEditor();return;}
 overview?renderTimeline():renderMonth();
 document.querySelectorAll('[data-cohort]').forEach(b=>b.onclick=()=>openEditor(b.dataset.cohort));
 document.querySelectorAll('[data-subject]').forEach(b=>b.onclick=()=>openSubject(Number(b.dataset.ci),Number(b.dataset.subject)));
}
function renderTimeline(){
 const b=bounds(), start=range==='all'?b.start.slice(0,7)+'-01':anchor+'-01',end=range==='all'?add(monthAdd(b.end.slice(0,7),1)+'-01',-1):add(monthAdd(anchor,Number(range))+'-01',-1),total=number(end)-number(start)+1;
 const pct=d=>(number(d)-number(start))/total*100;
 let ticks='',grid='',m=start.slice(0,7);let months=0;
 while(m+'-01'<=end){const l=Math.max(0,pct(m+'-01')),r=Math.min(100,pct(monthAdd(m,1)+'-01'));ticks+=`<div class="tick" style="left:${l}%;width:${r-l}%">${m.slice(0,4)}. ${m.slice(5)}</div>`;grid+=`<div class="grid-line" style="left:${l}%"></div>`;m=monthAdd(m,1);months++;}
 const marker=today()>=start&&today()<=end?`<div class="today-line" style="left:${pct(today())}%"><b>오늘</b></div>`:'';
 let rows='';model.cohorts.forEach(c=>{
 const elapsed=c.schedule.filter(s=>s.date<today()).length,progress=Math.round(elapsed/c.schedule.length*100);
 const bars=c.subjects.filter(s=>s.end>=start&&s.start<=end).map(s=>{
  const left=Math.max(0,pct(s.start)),right=Math.min(100,pct(add(s.end,1))),conflict=s.dates.some(d=>clash(d,s.instructor));
  const label=`${c.name} · ${s.subject} · ${s.instructor} · ${s.start} ~ ${s.end} · ${s.days}일${conflict?' · 중복 배정 있음':''}`;
  return `<button class="bar ${filter!=='all'&&filter!==s.instructor?'dim':''} ${conflict?'clash':''}" data-ci="${c.ci}" data-subject="${s.si}" style="${style(s.si+c.ci)};left:${left}%;width:${right-left}%" title="${esc(label)}" aria-label="${esc(label)}"><strong>${conflict?'! ':''}${esc(s.subject)}</strong><small>${esc(s.instructor)} · ${s.days}일</small></button>`;
 }).join('');
 rows+=`<div class="tl-label"><button class="cohort-title" data-cohort="${esc(c.id)}">${esc(c.name)} ↗</button><div class="cohort-date">${c.schedule[0].date.slice(5).replace('-','.')} – ${c.end.slice(5).replace('-','.')} · ${c.schedule.length*c.hours}h</div><div class="progress-row"><div class="progress"><i style="width:${progress}%"></i></div>${progress}%</div></div><div class="tl-lane">${grid}${bars||'<span style="position:absolute;top:50px;left:20px;color:#bac3cc;font-size:10px">이 기간에 수업 없음</span>'}${marker.replace('<b>오늘</b>','')}</div>`;
 });
 $('content').innerHTML=`<div class="timeline-wrap"><div class="timeline" style="min-width:${Math.max(810,210+months*130)}px"><div class="tl-corner">기수 / 예정 경과율</div><div class="tl-axis">${ticks}${marker}</div>${rows}</div></div><div class="legend"><span><i></i>과목별 교육 기간</span><span><i class="clash-key"></i>강사 중복 포함</span><span><i class="today-key"></i>오늘</span><span>경과율은 예정 수업일 기준 · 실제 이수율 아님</span></div>`;
}
function renderMonth(){let rows='',n=0,lastMonth='';const full=tableRange==='all',b=bounds(),start=full?b.start:anchor+'-01',end=full?b.end:add(monthAdd(anchor,1)+'-01',-1);const holidays=new Map(data.holidays.map(h=>[h.date,h.name]));
 for(let date=start;date&&date<=end;date=add(date,1)){
 const lessons=model.cohorts.map(c=>c.map.get(date));if(hideOff&&!lessons.some(s=>s&&(filter==='all'||filter===s.instructor)))continue;n++;
 if(full&&date.slice(0,7)!==lastMonth){lastMonth=date.slice(0,7);rows+=`<tr class="month-divider"><td colspan="${model.cohorts.length+1}">${lastMonth.replace('-','년 ')}월</td></tr>`;}
 rows+=`<tr class="${date===today()?'today-row':''}"><td><b>${full?date:date.slice(5)} ${DAYS[new Date(date+'T00:00:00Z').getUTCDay()]}</b>${date===today()?' · 오늘':''}<small>${esc(holidays.get(date)||'')}</small></td>${lessons.map(s=>`<td>${s&&(filter==='all'||filter===s.instructor)?`<button class="lesson ${clash(date,s.instructor)?'clash':''}" style="${style(s.si+s.ci)};width:100%;text-align:left;border-top:0;border-right:0;border-bottom:0" data-ci="${s.ci}" data-subject="${s.si}"><b>${esc(s.subject)}</b><small>${clash(date,s.instructor)?'⚠ ':''}${esc(s.instructor)}</small></button>`:'<span class="off">—</span>'}</td>`).join('')}</tr>`;
 }
 $('content').innerHTML=`<div class="month-scroll"><table class="month-table" style="min-width:${125+model.cohorts.length*170}px"><thead><tr><th>날짜</th>${model.cohorts.map(c=>`<th><button class="cohort-title" data-cohort="${esc(c.id)}">${esc(c.name)}</button></th>`).join('')}</tr></thead><tbody>${rows||`<tr><td colspan="${model.cohorts.length+1}"><div class="empty">조회 기간에 조건에 맞는 수업이 없습니다.</div></td></tr>`}</tbody></table></div><div class="legend"><span>${full?`${start} ~ ${end} · `:''}표시 ${n}일</span><span>CSV 내보내기는 필터와 무관하게 전체 기간을 포함합니다.</span></div>`;
}
function renderInstructors(){
 $('toolbar').innerHTML='<div class="board-title"><strong>강사별 배정 현황</strong><small>강사명은 공백을 제외한 정확히 같은 이름 기준으로 구분합니다.</small></div>';
 $('content').innerHTML=`<div class="list-section"><div class="instructor-grid">${instructors().map((name,i)=>{const schedules=model.cohorts.flatMap(c=>c.schedule).filter(s=>s.instructor===name), conflicts=model.conflicts.filter(c=>c.instructor===name), courses=model.cohorts.filter(c=>c.curriculum.some(s=>s.instructor===name));return `<article class="instructor-card"><h3><span class="initial">${esc(name.slice(0,1))}</span>${esc(name)}</h3><p>${courses.length}개 기수 · ${schedules.length}회 배정<br>${esc(courses.map(c=>c.name).join(' / '))}</p>${conflicts.length?`<span class="badge">중복 ${conflicts.length}일 · ${conflicts[0].date}부터</span>`:'<span class="badge" style="background:#edf7f2;color:#6a9b83">중복 배정 없음</span>'}<button class="button" data-inst="${i}">이 강사의 시간표 보기 →</button></article>`;}).join('')||'<div class="empty">기수를 추가하면 강사별 현황이 표시됩니다.</div>'}</div></div>`;
 document.querySelectorAll('[data-inst]').forEach(b=>b.onclick=()=>{filter=instructors()[Number(b.dataset.inst)];const conflict=model.conflicts.find(c=>c.instructor===filter),first=model.cohorts.flatMap(c=>c.schedule).filter(s=>s.instructor===filter).sort((a,b)=>a.date.localeCompare(b.date))[0];anchor=(conflict?.date||first.date).slice(0,7);view='month';tableRange='month';render();});
}
function renderHolidays(){
 const years=[...new Set(['2026','2027',holidayYear,...data.holidays.map(h=>h.date.slice(0,4))])].sort();
 $('toolbar').innerHTML=`<div class="board-title"><strong>전체 기수 공통 휴일</strong><small>2026·2027년 휴일 제공 · 임시공휴일은 추가 확인이 필요합니다.</small></div><div class="controls"><select id="holidayYear" aria-label="휴일 연도">${years.map(y=>`<option ${y===holidayYear?'selected':''}>${y}</option>`).join('')}</select></div>`;
 $('holidayYear').onchange=e=>{holidayYear=e.target.value;render();};
 $('content').innerHTML=`<div class="list-section"><p class="holiday-source">2027년 기준: <a href="https://www.kasa.go.kr/prog/plcyBrf/brief/kor/sub01_01_04/view.do?plcyBrfNo=431" target="_blank" rel="noopener noreferrer">우주항공청 월력요항 (2026.06.29)</a> · 휴일 변경 시 교육 종료일도 다시 계산됩니다.</p><form id="holidayForm" class="holiday-form"><input type="date" id="holidayDate" required aria-label="휴일 날짜"><input id="holidayName" placeholder="휴일명 · 센터 휴무 등" maxlength="100" required aria-label="휴일명"><button class="button primary">＋ 휴일 추가</button></form><div class="holiday-list">${data.holidays.filter(h=>h.date.startsWith(holidayYear)).map(h=>`<div class="holiday-item"><div>${esc(h.name)}<small>${h.date} (${DAYS[new Date(h.date+'T00:00:00Z').getUTCDay()]})</small></div><button data-delete-holiday="${h.date}" aria-label="${esc(h.name)} 삭제">×</button></div>`).join('')||'<div class="empty">등록된 휴일이 없습니다.</div>'}</div></div>`;
 $('holidayForm').onsubmit=e=>{e.preventDefault();const date=$('holidayDate').value,name=$('holidayName').value.trim();if(!validDate(date)||!name)return;const next=structuredClone(data);if(next.holidays.some(h=>h.date===date)&&!confirm('이미 등록된 날짜입니다. 휴일명을 변경할까요?'))return;next.holidays=next.holidays.filter(h=>h.date!==date);next.holidays.push({date,name});holidayYear=date.slice(0,4);save(next);notify('휴일을 반영해 모든 일정을 다시 계산했습니다.');};
 document.querySelectorAll('[data-delete-holiday]').forEach(b=>b.onclick=()=>{if(!confirm('이 휴일을 삭제하면 모든 기수 일정이 다시 계산됩니다. 삭제할까요?'))return;const next=structuredClone(data);next.holidays=next.holidays.filter(h=>h.date!==b.dataset.deleteHoliday);save(next);notify('휴일을 삭제했습니다.');});
}
function openEditor(id){const c=data.cohorts.find(c=>c.id===id);$('editId').value=c?.id||'';$('editorTitle').textContent=c?'기수 일정 수정':'새 기수 만들기';$('name').value=c?.name||'';$('start').value=c?.start||today();$('hours').value=c?.hours||8;$('curriculum').value=c?.curriculum.map(s=>`${s.subject}, ${s.instructor}, ${s.days}`).join('\n')||'';$('weekdays').innerHTML=[1,2,3,4,5,6,0].map(d=>`<label><input type="checkbox" value="${d}" ${(c?.weekdays||[1,2,3,4,5]).includes(d)?'checked':''}>${DAYS[d]}</label>`).join('');$('deleteCohort').hidden=!c;$('duplicateCohort').hidden=!c;$('formError').textContent='';setupCohortImport(!c);$('editor').showModal();}
$('cohortForm').onsubmit=e=>{e.preventDefault();try{const lines=$('curriculum').value.split('\n').filter(l=>l.trim());const curriculum=lines.map((l,i)=>{const p=l.split(',').map(s=>s.trim());if(p.length!==3||!/^\d+$/.test(p[2]))throw Error(`${i+1}번째 줄을 과목명, 강사명, 정수 일수로 입력해주세요.`);return {subject:p[0],instructor:p[1],days:Number(p[2])};});const id=$('editId').value||uid();const c={id,name:$('name').value,start:$('start').value,hours:Number($('hours').value),weekdays:[...$('weekdays').querySelectorAll('input:checked')].map(x=>Number(x.value)),curriculum};const next=structuredClone(data),idx=next.cohorts.findIndex(x=>x.id===id);if(idx<0)next.cohorts.push(c);else next.cohorts[idx]=c;save(next);$('editor').close();notify('기수 일정을 저장했습니다.');}catch(err){$('formError').textContent=err.message;}};
$('deleteCohort').onclick=()=>{if(removeCohort($('editId').value))$('editor').close();};
$('duplicateCohort').onclick=()=>{$('editId').value='';$('name').value+=' (복사)';$('editorTitle').textContent='복제한 기수 만들기';$('deleteCohort').hidden=true;$('duplicateCohort').hidden=true;setupCohortImport(true);};
function openSubject(ci,si){const c=model.cohorts[ci],s=c.subjects[si];$('subjectTitle').textContent=s.subject;const conflicts=s.dates.filter(d=>clash(d,s.instructor));$('subjectInfo').innerHTML=[['기수',c.name],['담당 강사',s.instructor],['교육 기간',`${s.start} ~ ${s.end}`],['교육량',`${s.days}일 · ${s.days*c.hours}시간`],['수업 요일',c.weekdays.map(d=>DAYS[d]).join(' · ')],['중복 배정',conflicts.length?`${conflicts.length}일 (${conflicts[0]}부터)`:'없음']].map(([k,v])=>`<div class="detail-row"><span>${k}</span><b>${esc(v)}</b></div>`).join('');$('subjectMonth').onclick=()=>{anchor=s.start.slice(0,7);view='month';tableRange='month';$('subjectDialog').close();render();};$('subjectEdit').onclick=()=>{$('subjectDialog').close();openEditor(c.id);};$('subjectDialog').showModal();}
function download(name,text,type){const url=URL.createObjectURL(new Blob([text],{type}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
$('backup').onclick=()=>{download(`ubion-backup-${today()}.json`,JSON.stringify(data,null,2),'application/json');notify('백업 파일을 다운로드했습니다.');};
$('export').onclick=()=>{const b=bounds();if(!b.start)return notify('먼저 기수를 추가해주세요.');const rows=[['날짜','요일','휴일',...model.cohorts.map(c=>c.name)]];const holidays=new Map(data.holidays.map(h=>[h.date,h.name]));for(let date=b.start;date<=b.end;date=add(date,1))rows.push([date,DAYS[new Date(date+'T00:00:00Z').getUTCDay()],holidays.get(date)||'',...model.cohorts.map(c=>{const s=c.map.get(date);return s?`${s.subject} (${s.instructor})`:'';})]);const cell=v=>'"'+String(/^[=+@\-\t\r]/.test(String(v))?"'"+v:v).replaceAll('"','""')+'"';download(`ubion-schedule-${today()}.csv`,'\ufeff'+rows.map(r=>r.map(cell).join(',')).join('\r\n'),'text/csv;charset=utf-8');notify('전체 기간 일정을 CSV로 다운로드했습니다.');};
$('restore').onclick=()=>$('fileInput').click();$('fileInput').onchange=async e=>{const file=e.target.files[0];if(!file)return;try{if(file.size>5000000)throw Error('5MB 이하의 JSON 백업 파일을 선택해주세요.');const next=normalize(JSON.parse(await file.text()));calculate(next);if(confirm(`${next.cohorts.length}개 기수와 ${next.holidays.length}개 휴일로 현재 데이터를 교체할까요? 필요한 경우 먼저 백업해주세요.`)){save(next);const b=bounds();anchor=b.start?.slice(0,7)||today().slice(0,7);render();notify('데이터를 가져왔습니다.');}}catch(err){notify('가져오기 실패: '+err.message);}e.target.value='';};
$('startBlank').onclick=()=>{if(!confirm('예시 데이터를 비우고 새 일정으로 시작할까요? 기본 휴일은 유지합니다.'))return;save({version:1,demo:false,holidays:baseHolidays,cohorts:[]});notify('새 워크스페이스를 준비했습니다.');};
$('add').onclick=()=>openEditor();$('help').onclick=()=>$('helpDialog').showModal();document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>$(b.dataset.close).close());document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>setView(b.dataset.view));
window.addEventListener('storage',e=>{if(e.key===KEY&&e.newValue){try{const next=normalize(JSON.parse(e.newValue));const nextModel=calculate(next);data=next;model=nextModel;render();notify('다른 탭에서 변경한 일정을 반영했습니다.');}catch{notify('다른 탭 데이터가 올바르지 않아 반영하지 않았습니다.');}}});
render();if(loadError)notify('저장 데이터를 읽지 못했습니다. 원본을 덮어쓰지 않고 예시 화면을 표시합니다.');

function setupCohortImport(show) {
 $('cohortImport').hidden=!show;
 $('sourceCohort').innerHTML='<option value="">'+(data.cohorts.length?'기수를 선택하세요':'가져올 기수가 없습니다')+'</option>'+data.cohorts.map(c=>`<option value="${esc(c.id)}">${esc(c.name)} · ${c.curriculum.length}개 과목</option>`).join('');
 $('sourceCohort').value='';
 $('sourceCohort').disabled=!data.cohorts.length;
 $('applySourceCohort').disabled=true;
 $('importStatus').textContent='';
}
$('sourceCohort').onchange=()=>{$('applySourceCohort').disabled=!$('sourceCohort').value;$('importStatus').textContent='';};
$('applySourceCohort').onclick=()=>{
 if($('editId').value)return;
 const source=data.cohorts.find(c=>c.id===$('sourceCohort').value);
 if(!source)return;
 if($('curriculum').value.trim()&&!confirm('입력 중인 커리큘럼·수업 요일·교육시간을 선택한 기수 정보로 바꿀까요? 기수명과 개강일은 유지됩니다.'))return;
 if(!$('name').value.trim())$('name').value=source.name+' (새 기수)';
 $('hours').value=source.hours;
 $('curriculum').value=source.curriculum.map(s=>`${s.subject}, ${s.instructor}, ${s.days}`).join('\n');
 $('weekdays').innerHTML=[1,2,3,4,5,6,0].map(d=>`<label><input type="checkbox" value="${d}" ${source.weekdays.includes(d)?'checked':''}>${DAYS[d]}</label>`).join('');
 $('formError').textContent='';
 $('importStatus').textContent=`${source.name}에서 ${source.curriculum.length}개 과목을 가져왔습니다. 기수명과 개강일을 확인한 뒤 저장해주세요.`;
};

function cohortPhase(c) {
 const t=today();
 return c.schedule[0].date>t?'upcoming':c.end<t?'ended':'active';
}
function renderCohortManager() {
 $('toolbar').innerHTML=`<div class="board-title"><strong>등록된 기수 ${data.cohorts.length}개</strong><small>↑ ↓ 버튼의 순서가 전체 흐름과 시간표에도 적용됩니다.</small></div><div class="controls"><input type="search" id="cohortSearch" placeholder="기수명 · 과목 · 강사 검색" aria-label="기수 검색" value="${esc(cohortSearch)}"><select id="cohortStatus" aria-label="기수 상태"><option value="all">전체 상태</option><option value="active">진행 중</option><option value="upcoming">개강 예정</option><option value="ended">일정 종료</option></select><button id="undoDelete" ${deletedCohort?'':'disabled'}>마지막 삭제 되돌리기</button><button id="manageAdd" class="active">＋ 새 기수</button></div>`;
 $('cohortStatus').value=cohortStatus;
 $('cohortSearch').oninput=e=>{cohortSearch=e.target.value;renderCohortCards();};
 $('cohortStatus').onchange=e=>{cohortStatus=e.target.value;renderCohortCards();};
 $('manageAdd').onclick=()=>openEditor();
 $('undoDelete').onclick=undoCohortDeletion;
 renderCohortCards();
}
function renderCohortCards() {
 const q=cohortSearch.trim().toLocaleLowerCase();
 const visible=model.cohorts.filter(c=>(cohortStatus==='all'||cohortPhase(c)===cohortStatus)&&[c.name,...c.curriculum.flatMap(s=>[s.subject,s.instructor])].join(' ').toLocaleLowerCase().includes(q));
 const phases={active:'진행 중',upcoming:'개강 예정',ended:'일정 종료'};
 $('content').innerHTML=`<div class="cohort-manager"><div class="manager-summary">${visible.length}개 표시 / 전체 ${data.cohorts.length}개 <span>복제 후 새 이름과 개강일을 지정하세요.</span></div><div class="cohort-cards">${visible.map(c=>{
 const idx=data.cohorts.findIndex(x=>x.id===c.id),elapsed=c.schedule.filter(s=>s.date<today()).length,percent=Math.round(elapsed/c.schedule.length*100),conflicts=c.schedule.filter(s=>clash(s.date,s.instructor)).length;
 return `<article class="cohort-card"><div class="cohort-card-top"><div><span class="phase-badge ${cohortPhase(c)}">${phases[cohortPhase(c)]}</span><h3>${esc(c.name)}</h3></div><div class="order-buttons"><button data-action="up" data-id="${esc(c.id)}" ${idx===0?'disabled':''} aria-label="${esc(c.name)} 위로 이동">↑</button><button data-action="down" data-id="${esc(c.id)}" ${idx===data.cohorts.length-1?'disabled':''} aria-label="${esc(c.name)} 아래로 이동">↓</button></div></div><div class="cohort-facts"><span>교육 기간 <b>${c.schedule[0].date} ~ ${c.end}</b></span><span>교육량 <b>${c.curriculum.length}개 과목 · ${c.schedule.length}일 · ${c.schedule.length*c.hours}시간</b></span><span>수업 요일 <b>${c.weekdays.map(d=>DAYS[d]).join(' · ')} / 하루 ${c.hours}시간</b></span></div><div class="cohort-subjects">${c.curriculum.map(s=>`<span title="${esc(s.instructor)} · ${s.days}일">${esc(s.subject)}</span>`).join('')}</div><div class="cohort-progress"><span>예정 경과율 ${percent}%</span><div class="progress"><i style="width:${percent}%"></i></div>${conflicts?`<span class="cohort-conflict">중복 ${conflicts}일</span>`:''}</div><div class="cohort-actions"><button class="button primary" data-action="edit" data-id="${esc(c.id)}">수정</button><button class="button" data-action="copy" data-id="${esc(c.id)}">복제해서 새 기수</button><button class="button" data-action="schedule" data-id="${esc(c.id)}">시간표</button><button class="button danger" data-action="delete" data-id="${esc(c.id)}">삭제</button></div></article>`;
 }).join('')||`<div class="empty"><strong>${data.cohorts.length?'검색 조건에 맞는 기수가 없습니다.':'등록된 기수가 없습니다.'}</strong>${data.cohorts.length?'검색어나 상태 조건을 바꿔보세요.':'상단의 새 기수 버튼으로 시작하세요.'}</div>`}</div></div>`;
 document.querySelectorAll('[data-action]').forEach(b=>b.onclick=()=>{
 const id=b.dataset.id,action=b.dataset.action;
 if(action==='edit')openEditor(id);
 else if(action==='copy'){openEditor(id);$('duplicateCohort').onclick();}
 else if(action==='delete')removeCohort(id);
 else if(action==='up'||action==='down')moveCohort(id,action==='up'?-1:1);
 else if(action==='schedule'){const c=model.cohorts.find(c=>c.id===id);anchor=c.schedule[0].date.slice(0,7);tableRange='month';filter='all';view='month';render();}
 });
}
function moveCohort(id,delta) {
 const next=structuredClone(data),idx=next.cohorts.findIndex(c=>c.id===id),to=idx+delta;
 if(idx<0||to<0||to>=next.cohorts.length)return;
 [next.cohorts[idx],next.cohorts[to]]=[next.cohorts[to],next.cohorts[idx]];
 save(next);notify('표시 순서를 변경했습니다.');
}
function removeCohort(id) {
 const idx=data.cohorts.findIndex(c=>c.id===id);if(idx<0)return false;
 const c=data.cohorts[idx];
 if(!confirm(`‘${c.name}’ 기수를 삭제할까요? 해당 기수의 전체 일정이 삭제됩니다.`))return false;
 const next=structuredClone(data);next.cohorts.splice(idx,1);
 deletedCohort={cohort:structuredClone(c),index:idx};
 save(next);notify('기수를 삭제했습니다. 기수 관리에서 마지막 삭제를 되돌릴 수 있습니다.');return true;
}
function undoCohortDeletion() {
 if(!deletedCohort)return;
 const next=structuredClone(data),record=deletedCohort;
 if(next.cohorts.some(c=>c.id===record.cohort.id)){notify('같은 기수가 이미 존재합니다.');return;}
 next.cohorts.splice(Math.min(record.index,next.cohorts.length),0,structuredClone(record.cohort));
 deletedCohort=null;save(next);notify('삭제한 기수를 복원했습니다.');
}
