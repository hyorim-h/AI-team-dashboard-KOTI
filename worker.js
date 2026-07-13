// notion-proxy Cloudflare Worker (리포트 + WBS)
// 브라우저 → 이 Worker → 노션 API (CORS 우회 + 토큰 숨김)

const REPORT_DB_ID = "383ce6a25dc6801c874bc6bb96dc83c1"; // 주간 리포트 DB
const WBS_DB_ID    = "f1a718244eb54c399b70eb216067804d"; // WBS DB
const PROJECT_DB_ID = "5a75146603614e489364b66e5eab2e1c"; // 과제 정보 DB (노션 확인 database_id)
// 일정관리 페이지는 노션 DB가 아니라 구글 캘린더를 소스로 사용 (아래 GCAL_ID 참조)
const PERF_DB_ID   = "2f590aa04b1243f09255ca3850833038"; // 성과 DB
const ACHIEVE_DB_ID = "34ab53ea4afb4b1481c8c5358cd67b29"; // 업무실적 DB
const PLAN_DB_ID    = "d104d01ba9b140e6a83ceaea36e86b48"; // 업무계획 DB
const MEETING_DB_ID = "04abad201f3b4d08a5a293749c28626c"; // 회의자료 DB
const COMMENT_DB_ID = "b65a81a8947b415ebd921c45f155c0f6"; // 코멘트 DB
const CONSIGN_DB_ID = "3824cab3f1fe427f9e7f8f62664ed8a7"; // 위탁과제 정보 DB
const CONSIGN_MEETING_DB_ID = "12245461cc924caea18603f30deb6a9f"; // 위탁과제 회의록 DB
const CONSIGN_REQUEST_DB_ID = "5dbf4ecde36a42e0bffeed87502b3f1b"; // 위탁과제 요청자료 DB
const NOTION_VERSION = "2022-06-28";

const TEAM = ["이종우","전준수","이채영","한효림","김예원","정승환"];

const NAME_MAP = { "AI빅데이터팀": "한효림", "js_koti": "전준수" };

function normProj(s){ if(!s) return ""; return s.replace(/[\s\u00a0\u200b]/g, ""); }

const SECTION_MAP = [
  ["이번 주 한 일", "f1"], ["진행 중", "f2"], ["막힌 것", "f3"],
  ["다음 주 계획", "f4"], ["관련 논문", "f5"], ["위키 노트", "f5"],
  ["검토 필요", "f6"], ["연구책임자 코멘트", "comment"],
];

function corsHeaders(){
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  };
}

// ===== iCal 파싱 =====
function unfoldICS(text){
  // 접힌 줄(다음 줄이 공백/탭으로 시작) 합치기
  return text.replace(/\r\n/g, "\n").replace(/\n[ \t]/g, "");
}

function icsUnescape(s){
  return (s || "").replace(/\\n/gi, " ").replace(/\\,/g, ",").replace(/\\;/g, ";").replace(/\\\\/g, "\\");
}

function parseICSDate(val){
  // DTSTART 형태: 20260616T140000 (로컬/TZID) / 20260616T050000Z (UTC) / 20260616 (종일)
  var m = val.match(/(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})(Z)?)?/);
  if(!m) return null;
  var y=+m[1], mo=+m[2], d=+m[3], hh=m[4]?+m[4]:0, mm=m[5]?+m[5]:0, isUTC=!!m[7], allday=!m[4];
  if(isUTC){
    // UTC → 한국시간(KST, +9h) 변환 후 KST 기준 연·월·일·시·분 재추출
    var utc = new Date(Date.UTC(y,mo-1,d,hh,mm,0));
    var kst = new Date(utc.getTime() + 9*3600*1000);
    y = kst.getUTCFullYear(); mo = kst.getUTCMonth()+1; d = kst.getUTCDate();
    hh = kst.getUTCHours(); mm = kst.getUTCMinutes();
  }
  // 이미 KST 로컬값(TZID Asia/Seoul 또는 floating)인 경우 그대로 사용
  var dateObj = new Date(Date.UTC(y,mo-1,d,hh,mm,0));
  return { date: dateObj, allday: allday, y:y, mo:mo, d:d, hh:hh, mm:mm };
}

function parseICS(text){
  text = unfoldICS(text);
  var lines = text.split("\n");
  var events = [], cur = null;
  for(var i=0;i<lines.length;i++){
    var line = lines[i];
    if(line === "BEGIN:VEVENT"){ cur = {}; continue; }
    if(line === "END:VEVENT"){ if(cur) events.push(cur); cur = null; continue; }
    if(!cur) continue;
    var ci = line.indexOf(":");
    if(ci < 0) continue;
    var key = line.substring(0, ci);
    var val = line.substring(ci+1);
    var keyName = key.split(";")[0];
    if(keyName === "SUMMARY") cur.title = icsUnescape(val);
    else if(keyName === "DTSTART") cur.start = parseICSDate(val);
    else if(keyName === "DTEND") cur.end = parseICSDate(val);
    else if(keyName === "DESCRIPTION") cur.desc = icsUnescape(val);
    else if(keyName === "LOCATION") cur.location = icsUnescape(val);
  }
  return events;
}

function fmtDate(p){ // p = parseICSDate 결과
  function z(n){ return (n<10?"0":"")+n; }
  return p.y + "-" + z(p.mo) + "-" + z(p.d);
}
function fmtTime(p){
  function z(n){ return (n<10?"0":"")+n; }
  return p.allday ? "" : (z(p.hh) + ":" + z(p.mm));
}

async function getCalendarEvents(icsUrl){
  if(!icsUrl) return [];
  var res = await fetch(icsUrl, { headers: { "User-Agent": "Mozilla/5.0 (dashboard-worker)" } });
  if(!res.ok) throw new Error("iCal " + res.status);
  var text = await res.text();
  var raw = parseICS(text);
  var out = [];
  raw.forEach(function(e){
    if(!e.start) return;
    out.push({
      title: e.title || "(제목 없음)",
      date: fmtDate(e.start),
      time: fmtTime(e.start),
      desc: e.desc || "",
      location: e.location || "",
      _ts: e.start.date.getTime(),
    });
  });
  return out;
}

