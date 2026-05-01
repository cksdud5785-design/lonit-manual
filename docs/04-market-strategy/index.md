# 4마켓 노출 전략 — 한눈에 비교

> 사용자가 가장 자주 묻는 챕터. **각 마켓이 무엇을 보고 노출 순위를 정하는지** 이해하면, Lonit이 왜 그렇게 동작하는지 보입니다.

---

## 1. 한 줄 요약

| 마켓 | 노출 핵심 |
|------|---------|
| **🛒 스마트스토어** | **검색 SEO** — 상품명·태그·카테고리·키워드가 정답에 얼마나 일치하는가 |
| **📦 쿠팡** | **카테고리 일치 + 옵션 매칭** — 카탈로그 카테고리에 정확히 들어갔는가 |
| **🏪 롯데온** | **정책 점수 + 가격 경쟁력** — 매장 정책이 마켓 룰에 얼마나 부합하는가 |
| **🎁 11번가** | **카테고리 + KC 인증 + 신상품 가중치** — 등록 형식 완성도 |

각 마켓의 **상세 알고리즘**과 **Lonit이 자동으로 처리하는 부분**은 아래 챕터에서 따로 설명합니다.

---

## 2. 마켓별 알고리즘 비교

```mermaid
flowchart TB
    subgraph SS["🛒 스마트스토어"]
        SS1[상품명 SEO 70%]
        SS2[태그·카테고리 20%]
        SS3[가격·구매수 10%]
    end
    
    subgraph CP["📦 쿠팡"]
        CP1[카탈로그 매칭 50%]
        CP2[옵션·이미지 30%]
        CP3[가격·로켓 20%]
    end
    
    subgraph LT["🏪 롯데온"]
        LT1[정책 점수 40%]
        LT2[카테고리 30%]
        LT3[가격·발주 30%]
    end
    
    subgraph EL["🎁 11번가"]
        EL1[등록 완성도 40%]
        EL2[KC·카테고리 30%]
        EL3[가격·신상 30%]
    end
    
    style SS fill:#dcfce7,stroke:#22c55e
    style CP fill:#fee2e2,stroke:#ee2c4a
    style LT fill:#fce7f3,stroke:#ed1c24
    style EL fill:#ffedd5,stroke:#ff0038
```

**숫자는 대략적 비중입니다** — 각 마켓이 공식 비공개. 운영 경험과 패턴 분석 기반.

---

## 3. 마켓별 함정 한눈에

### ❌ 자주 하는 실수 vs ✅ Lonit이 자동으로 막는 것

| 마켓 | 자주 하는 실수 | Lonit 자동 대응 |
|------|------------|--------------|
| **스마트스토어** | "무신사" "스탠다드" 등 마켓 금지어 사용 → 노출 차단 | 자동 필터 + 동의어 치환 |
| **스마트스토어** | 카테고리 잘못 지정 → 검색 풀에서 빠짐 | 7단계 매핑 (DB 학습 + AI) |
| **스마트스토어** | 태그를 안 채움 → 노출 50% 손실 | Top5 추천 태그 자동 입력 |
| **쿠팡** | 옵션값 30자 초과 → 등록 실패 | 자동 줄임 + 필수 옵션 채움 |
| **쿠팡** | 카테고리 미매핑 → "기타" 폴백 → 노출 거의 없음 | 카탈로그 매칭 + 카테고리 검색 |
| **쿠팡** | itemName 형식 안 맞음 → 큐 정체 | 표준 형식 자동 변환 |
| **롯데온** | 정책 ID 누락 → 발주 거부 | 정책 자동 매핑 |
| **롯데온** | 매장 ID 미입력 → 등록 실패 | 매장 ID 자동 적용 |
| **11번가** | KC 인증 미입력 → 등록 거부 | 카테고리별 KC 자동 입력 |
| **11번가** | 상품명 100바이트 초과 → 거부 | UTF-8 자동 절단 |
| **11번가** | 신상품 코드 누락 → 신상 가중치 못 받음 | `prdStatCd=01` 자동 |
| **공통** | 가격 단위 1원 → 일부 마켓 거부 | 정책 가격 단위 자동 정렬 |

---

## 4. 4마켓 노출 잘 되는 셀러의 공통 행동

```mermaid
flowchart TB
    H1[1. 정확한 카테고리 매핑]
    H2[2. 마켓별 SEO 형식 준수]
    H3[3. 가격 정책 일관성]
    H4[4. 빠른 재고·가격 동기화]
    H5[5. 빠른 송장 등록]
    H6[6. CS 답변 24h 안]
    
    H1 --> VISIBILITY[🎯 노출 ↑]
    H2 --> VISIBILITY
    H3 --> VISIBILITY
    H4 --> TRUST[⭐ 셀러 신뢰도 ↑]
    H5 --> TRUST
    H6 --> TRUST
    
    VISIBILITY --> SALES[💰 매출 ↑]
    TRUST --> SALES
    
    style SALES fill:#6366f1,color:#fff,stroke:#4f46e5,stroke-width:3px
```

이 6가지를 셀러가 직접 하면 시간이 많이 들지만, **Lonit이 1·2·4·5를 자동화**합니다. 셀러는 3과 6에 집중하면 됩니다.

---

## 5. 우선순위 — 어디부터 노출 잘 되게 할까?

신규 셀러의 경우:

```mermaid
flowchart LR
    S[Start] --> L[Step 1<br>스마트스토어<br>SEO 최적화]
    L --> C[Step 2<br>쿠팡 카탈로그<br>매칭]
    C --> Lo[Step 3<br>롯데온 정책<br>설정]
    Lo --> E[Step 4<br>11번가 KC·<br>카테고리]
    
    L -.- L_Note[검색량·매출 가장 큼]
    C -.- C_Note[로켓 노출 욕심나면]
    Lo -.- Lo_Note[20-30대 여성 풀]
    E -.- E_Note[가격 비교 풀]
    
    style L fill:#dcfce7,stroke:#22c55e,stroke-width:2px
    style C fill:#fee2e2,stroke:#ee2c4a
    style Lo fill:#fce7f3,stroke:#ed1c24
    style E fill:#ffedd5,stroke:#ff0038
```

**스마트스토어**가 검색량·매출이 가장 크므로 SEO 최적화에 가장 신경 써야 합니다. 다른 3개 마켓은 카테고리·정책·KC만 잘 맞추면 노출 자체는 큰 차이 없이 됩니다.

---

## 마켓별 자세히 보기

<div class="lonit-cards">

<a class="lonit-card" href="../smartstore/">
<span class="lonit-card-icon">🛒</span>
<h3>스마트스토어</h3>
<p>검색 SEO + 카테고리 + 태그 — 가장 중요한 마켓</p>
</a>

<a class="lonit-card" href="../coupang/">
<span class="lonit-card-icon">📦</span>
<h3>쿠팡</h3>
<p>카탈로그 매칭 + 옵션 + 로켓 가능성</p>
</a>

<a class="lonit-card" href="../lotteon/">
<span class="lonit-card-icon">🏪</span>
<h3>롯데온</h3>
<p>정책 시스템 + 발주 + 가격</p>
</a>

<a class="lonit-card" href="../11st/">
<span class="lonit-card-icon">🎁</span>
<h3>11번가</h3>
<p>KC 인증 + 카테고리 + 신상품 가중치</p>
</a>

</div>
