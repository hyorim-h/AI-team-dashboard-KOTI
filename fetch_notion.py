"""
fetch_notion.py
노션 주간 리포트 DB → data.json
"""
import os, json, re, urllib.request, urllib.error
from datetime import datetime, timezone

NOTION_TOKEN = os.environ["NOTION_TOKEN"]
NOTION_DB_ID = os.environ["NOTION_DB_ID"]

HEADERS = {
    "Authorization": f"Bearer {NOTION_TOKEN}",
    "Notion-Version": "2022-06-28",
    "Content-Type": "application/json",
}

def notion_request(method, path, body=None):
    url = f"https://api.notion.com/v1{path}"
    data = json.dumps(body).encode() if body else None
    req = urllib.request.Request(url, data=data, headers=HEADERS, method=method)
    try:
        with urllib.request.urlopen(req) as r:
            return json.loads(r.read())
    except urllib.error.HTTPError as e:
        print(f"HTTP Error {e.code}: {e.read().decode()}")
        raise

def get_all_pages():
    """DB의 모든 페이지(리포트) 가져오기 — 페이지네이션 처리"""
    pages, cursor = [], None
    while True:
        body = {"page_size": 100}
        if cursor:
            body["start_cursor"] = cursor
        res = notion_request("POST", f"/databases/{NOTION_DB_ID}/query", body)
        pages.extend(res.get("results", []))
        if not res.get("has_more"):
            break
        cursor = res.get("next_cursor")
    return pages

def get_page_content(page_id):
    """페이지 본문 블록을 헤딩 기준으로 섹션 파싱"""
    res = notion_request("GET", f"/blocks/{page_id}/children?page_size=100")
    blocks = res.get("results", [])

    sections = {}
    current_heading = None
    for block in blocks:
        btype = block.get("type", "")
        if btype in ("heading_1", "heading_2", "heading_3", "heading_4"):
            texts = block[btype].get("rich_text", [])
            current_heading = "".join(t["plain_text"] for t in texts).strip()
            sections[current_heading] = []
        elif current_heading is not None:
            # paragraph / bulleted_list_item / numbered_list_item 등 텍스트 추출
            rich = block.get(btype, {}).get("rich_text", [])
            text = "".join(t["plain_text"] for t in rich).strip()
            if text:
                sections[current_heading].append(text)

    # 섹션 리스트 → 문자열로 합치기
    return {k: "\n".join(v) for k, v in sections.items()}

SECTION_MAP = {
    "이번 주 한 일": "f1",
    "진행 중":       "f2",
    "막힌 것":       "f3",
    "다음 주 계획":  "f4",
    "관련 논문":     "f5",
    "위키 노트":     "f5",  # 같은 f5로 병합
    "검토 필요 사항": "f6",
    "검토 필요사항": "f6",
    "연구책임자 코멘트": "comment",
}

def extract_week(title):
    """문서명에서 주차 정보 추출. 예: '6월 3주차 주간레포트' → '6월 3주차'"""
    m = re.search(r"\d+월\s*\d+주차", title)
    return m.group(0) if m else title

def parse_page(page):
    props = page.get("properties", {})

    # 문서명
    title_list = props.get("문서명", {}).get("title", [])
    title = "".join(t["plain_text"] for t in title_list).strip()

    # 프로젝트
    proj_sel = props.get("프로젝트", {}).get("select") or {}
    project = proj_sel.get("name", "")

    # 막힘 체크박스
    blocked = props.get("막힘", {}).get("checkbox", False)

    # 생성자 ID
    creator = props.get("생성자", {}).get("created_by", {})
    creator_id = creator.get("id", "")
    creator_name = creator.get("name", "")  # 이미 이름 포함되는 경우

    # 상태: '제출완료' 포함 여부로 판단 (추후 속성 추가 시 여기서 읽으면 됨)
    status_sel = props.get("상태", {}).get("select") or {}
    status_name = status_sel.get("name", "")
    if status_name:
        status = "submitted" if "제출" in status_name else "pending"
    else:
        # 상태 속성 없으면 막힘=False + 내용 있으면 submitted로 간주
        status = "submitted" if title else "pending"

    # 페이지 본문 파싱
    content = get_page_content(page["id"])

    report = {
        "title": title,
        "week": extract_week(title),
        "project": project,
        "blocked": blocked,
        "status": status,
        "creator_id": creator_id,
        "creator_name": creator_name,
        "f1": "", "f2": "", "f3": "", "f4": "", "f5": "", "f6": "",
        "comment": "",
        "page_url": page.get("url", ""),
    }

    for heading, text in content.items():
        for key, field in SECTION_MAP.items():
            if key in heading:
                if field == "f5" and report["f5"]:
                    report["f5"] += "\n" + text
                else:
                    report[field] = text
                break

    return report

def main():
    print("노션 DB 조회 중...")
    pages = get_all_pages()
    print(f"  {len(pages)}개 리포트 발견")

    reports = []
    for page in pages:
        try:
            r = parse_page(page)
            reports.append(r)
            print(f"  ✓ {r['creator_name'] or r['creator_id']} / {r['week']} / {r['project']}")
        except Exception as e:
            print(f"  ✗ 페이지 파싱 실패 ({page.get('id','')}): {e}")

    output = {
        "updated_at": datetime.now(timezone.utc).isoformat(),
        "reports": reports,
    }
    with open("data.json", "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)
    print(f"data.json 저장 완료 ({len(reports)}건)")

if __name__ == "__main__":
    main()