async function notionFetch(path, token, method, body){
  method = method || "GET";
  const res = await fetch("https://api.notion.com/v1" + path, {
    method: method,
    headers: {
      "Authorization": "Bearer " + token,
      "Notion-Version": NOTION_VERSION,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if(!res.ok){ const t = await res.text(); throw new Error("Notion " + res.status + ": " + t); }
  return res.json();
}

async function getAllPages(dbId, token){
  let pages = [], cursor = undefined;
  do {
    const body = { page_size: 100 };
    if(cursor) body.start_cursor = cursor;
    const data = await notionFetch("/databases/" + dbId + "/query", token, "POST", body);
    pages = pages.concat(data.results || []);
    cursor = data.has_more ? data.next_cursor : undefined;
  } while(cursor);
  return pages;
}

async function getPageContent(pageId, token){
  const data = await notionFetch("/blocks/" + pageId + "/children?page_size=100", token);
  const sections = {}; let cur = null;
  for(const b of data.results || []){
    const t = b.type;
    if(t && t.startsWith("heading")){
      const rich = b[t].rich_text || [];
      cur = rich.map(function(x){return x.plain_text;}).join("").trim();
      sections[cur] = [];
    } else if(cur !== null){
      const rich = (b[t] && b[t].rich_text) || [];
      const text = rich.map(function(x){return x.plain_text;}).join("").trim();
      if(text) sections[cur].push(text);
    }
  }
  const out = {}; for(const k in sections) out[k] = sections[k].join("\n");
  return out;
}

function extractWeek(title){ const m = title.match(/\d+월\s*\d+주차/); return m ? m[0] : title; }

// 관계형(relation) 속성에서 첫 번째 연결된 페이지 id 추출
function firstRelationId(prop){
  var arr = (prop && prop.relation) || [];
  return arr.length ? arr[0].id : "";
}

// 위탁과제 정보 파싱
function parseConsignment(page){
  const p = page.properties || {};
  const titleList = (p["과제명"] && p["과제명"].title) || [];
  const title = titleList.map(function(t){return t.plain_text;}).join("").trim();
  const orgRt = (p["수행기관"] && p["수행기관"].rich_text) || [];
  const org = orgRt.map(function(t){return t.plain_text;}).join("");
  const piRt = (p["책임자"] && p["책임자"].rich_text) || [];
  const pi = piRt.map(function(t){return t.plain_text;}).join("");
  const budgetRt = (p["위탁금액"] && p["위탁금액"].rich_text) || [];
  const budget = budgetRt.map(function(t){return t.plain_text;}).join("");
  const start = (p["시작일"] && p["시작일"].date && p["시작일"].date.start) || "";
  const end = (p["종료일"] && p["종료일"].date && p["종료일"].date.start) || "";
  const order = (p["정렬순서"] && typeof p["정렬순서"].number === "number") ? p["정렬순서"].number : 999;
  return { id: page.id, title: title, org: org, pi: pi, start: start, end: end, budget: budget, order: order };
}

// 위탁과제 회의록 파싱
function parseConsignMeeting(page){
  const p = page.properties || {};
  const titleList = (p["제목"] && p["제목"].title) || [];
  const title = titleList.map(function(t){return t.plain_text;}).join("").trim();
  const project = firstRelationId(p["과제"]);
  const kind = (p["구분"] && p["구분"].select && p["구분"].select.name) || "월간회의";
  const status = (p["상태"] && p["상태"].select && p["상태"].select.name) || "완료";
  const mode = (p["형태"] && p["형태"].select && p["형태"].select.name) || "대면";
  const date = (p["일시"] && p["일시"].date && p["일시"].date.start) || "";
  const attRt = (p["참석"] && p["참석"].rich_text) || [];
  const attendees = attRt.map(function(t){return t.plain_text;}).join("");
  const bodyRt = (p["내용"] && p["내용"].rich_text) || [];
  const body = bodyRt.map(function(t){return t.plain_text;}).join("");
  return { id: page.id, project: project, title: title, kind: kind, status: status, mode: mode, date: date, attendees: attendees, body: body };
}

// 위탁과제 요청자료 파싱 (Q&A는 페이지 본문에서 heading=질문, 본문=답변으로 파싱)
// getPageContent 확장판: heading 섹션별 본문 + 이미지 블록(그림)까지 캡처 (위탁과제 요청자료 Q&A용)
async function getPageContentWithFigures(pageId, token){
  const data = await notionFetch("/blocks/" + pageId + "/children?page_size=100", token);
  const sections = {}; let cur = null;
  for(const b of data.results || []){
    const t = b.type;
    if(t && t.startsWith("heading")){
      const rich = b[t].rich_text || [];
      cur = rich.map(function(x){return x.plain_text;}).join("").trim();
      sections[cur] = { body: [], figures: [] };
    } else if(cur !== null){
      if(t === "image"){
        const img = b.image;
        const url = (img.type === "external") ? (img.external && img.external.url) : (img.file && img.file.url);
        const capRich = img.caption || [];
        const caption = capRich.map(function(x){return x.plain_text;}).join("").trim();
        if(url) sections[cur].figures.push({ url: url, caption: caption });
      } else {
        const rich = (b[t] && b[t].rich_text) || [];
        const text = rich.map(function(x){return x.plain_text;}).join("").trim();
        if(text) sections[cur].body.push(text);
      }
    }
  }
  const out = {};
  for(const k in sections){ out[k] = { body: sections[k].body.join("\n"), figures: sections[k].figures }; }
  return out;
}

async function parseConsignRequest(page, token){
  const p = page.properties || {};
  const titleList = (p["제목"] && p["제목"].title) || [];
  const title = titleList.map(function(t){return t.plain_text;}).join("").trim();
  const project = firstRelationId(p["과제"]);
  const category = (p["구분"] && p["구분"].select && p["구분"].select.name) || "기타";
  const status = (p["상태"] && p["상태"].select && p["상태"].select.name) || "검토중";
  const reqDate = (p["요청일"] && p["요청일"].date && p["요청일"].date.start) || "";
  const replyDate = (p["회신일"] && p["회신일"].date && p["회신일"].date.start) || "";
  const reqFileRt = (p["요청파일명"] && p["요청파일명"].rich_text) || [];
  const reqFile = reqFileRt.map(function(t){return t.plain_text;}).join("");
  const replyFileRt = (p["회신파일명"] && p["회신파일명"].rich_text) || [];
  const replyFile = replyFileRt.map(function(t){return t.plain_text;}).join("");
  const content = await getPageContentWithFigures(page.id, token);
  const qa = [];
  for(const q in content){ qa.push({ q: q, a: content[q].body, figures: content[q].figures }); }
  return { id: page.id, project: project, title: title, category: category, status: status,
    reqDate: reqDate, replyDate: replyDate, reqFile: reqFile, replyFile: replyFile, qa: qa };
}

// 회의자료 페이지 파싱 (꼭지별 본문 포함)
// 대시보드용 경량 파싱: 속성만 읽고 본문(꼭지)·코멘트는 조회하지 않음 (빠름)
function parseMeetingLite(page){
  const p = page.properties || {};
  const titleList = (p["제목"] && p["제목"].title) || [];
  const title = titleList.map(function(t){return t.plain_text;}).join("").trim();
  const project = (p["과제"] && p["과제"].select && p["과제"].select.name) || "";
  const kind = (p["구분"] && p["구분"].select && p["구분"].select.name) || "주간회의";
  const date = (p["회의날짜"] && p["회의날짜"].date && p["회의날짜"].date.start) || "";
  const sumRt = (p["요약"] && p["요약"].rich_text) || [];
  const headingList = sumRt.map(function(t){return t.plain_text;}).join("");
  const overviewRt = (p["회의요약"] && p["회의요약"].rich_text) || [];
  const summary = overviewRt.map(function(t){return t.plain_text;}).join("");
  const cntProp = p["코멘트수"];
  const commentCount = (cntProp && typeof cntProp.number === "number") ? cntProp.number : 0;
  return { id: page.id, title: title, project: project, kind: kind, date: date, summary: summary, headingList: headingList, commentCount: commentCount };
}

async function parseMeeting(page, token){
  const p = page.properties || {};
  const titleList = (p["제목"] && p["제목"].title) || [];
  const title = titleList.map(function(t){return t.plain_text;}).join("").trim();
  const project = (p["과제"] && p["과제"].select && p["과제"].select.name) || "";
  const kind = (p["구분"] && p["구분"].select && p["구분"].select.name) || "주간회의";
  const date = (p["회의날짜"] && p["회의날짜"].date && p["회의날짜"].date.start) || "";
  const weekRt = (p["주차"] && p["주차"].rich_text) || [];
  const week = weekRt.map(function(t){return t.plain_text;}).join("");
  var wRt = (p["작성자"] && p["작성자"].rich_text) || [];
  const writer = wRt.map(function(t){return t.plain_text;}).join("");
  const timeRt = (p["시간"] && p["시간"].rich_text) || [];
  const time = timeRt.map(function(t){return t.plain_text;}).join("");
  const placeRt = (p["장소"] && p["장소"].rich_text) || [];
  const place = placeRt.map(function(t){return t.plain_text;}).join("");
  const attRt = (p["참석자"] && p["참석자"].rich_text) || [];
  const attendees = attRt.map(function(t){return t.plain_text;}).join("");
  // "요약"은 꼭지 제목을 자동 나열한 값(updateMeeting이 매번 덮어씀) — 진짜 요약문이 아니므로 headingList로만 보존
  const sumRt = (p["요약"] && p["요약"].rich_text) || [];
  const headingList = sumRt.map(function(t){return t.plain_text;}).join("");
  // "회의요약"은 직접 작성하는 진짜 요약문(자동 덮어쓰기 없음) — 화면에 보여줄 summary는 이걸로
  const overviewRt = (p["회의요약"] && p["회의요약"].rich_text) || [];
  const summary = overviewRt.map(function(t){return t.plain_text;}).join("");

  // 본문 꼭지 (heading별로 묶음)
  const content = await getPageContent(page.id, token);
  const sections = [];
  for(const h in content){ sections.push({ heading: h, body: content[h] }); }

  return {
    id: page.id, title: title, project: project, kind: kind, date: date, week: week,
    time: time, place: place, attendees: attendees, summary: summary, headingList: headingList,
    writer: writer, sections: sections, last_edited: page.last_edited_time || "",
    page_url: page.url || ""
  };
}

// 특정 회의자료에 달린 코멘트 읽기
async function getComments(meetingId, token){
  const body = { page_size: 100,
    filter: { property: "회의자료", relation: { contains: meetingId } },
    sorts: [{ property: "작성시각", direction: "ascending" }] };
  const data = await notionFetch("/databases/" + COMMENT_DB_ID + "/query", token, "POST", body);
  return (data.results||[]).map(function(pg){
    const p = pg.properties || {};
    const tList = (p["코멘트"] && p["코멘트"].title) || [];
    const text = tList.map(function(t){return t.plain_text;}).join("");
    const author = (p["작성자"] && p["작성자"].select && p["작성자"].select.name) || "";
    const time = (p["작성시각"] && p["작성시각"].created_time) || "";
    return { id: pg.id, text: text, author: author, time: time };
  });
}

// parseWorkPage와 동일 로직이지만 동기 함수(추가 API 호출이 원래 없어서 async가 불필요) — map()에서 안전하게 쓰기 위함
function parseWorkPageLite(page){
  const p = page.properties || {};
  const titleList = (p["제목"] && p["제목"].title) || [];
  const title = titleList.map(function(t){return t.plain_text;}).join("").trim();
  const date = (p["날짜"] && p["날짜"].date && p["날짜"].date.start) || "";
  const timeRt = (p["시간"] && p["시간"].rich_text) || [];
  const time = timeRt.map(function(t){return t.plain_text;}).join("");
  const weekRt = (p["출처주차"] && p["출처주차"].rich_text) || [];
  const week = weekRt.map(function(t){return t.plain_text;}).join("");
  const proj = (p["과제"] && p["과제"].select && p["과제"].select.name) || "";
  return { id: page.id, title: title, date: date, time: time, project: proj, week: week };
}

// 업무실적/업무계획 페이지 파싱 (본문 섹션 포함)
async function parseWorkPage(page, token, isPlan){
  const p = page.properties || {};
  const titleList = (p["제목"] && p["제목"].title) || [];
  const title = titleList.map(function(t){return t.plain_text;}).join("").trim();
  const date = (p["날짜"] && p["날짜"].date && p["날짜"].date.start) || "";
  const timeRt = (p["시간"] && p["시간"].rich_text) || [];
  const time = timeRt.map(function(t){return t.plain_text;}).join("");
  const attendRt = (p["참석자"] && p["참석자"].rich_text) || [];
  const attendees = attendRt.map(function(t){return t.plain_text;}).join("");
  const weekRt = (p["출처주차"] && p["출처주차"].rich_text) || [];
  const week = weekRt.map(function(t){return t.plain_text;}).join("");
  const proj = (p["과제"] && p["과제"].select && p["과제"].select.name) || "";

  var status = "", writer = "", modified = false, modifier = "";
  status = (p["상태"] && p["상태"].select && p["상태"].select.name) || "";
  modified = (p["수정됨"] && p["수정됨"].checkbox) || false;
  var mRt = (p["수정자"] && p["수정자"].rich_text) || [];
  modifier = mRt.map(function(t){return t.plain_text;}).join("");
  var wRt = (p["작성자"] && p["작성자"].rich_text) || [];
  writer = wRt.map(function(t){return t.plain_text;}).join("");
  var editRt = (p["수정일시"] && p["수정일시"].rich_text) || [];
  var modifiedAt = editRt.map(function(t){return t.plain_text;}).join("");

  // 일시장소·내용은 속성에서 직접 (본문 블록 조회 안 함 → 빠름)
  var locRt = (p["일시장소"] && p["일시장소"].rich_text) || [];
  var location = locRt.map(function(t){return t.plain_text;}).join("");
  var bodyRt = (p["내용"] && p["내용"].rich_text) || [];
  var body = bodyRt.map(function(t){return t.plain_text;}).join("");
  var gcalRt = (p["캘린더ID"] && p["캘린더ID"].rich_text) || [];
  var gcalId = gcalRt.map(function(t){return t.plain_text;}).join("");

  return {
    id: page.id, title: title, date: date, time: time,
    project: proj, attendees: attendees, week: week,
    location: location, content: body,
    status: status, writer: writer, modified: modified, modifier: modifier,
    modified_at: modifiedAt, gcal_id: gcalId,
    last_edited: page.last_edited_time || "",
    page_url: page.url || ""
  };
}

async function parseReport(page, token){
  const props = page.properties || {};
  const titleList = (props["문서명"] && props["문서명"].title) || [];
  const title = titleList.map(function(t){return t.plain_text;}).join("").trim();
  const projSel = (props["프로젝트"] && props["프로젝트"].select) || {};
  const project = projSel.name || "";
  const chk = (props["검토 필요"] && props["검토 필요"].checkbox);
  const blocked = (chk !== undefined ? chk : ((props["막힘"] && props["막힘"].checkbox) || false));
  const creator = (props["생성자"] && props["생성자"].created_by) || {};
  const creatorName = creator.name || "";
  const statusSel = (props["상태"] && props["상태"].select) || {};
  const statusName = statusSel.name || "";
  let status;
  if(statusName) status = statusName.indexOf("제출") >= 0 ? "submitted" : "pending";
  else status = title ? "submitted" : "pending";

  const content = await getPageContent(page.id, token);
  const r = { title: title, week: extractWeek(title), project: project, blocked: blocked, status: status,
    creator_name: creatorName, f1:"", f2:"", f3:"", f4:"", f5:"", f6:"", comment:"",
    page_url: page.url || "" };
  for(const heading in content){
    for(const pair of SECTION_MAP){
      const key = pair[0], field = pair[1];
      if(heading.indexOf(key) >= 0){
        if(field === "f5" && r.f5) r.f5 += "\n" + content[heading];
        else r[field] = content[heading];
        break;
      }
    }
  }
  return r;
}

function parseWbs(page){
  const p = page.properties || {};
  const titleList = (p["작업명"] && p["작업명"].title) || [];
  const task = titleList.map(function(t){return t.plain_text;}).join("").trim();
  const project = (p["과제"] && p["과제"].select && p["과제"].select.name) || "";
  const owner = (p["담당자"] && p["담당자"].select && p["담당자"].select.name) || "";
  const status = (p["상태"] && p["상태"].select && p["상태"].select.name) || "";
  const progress = (p["진척률"] && typeof p["진척률"].number === "number") ? p["진척률"].number : 0;
  const start = (p["시작일"] && p["시작일"].date && p["시작일"].date.start) || "";
  const end = (p["종료일"] && p["종료일"].date && p["종료일"].date.start) || "";
  const done = (p["완료일"] && p["완료일"].date && p["완료일"].date.start) || "";
  const noteRt = (p["비고"] && p["비고"].rich_text) || [];
  const note = noteRt.map(function(t){return t.plain_text;}).join("");
  const chkRt = (p["체크리스트"] && p["체크리스트"].rich_text) || [];
  const checklist = chkRt.map(function(t){return t.plain_text;}).join("");
  return {
    id: page.id, task: task, project: project, owner: owner, status: status,
    progress: progress, start: start, end: end, done: done,
    note: note, checklist: checklist, page_url: page.url || ""
  };
}

// 과제 정보 DB 파싱 (과제별 그룹 헤더용: PM·참여자·기간)
function parseProjectInfo(page){
  const p = page.properties || {};
  const titleList = (p["과제명"] && p["과제명"].title) || [];
  const name = titleList.map(function(t){return t.plain_text;}).join("").trim();
  function msNames(prop){
    var arr = (prop && prop.multi_select) || [];
    return arr.map(function(x){return x.name;});
  }
  const main = msNames(p["Main"]);
  const sub = msNames(p["Sub"]);
  const pi = msNames(p["연구책임자"]); // multi_select (연구책임자 2명 이상 가능) - 연구진(Main/Sub)과 동일 타입
  const start = (p["시작"] && p["시작"].date && p["시작"].date.start) || "";
  const end = (p["종료"] && p["종료"].date && p["종료"].date.start) || "";
  const order = (p["정렬순서"] && typeof p["정렬순서"].number === "number") ? p["정렬순서"].number : 999;
  return { id: page.id, name: name, pi: pi, main: main, sub: sub, start: start, end: end, order: order };
}

// ===== 일정관리(구글 캘린더 기반) 분류 =====
// 제목 규칙: "휴가(효림)" / "외출(효림)" / "재택근무(효림)" / "오전반차(효림)" 등 → 유형(효림)
// 출장 규칙: description(설명란)에 '출장' 단어 포함 → 유형=출장 (제목은 자유)
// 그 외 제목에 과제명 키워드 있으면 과제, 없으면 기타(회의 등 자유 제목)
const SCHED_PROJECT_KEYWORDS = [
  { kw: "국가교통조사", name: "국가교통조사사업" },
  { kw: "DB사업", name: "국가교통조사사업" },
  { kw: "통신", name: "국가교통조사사업" },
  { kw: "자율주행", name: "자율주행R&D" },
  { kw: "탄소", name: "탄소공간지도R&D" },        // "탄소공간지도"보다 넓게(탄소 포함이면 매칭)
  { kw: "교통SOC", name: "교통SOC R&D" },
  { kw: "데이터스페이스", name: "데이터스페이스R&D" },
];
const SCHED_VAC_TYPES = ["휴가","오전반차","오후반차","병가","공가","건강검진"];
// 팀원 짧은 이름("예원") → 풀네임("김예원") 정규화 (일정 제목/설명란에 짧게 적힌 경우 대비)
const SCHED_TEAM = ["이종우","전준수","이채영","한효림","김예원","정승환","심지윤","정정호"];
function schedShortName(o){ return (o && o.length>=3) ? o.slice(1) : o; }
function normalizePersonName(t){
  if(!t) return t;
  t = t.trim();
  var hit = SCHED_TEAM.filter(function(o){ return o===t || schedShortName(o)===t; })[0];
  return hit || t; // 팀원 명단에 없으면(외부인 등) 원문 그대로
}
function normalizePersonList(raw){
  if(!raw) return raw;
  return raw.split(/[,\s]+/).map(function(x){return x.trim();}).filter(Boolean).map(normalizePersonName).join(", ");
}
const SCHED_ATT_TYPES = SCHED_VAC_TYPES.concat(["외출","재택근무"]);
// "휴가(효림)" / "외출(효림)" 등
const SCHED_RE_PAREN = new RegExp("(" + SCHED_ATT_TYPES.join("|") + ")\\s*\\(([^)]+)\\)\\s*$");
// 과거 형식 "효림 휴가" / "효림-외출" 등 (이름이 앞)
const SCHED_RE_LEGACY = new RegExp("^([^\\s()]{2,6})\\s*[\\-\\s]?\\s*(" + SCHED_ATT_TYPES.join("|") + ")\\s*$");

function extractPersonFromDesc(desc){
  if(!desc) return "";
  var m = desc.match(/담당자\s*[:：]\s*([^\n\r]+)/);
  return m ? normalizePersonName(m[1].trim()) : "";
}
function extractAttendeesFromDesc(desc){
  if(!desc) return "";
  var m = desc.match(/참석자\s*[:：]\s*([^\n\r]+)/);
  return m ? normalizePersonList(m[1].trim()) : "";
}
// 설명란에 명시적으로 적힌 "과제: XXX"(드롭다운으로 직접 고른 값) — 제목에 남은 예전 키워드보다 이걸 우선해야 함
var SCHED_PROJECT_NAMES = SCHED_PROJECT_KEYWORDS.map(function(x){ return x.name; }).filter(function(v,i,a){ return a.indexOf(v)===i; });
function extractExplicitProject(desc){
  if(!desc) return "";
  var m = desc.match(/과제\s*[:：]\s*([^\n\r]+)/);
  if(!m) return "";
  var val = m[1].trim();
  return (SCHED_PROJECT_NAMES.indexOf(val) >= 0) ? val : "";
}
function classifySchedule(ev){
  var title = (ev.title || "").trim();
  var desc = ev.desc || "";
  var type = "", person = "", vacation = "", project = "";

  var mp = title.match(SCHED_RE_PAREN);
  var ml = !mp && title.match(SCHED_RE_LEGACY);
  if(mp){
    type = (SCHED_VAC_TYPES.indexOf(mp[1]) >= 0) ? "휴가" : mp[1];
    if(SCHED_VAC_TYPES.indexOf(mp[1]) >= 0) vacation = mp[1];
    var rawName1 = mp[2].trim();
    person = (rawName1.indexOf(",")>=0) ? normalizePersonList(rawName1) : normalizePersonName(rawName1);
  } else if(ml){
    type = (SCHED_VAC_TYPES.indexOf(ml[2]) >= 0) ? "휴가" : ml[2];
    if(SCHED_VAC_TYPES.indexOf(ml[2]) >= 0) vacation = ml[2];
    var rawName2 = ml[1].trim();
    person = (rawName2.indexOf(",")>=0) ? normalizePersonList(rawName2) : normalizePersonName(rawName2);
  } else if(desc.indexOf("출장") >= 0){
    type = "출장";
    person = extractPersonFromDesc(desc);
    project = extractExplicitProject(desc);
  } else {
    var explicitProj = extractExplicitProject(desc);
    if(explicitProj){ type = "과제"; project = explicitProj; person = extractPersonFromDesc(desc); }
    else {
      var matched = SCHED_PROJECT_KEYWORDS.filter(function(x){ return title.indexOf(x.kw) >= 0 || desc.indexOf(x.kw) >= 0; })[0];
      if(matched){ type = "과제"; project = matched.name; person = extractPersonFromDesc(desc); }
      else { type = "기타"; person = extractPersonFromDesc(desc); }
    }
  }
  var attendees = extractAttendeesFromDesc(desc);
  return { type: type, person: person, vacation: vacation, project: project, attendees: attendees };
}

// Google Calendar event(list API 결과) → 대시보드 표시용 객체로 변환
function parseGcalEvent(ev){
  if(ev.status === "cancelled") return null;
  var title = ev.summary || "(제목 없음)";
  var desc = ev.description || "";
  var location = ev.location || "";
  var startAllDay = ev.start && ev.start.date;   // "YYYY-MM-DD" (종일)
  var endAllDay = ev.end && ev.end.date;
  var start = "", end = "", time = "", timeEnd = "";
  if(startAllDay){
    start = startAllDay;
    // 구글 종일 일정은 end가 다음날(배타적) → 하루 빼서 실제 마지막 날로
    if(endAllDay){
      var d = new Date(endAllDay + "T00:00:00"); d.setDate(d.getDate()-1);
      function z(n){ return (n<10?"0":"")+n; }
      end = d.getFullYear()+"-"+z(d.getMonth()+1)+"-"+z(d.getDate());
      if(end < start) end = start;
    } else end = start;
  } else if(ev.start && ev.start.dateTime){
    start = ev.start.dateTime.slice(0,10);
    var m1 = ev.start.dateTime.match(/T(\d{2}):(\d{2})/); if(m1) time = m1[1]+":"+m1[2];
    end = (ev.end && ev.end.dateTime) ? ev.end.dateTime.slice(0,10) : start;
    var m2 = (ev.end && ev.end.dateTime) ? ev.end.dateTime.match(/T(\d{2}):(\d{2})/) : null; if(m2) timeEnd = m2[1]+":"+m2[2];
  } else return null;

  var cls = classifySchedule({ title: title, desc: desc });
  var timeStr = time ? (time + (timeEnd && timeEnd!==time ? "~"+timeEnd : "")) : "";
  return {
    id: ev.id, title: title, type: cls.type, person: cls.person, project: cls.project,
    vacation: cls.vacation, attendees: cls.attendees, start: start, end: end, time: timeStr, location: location,
    raw_desc: desc
  };
}

async function gcalList(env, timeMinISO){
  var token = await getGcalToken(env);
  var out = [], pageToken = "";
  for(var i=0;i<8;i++){ // 최대 8페이지(=최대 약 2000건) 안전장치
    var url = "https://www.googleapis.com/calendar/v3/calendars/" + encodeURIComponent(GCAL_ID) + "/events"
      + "?singleEvents=true&orderBy=startTime&maxResults=250&timeMin=" + encodeURIComponent(timeMinISO)
      + (pageToken ? "&pageToken=" + encodeURIComponent(pageToken) : "");
    var res = await fetch(url, { headers: { "Authorization": "Bearer " + token } });
    var data = await res.json();
    if(data.error) throw new Error("캘린더 조회 실패: " + JSON.stringify(data.error));
    (data.items || []).forEach(function(ev){ var p = parseGcalEvent(ev); if(p) out.push(p); });
    if(!data.nextPageToken) break;
    pageToken = data.nextPageToken;
  }
  return out;
}

// ===== 두레이(Dooray!) 캘린더 연동 (공공기관용 gov-dooray.com, 개인 API 토큰) =====
// "교통빅데이터팀" 캘린더 - 아이폰 캘린더에도 같이 연동해둔 팀 공유 캘린더를 대시보드/일정관리에 병합
const DOORAY_API_BASE = "https://api.gov-dooray.com";
const DOORAY_TEAM_CALENDAR_ID = "4193093966505478406"; // 교통빅데이터팀

// Dooray event → 대시보드 표시용 객체(구글 캘린더와 동일한 형태로 변환, 기존 classifySchedule 그대로 재사용)
function parseDoorayEvent(ev){
  var title = ev.subject || "(제목 없음)";
  var location = ev.location || "";
  var start = "", end = "", time = "", timeEnd = "";
  var startedAt = ev.startedAt || "", endedAt = ev.endedAt || "";
  if(ev.wholeDayFlag){
    start = startedAt.slice(0,10);
    var endRaw = endedAt.slice(0,10);
    if(endRaw){
      // 두레이 종일 일정도 구글과 동일하게 end가 다음날(배타적) → 하루 빼서 실제 마지막 날로
      var d = new Date(endRaw + "T00:00:00"); d.setDate(d.getDate()-1);
      function z(n){ return (n<10?"0":"")+n; }
      end = d.getFullYear()+"-"+z(d.getMonth()+1)+"-"+z(d.getDate());
      if(end < start) end = start;
    } else end = start;
  } else {
    start = startedAt.slice(0,10);
    var m1 = startedAt.match(/T(\d{2}):(\d{2})/); if(m1) time = m1[1]+":"+m1[2];
    end = endedAt.slice(0,10) || start;
    var m2 = endedAt.match(/T(\d{2}):(\d{2})/); if(m2) timeEnd = m2[1]+":"+m2[2];
  }
  // 두레이 이벤트에는 구글의 "설명란"에 해당하는 필드가 없어 제목만으로 분류
  // (휴가(이름)/외출(이름)/재택근무(이름)/과제 키워드 형식은 구글 쪽과 동일한 규칙을 그대로 따름)
  var cls = classifySchedule({ title: title, desc: "" });
  var timeStr = time ? (time + (timeEnd && timeEnd!==time ? "~"+timeEnd : "")) : "";
  return {
    id: "dooray-" + ev.id, title: title, type: cls.type, person: cls.person, project: cls.project,
    vacation: cls.vacation, attendees: cls.attendees, start: start, end: end, time: timeStr, location: location,
    raw_desc: ""
  };
}

async function doorayListRange(env, timeMinISO, timeMaxISO){
  var token = env.DOORAY_API_TOKEN;
  if(!token) throw new Error("DOORAY_API_TOKEN 미설정");
  var url = DOORAY_API_BASE + "/calendar/v1/calendars/*/events"
    + "?calendars=" + encodeURIComponent(DOORAY_TEAM_CALENDAR_ID)
    + "&timeMin=" + encodeURIComponent(timeMinISO)
    + "&timeMax=" + encodeURIComponent(timeMaxISO);
  var res = await fetch(url, { headers: { "Authorization": "dooray-api " + token } });
  var data = await res.json();
  if(!data.header || !data.header.isSuccessful){
    throw new Error("두레이 캘린더 조회 실패: " + (data.header && data.header.resultMessage ? data.header.resultMessage : JSON.stringify(data)));
  }
  return (data.result || []).map(parseDoorayEvent).filter(function(e){ return e.type; });
}
// 두레이는 문서엔 "최대 1년치"라고 돼있지만 실제로는 한 달을 넘기면 USER_INVALID_EXCEED_MAXIMUM_PERIOD로 거부됨(실측 확인).
// 지난 날짜는 노션 아카이브가 담당하므로, 여기선 "이번달/다음달"만 한 달씩 나눠 병렬로 조회한 뒤 합침
function doorayMonthChunks(){
  var kst = new Date(Date.now() + 9*60*60*1000); // UTC → KST 보정해서 "지금이 한국 시간으로 며칠인지" 얻기
  var y = kst.getUTCFullYear(), m = kst.getUTCMonth();
  function z(n){ return (n<10?"0":"")+n; }
  function fmt(yy, mm, dd, hh, mi, ss){ return yy+"-"+z(mm+1)+"-"+z(dd)+"T"+z(hh)+":"+z(mi)+":"+z(ss)+"+09:00"; }
  var chunks = [];
  for(var i=0;i<=1;i++){
    var yy = y, mm = m + i;
    while(mm < 0){ mm += 12; yy--; }
    while(mm > 11){ mm -= 12; yy++; }
    var daysInMonth = new Date(Date.UTC(yy, mm+1, 0)).getUTCDate();
    chunks.push({ timeMin: fmt(yy, mm, 1, 0,0,0), timeMax: fmt(yy, mm, daysInMonth, 23,59,59) });
  }
  return chunks;
}
async function doorayList(env){
  var chunks = doorayMonthChunks();
  var settled = await Promise.allSettled(chunks.map(function(c){ return doorayListRange(env, c.timeMin, c.timeMax); }));
  var out = [], firstError = null;
  settled.forEach(function(r){
    if(r.status === "fulfilled") out = out.concat(r.value);
    else if(!firstError) firstError = r.reason;
  });
  if(out.length === 0 && firstError) throw firstError; // 전부 실패했을 때만 에러로 전파(부분 실패는 있는 만큼만 반영)
  // 월 경계에 걸친(여러 청크에 겹쳐 조회되는) 이벤트 중복 제거
  var seen = {}, dedup = [];
  out.forEach(function(e){ if(!seen[e.id]){ seen[e.id]=1; dedup.push(e); } });
  return dedup;
}

// ===== 일정 아카이브 (노션 DB) =====
// 두레이 조회 기간 제한(약 한 달) 때문에, "오늘 이전" 일정은 매일 크론으로 노션에 옮겨 저장해두고 여기서 불러옴.
// "오늘 이후"는 항상 두레이에서 실시간으로 조회.
const SCHEDULE_ARCHIVE_DB_ID = "0bbdeffb-e7e6-4efe-977b-01d914fa7fd0";

function todayKST(){
  var kst = new Date(Date.now() + 9*60*60*1000);
  function z(n){ return (n<10?"0":"")+n; }
  return kst.getUTCFullYear()+"-"+z(kst.getUTCMonth()+1)+"-"+z(kst.getUTCDate());
}
function parseArchivedSchedule(page){
  const p = page.properties || {};
  function txt(name){ var r=(p[name]&&p[name].rich_text)||[]; return r.map(function(t){return t.plain_text;}).join(""); }
  function ttl(name){ var r=(p[name]&&p[name].title)||[]; return r.map(function(t){return t.plain_text;}).join(""); }
  function sel(name){ return (p[name]&&p[name].select&&p[name].select.name)||""; }
  function dt(name){ return (p[name]&&p[name].date&&p[name].date.start)||""; }
  return {
    id: "archive-" + page.id, title: ttl("제목"), type: sel("유형"), person: txt("담당자"),
    project: sel("과제"), vacation: txt("휴가구분"), attendees: txt("참석자"),
    start: (dt("시작일")||"").slice(0,10), end: (dt("종료일")||dt("시작일")||"").slice(0,10),
    time: txt("시간"), location: txt("장소"), raw_desc: ""
  };
}
// 아카이브 DB 전체 조회(오늘 이전 것만) - 매 요청마다 전체를 훑는 구조라 데이터가 아주 많아지면 나중에 날짜 필터 API로 바꿔야 할 수 있음
async function archivedScheduleList(env){
  const token = env.NOTION_TOKEN;
  const pages = await getAllPages(SCHEDULE_ARCHIVE_DB_ID, token);
  var today = todayKST();
  return pages.map(parseArchivedSchedule).filter(function(x){ return x.title && x.start && x.start < today; });
}
// 어제 하루치 두레이 일정을 노션 아카이브에 저장(매일 크론으로 실행). 이미 저장된 건(원본ID 기준) 건너뜀
// 두레이 이벤트 목록을 노션 아카이브에 저장(이미 있는 원본ID는 건너뜀). existingIds는 미리 조회해둔 {원본ID: true} 맵
async function archiveEventsToNotion(env, events, existingIds){
  const token = env.NOTION_TOKEN;
  var created = 0;
  for(var i=0;i<events.length;i++){
    var e = events[i];
    var origId = e.id.indexOf("dooray-")===0 ? e.id.slice(7) : e.id;
    if(existingIds[origId]) continue;
    var props = {
      "제목": { title: rt(e.title) },
      "담당자": { rich_text: rt(e.person) },
      "휴가구분": { rich_text: rt(e.vacation) },
      "참석자": { rich_text: rt(e.attendees) },
      "시간": { rich_text: rt(e.time) },
      "장소": { rich_text: rt(e.location) },
      "원본ID": { rich_text: rt(origId) },
      "시작일": { date: { start: e.start } },
      "종료일": { date: { start: e.end || e.start } },
    };
    if(e.type) props["유형"] = { select: { name: e.type } };
    if(e.project) props["과제"] = { select: { name: e.project } };
    await notionFetch("/pages", token, "POST", { parent:{ database_id: SCHEDULE_ARCHIVE_DB_ID }, properties: props });
    existingIds[origId] = true; // 같은 배치 안에서 중복 생성 방지
    created++;
  }
  return created;
}
async function getArchiveExistingIds(env){
  const token = env.NOTION_TOKEN;
  var existingPages = await getAllPages(SCHEDULE_ARCHIVE_DB_ID, token);
  var existingIds = {};
  existingPages.forEach(function(pg){
    var r = (pg.properties["원본ID"] && pg.properties["원본ID"].rich_text) || [];
    var v = r.map(function(t){return t.plain_text;}).join("");
    if(v) existingIds[v] = true;
  });
  return existingIds;
}
// 어제 하루치 두레이 일정을 노션 아카이브에 저장(매일 크론으로 실행). 이미 저장된 건(원본ID 기준) 건너뜀
async function archiveOneDay(env, dayStr){
  var events = await doorayListRange(env, dayStr+"T00:00:00+09:00", dayStr+"T23:59:59+09:00");
  var existingIds = await getArchiveExistingIds(env);
  var created = await archiveEventsToNotion(env, events, existingIds);
  return { archived: created, checked: events.length, day: dayStr };
}
async function archiveYesterdaySchedule(env){
  var kst = new Date(Date.now() + 9*60*60*1000);
  var y = kst.getUTCFullYear(), m = kst.getUTCMonth(), d = kst.getUTCDate() - 1;
  var yest = new Date(Date.UTC(y, m, d));
  function z(n){ return (n<10?"0":"")+n; }
  var dayStr = yest.getUTCFullYear()+"-"+z(yest.getUTCMonth()+1)+"-"+z(yest.getUTCDate());
  return await archiveOneDay(env, dayStr);
}
// 지정한 기간(fromDateStr~toDateStr, "YYYY-MM-DD")을 통째로 백필 — 과거 데이터를 한 번에 몰아서 노션에 채워 넣을 때 사용.
// 두레이 조회 기간 제한(약 한 달) 때문에 내부적으로 한 달 단위 청크로 나눠서 순차 조회함.
// 주의: 한 청크 안에 새로 만들어야 할 일정이 많으면 Cloudflare 서브요청 한도(50개)에 걸릴 수 있음 —
// 그런 경우 archiveOneDay(action: "archiveDay")로 하루씩 나눠서 호출할 것.
async function archiveDateRange(env, fromDateStr, toDateStr){
  function parseYMD(s){ var p=String(s).split("-").map(function(x){return parseInt(x,10);}); return { y:p[0], m:p[1]-1, d:p[2] }; }
  function z(n){ return (n<10?"0":"")+n; }
  function cmp(a,b){ return (a.y*10000+a.m*100+a.d) - (b.y*10000+b.m*100+b.d); }
  var from = parseYMD(fromDateStr), to = parseYMD(toDateStr);
  if(isNaN(from.y) || isNaN(to.y) || cmp(from, to) > 0) throw new Error("날짜 범위가 올바르지 않습니다(from이 to보다 늦거나 형식이 잘못됨)");
  var existingIds = await getArchiveExistingIds(env);
  var totalChecked = 0, totalCreated = 0, chunkCount = 0;
  var cursor = { y: from.y, m: from.m, d: from.d };
  while(cmp(cursor, to) <= 0){
    var monthLastDay = new Date(Date.UTC(cursor.y, cursor.m+1, 0)).getUTCDate(); // 안전: 순수 날짜 계산용(시간대 변환 없음)
    var chunkEnd = { y: cursor.y, m: cursor.m, d: monthLastDay };
    if(cmp(chunkEnd, to) > 0) chunkEnd = { y: to.y, m: to.m, d: to.d };
    var startStr = cursor.y+"-"+z(cursor.m+1)+"-"+z(cursor.d)+"T00:00:00+09:00";
    var endStr = chunkEnd.y+"-"+z(chunkEnd.m+1)+"-"+z(chunkEnd.d)+"T23:59:59+09:00";
    var events = await doorayListRange(env, startStr, endStr);
    totalChecked += events.length;
    totalCreated += await archiveEventsToNotion(env, events, existingIds);
    chunkCount++;
    // 다음 청크: 다음 달 1일로 이동
    var ny = cursor.y, nm = cursor.m + 1;
    if(nm > 11){ nm = 0; ny++; }
    cursor = { y: ny, m: nm, d: 1 };
  }
  return { archived: totalCreated, checked: totalChecked, chunks: chunkCount, from: fromDateStr, to: toDateStr };
}

// ===== 로그인(접근 장벽 수준 - 진짜 계정 시스템 아님, 팀 공용 아이디/비밀번호 하나로 체크) =====
// Cloudflare Worker 환경변수에 TEAM_LOGIN_ID / TEAM_LOGIN_PW 를 secret으로 등록해야 동작함
async function checkLogin(env, payload){
  var expectId = env.TEAM_LOGIN_ID, expectPw = env.TEAM_LOGIN_PW;
  if(!expectId || !expectPw) throw new Error("TEAM_LOGIN_ID/TEAM_LOGIN_PW 미설정");
  var ok = (String(payload.id||"") === String(expectId)) && (String(payload.pw||"") === String(expectPw));
  return { authed: ok };
}

// 아카이브(오늘 이전) + 두레이 실시간(오늘 이후)을 병합해서 하나의 일정 목록으로 - 한쪽이 실패해도 다른 쪽은 그대로 반영
async function combinedScheduleList(env){
  var today = todayKST();
  var results = await Promise.allSettled([
    archivedScheduleList(env),
    doorayList(env),
  ]);
  var out = [];
  var errors = {};
  if(results[0].status === "fulfilled") out = out.concat(results[0].value);
  else errors.archiveScheduleError = String(results[0].reason);
  if(results[1].status === "fulfilled") out = out.concat(results[1].value.filter(function(e){ return !e.end || e.end >= today; }));
  else errors.doorayScheduleError = String(results[1].reason);
  return { items: out, errors: errors };
}


function parsePerf(page){
  const p = page.properties || {};
  const titleList = (p["성과명"] && p["성과명"].title) || [];
  const name = titleList.map(function(t){return t.plain_text;}).join("").trim();
  const project = (p["과제"] && p["과제"].select && p["과제"].select.name) || "";
  const type = (p["구분"] && p["구분"].select && p["구분"].select.name) || "";
  const owner = (p["담당자"] && p["담당자"].select && p["담당자"].select.name) || "";
  const status = (p["상태"] && p["상태"].select && p["상태"].select.name) || "";
  const detailRt = (p["세부내용"] && p["세부내용"].rich_text) || [];
  const detail = detailRt.map(function(t){return t.plain_text;}).join("");
  const due = (p["기한"] && p["기한"].date && p["기한"].date.start) || "";
  const progress = (p["진행률"] && typeof p["진행률"].number === "number") ? p["진행률"].number : 0;
  const startYear = (p["시작연도"] && typeof p["시작연도"].number === "number") ? p["시작연도"].number : null;
  const chkRt = (p["체크리스트"] && p["체크리스트"].rich_text) || [];
  const checklist = chkRt.map(function(t){return t.plain_text;}).join("");
  return {
    id: page.id, name: name, project: project, type: type, owner: owner,
    status: status, detail: detail, due: due, progress: progress, checklist: checklist,
    start_year: startYear,
    page_url: page.url || ""
  };
}

// ===== 노션 쓰기 (업무실적/업무계획 저장) =====
function rt(text){ return [{ type:"text", text:{ content: String(text||"") } }]; }

// ===== Google Calendar 연동 (서비스 계정, WebCrypto로 JWT 서명) =====
const GCAL_ID = "vhulqta766un5182bit092vo90@group.calendar.google.com";
let _gcalToken = { value:"", exp:0 };

function b64url(buf){
  var bytes = new Uint8Array(buf);
  var bin = "";
  for(var i=0;i<bytes.length;i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");
}
function b64urlStr(str){
  return btoa(unescape(encodeURIComponent(str))).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");
}
function pemToArrayBuffer(pem){
  var b64 = pem.replace(/-----BEGIN PRIVATE KEY-----/,"").replace(/-----END PRIVATE KEY-----/,"").replace(/\s+/g,"");
  var bin = atob(b64);
  var buf = new ArrayBuffer(bin.length);
  var view = new Uint8Array(buf);
  for(var i=0;i<bin.length;i++) view[i] = bin.charCodeAt(i);
  return buf;
}

async function getGcalToken(env){
  var now = Math.floor(Date.now()/1000);
  if(_gcalToken.value && _gcalToken.exp > now + 30) return _gcalToken.value;

  var email = env.GCAL_SA_EMAIL;
  var key = env.GCAL_SA_KEY;
  if(!email || !key) throw new Error("서비스 계정 정보 미설정 (GCAL_SA_EMAIL/GCAL_SA_KEY)");
  // Secret 붙여넣을 때 \n이 literal로 들어간 경우 복원
  key = key.replace(/\\n/g, "\n");

  var header = { alg:"RS256", typ:"JWT" };
  var claim = {
    iss: email,
    scope: "https://www.googleapis.com/auth/calendar",
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now
  };
  var unsigned = b64urlStr(JSON.stringify(header)) + "." + b64urlStr(JSON.stringify(claim));

  var cryptoKey = await crypto.subtle.importKey(
    "pkcs8", pemToArrayBuffer(key),
    { name:"RSASSA-PKCS1-v1_5", hash:"SHA-256" },
    false, ["sign"]
  );
  var sig = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", cryptoKey, new TextEncoder().encode(unsigned));
  var jwt = unsigned + "." + b64url(sig);

  var res = await fetch("https://oauth2.googleapis.com/token", {
    method:"POST",
    headers:{ "Content-Type":"application/x-www-form-urlencoded" },
    body: "grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=" + encodeURIComponent(jwt)
  });
  var data = await res.json();
  if(!data.access_token) throw new Error("토큰 발급 실패: " + JSON.stringify(data));
  _gcalToken = { value: data.access_token, exp: now + (data.expires_in || 3600) };
  return _gcalToken.value;
}

// 캘린더에 일정 등록 → event id 반환 (실패해도 노션 저장은 유지되도록 호출측에서 try)
async function gcalInsert(env, item){
  var token = await getGcalToken(env);
  if(!item.date) return null;
  var summary = (item.title || "제목 없음");
  // 시간 있으면 dateTime, 없으면 all-day
  var body;
  if(item.time && /^\d{1,2}:\d{2}$/.test(item.time)){
    var hh = ("0"+item.time.split(":")[0]).slice(-2);
    var mm = item.time.split(":")[1];
    var startISO = item.date + "T" + hh + ":" + mm + ":00+09:00";
    // 종료는 +1시간
    var endH = (parseInt(hh,10)+1)%24;
    var endISO = item.date + "T" + ("0"+endH).slice(-2) + ":" + mm + ":00+09:00";
    body = { summary: summary, start:{ dateTime:startISO, timeZone:"Asia/Seoul" }, end:{ dateTime:endISO, timeZone:"Asia/Seoul" } };
  } else {
    // 종일 일정 (end는 다음날)
    var d = new Date(item.date + "T00:00:00"); d.setDate(d.getDate()+1);
    function z(n){ return (n<10?"0":"")+n; }
    var nextDay = d.getFullYear()+"-"+z(d.getMonth()+1)+"-"+z(d.getDate());
    body = { summary: summary, start:{ date:item.date }, end:{ date:nextDay } };
  }
  if(item.location) body.location = item.location;
  var desc = [];
  if(item.project) desc.push("과제: " + item.project);
  if(item.content) desc.push(item.content);
  if(item.attendees) desc.push("참석자: " + item.attendees);
  if(desc.length) body.description = desc.join("\n");

  var res = await fetch("https://www.googleapis.com/calendar/v3/calendars/" + encodeURIComponent(GCAL_ID) + "/events", {
    method:"POST",
    headers:{ "Authorization":"Bearer "+token, "Content-Type":"application/json" },
    body: JSON.stringify(body)
  });
  var data = await res.json();
  if(data.error) throw new Error("캘린더 등록 실패: " + JSON.stringify(data.error));
  return data.id || null;
}

// 캘린더 일정 수정 (event id로 patch). id 없으면 새로 등록해서 id 반환.
async function gcalUpdate(env, eventId, item){
  var token = await getGcalToken(env);
  if(!item.date) return eventId || null;
  // 새 body 구성 (insert와 동일 규칙)
  var body = { summary: (item.title || "제목 없음") };
  if(item.time && /^\d{1,2}:\d{2}$/.test(item.time)){
    var hh = ("0"+item.time.split(":")[0]).slice(-2);
    var mm = item.time.split(":")[1];
    var endH = (parseInt(hh,10)+1)%24;
    body.start = { dateTime: item.date+"T"+hh+":"+mm+":00+09:00", timeZone:"Asia/Seoul" };
    body.end = { dateTime: item.date+"T"+("0"+endH).slice(-2)+":"+mm+":00+09:00", timeZone:"Asia/Seoul" };
  } else {
    var d = new Date(item.date + "T00:00:00"); d.setDate(d.getDate()+1);
    function z(n){ return (n<10?"0":"")+n; }
    body.start = { date: item.date };
    body.end = { date: d.getFullYear()+"-"+z(d.getMonth()+1)+"-"+z(d.getDate()) };
  }
  body.location = item.location || "";
  var desc = [];
  if(item.project) desc.push("과제: " + item.project);
  if(item.content) desc.push(item.content);
  if(item.attendees) desc.push("참석자: " + item.attendees);
  body.description = desc.join("\n");

  // event id가 있으면 patch, 없으면 새로 insert
  if(eventId){
    var res = await fetch("https://www.googleapis.com/calendar/v3/calendars/" + encodeURIComponent(GCAL_ID) + "/events/" + encodeURIComponent(eventId), {
      method:"PATCH",
      headers:{ "Authorization":"Bearer "+token, "Content-Type":"application/json" },
      body: JSON.stringify(body)
    });
    var data = await res.json();
    if(data.error){
      // event가 삭제됐거나 못 찾으면 새로 등록
      if(data.error.code===404 || data.error.code===410){ return await gcalInsert(env, item); }
      throw new Error("캘린더 수정 실패: " + JSON.stringify(data.error));
    }
    return data.id || eventId;
  } else {
    return await gcalInsert(env, item);
  }
}

// 캘린더에서 event 하나 조회 → {date, time, title} 반환 (없으면 null)
async function gcalGet(env, eventId){
  if(!eventId) return null;
  var token = await getGcalToken(env);
  var res = await fetch("https://www.googleapis.com/calendar/v3/calendars/" + encodeURIComponent(GCAL_ID) + "/events/" + encodeURIComponent(eventId), {
    headers:{ "Authorization":"Bearer "+token }
  });
  var data = await res.json();
  if(data.error) return null;               // 삭제됐거나 못 찾음
  if(data.status === "cancelled") return null;
  var title = data.summary || "";
  var date = "", time = "";
  if(data.start){
    if(data.start.dateTime){
      // "2026-07-07T14:00:00+09:00" → date, time
      var dt = data.start.dateTime;
      date = dt.slice(0,10);
      var m = dt.match(/T(\d{2}):(\d{2})/);
      if(m) time = m[1] + ":" + m[2];
    } else if(data.start.date){
      date = data.start.date;               // 종일 일정
      time = "";
    }
  }
  return { date: date, time: time, title: title };
}

// 업무계획 캘린더 동기화: event id로 캘린더 조회 → 날짜·시간·제목만 노션에 반영
// (장소·내용·참석자는 노션 값 유지)
// 프론트(weekly-work.html)의 computePeriod/weekLabelText와 동일 로직 (오늘 기준 실시간 계산, 저장 데이터에 의존하지 않음)
function z2(n){ return (n<10?"0":"")+n; }
function ymdOf(d){ return d.getFullYear()+"-"+z2(d.getMonth()+1)+"-"+z2(d.getDate()); }
function isoWeekNumSrv(ymdStr){
  var d=new Date(ymdStr+"T00:00:00");
  var target=new Date(d.valueOf()); var dayNr=(d.getDay()+6)%7;
  target.setDate(target.getDate()-dayNr+3);
  var firstThu=target.valueOf();
  target.setMonth(0,1);
  if(target.getDay()!==4){ target.setMonth(0,1+((4-target.getDay())+7)%7); }
  return 1+Math.ceil((firstThu-target)/604800000);
}
function currentWeekRange(offsetWeeks){
  var offset = offsetWeeks || 0;
  var today=new Date();
  var dow=today.getDay();
  var monOffset=(dow===0)?-6:(1-dow);
  var mon=new Date(today); mon.setDate(today.getDate()+monOffset+offset*7); mon.setHours(0,0,0,0);
  var fri=new Date(mon); fri.setDate(mon.getDate()+4);
  var nextMon=new Date(mon); nextMon.setDate(mon.getDate()+7);
  var nextFri=new Date(nextMon); nextFri.setDate(nextMon.getDate()+4);
  var aStart=ymdOf(mon), aEnd=ymdOf(fri);
  var pStart=ymdOf(nextMon), pEnd=ymdOf(nextFri);
  var awn=isoWeekNumSrv(aStart)-1, pwn=isoWeekNumSrv(pStart)-1;
  return {
    // 실적주(오프셋 적용된 기준주)
    start: aStart, end: aEnd, label: aStart+" ~ "+aEnd.slice(5)+" ("+awn+"주차)",
    // 계획주(기준주+1주) — 캘린더 동기화·PDF 계획 읽기는 오프셋 없이(실제 현재) 이 범위를 대상으로 함
    planStart: pStart, planEnd: pEnd, planLabel: pStart+" ~ "+pEnd.slice(5)+" ("+pwn+"주차)"
  };
}
function currentWeekLabel(){ return currentWeekRange().label; }

// 업무계획 캘린더 동기화: 이번 주(월~금) 팀 캘린더에서 "과제/기타"(회의 등 업무성) 일정만 대상.
// 휴가/외출/재택근무/출장은 개인 일정관리용이라 제외. 이미 가져온 항목(캘린더ID로 연결)은 날짜·시간·제목만 갱신,
// 아직 없는 항목은 새 업무계획으로 생성 (장소·내용·참석자는 비워둠 → 직접 채워넣기).
async function syncPlansFromCalendar(env){
  const token = env.NOTION_TOKEN;
  var result = { checked:0, updated:0, missing:0, imported:0 };
  var wk = currentWeekRange();
  // 캘린더 동기화는 "계획주"(다음주) 범위를 대상으로 함 — 실적주(이번주)가 아님
  var events = await doorayList(env);
  events = events.filter(function(ev){
    return ev.start >= wk.planStart && ev.start <= wk.planEnd
      && (ev.type === "과제" || ev.type === "기타"); // 휴가/외출/재택근무/출장 등은 제외
  });

  // 계획주 기존 업무계획 조회 — 캘린더ID로도, (날짜+제목)으로도 매칭 (PDF 등 다른 경로로 이미 들어온 항목과 중복 방지)
  var pPages = await getAllPages(PLAN_DB_ID, token);
  var existing = [];
  for(const pg of pPages){ existing.push(await parseWorkPage(pg, token, true)); }
  var byGcalId = {}, byDateTitle = {};
  existing.forEach(function(p){
    if(p.gcal_id) byGcalId[p.gcal_id] = p;
    var key = (p.date||"") + "|" + (p.title||"").trim();
    if(!byDateTitle[key]) byDateTitle[key] = p;
  });

  for(const ev of events){
    result.checked++;
    var evTime = (ev.time||"").split("~")[0].trim(); // 종료시간은 저장하지 않음(시작시간만)
    var matched = byGcalId[ev.id];
    if(!matched){
      // 캘린더ID로 못 찾으면 (날짜+제목)으로도 확인 — 같은 일정이 중복 생성되는 것을 막음
      var dtKey = (ev.start||"") + "|" + (ev.title||"").trim();
      matched = byDateTitle[dtKey];
    }
    if(matched){
      // 이미 있는 항목 → 날짜·시간·제목만 갱신 (장소·내용·참석자는 노션 값 유지), 캘린더ID/과제 비어있으면 이번에 채움
      var props = {};
      if(ev.start && ev.start !== matched.date) props["날짜"] = { date: { start: ev.start } };
      if(evTime !== (matched.time||"")) props["시간"] = { rich_text: rt(evTime) };
      if(ev.title && ev.title !== matched.title) props["제목"] = { title: rt(ev.title) };
      if(!matched.gcal_id) props["캘린더ID"] = { rich_text: rt(ev.id) };
      if((!matched.project || matched.project==="기타") && ev.project && ev.project!=="기타") props["과제"] = { select: { name: ev.project } };
      if(Object.keys(props).length){
        await notionFetch("/pages/" + matched.id, token, "PATCH", { properties: props });
        result.updated++;
      }
    } else {
      // 캘린더에는 있는데 노션엔 정말 없는 일정 → 새 업무계획으로 가져오기
      var item = {
        title: ev.title || "(제목 없음)", date: ev.start, time: evTime,
        project: ev.project || "기타", location: ev.location || "", content: "", attendees: ev.attendees || "",
        week: wk.planLabel
      };
      var props2 = {
        "제목": { title: rt(item.title) }, "날짜": { date: { start: item.date } },
        "시간": { rich_text: rt(item.time) }, "참석자": { rich_text: rt(item.attendees) },
        "일시장소": { rich_text: rt(item.location) }, "내용": { rich_text: rt(item.content) },
        "출처주차": { rich_text: rt(item.week) }, "과제": { select: { name: item.project } },
        "상태": { select: { name: "예정" } }, "캘린더ID": { rich_text: rt(ev.id) },
      };
      await notionFetch("/pages", token, "POST", { parent:{ database_id: PLAN_DB_ID }, properties: props2, children: buildBodyBlocks(item) });
      result.imported++;
    }
  }
  return result;
}



function buildBodyBlocks(item){
  // 본문 템플릿: 제목 / 일시·장소 / 내용 / 참석자
  function heading(t){ return { object:"block", type:"heading_3", heading_3:{ rich_text: rt(t) } }; }
  function para(t){ return { object:"block", type:"paragraph", paragraph:{ rich_text: rt(t) } }; }
  return [
    heading("일시·장소"), para(item.location || ""),
    heading("내용"),     para(item.content || ""),
    heading("참석자"),   para(item.attendees || ""),
  ];
}

async function queryExisting(dbId, token, week){
  // 같은 출처주차의 기존 항목 (중복 방지용) → {제목|날짜: true} 맵
  const body = { page_size: 100, filter: { property:"출처주차", rich_text:{ equals: week } } };
  const data = await notionFetch("/databases/" + dbId + "/query", token, "POST", body);
  const seen = {};
  (data.results||[]).forEach(function(pg){
    const p = pg.properties || {};
    const title = ((p["제목"]&&p["제목"].title)||[]).map(function(t){return t.plain_text;}).join("");
    const date = (p["날짜"]&&p["날짜"].date&&p["날짜"].date.start) || "";
    seen[date + "|" + title] = true;
  });
  return seen;
}

async function createWorkPage(dbId, token, item, isPlan, env){
  const props = {
    "제목":   { title: rt(item.title) },
    "날짜":   { date: { start: item.date } },
    "시간":   { rich_text: rt(item.time || "") },
    "참석자": { rich_text: rt(item.attendees || "") },
    "일시장소": { rich_text: rt(item.location || "") },
    "내용":   { rich_text: rt(item.content || "") },
    "출처주차": { rich_text: rt(item.week || "") },
  };
  props["과제"] = { select: { name: item.project || "기타" } };
  if(isPlan){
    props["상태"] = { select: { name: "예정" } };
    if(item.writer) props["작성자"] = { rich_text: rt(item.writer) };
  }
  const body = { parent: { database_id: dbId }, properties: props, children: buildBodyBlocks(item) };
  const res = await notionFetch("/pages", token, "POST", body);
  // 주간업무 탭은 구글 캘린더에 아무것도 쓰지 않음(읽기 전용). 캘린더 등록/편집은 일정관리 탭에서만.
  return res;
}

async function saveWork(env, payload){
  const token = env.NOTION_TOKEN;
  const achieveWeek = payload.achieveWeek || payload.week || "";
  const planWeek = payload.planWeek || payload.week || "";
  const result = { achieve_saved:0, achieve_skipped:0, plan_saved:0, plan_skipped:0 };

  // 업무실적
  const seenA = await queryExisting(ACHIEVE_DB_ID, token, achieveWeek);
  for(const it of (payload.achievements||[])){
    it.week = achieveWeek;
    if(seenA[it.date + "|" + it.title]){ result.achieve_skipped++; continue; }
    await createWorkPage(ACHIEVE_DB_ID, token, it, false, env);
    result.achieve_saved++;
  }
  // 업무계획
  const seenP = await queryExisting(PLAN_DB_ID, token, planWeek);
  for(const it of (payload.plans||[])){
    it.week = planWeek;
    if(seenP[it.date + "|" + it.title]){ result.plan_skipped++; continue; }
    await createWorkPage(PLAN_DB_ID, token, it, true, env);
    result.plan_saved++;
  }
  return result;
}

// 기존 페이지 본문 블록 전부 삭제 후 새 본문으로 교체
async function replaceBody(pageId, token, item){
  // 기존 자식 블록 조회
  const cur = await notionFetch("/blocks/" + pageId + "/children?page_size=100", token);
  for(const b of (cur.results||[])){
    try { await notionFetch("/blocks/" + b.id, token, "DELETE"); } catch(e){}
  }
  // 새 본문 추가
  await notionFetch("/blocks/" + pageId + "/children", token, "PATCH", { children: buildBodyBlocks(item) });
}

async function updateWork(env, payload){
  const token = env.NOTION_TOKEN;
  const item = payload.item || {};
  const isPlan = !!payload.isPlan;
  if(!item.id) throw new Error("page id 없음");

  var now = payload.now || "";  // 클라이언트가 넘겨준 수정일시 문자열

  const props = {
    "제목":   { title: rt(item.title || "") },
    "시간":   { rich_text: rt(item.time || "") },
    "참석자": { rich_text: rt(item.attendees || "") },
    "일시장소": { rich_text: rt(item.location || "") },
    "내용":   { rich_text: rt(item.content || "") },
    "수정일시": { rich_text: rt(now) },
  };
  if(item.project) props["과제"] = { select: { name: item.project } };
  if(item.date) props["날짜"] = { date: { start: item.date } };

  if(isPlan){
    // 업무계획 상태 로직:
    //  - 사용자가 드롭다운에서 상태를 명시적으로 바꿨으면(statusChanged) 그 값
    //  - 아니면 자동: 완료였으면 재수정 → 수정됨, 그 외 → 완료
    var newStatus;
    if(item.statusChanged && item.status){
      newStatus = item.status;
    } else {
      var prev = item.prevStatus || "";
      newStatus = (prev==="완료" || prev==="수정됨") ? "수정됨" : "완료";
    }
    props["상태"] = { select: { name: newStatus } };
    if(item.writer) props["작성자"] = { rich_text: rt(item.writer) };
    if(item.modifier) props["수정자"] = { rich_text: rt(item.modifier) };
    props["수정됨"] = { checkbox: (newStatus==="수정됨") };
  } else {
    // 업무실적: 수정하면 무조건 수정됨=true + 수정일시.
    //  - 드롭다운에서 삭제필요 고르면 상태=삭제필요, 아니면 상태 비움
    props["상태"] = item.status ? { select: { name: item.status } } : { select: null };
    props["수정됨"] = { checkbox: true };
    if(item.modifier) props["수정자"] = { rich_text: rt(item.modifier) };
  }

  await notionFetch("/pages/" + item.id, token, "PATCH", { properties: props });

  // 주간업무 탭은 구글 캘린더에 아무것도 쓰지 않음(읽기 전용). 캘린더 등록/편집은 일정관리 탭에서만.
  return { updated: true };
}

// 항목 생성 (모달에서 + 항목 추가)
async function createWork(env, payload){
  const token = env.NOTION_TOKEN;
  const item = payload.item || {};
  const isPlan = !!payload.isPlan;
  const dbId = isPlan ? PLAN_DB_ID : ACHIEVE_DB_ID;

  const props = {
    "제목":   { title: rt(item.title || "") },
    "시간":   { rich_text: rt(item.time || "") },
    "참석자": { rich_text: rt(item.attendees || "") },
    "일시장소": { rich_text: rt(item.location || "") },
    "내용":   { rich_text: rt(item.content || "") },
    "출처주차": { rich_text: rt(item.week || "") },
    "수정일시": { rich_text: rt(item.now || "") },
  };
  if(item.project) props["과제"] = { select: { name: item.project } };
  if(item.date) props["날짜"] = { date: { start: item.date } };
  if(isPlan){
    // 업무계획 추가 → 자동 "완료" (사용자가 삭제필요 아닌 다른 상태 명시하면 존중)
    var planStatus = (item.status && item.status!=="예정") ? item.status : "완료";
    props["상태"] = { select: { name: planStatus } };
    if(item.writer) props["작성자"] = { rich_text: rt(item.writer) };
    if(item.writer) props["수정자"] = { rich_text: rt(item.writer) };
  } else {
    // 업무실적 추가 → 자동 "수정됨" (삭제필요 명시하면 그 값도 함께)
    if(item.status==="삭제필요") props["상태"] = { select: { name: "삭제필요" } };
    props["수정됨"] = { checkbox: true };
    if(item.modifier) props["수정자"] = { rich_text: rt(item.modifier) };
  }
  var res = await notionFetch("/pages", token, "POST", { parent:{ database_id: dbId }, properties: props });

  // 주간업무 탭은 구글 캘린더에 아무것도 쓰지 않음(읽기 전용). 캘린더 등록/편집은 일정관리 탭에서만.
  return { created: true, id: res.id };
}

// 항목 삭제 (노션 휴지통으로)
async function deleteWork(env, payload){
  const token = env.NOTION_TOKEN;
  if(!payload.id) throw new Error("page id 없음");
  await notionFetch("/pages/" + payload.id, token, "PATCH", { archived: true });
  return { deleted: true };
}

// ===== 성과 관리 CRUD =====
function perfProps(item){
  var props = {
    "성과명": { title: rt(item.name || "") },
    "세부내용": { rich_text: rt(item.detail || "") },
    "체크리스트": { rich_text: rt(item.checklist || "") },
    "진행률": { number: (typeof item.progress === "number" ? item.progress : 0) },
  };
  if(item.project) props["과제"] = { select: { name: item.project } };
  if(item.type) props["구분"] = { select: { name: item.type } };
  if(item.owner) props["담당자"] = { select: { name: item.owner } };
  if(item.status) props["상태"] = { select: { name: item.status } };
  if(item.due) props["기한"] = { date: { start: item.due } };
  else props["기한"] = { date: null };
  if(typeof item.start_year === "number") props["시작연도"] = { number: item.start_year };
  else props["시작연도"] = { number: null };
  return props;
}
async function createPerf(env, payload){
  const token = env.NOTION_TOKEN;
  const item = payload.item || {};
  var res = await notionFetch("/pages", token, "POST", { parent:{ database_id: PERF_DB_ID }, properties: perfProps(item) });
  return { created: true, id: res.id };
}
async function updatePerf(env, payload){
  const token = env.NOTION_TOKEN;
  const item = payload.item || {};
  if(!item.id) throw new Error("page id 없음");
  await notionFetch("/pages/" + item.id, token, "PATCH", { properties: perfProps(item) });
  return { updated: true };
}
async function deletePerf(env, payload){
  const token = env.NOTION_TOKEN;
  if(!payload.id) throw new Error("page id 없음");
  await notionFetch("/pages/" + payload.id, token, "PATCH", { archived: true });
  return { deleted: true };
}

// ===== WBS CRUD =====
// item: { id?, task, project, owner, status, start('YYYY-MM'|'YYYY-MM-DD'), end, note, checklist(JSON str), progress }
function ymToDate(s, endOfRange){
  // 'YYYY-MM' → 'YYYY-MM-01' (종료는 그대로 1일로 저장; 간트는 월만 사용)
  if(!s) return null;
  var t = String(s).slice(0,10);
  if(/^\d{4}-\d{2}$/.test(t)) return t + "-01";
  if(/^\d{4}-\d{2}-\d{2}$/.test(t)) return t;
  return null;
}
function wbsProps(item){
  var props = {
    "작업명": { title: rt(item.task || "") },
    "비고": { rich_text: rt(item.note || "") },
    "체크리스트": { rich_text: rt(item.checklist || "") },
    "진척률": { number: (typeof item.progress === "number" ? item.progress : 0) },
  };
  if(item.project) props["과제"] = { select: { name: item.project } };
  if(item.owner)   props["담당자"] = { select: { name: item.owner } };
  if(item.status)  props["상태"] = { select: { name: item.status } };
  var sd = ymToDate(item.start);
  var ed = ymToDate(item.end);
  props["시작일"] = sd ? { date: { start: sd } } : { date: null };
  props["종료일"] = ed ? { date: { start: ed } } : { date: null };
  // 상태가 완료면 완료일 자동 기록, 아니면 비움
  if(item.status === "완료") props["완료일"] = { date: { start: (ed || sd || new Date().toISOString().slice(0,10)) } };
  else props["완료일"] = { date: null };
  return props;
}
async function createWbs(env, payload){
  const token = env.NOTION_TOKEN;
  const item = payload.item || {};
  var res = await notionFetch("/pages", token, "POST", { parent:{ database_id: WBS_DB_ID }, properties: wbsProps(item) });
  return { created: true, id: res.id };
}
async function updateWbs(env, payload){
  const token = env.NOTION_TOKEN;
  const item = payload.item || {};
  if(!item.id) throw new Error("page id 없음");
  await notionFetch("/pages/" + item.id, token, "PATCH", { properties: wbsProps(item) });
  return { updated: true };
}
async function deleteWbs(env, payload){
  const token = env.NOTION_TOKEN;
  if(!payload.id) throw new Error("page id 없음");
  await notionFetch("/pages/" + payload.id, token, "PATCH", { archived: true });
  return { deleted: true };
}

// ===== 일정관리 CRUD (두레이) =====
// item: { id?, type, person, title, project, vacation, start, end, time('HH:MM' or 'HH:MM~HH:MM'), location }
function schedSummary(item){
  if(SCHED_ATT_TYPES.indexOf(item.type) >= 0){
    // 휴가/오전반차/오후반차/병가/공가/건강검진/외출/재택근무 → "유형(이름)" 고정 규칙
    var label = (item.type === "휴가" && item.vacation) ? item.vacation : item.type;
    return label + "(" + (item.person || "") + ")";
  }
  return item.title || "(제목 없음)"; // 과제·출장·기타는 자유 제목
}
function schedDescription(item){
  var lines = [];
  if(item.type === "출장") lines.push("출장"); // 필수 키워드
  if((item.type === "과제" || item.type === "출장") && item.project) lines.push("과제: " + item.project);
  // 휴가/외출/재택근무 등은 제목의 "유형(이름)"이 담당자의 유일한 출처 → 설명란에 중복 기록하지 않음
  if(item.person && SCHED_ATT_TYPES.indexOf(item.type) < 0) lines.push("담당자: " + item.person);
  if(item.attendees) lines.push("참석자: " + item.attendees);
  if(item.title && SCHED_ATT_TYPES.indexOf(item.type) >= 0) lines.push(item.title); // 휴가류 비고
  return lines.join("\n");
}
function schedTimeRange(item){
  // "HH:MM" 또는 "HH:MM~HH:MM" → {start,end} (end 없으면 start+1h)
  var t = (item.time || "").split("~");
  var t0 = (t[0] || "").trim(), t1 = (t[1] || "").trim();
  if(!t0) return null;
  return { start: t0, end: t1 || null };
}
// 두레이 일정 생성/수정 시 "참석자(users.to)"는 필수 필드라 화면에서 안 고르게 하고 고정 시스템 계정으로 자동 채움
// (실제 담당자는 어차피 제목의 "유형(이름)" 표기가 유일한 출처라 참석자 지정은 의미 없음 - API 필수조건 맞추기용)
const DOORAY_DEFAULT_ATTENDEE_ID = "4180547016341419629"; // 한효림
function doorayEventBody(item){
  var body = {
    users: { to: [{ type:"member", member:{ organizationMemberId: DOORAY_DEFAULT_ATTENDEE_ID } }] },
    subject: schedSummary(item),
    body: { mimeType: "text/plain", content: schedDescription(item) || "" }, // body도 필수 필드(빈 값이라도 구조는 있어야 함)
    location: item.location || "",
  };
  var tr = schedTimeRange(item);
  var endDate = (item.end && item.end >= item.start) ? item.end : item.start;
  if(tr){
    var hh = ("0"+tr.start.split(":")[0]).slice(-2), mm = tr.start.split(":")[1];
    var startISO = item.start + "T" + hh + ":" + mm + ":00+09:00";
    var endISO;
    if(tr.end){
      var eh=("0"+tr.end.split(":")[0]).slice(-2), em=tr.end.split(":")[1];
      endISO = endDate + "T" + eh + ":" + em + ":00+09:00";
    } else {
      var endH = (parseInt(hh,10)+1)%24;
      endISO = endDate + "T" + ("0"+endH).slice(-2) + ":" + mm + ":00+09:00";
    }
    body.startedAt = startISO;
    body.endedAt = endISO;
    body.wholeDayFlag = false;
  } else {
    // 종일: end는 배타적이라 하루 다음날로
    var d = new Date(endDate + "T00:00:00"); d.setDate(d.getDate()+1);
    function z(n){ return (n<10?"0":"")+n; }
    var nextDay = d.getFullYear()+"-"+z(d.getMonth()+1)+"-"+z(d.getDate());
    body.startedAt = item.start + "+09:00";
    body.endedAt = nextDay + "+09:00";
    body.wholeDayFlag = true;
  }
  return body;
}
// 프론트에서 넘어오는 id는 combinedScheduleList에서 "dooray-" 접두어를 붙여둔 상태라, 실제 API 호출 전 원래 id로 복원
function stripDoorayPrefix(id){
  id = String(id||"");
  return id.indexOf("dooray-")===0 ? id.slice(7) : id;
}
async function createSchedule(env, payload){
  const item = payload.item || {};
  if(!item.start) throw new Error("시작일 없음");
  var token = env.DOORAY_API_TOKEN;
  if(!token) throw new Error("DOORAY_API_TOKEN 미설정");
  var res = await fetch(DOORAY_API_BASE + "/calendar/v1/calendars/" + encodeURIComponent(DOORAY_TEAM_CALENDAR_ID) + "/events", {
    method: "POST",
    headers: { "Authorization": "dooray-api " + token, "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(doorayEventBody(item))
  });
  var data = await res.json();
  if(!data.header || !data.header.isSuccessful) throw new Error("일정 등록 실패: " + (data.header && data.header.resultMessage ? data.header.resultMessage : JSON.stringify(data)));
  return { created: true, id: "dooray-" + (data.result && data.result.id) };
}
async function updateSchedule(env, payload){
  const item = payload.item || {};
  if(!item.id) throw new Error("event id 없음");
  if(!item.start) throw new Error("시작일 없음");
  var token = env.DOORAY_API_TOKEN;
  if(!token) throw new Error("DOORAY_API_TOKEN 미설정");
  var rawId = stripDoorayPrefix(item.id);
  var res = await fetch(DOORAY_API_BASE + "/calendar/v1/calendars/" + encodeURIComponent(DOORAY_TEAM_CALENDAR_ID) + "/events/" + encodeURIComponent(rawId), {
    method: "PUT",
    headers: { "Authorization": "dooray-api " + token, "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(doorayEventBody(item))
  });
  var data = await res.json();
  if(!data.header || !data.header.isSuccessful) throw new Error("일정 수정 실패: " + (data.header && data.header.resultMessage ? data.header.resultMessage : JSON.stringify(data)));
  return { updated: true };
}
async function deleteSchedule(env, payload){
  if(!payload.id) throw new Error("event id 없음");
  var token = env.DOORAY_API_TOKEN;
  if(!token) throw new Error("DOORAY_API_TOKEN 미설정");
  var rawId = stripDoorayPrefix(payload.id);
  var res = await fetch(DOORAY_API_BASE + "/calendar/v1/calendars/" + encodeURIComponent(DOORAY_TEAM_CALENDAR_ID) + "/events/" + encodeURIComponent(rawId) + "/delete", {
    method: "POST",
    headers: { "Authorization": "dooray-api " + token, "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ deleteType: "this" })
  });
  var data = await res.json();
  if(!data.header || !data.header.isSuccessful) throw new Error("일정 삭제 실패: " + (data.header && data.header.resultMessage ? data.header.resultMessage : JSON.stringify(data)));
  return { deleted: true };
}



// 코멘트 추가 → 코멘트 DB에 새 행 + 회의자료 코멘트수 +1
// 진짜 노션 댓글(페이지 Discussion)로도 남겨서 노션 알림이 가게 함.
// 실패해도(권한 등) 우리 앱의 코멘트 저장/표시엔 영향 없도록 항상 try/catch로 감싸서 호출할 것.
async function postNotionComment(env, pageId, text, author){
  const token = env.NOTION_TOKEN;
  const content = (author ? author + ": " : "") + text;
  try {
    // 이 페이지에 기존 디스커션이 있으면 거기에 답글로, 없으면 새 디스커션 시작
    const existing = await notionFetch("/comments?block_id=" + pageId, token, "GET");
    const discussionId = (existing.results && existing.results[0] && existing.results[0].discussion_id) || null;
    const body = discussionId
      ? { discussion_id: discussionId, rich_text: rt(content) }
      : { parent: { page_id: pageId }, rich_text: rt(content) };
    await notionFetch("/comments", token, "POST", body);
    return true;
  } catch(e){
    return false;
  }
}

async function addComment(env, payload){
  const token = env.NOTION_TOKEN;
  const meetingId = payload.meetingId;
  const text = payload.text || "";
  const author = payload.author || "";
  if(!meetingId || !text) throw new Error("내용/회의자료 누락");

  await notionFetch("/pages", token, "POST", {
    parent: { database_id: COMMENT_DB_ID },
    properties: {
      "코멘트": { title: rt(text) },
      "회의자료": { relation: [{ id: meetingId }] },
      "작성자": author ? { select: { name: author } } : undefined,
    }
  });

  // 코멘트수 갱신 (현재 개수 다시 세서 기록)
  try {
    const q = await notionFetch("/databases/" + COMMENT_DB_ID + "/query", token, "POST",
      { filter: { property: "회의자료", relation: { contains: meetingId } } });
    const cnt = (q.results||[]).length;
    await notionFetch("/pages/" + meetingId, token, "PATCH", { properties: { "코멘트수": { number: cnt } } });
  } catch(e){}
  return { added: true };
}

// 코멘트 삭제 → 노션 휴지통으로(archived) + 회의자료 코멘트수 갱신
async function deleteComment(env, payload){
  const token = env.NOTION_TOKEN;
  const commentId = payload.commentId;
  const meetingId = payload.meetingId;
  if(!commentId) throw new Error("코멘트 id 누락");

  await notionFetch("/pages/" + commentId, token, "PATCH", { archived: true });

  // 코멘트수 갱신
  if(meetingId){
    try {
      const q = await notionFetch("/databases/" + COMMENT_DB_ID + "/query", token, "POST",
        { filter: { property: "회의자료", relation: { contains: meetingId } } });
      const cnt = (q.results||[]).length;
      await notionFetch("/pages/" + meetingId, token, "PATCH", { properties: { "코멘트수": { number: cnt } } });
    } catch(e){}
  }
  return { deleted: true };
}

// 회의요약(진짜 요약문, 자동 덮어쓰기 없음) 수정 — 꼭지 편집(updateMeeting)과 별개
async function updateMeetingSummary(env, payload){
  const token = env.NOTION_TOKEN;
  const meetingId = payload.meetingId;
  const summary = payload.summary || "";
  if(!meetingId) throw new Error("회의자료 id 누락");
  await notionFetch("/pages/" + meetingId, token, "PATCH", { properties: { "회의요약": { rich_text: rt(summary) } } });
  return { updated: true };
}

// 회의 기본 정보(과제/구분/일시/장소/참석자) 수정 — 요약·내용 수정과는 별개
async function updateMeetingInfo(env, payload){
  const token = env.NOTION_TOKEN;
  const item = payload.item || {};
  if(!item.id) throw new Error("회의자료 id 누락");
  const props = {
    "구분": { select: { name: item.kind || "주간회의" } },
    "시간": { rich_text: rt(item.time || "") },
    "장소": { rich_text: rt(item.place || "") },
    "참석자": { rich_text: rt(item.attendees || "") },
  };
  if(item.date) props["회의날짜"] = { date: { start: item.date } };
  props["과제"] = item.project ? { select: { name: item.project } } : { select: null };
  await notionFetch("/pages/" + item.id, token, "PATCH", { properties: props });
  return { updated: true };
}

// 회의자료 삭제 — 딸린 코멘트도 같이 정리(휴지통으로)
async function deleteMeeting(env, payload){
  const token = env.NOTION_TOKEN;
  const meetingId = payload.meetingId;
  if(!meetingId) throw new Error("회의자료 id 누락");
  try {
    const comments = await getComments(meetingId, token);
    for(const c of comments){ try { await notionFetch("/pages/" + c.id, token, "PATCH", { archived: true }); } catch(e){} }
  } catch(e){}
  await notionFetch("/pages/" + meetingId, token, "PATCH", { archived: true });
  return { deleted: true };
}

// 페이지 안에서 새 회의 등록 (기존엔 PDF 업로드 skill로만 생성 가능했음)
function weekLabelForDate(dateStr){
  var d = new Date(dateStr+"T00:00:00");
  var dow = d.getDay();
  var monOffset = (dow===0)?-6:(1-dow);
  var mon = new Date(d); mon.setDate(d.getDate()+monOffset);
  var fri = new Date(mon); fri.setDate(mon.getDate()+4);
  var aStart = ymdOf(mon), aEnd = ymdOf(fri);
  var wn = isoWeekNumSrv(aStart)-1;
  return aStart+" ~ "+aEnd.slice(5)+" ("+wn+"주차)";
}
async function createMeeting(env, payload){
  const token = env.NOTION_TOKEN;
  const item = payload.item || {};
  if(!item.title) throw new Error("제목을 입력하세요");
  if(!item.date) throw new Error("회의날짜를 입력하세요");
  var week = "";
  try { week = weekLabelForDate(item.date); } catch(e){}
  const props = {
    "제목": { title: rt(item.title) },
    "구분": { select: { name: item.kind || "주간회의" } },
    "회의날짜": { date: { start: item.date } },
    "주차": { rich_text: rt(week) },
    "작성자": { rich_text: rt(item.writer || "") },
    "시간": { rich_text: rt(item.time || "") },
    "장소": { rich_text: rt(item.place || "") },
    "참석자": { rich_text: rt(item.attendees || "") },
    "회의요약": { rich_text: rt(item.summary || "") },
  };
  props["과제"] = item.project ? { select: { name: item.project } } : { select: null };

  const sections = item.sections || [];
  const children = [];
  sections.forEach(function(s){
    children.push({ object:"block", type:"heading_3", heading_3:{ rich_text: rt(s.heading||"") } });
    children.push({ object:"block", type:"paragraph", paragraph:{ rich_text: rt(s.body||"") } });
  });
  const body = { parent: { database_id: MEETING_DB_ID }, properties: props };
  if(children.length) body.children = children;
  const res = await notionFetch("/pages", token, "POST", body);

  if(sections.length){
    try {
      const summaryText = sections.map(function(s){ return s.heading; }).filter(Boolean).join(" / ");
      await notionFetch("/pages/" + res.id, token, "PATCH", { properties: { "요약": { rich_text: rt(summaryText) } } });
    } catch(e){}
  }
  return { created: true, id: res.id };
}

// 회의자료 꼭지(본문) 수정 — 본문 전체를 새 섹션으로 교체
async function updateMeeting(env, payload){
  const token = env.NOTION_TOKEN;
  const meetingId = payload.meetingId;
  const sections = payload.sections || []; // [{heading, body}]
  if(!meetingId) throw new Error("회의자료 id 누락");

  // 기존 본문 블록 삭제
  const cur = await notionFetch("/blocks/" + meetingId + "/children?page_size=100", token);
  for(const b of (cur.results||[])){
    try { await notionFetch("/blocks/" + b.id, token, "DELETE"); } catch(e){}
  }
  // 새 본문: 꼭지마다 heading_3 + paragraph
  const children = [];
  sections.forEach(function(s){
    children.push({ object:"block", type:"heading_3", heading_3:{ rich_text: rt(s.heading||"") } });
    children.push({ object:"block", type:"paragraph", paragraph:{ rich_text: rt(s.body||"") } });
  });
  if(children.length){
    await notionFetch("/blocks/" + meetingId + "/children", token, "PATCH", { children: children });
  }
  // 요약 속성도 꼭지 제목 나열로 동기화 (개요 표에 표시되는 값)
  try {
    const summaryText = sections.map(function(s){ return s.heading; }).filter(Boolean).join(" / ");
    await notionFetch("/pages/" + meetingId, token, "PATCH", { properties: { "요약": { rich_text: rt(summaryText) } } });
  } catch(e){}
  return { updated: true };
}

// ===== 위탁과제 회의록 CRUD =====
function consignMeetingProps(item){
  return {
    "제목": { title: rt(item.title || "") },
    "과제": { relation: [{ id: item.project }] },
    "구분": { select: { name: item.kind || "월간회의" } },
    "상태": { select: { name: item.status || "예정" } },
    "형태": { select: { name: item.mode || "대면" } },
    "일시": item.date ? { date: { start: item.date } } : { date: null },
    "참석": { rich_text: rt(item.attendees || "") },
    "내용": { rich_text: rt(item.body || "") },
  };
}
async function createConsignMeeting(env, payload){
  const token = env.NOTION_TOKEN;
  const item = payload.item || {};
  if(!item.project) throw new Error("과제(project) 누락");
  var res = await notionFetch("/pages", token, "POST", { parent:{ database_id: CONSIGN_MEETING_DB_ID }, properties: consignMeetingProps(item) });
  return { created: true, id: res.id };
}
async function updateConsignMeeting(env, payload){
  const token = env.NOTION_TOKEN;
  const item = payload.item || {};
  if(!item.id) throw new Error("page id 누락");
  await notionFetch("/pages/" + item.id, token, "PATCH", { properties: consignMeetingProps(item) });
  return { updated: true };
}
async function deleteConsignMeeting(env, payload){
  const token = env.NOTION_TOKEN;
  if(!payload.id) throw new Error("page id 누락");
  await notionFetch("/pages/" + payload.id, token, "PATCH", { archived: true });
  return { deleted: true };
}

// ===== 위탁과제 요청자료 CRUD (Q&A는 본문 블록으로 저장) =====
function consignRequestProps(item){
  return {
    "제목": { title: rt(item.title || "") },
    "과제": { relation: [{ id: item.project }] },
    "구분": { select: { name: item.category || "기타" } },
    "상태": { select: { name: item.status || "검토중" } },
    "요청일": item.reqDate ? { date: { start: item.reqDate } } : { date: null },
    "회신일": item.replyDate ? { date: { start: item.replyDate } } : { date: null },
    "요청파일명": { rich_text: rt(item.reqFile || "") },
    "회신파일명": { rich_text: rt(item.replyFile || "") },
  };
}
// 현재 본문을 "꼭지 단위"(heading + 그 뒤 첫 paragraph + 그 뒤 image들)로 순서대로 묶어서 반환
async function getOrderedQaSections(pageId, token){
  const data = await notionFetch("/blocks/" + pageId + "/children?page_size=100", token);
  const sections = []; let cur = null;
  const BODY_TYPES = ["paragraph","bulleted_list_item","numbered_list_item","quote","callout"];
  for(const b of (data.results || [])){
    const t = b.type;
    if(t && t.startsWith("heading")){
      cur = { headingId: b.id, headingType: t, paragraphId: null, paragraphType: "paragraph", extraBodyIds: [], imageIds: [] };
      sections.push(cur);
    } else if(cur){
      if(BODY_TYPES.indexOf(t) >= 0){
        // 답변이 노션에서 여러 문단(블록)으로 나뉘어 있을 수 있음(Enter로 줄바꿈한 경우) — 전부 추적해야 저장 시 안 남고 지워짐
        if(cur.paragraphId === null){ cur.paragraphId = b.id; cur.paragraphType = t; }
        else cur.extraBodyIds.push(b.id);
      }
      else if(t === "image") cur.imageIds.push(b.id);
    }
  }
  return sections;
}

// Q&A 저장: 기존 꼭지(질문/답변)는 그 블록을 "그 자리에서" 내용만 교체 → 사이에 있는 이미지 블록은 절대 안 건드림.
// 답변이 여러 문단(블록)으로 나뉘어 있었으면 첫 블록에 전체 내용을 담고 나머지 옛 블록은 삭제(안 그러면 옛 내용이 남아서 뒤섞임).
// 새로 추가된 항목은 맨 뒤에 덧붙이고, 삭제된 항목은 그 항목의 블록만 지움(이미지 포함).
async function writeRequestQaBlocks(pageId, token, qa){
  const list = qa || [];
  const sections = await getOrderedQaSections(pageId, token);
  const n = Math.min(sections.length, list.length);
  for(let i=0;i<n;i++){
    const sec = sections[i], item = list[i];
    // 실제 블록 타입(heading_1/2/3 등)에 맞춰 패치해야 함 — 타입을 강제로 바꾸는 건 노션이 거부함
    var headingPatch = {}; headingPatch[sec.headingType] = { rich_text: rt(item.q||"") };
    await notionFetch("/blocks/" + sec.headingId, token, "PATCH", headingPatch);
    if(sec.paragraphId){
      var bodyPatch = {}; bodyPatch[sec.paragraphType] = { rich_text: rt(item.a||"") };
      await notionFetch("/blocks/" + sec.paragraphId, token, "PATCH", bodyPatch);
    } else {
      await notionFetch("/blocks/" + pageId + "/children", token, "PATCH", { children: [{ object:"block", type:"paragraph", paragraph:{ rich_text: rt(item.a||"") } }], after: sec.headingId });
    }
    // 답변이 여러 블록으로 나뉘어 있었다면, 첫 블록에 전체 내용을 넣었으니 나머지는 삭제(안 그러면 옛 내용이 중복으로 남음)
    for(const extraId of (sec.extraBodyIds||[])){ try { await notionFetch("/blocks/" + extraId, token, "DELETE"); } catch(e){} }
  }
  // 삭제된 항목(뒤쪽 남는 기존 섹션) 제거 — 이미지도 그 섹션 것만 같이 지움
  for(let i=list.length; i<sections.length; i++){
    const sec = sections[i];
    try { await notionFetch("/blocks/" + sec.headingId, token, "DELETE"); } catch(e){}
    if(sec.paragraphId){ try { await notionFetch("/blocks/" + sec.paragraphId, token, "DELETE"); } catch(e){} }
    for(const extraId of (sec.extraBodyIds||[])){ try { await notionFetch("/blocks/" + extraId, token, "DELETE"); } catch(e){} }
    for(const imgId of sec.imageIds){ try { await notionFetch("/blocks/" + imgId, token, "DELETE"); } catch(e){} }
  }
  // 새로 추가된 항목(기존보다 많아진 만큼) — 맨 뒤에 덧붙임
  if(list.length > sections.length){
    const children = [];
    for(let i=sections.length; i<list.length; i++){
      children.push({ object:"block", type:"heading_3", heading_3:{ rich_text: rt(list[i].q||"") } });
      children.push({ object:"block", type:"paragraph", paragraph:{ rich_text: rt(list[i].a||"") } });
    }
    if(children.length) await notionFetch("/blocks/" + pageId + "/children", token, "PATCH", { children: children });
  }
}
async function createConsignRequest(env, payload){
  const token = env.NOTION_TOKEN;
  const item = payload.item || {};
  if(!item.project) throw new Error("과제(project) 누락");
  var res = await notionFetch("/pages", token, "POST", { parent:{ database_id: CONSIGN_REQUEST_DB_ID }, properties: consignRequestProps(item) });
  await writeRequestQaBlocks(res.id, token, item.qa);
  return { created: true, id: res.id };
}
async function updateConsignRequest(env, payload){
  const token = env.NOTION_TOKEN;
  const item = payload.item || {};
  if(!item.id) throw new Error("page id 누락");
  await notionFetch("/pages/" + item.id, token, "PATCH", { properties: consignRequestProps(item) });
  await writeRequestQaBlocks(item.id, token, item.qa);
  return { updated: true };
}
async function deleteConsignRequest(env, payload){
  const token = env.NOTION_TOKEN;
  if(!payload.id) throw new Error("page id 누락");
  await notionFetch("/pages/" + payload.id, token, "PATCH", { archived: true });
  return { deleted: true };
}

export default {
  async fetch(request, env){
    if(request.method === "OPTIONS") return new Response(null, { headers: corsHeaders() });

    // POST = 저장 또는 수정 요청
    if(request.method === "POST"){
      try {
        const payload = await request.json();
        let result;
        if(payload.action === "update"){
          result = await updateWork(env, payload);
        } else if(payload.action === "create"){
          result = await createWork(env, payload);
        } else if(payload.action === "delete"){
          result = await deleteWork(env, payload);
        } else if(payload.action === "syncPlans"){
          result = await syncPlansFromCalendar(env);
        } else if(payload.action === "perfCreate"){
          result = await createPerf(env, payload);
        } else if(payload.action === "perfUpdate"){
          result = await updatePerf(env, payload);
        } else if(payload.action === "perfDelete"){
          result = await deletePerf(env, payload);
        } else if(payload.action === "wbsCreate"){
          result = await createWbs(env, payload);
        } else if(payload.action === "wbsUpdate"){
          result = await updateWbs(env, payload);
        } else if(payload.action === "wbsDelete"){
          result = await deleteWbs(env, payload);
        } else if(payload.action === "schedCreate"){
          result = await createSchedule(env, payload);
        } else if(payload.action === "schedUpdate"){
          result = await updateSchedule(env, payload);
        } else if(payload.action === "schedDelete"){
          result = await deleteSchedule(env, payload);
        } else if(payload.action === "archiveScheduleNow"){
          result = await archiveYesterdaySchedule(env); // 크론 기다리지 않고 수동 테스트용
        } else if(payload.action === "archiveBackfill"){
          if(!payload.from || !payload.to) throw new Error("from/to 날짜(YYYY-MM-DD)가 필요합니다");
          result = await archiveDateRange(env, payload.from, payload.to); // 과거 데이터 한 번에 몰아서 채우기
        } else if(payload.action === "archiveDay"){
          if(!payload.day) throw new Error("day 날짜(YYYY-MM-DD)가 필요합니다");
          result = await archiveOneDay(env, payload.day); // 하루씩 백필(서브요청 한도 안전)
        } else if(payload.action === "login"){
          result = await checkLogin(env, payload);
        } else if(payload.action === "comment"){
          result = await addComment(env, payload);
        } else if(payload.action === "deleteComment"){
          result = await deleteComment(env, payload);
        } else if(payload.action === "meetingCreate"){
          result = await createMeeting(env, payload);
        } else if(payload.action === "updateMeeting"){
          result = await updateMeeting(env, payload);
        } else if(payload.action === "updateMeetingSummary"){
          result = await updateMeetingSummary(env, payload);
        } else if(payload.action === "updateMeetingInfo"){
          result = await updateMeetingInfo(env, payload);
        } else if(payload.action === "meetingDelete"){
          result = await deleteMeeting(env, payload);
        } else if(payload.action === "consignMeetingCreate"){
          result = await createConsignMeeting(env, payload);
        } else if(payload.action === "consignMeetingUpdate"){
          result = await updateConsignMeeting(env, payload);
        } else if(payload.action === "consignMeetingDelete"){
          result = await deleteConsignMeeting(env, payload);
        } else if(payload.action === "consignRequestCreate"){
          result = await createConsignRequest(env, payload);
        } else if(payload.action === "consignRequestUpdate"){
          result = await updateConsignRequest(env, payload);
        } else if(payload.action === "consignRequestDelete"){
          result = await deleteConsignRequest(env, payload);
        } else {
          result = await saveWork(env, payload);
        }
        return new Response(JSON.stringify({ ok:true, result: result }), { headers: corsHeaders() });
      } catch(e){
        return new Response(JSON.stringify({ ok:false, error: String(e) }), { status:500, headers: corsHeaders() });
      }
    }

    try {
      const token = env.NOTION_TOKEN;
      if(!token) throw new Error("NOTION_TOKEN 미설정");

      var url = new URL(request.url);
      var scope = url.searchParams.get("scope") || "all";
      var want = function(k){ return scope==="all" || scope===k; };

      const body = { updated_at: new Date().toISOString() };

      if(scope === "dashboard"){
        // 대시보드 전용: 필요한 것만, 전부 병렬로 (개별 실패해도 나머지는 계속 진행)
        var wkR0 = currentWeekRange();
        // 회의 목록 + (이번주 회의 한정) 코멘트 조회를 하나의 체인으로 묶음
        // → 아래 Promise.allSettled 안에서 다른 6개 fetch와 "진짜" 동시에 돎 (예전엔 이게 밖에서 순차로 붙어서 시간이 그냥 더해졌었음)
        var meetingsPromise = getAllPages(MEETING_DB_ID, token).then(async function(pages){
          var lite = pages.map(parseMeetingLite).filter(function(m){ return m.title; });
          var thisWeek = lite.filter(function(m){ return m.date >= wkR0.start && m.date <= wkR0.end; });
          try {
            var commentResults = await Promise.allSettled(thisWeek.map(function(m){ return getComments(m.id, token); }));
            thisWeek.forEach(function(m, i){
              var comments = (commentResults[i].status==="fulfilled") ? commentResults[i].value : [];
              m.needsReview = !comments.some(function(c){ return c.author === "이숭봉"; });
            });
          } catch(e){}
          return lite;
        });

        const results = await Promise.allSettled([
          getAllPages(PROJECT_DB_ID, token),                 // 0: 과제 정보
          getAllPages(WBS_DB_ID, token),                     // 1: WBS
          getAllPages(PERF_DB_ID, token),                    // 2: 성과
          getAllPages(ACHIEVE_DB_ID, token),                 // 3: 업무실적
          getAllPages(PLAN_DB_ID, token),                    // 4: 업무계획
          meetingsPromise,                                   // 5: 회의자료 + 이번주 코멘트(체인됨, 이제 진짜 병렬)
          getAllPages(CONSIGN_DB_ID, token),                 // 6: 위탁과제 정보만(회의록/요청자료는 대시보드에 안 씀)
          combinedScheduleList(env),  // 7: 일정(노션 아카이브 - 오늘 이전 + 두레이 팀 캘린더 - 오늘 이후, 병합)
        ]);
        function ok(i, map){ return results[i].status==="fulfilled" ? map(results[i].value) : []; }

        var pinfo = ok(0, function(pages){ return pages.map(parseProjectInfo).filter(function(x){return x.name;}); });
        pinfo.sort(function(a,b){ return a.order - b.order; });
        body.projectInfo = pinfo;
        if(results[0].status==="rejected") body.projectInfoError = String(results[0].reason);

        body.wbs = ok(1, function(pages){ return pages.map(parseWbs).filter(function(w){return w.task;}); });

        body.perf = ok(2, function(pages){ return pages.map(parsePerf).filter(function(x){return x.name;}); });

        var aAll = ok(3, function(pages){ return pages.map(parseWorkPageLite); });
        var pAll = ok(4, function(pages){ return pages.map(parseWorkPageLite); });
        var wkR = wkR0;
        var achievements = aAll.filter(function(x){return x.week===wkR.label;});
        var plans = pAll.filter(function(x){return x.week===wkR.planLabel;});
        body.work = { week: wkR.label, planWeek: wkR.planLabel, achievements: achievements, plans: plans };

        body.meetings = results[5].status==="fulfilled" ? results[5].value : [];

        var consignments = ok(6, function(pages){ return pages.map(parseConsignment).filter(function(c){return c.title;}); });
        consignments.sort(function(a,b){ return a.order - b.order; });
        body.consignments = consignments;

        var scheduleResult = results[7].status==="fulfilled" ? results[7].value : { items: [], errors: { combinedScheduleError: String(results[7].reason) } };
        body.schedule = scheduleResult.items || [];
        if(scheduleResult.errors && scheduleResult.errors.archiveScheduleError) body.archiveScheduleError = scheduleResult.errors.archiveScheduleError;
        if(scheduleResult.errors && scheduleResult.errors.doorayScheduleError) body.doorayScheduleError = scheduleResult.errors.doorayScheduleError;
        if(scheduleResult.errors && scheduleResult.errors.combinedScheduleError) body.scheduleError = scheduleResult.errors.combinedScheduleError;

        return new Response(JSON.stringify(body), { headers: corsHeaders() });
      }

      // 대시보드 팝업 전용: 회의 1건만 (본문+코멘트) 가볍게 조회 — scope=meetings(전체) 대신 사용
      if(scope === "meetingDetail"){
        const meetingId = url.searchParams.get("id");
        if(!meetingId) return new Response(JSON.stringify({ error:"id 누락" }), { status:400, headers: corsHeaders() });
        try {
          const page = await notionFetch("/pages/" + meetingId, token, "GET");
          const meeting = await parseMeeting(page, token);
          meeting.comments = await getComments(meetingId, token);
          return new Response(JSON.stringify({ meeting: meeting }), { headers: corsHeaders() });
        } catch(e){
          return new Response(JSON.stringify({ error: String(e) }), { status:500, headers: corsHeaders() });
        }
      }

      if(want("reports")){
        const reportPages = await getAllPages(REPORT_DB_ID, token);
        const reports = [];
        for(const pg of reportPages){ try { reports.push(await parseReport(pg, token)); } catch(e){} }
        body.reports = reports;
      }

      if(want("wbs")){
        const [wbsRes, projRes] = await Promise.allSettled([
          getAllPages(WBS_DB_ID, token),
          getAllPages(PROJECT_DB_ID, token),
        ]);
        if(wbsRes.status==="fulfilled"){
          body.wbs = wbsRes.value.map(parseWbs).filter(function(w){ return w.task; });
        } else { body.wbs = []; }
        if(projRes.status==="fulfilled"){
          var pinfo = projRes.value.map(parseProjectInfo).filter(function(x){ return x.name; });
          pinfo.sort(function(a,b){ return a.order - b.order; });
          body.projectInfo = pinfo;
        } else { body.projectInfo = []; body.projectInfoError = String(projRes.reason); }
      }

      if(want("perf")){
        try {
          const perfPages = await getAllPages(PERF_DB_ID, token);
          body.perf = perfPages.map(parsePerf).filter(function(x){ return x.name; });
        } catch(e){ body.perf = []; }
      }

      if(want("schedule")){
        try {
          var schedRes = await combinedScheduleList(env);
          body.schedule = schedRes.items || [];
          if(schedRes.errors && schedRes.errors.archiveScheduleError) body.archiveScheduleError = schedRes.errors.archiveScheduleError;
          if(schedRes.errors && schedRes.errors.doorayScheduleError) body.doorayScheduleError = schedRes.errors.doorayScheduleError;
        } catch(e){ body.schedule = []; body.scheduleError = String(e); }
      }

      if(want("calendar")){
        try { body.calendar = await getCalendarEvents(env.GCAL_ICS_URL); }
        catch(e){ body.calendar = []; body.calError = String(e); }
      }

      if(want("work")){
        let achievements = [], plans = [];
        const weekOffset = parseInt(url.searchParams.get("weekOffset") || "0", 10) || 0;
        const wkR = currentWeekRange(weekOffset);
        try {
          const [aPages, pPages] = await Promise.all([
            getAllPages(ACHIEVE_DB_ID, token),
            getAllPages(PLAN_DB_ID, token),
          ]);
          const [aAll, pAll] = await Promise.all([
            Promise.all(aPages.map(function(pg){ return parseWorkPage(pg, token, false); })),
            Promise.all(pPages.map(function(pg){ return parseWorkPage(pg, token, true); })),
          ]);
          achievements = aAll.filter(function(x){ return x.week === wkR.label; });
          plans = pAll.filter(function(x){ return x.week === wkR.planLabel; });
          function srt(a,b){ if(a.date!==b.date) return a.date<b.date?-1:1; return (a.time||"")<(b.time||"")?-1:1; }
          achievements.sort(srt); plans.sort(srt);
        } catch(e){}
        body.work = { week: wkR.label, planWeek: wkR.planLabel, achievements: achievements, plans: plans };
      }

      if(want("meetings")){
        let meetings = [];
        try {
          const mPages = await getAllPages(MEETING_DB_ID, token);
          const parsed = await Promise.all(mPages.map(function(pg){ return parseMeeting(pg, token); }));
          parsed.sort(function(a,b){ return (a.date<b.date?1:-1); });
          const commentResults = await Promise.all(parsed.map(function(m){ return getComments(m.id, token); }));
          parsed.forEach(function(m, i){ m.comments = commentResults[i]; });
          meetings = parsed;
        } catch(e){ body.meetingError = String(e); }
        body.meetings = meetings;
      }

      if(want("outsourced")){
        const [cRes, cmRes, crRes] = await Promise.allSettled([
          getAllPages(CONSIGN_DB_ID, token),
          getAllPages(CONSIGN_MEETING_DB_ID, token),
          getAllPages(CONSIGN_REQUEST_DB_ID, token),
        ]);
        if(cRes.status==="fulfilled"){
          var consignments = cRes.value.map(parseConsignment).filter(function(c){ return c.title; });
          consignments.sort(function(a,b){ return a.order - b.order; });
          body.consignments = consignments;
        } else { body.consignments = []; body.consignError = String(cRes.reason); }

        if(cmRes.status==="fulfilled"){
          body.consignMeetings = cmRes.value.map(parseConsignMeeting).filter(function(m){ return m.title; });
        } else { body.consignMeetings = []; body.consignMeetingError = String(cmRes.reason); }

        if(crRes.status==="fulfilled"){
          try {
            body.consignRequests = await Promise.all(crRes.value.map(function(pg){ return parseConsignRequest(pg, token); }));
          } catch(e){ body.consignRequests = []; body.consignRequestError = String(e); }
        } else { body.consignRequests = []; body.consignRequestError = String(crRes.reason); }
      }

      return new Response(JSON.stringify(body), { headers: corsHeaders() });
    } catch(e){
      return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: corsHeaders() });
    }
  },

  // 매일 한 번(Cloudflare 대시보드에서 Cron Trigger로 등록 필요) - 어제치 두레이 일정을 노션 아카이브로 저장
  async scheduled(event, env, ctx){
    ctx.waitUntil(
      archiveYesterdaySchedule(env)
        .then(function(r){ console.log("일정 아카이브 완료:", JSON.stringify(r)); })
        .catch(function(e){ console.error("일정 아카이브 실패:", e); })
    );
  },
};
