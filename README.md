# Lonit 매뉴얼 사이트

셀러를 위한 4마켓 자동화 가이드. MkDocs Material 기반.

## 로컬에서 보기

```bash
# 1) 의존성 설치 (한 번만)
cd manual
pip install -r requirements.txt

# 2) 로컬 서버 실행
mkdocs serve

# 브라우저에서 http://127.0.0.1:8000 열기
# 마크다운 수정하면 자동 새로고침
```

## 빌드 (정적 사이트 생성)

```bash
mkdocs build
# manual/site/ 에 정적 파일 생성됨
```

## GitHub Pages 배포 (후속)

```bash
mkdocs gh-deploy
# gh-pages 브랜치에 자동 push + 배포
```

## 폴더 구조

```
manual/
├── mkdocs.yml              # 사이트 설정
├── requirements.txt        # Python 의존성
├── README.md               # 이 파일
└── docs/                   # 콘텐츠 (마크다운)
    ├── index.md            # 랜딩
    ├── 01-getting-started.md
    ├── 02-architecture.md
    ├── 03-vs-themango.md
    ├── 04-market-strategy/
    │   ├── index.md
    │   ├── smartstore.md
    │   ├── coupang.md
    │   ├── lotteon.md
    │   └── 11st.md
    ├── 05-workflow.md
    ├── 06-orders-cs.md
    ├── 07-pricing.md
    └── 08-troubleshooting.md
```

## 콘텐츠 편집 가이드

- 모든 문서는 `docs/` 안의 `.md` 파일
- Mermaid 다이어그램: ` ```mermaid ` 코드 블록
- 콜아웃 박스: `!!! note "제목"` 또는 `!!! tip` / `!!! warning` / `!!! danger`
- 탭: `=== "탭1"` ... `=== "탭2"`
- 새 페이지 추가 시 `mkdocs.yml`의 `nav:` 섹션도 업데이트

자세한 마크다운 문법은 [Material for MkDocs 문서](https://squidfunk.github.io/mkdocs-material/reference/) 참고.
