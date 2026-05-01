#!/usr/bin/env python
"""Convert Korean mermaid identifiers to ASCII while keeping labels."""
import re
import sys
from pathlib import Path

# Korean ID → ASCII ID mapping (label kept as-is in brackets/after as)
ID_MAP = {
    # subgraph + flowchart node IDs
    "입력": "INPUT",
    "핵심": "CORE",
    "출력": "OUTPUT",
    "마켓": "MK",
    "마켓들": "MARKETS",
    "표준": "STD",
    "셀러": "USER",
    "통합": "HUB",
    "발송": "SHIP",
    "클레임": "CLAIM",
    "패션": "FASHION",
    "종합": "SHOPPING",
    "기타": "MISC",
    "일반마켓": "OTHER_MKT",
    "롯데온": "LOTTE",
    "스마트스토어": "SS",
    "쿠팡": "CP",
    "무신사": "MUSINSA",
    "익스텐션": "EXT",
    "정책": "POLICY",
    "4마켓": "FOUR_MKT",
    "고객": "CUSTOMER",
    "더망고": "TCO",  # legacy — already replaced but defensive
    "T사": "TCO",     # post-rename
    # state diagram states (06-orders-cs.md)
    "주문접수": "Received",
    "발송완료": "Shipped",
    "취소요청": "CancelReq",
    "취소승인": "CancelApprove",
    "취소거부": "CancelReject",
    "반품요청": "ReturnReq",
    "회수보류": "ReturnHold",
    "반품승인": "ReturnApprove",
    "회수완료": "Returned",
    "환불완료": "Refunded",
    "교환요청": "ExchangeReq",
    "교환승인": "ExchangeApprove",
    "재발송": "Reshipped",
    # extra hero/index node IDs
    "노출": "VISIBILITY",
    "신뢰": "TRUST",
    "매출": "SALES",
    "상품": "PRODUCT",
    "원본": "SOURCE",
    "결과": "RESULT",
    "검색": "SEARCH",
    "수집": "COLLECT",
    "그룹상품": "GROUP_PROD",
}

# Order by length desc to avoid partial matches (e.g., "마켓" being part of "마켓들")
KEYS_BY_LEN = sorted(ID_MAP.keys(), key=len, reverse=True)

MERMAID_BLOCK = re.compile(r"^```mermaid\n(.*?)^```", re.MULTILINE | re.DOTALL)


def transform_block(block: str) -> str:
    """Replace Korean IDs in a mermaid source block.

    Strategy: replace whole-word Korean tokens that appear as identifiers.
    Korean inside square brackets [라벨] or quotes "라벨" or after 'as' keyword
    is kept as label, not replaced.
    """
    # 1) `subgraph KOREAN["label"]` → `subgraph ASCII["label"]`
    # 2) `subgraph KOREAN` (no brackets) → `subgraph ASCII["KOREAN"]`
    # 3) `KOREAN[label]` (node def) → `ASCII[label]`
    # 4) `KOREAN -->` / `KOREAN -.->` / `--> KOREAN` (edges) → ASCII
    # 5) `style KOREAN` → `style ASCII`
    # 6) `participant KOREAN` (sequence) → `participant ASCII as KOREAN`
    # 7) sequence: `KOREAN->>OTHER` → `ASCII->>OTHER`

    out = block

    # Pre-pass: subgraph without brackets — add brackets with original label
    # subgraph 패션  →  subgraph FASHION["패션"]
    def fix_bare_subgraph(m):
        kor = m.group(1)
        if kor in ID_MAP:
            return f'subgraph {ID_MAP[kor]}["{kor}"]'
        return m.group(0)
    out = re.sub(r'subgraph\s+([가-힣][가-힣\d]*)\s*$', fix_bare_subgraph, out, flags=re.MULTILINE)

    # Pre-pass: participant 셀러 (no `as`) → participant USER as 셀러
    def fix_bare_participant(m):
        kor = m.group(1)
        if kor in ID_MAP:
            return f'participant {ID_MAP[kor]} as {kor}'
        return m.group(0)
    out = re.sub(r'^(\s*)participant\s+([가-힣][가-힣\d]*)\s*$', lambda m: m.group(1) + fix_bare_participant(re.match(r'participant\s+([가-힣][가-힣\d]*)\s*$', m.group(0).strip())), out, flags=re.MULTILINE)

    # Generic: replace Korean identifiers with ASCII, BUT only when they appear as IDs
    # We preserve text inside [...], ("..."), {...} (labels), and after `:` (sequence message)
    # Approach: split by label-like spans, only transform outside-spans.
    label_pat = re.compile(r'(\[[^\]]*\]|\([^\)]*\)|\{[^\}]*\}|"[^"]*"|:.*$)', re.MULTILINE)

    result_lines = []
    for line in out.split('\n'):
        # Find label spans first so we don't replace inside them
        spans = []
        for m in label_pat.finditer(line):
            spans.append((m.start(), m.end()))

        def in_span(pos):
            for s, e in spans:
                if s <= pos < e:
                    return True
            return False

        # Replace each Korean key when it appears as a whole word OUTSIDE label spans
        new_line = []
        i = 0
        while i < len(line):
            matched = False
            for kor in KEYS_BY_LEN:
                if line.startswith(kor, i) and not in_span(i):
                    # Check word boundaries: previous char and next char should not be Korean
                    prev_ok = (i == 0) or (not _is_korean(line[i-1]) and not _is_alnum(line[i-1]))
                    next_pos = i + len(kor)
                    next_ok = (next_pos == len(line)) or (not _is_korean(line[next_pos]) and not _is_alnum(line[next_pos]))
                    if prev_ok and next_ok:
                        new_line.append(ID_MAP[kor])
                        i += len(kor)
                        matched = True
                        break
            if not matched:
                new_line.append(line[i])
                i += 1
        result_lines.append(''.join(new_line))

    return '\n'.join(result_lines)


def _is_korean(c):
    return '가' <= c <= '힣'


def _is_alnum(c):
    return c.isalnum() or c == '_'


def process_file(path: Path):
    text = path.read_text(encoding='utf-8')
    new_text = MERMAID_BLOCK.sub(lambda m: '```mermaid\n' + transform_block(m.group(1)) + '```', text)
    if new_text != text:
        path.write_text(new_text, encoding='utf-8')
        print(f"OK {path.relative_to(path.parent.parent)}")
    else:
        print(f".. {path.relative_to(path.parent.parent)} (no change)")


if __name__ == '__main__':
    docs = Path(__file__).parent / 'docs'
    for md in sorted(docs.rglob('*.md')):
        process_file(md)
