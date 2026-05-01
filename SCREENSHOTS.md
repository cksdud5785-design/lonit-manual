# 스크린샷 추가 가이드

이 문서는 매뉴얼에 추가하면 좋은 **Lonit UI 스크린샷 목록**입니다. 캡처해서 `docs/assets/screenshots/` 에 정확한 파일명으로 저장하면, 매뉴얼 마크다운에 추가만 하면 됩니다.

---

## 캡처 환경 권장

- **해상도**: 1440 × 900 (데스크톱 표준)
- **브라우저**: Chrome, 100% 줌
- **시크릿 모드**: 즐겨찾기/확장 안 보이게
- **포맷**: PNG (단일 화면) 또는 WebP (압축 더 좋음)
- **익명화**: 실제 셀러 데이터(이메일·전화·주문번호) 모자이크 처리

---

## 우선순위별 캡처 목록

### 🌟 P0 — 가장 임팩트 있는 5장

| 파일명 | 캡처 화면 | 매뉴얼 위치 |
|------|----------|----------|
| `dashboard-main.png` | 대시보드 메인 (4마켓 통합 매트릭스, 매출 카드) | `docs/index.md` 히어로 |
| `accounts-with-ip-banner.png` | 설정 → 마켓 계정 (IP 배너 + 4마켓 카드) | `docs/01-getting-started.md` §2-2 |
| `upload-progress.png` | 4마켓 동시 업로드 진행 화면 | `docs/01-getting-started.md` §6 |
| `orders-unified.png` | 통합 주문 화면 (4마켓 색상 구분) | `docs/06-orders-cs.md` §1 |
| `policy-editor.png` | 가격 정책 편집 화면 (8변수 폼) | `docs/07-pricing.md` §2 |

### 🔵 P1 — 챕터별 보조 8장

| 파일명 | 캡처 화면 | 매뉴얼 위치 |
|------|----------|----------|
| `extension-collect.png` | 익스텐션 수집 동작 (무신사 페이지) | `docs/01-getting-started.md` §3 |
| `extension-popup.png` | 익스텐션 팝업 UI | `docs/01-getting-started.md` §3 |
| `category-mapping.png` | 카테고리 매핑 화면 (자동 + 수동) | `docs/04-market-strategy/smartstore.md` §4 |
| `coupang-catalog-match.png` | 쿠팡 카탈로그 매칭 결과 | `docs/04-market-strategy/coupang.md` §2 |
| `lotteon-policy-list.png` | 롯데온 정책 매핑 | `docs/04-market-strategy/lotteon.md` §5 |
| `11st-kc-form.png` | 11번가 KC 인증 입력 폼 | `docs/04-market-strategy/11st.md` §2 |
| `sync-status.png` | 동기화 현황 화면 | `docs/05-workflow.md` §5-3 |
| `claim-actions.png` | 클레임 처리 (승인/거부/보류) | `docs/06-orders-cs.md` §4 |

### 🟢 P2 — 디테일 보강 7장

| 파일명 | 캡처 화면 | 매뉴얼 위치 |
|------|----------|----------|
| `signup-form.png` | 회원가입 폼 | `docs/01-getting-started.md` §1 |
| `policy-simulation.png` | 정책 시뮬레이션 결과 | `docs/07-pricing.md` §8 |
| `bulk-upload-dialog.png` | 일괄 업로드 다이얼로그 | `docs/05-workflow.md` §4 |
| `recent-failures.png` | 최근 실패 카드 | `docs/08-troubleshooting.md` §4 |
| `architecture-overview.png` | 시스템 한눈에 (직접 그린 다이어그램 사진 또는 별도 디자인) | `docs/02-architecture.md` §1 |
| `themango-vs-lonit-side.png` | 더망고 vs Lonit 화면 비교 (선택사항) | `docs/03-vs-themango.md` §1 |
| `admin-sales-matrix.png` | 매출 매트릭스 화면 | `docs/05-workflow.md` §8 |

---

## 매뉴얼에 추가하는 방법

### 방법 1: 기본 이미지 (간단)

```markdown
![대시보드 메인](assets/screenshots/dashboard-main.png)
```

### 방법 2: 캡션 있는 figure (권장)

```markdown
<figure markdown>
  ![대시보드 메인](assets/screenshots/dashboard-main.png)
  <figcaption>로그인 직후 보이는 대시보드 메인 — 4마켓 등록 상품 수와 최근 매출이 한눈에</figcaption>
</figure>
```

### 방법 3: 클릭 시 확대 (라이트박스)

mkdocs.yml의 `markdown_extensions` 에 `attr_list` 와 `md_in_html` 이 이미 켜져 있으므로:

```markdown
[![대시보드](assets/screenshots/dashboard-main.png){ width="100%" }](assets/screenshots/dashboard-main.png){ target=_blank }
```

---

## 폴더 구조 (저장 후)

```
manual/docs/assets/screenshots/
├── dashboard-main.png           # P0
├── accounts-with-ip-banner.png  # P0
├── upload-progress.png          # P0
├── orders-unified.png           # P0
├── policy-editor.png            # P0
├── extension-collect.png        # P1
├── ...
```

---

## 진행 체크리스트

- [ ] `docs/assets/screenshots/` 폴더 생성
- [ ] P0 5장 캡처 (가장 임팩트 큼)
- [ ] P1 8장 캡처 (챕터별 보조)
- [ ] P2 7장 캡처 (디테일 보강, 선택사항)
- [ ] 매뉴얼 각 챕터에 `![]()` 추가
- [ ] `mkdocs serve` 로 확인
- [ ] 익명화 처리 점검
- [ ] 깨진 이미지 링크 없는지 `mkdocs build --strict` 검증

---

P0 5장만 추가해도 매뉴얼 임팩트가 크게 달라집니다. 시간 부족 시 P0 → P1 순서로 진행 권장.
