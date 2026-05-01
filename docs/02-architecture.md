# 시스템 구조 한눈에 보기

> Lonit이 **어떻게** 동작하는지 그림으로 이해하기.

!!! tip "🎯 이 챕터에서 배우는 것"
    - Lonit의 4가지 핵심 기능 (수집·등록·동기화·주문)
    - 상품 1개가 무신사에서 마켓에 올라가기까지의 전체 흐름
    - "왜 4마켓 동시 등록이 가능한가" — 마켓별 변환 원리
    - 셀러가 직접 하는 일 vs Lonit이 자동으로 하는 일

이 챕터는 코드나 어려운 용어 없이, **그림 위주로** Lonit의 동작을 설명합니다. 처음 가입한 분이라면 [1. 시작하기](01-getting-started.md)부터 보시고, 강의 수강생은 이 챕터부터 시작하세요.

---

## 1. 한 장으로 보는 Lonit

<div class="lonit-flow" markdown>

<div class="flow-stage" markdown>
<div class="flow-stage-title">📥 어디에서 상품을 가져오나요?</div>
<div class="flow-stage-items">
<span>👗 무신사</span>
<span>🛍️ SSG</span>
<span>🏬 롯데아이몰</span>
<span>➕ 9개 사이트 더</span>
</div>
</div>

<div class="flow-arrow">
<span class="arrow-icon">↓</span>
크롬 익스텐션으로 한 번에 모음
</div>

<div class="flow-stage primary" markdown>
<div class="flow-stage-title">⚙️ Lonit이 자동으로 하는 6가지 일</div>
<ol class="flow-stage-steps">
<li>소싱처에서 상품 정보 모으기 (수집)</li>
<li>내가 정한 가격 규칙 자동 적용</li>
<li>4개 마켓에 맞게 형식 변환</li>
<li>4개 마켓에 동시 업로드</li>
<li>가격·재고가 바뀌면 4마켓 자동 갱신</li>
<li>주문·CS 한 화면에서 처리</li>
</ol>
</div>

<div class="flow-arrow">
<span class="arrow-icon">↓</span>
4마켓 API에 자동 전송
</div>

<div class="flow-stage" markdown>
<div class="flow-stage-title">📤 어디에 올라가나요?</div>
<div class="flow-stage-items">
<span>🛒 스마트스토어</span>
<span>📦 쿠팡</span>
<span>🏪 롯데온</span>
<span>🎁 11번가</span>
</div>
</div>

</div>

**셀러가 하는 일은 "익스텐션 클릭" + "정책 한 번 설정"** 정도. 나머지는 위 6단계가 자동으로 돌아갑니다.

---

## 2. 핵심 4기능

```mermaid
mindmap
  root((Lonit))
    수집
      크롬 익스텐션
      12개 사이트
      자동 파싱
    등록
      4마켓 동시
      카테고리 자동 매핑
      옵션 변환
    동기화
      가격 자동
      재고 자동
      품절 자동
    주문·CS
      통합 주문 화면
      송장 자동 등록
      클레임 처리
```

각 기능을 하나씩 봅시다.

### 2-1. 수집 (Collect)

<div class="lonit-flow" markdown>

<div class="flow-stage" markdown>
<div class="flow-stage-title">1단계 — 셀러가 할 일</div>
<div class="flow-stage-items">
<span>👤 무신사 같은 사이트에서</span>
<span>📄 상품 페이지를 열고</span>
<span>🖱️ 익스텐션 클릭</span>
</div>
</div>

<div class="flow-arrow">
<span class="arrow-icon">↓</span>
익스텐션이 페이지를 자동으로 읽어옴
</div>

<div class="flow-stage primary" markdown>
<div class="flow-stage-title">2단계 — 자동으로 가져오는 정보</div>
<div class="lonit-extract">
<div class="lonit-extract-item"><span class="extract-icon">🏷️</span>상품명</div>
<div class="lonit-extract-item"><span class="extract-icon">💰</span>가격</div>
<div class="lonit-extract-item"><span class="extract-icon">📏</span>옵션·사이즈</div>
<div class="lonit-extract-item"><span class="extract-icon">🖼️</span>이미지 여러 장</div>
<div class="lonit-extract-item"><span class="extract-icon">📝</span>상세 설명</div>
<div class="lonit-extract-item"><span class="extract-icon">🏷️</span>브랜드</div>
</div>
</div>

<div class="flow-arrow">
<span class="arrow-icon">↓</span>
Lonit 작업 공간에 저장
</div>

<div class="flow-stage" markdown>
<div class="flow-stage-title">3단계 — Lonit에 저장 완료</div>
<div class="flow-stage-items">
<span>💾 상품 목록에 자동 등록</span>
<span>🔍 검색·편집 가능</span>
</div>
</div>

</div>

!!! note "수집은 곧 '복제'가 아닙니다"
    Lonit은 소싱처의 **상품 정보**를 가져옵니다. 가격·이미지·설명을 그대로 마켓에 올리는 게 아니라, [가격 정책](07-pricing.md)을 적용해 새로운 판매가를 계산하고, [SEO 최적화](04-market-strategy/smartstore.md)로 상품명을 다듬어 올립니다.

### 2-2. 등록 (Upload)

<div class="lonit-flow" markdown>

<div class="flow-stage" markdown>
<div class="flow-stage-title">📦 출발 — 상품 1개</div>
<div class="flow-stage-items">
<span>제목·가격·옵션·이미지·설명을 가진</span>
<span>Lonit 작업 공간의 상품 1건</span>
</div>
</div>

<div class="flow-arrow">
<span class="arrow-icon">↓</span>
4마켓 각각의 형식에 맞게 자동 변환
</div>

<div class="flow-stage primary" markdown>
<div class="flow-stage-title">⚡ 4마켓 동시 업로드 (병렬)</div>
<div class="flow-stage-items">
<span>🟢 스마트스토어 — 네이버 SEO 형식</span>
<span>🔴 쿠팡 — 옵션 30자 / 카테고리 5단계</span>
<span>🔴 롯데온 — 매장 ID + 발주 정책 결합</span>
<span>🟠 11번가 — KC 자동 + 브랜드 병기</span>
</div>
</div>

<div class="flow-arrow">
<span class="arrow-icon">↓</span>
결과 모음
</div>

<div class="flow-stage" markdown>
<div class="flow-stage-title">📊 활동 센터에서 결과 확인</div>
<div class="flow-stage-items">
<span>✅ 성공 — 마켓에 등록 완료</span>
<span>⚠️ 스킵 — 카테고리 미매핑 등</span>
<span>❌ 실패 — 에러 메시지 표시</span>
</div>
</div>

</div>

!!! tip "🎯 핵심 — 한 마켓 느려도 다른 3개는 영향 없음"
    4마켓은 **각자 독립된 큐로 동시에** 업로드됩니다. 쿠팡 검수가 오래 걸려도 스마트스토어는 즉시 등록 완료. 한 마켓 실패가 전체를 막지 않습니다.

### 2-3. 동기화 (Sync)

이건 Lonit의 **가장 큰 가치**입니다. 등록 후엔 아무것도 안 해도 자동.

```mermaid
sequenceDiagram
    participant MUSINSA as 무신사
    participant L as Lonit
    participant MK as 4마켓
    
    loop 정기 동기화 사이클
        L->>MUSINSA: 가격·재고 확인
        MUSINSA-->>L: 현재 데이터
        
        alt 가격이 변했다면
            L->>L: 정책 다시 적용해<br>새 판매가 계산
            L->>MK: 4마켓 가격 업데이트
            MK-->>L: ✅ 반영됨
        end
        
        alt 재고가 0이 됐다면
            L->>MK: 4마켓 품절 처리
            MK-->>L: ✅ 품절 표시됨
        end
    end
```

!!! info "동기화 주기에 대한 사실"
    Lonit은 정기 스케줄러(약 30분 주기)로 변경 사항을 점검하며, 즉시 push가 필요한 변경(정책 수정 등)은 별도 경로로 처리합니다. 마켓 API 응답 속도와 큐 상태에 따라 실제 반영 시간은 달라집니다.

### 2-4. 주문·CS

```mermaid
flowchart TB
    subgraph MK["🛒 4마켓에서 주문 발생"]
        OM1[스마트스토어 주문]
        OM2[쿠팡 주문]
        OM3[롯데온 주문]
        OM4[11번가 주문]
    end

    OM1 -->|정기 동기화| Lonit
    OM2 -->|정기 동기화| Lonit
    OM3 -->|정기 동기화| Lonit
    OM4 -->|정기 동기화| Lonit
    
    Lonit --> HUB[📋 통합 주문 화면]
    
    HUB --> SHIP[송장 등록]
    HUB --> CLAIM[취소·반품·교환]
    HUB --> CS[CS 답변]
    
    SHIP -->|자동 분배| OM1
    SHIP -->|자동 분배| OM2
    SHIP -->|자동 분배| OM3
    SHIP -->|자동 분배| OM4
    
    style Lonit fill:#6366f1,color:#fff,stroke:#4f46e5,stroke-width:3px
    style HUB fill:#fce7f3,stroke:#ec4899
```

**4개 마켓 따로 주문 받아 처리**할 필요가 없습니다. 한 화면에서 다 보고, 송장도 한 번 등록하면 4마켓에 자동 분배.

자세한 흐름은 [6. 주문 + CS](06-orders-cs.md) 참고.

---

## 3. 데이터의 일생 — 한 상품이 거치는 길

상품 1개가 무신사에서 시작해 마켓에 올라가고 주문 받기까지의 전체 흐름:

```mermaid
sequenceDiagram
    autonumber
    participant USER as USER
    participant MUSINSA as MUSINSA
    participant EXT as 크롬 익스텐션
    participant Lonit
    participant POLICY as 가격 정책
    participant FOUR_MKT
    participant CUSTOMER as CUSTOMER
    USER->>MUSINSA: 상품 페이지 열기
    USER->>EXT: 수집 버튼 클릭
    EXT->>MUSINSA: 자동 파싱
    MUSINSA-->>EXT: 상품 데이터
    EXT->>Lonit: 수집 데이터 전송
    
    Lonit->>POLICY: 마진 적용 요청
    POLICY-->>Lonit: 판매가 계산됨
    
    Lonit->>Lonit: 카테고리 자동 매핑<br>SEO 제목 최적화<br>옵션 변환
    
    USER->>Lonit: 업로드 버튼 클릭
    par 4마켓 동시 업로드
        Lonit->>FOUR_MKT: 스마트스토어 등록
        Lonit->>FOUR_MKT: 쿠팡 등록
        Lonit->>FOUR_MKT: 롯데온 등록
        Lonit->>FOUR_MKT: 11번가 등록
    end
    FOUR_MKT-->>Lonit: ✅ 4마켓 등록 완료
    
    Note over Lonit: 이제 자동 동기화 시작
    
    loop 5분마다
        Lonit->>MUSINSA: 가격·재고 확인
        MUSINSA-->>Lonit: 변경 사항
        Lonit->>FOUR_MKT: 가격·재고 업데이트
    end
    
    CUSTOMER->>FOUR_MKT: 주문하기
    FOUR_MKT-->>Lonit: 주문 알림 (1분 안)
    Lonit-->>USER: 새 주문 알림
    
    USER->>Lonit: 송장 등록
    Lonit->>FOUR_MKT: 송장 자동 분배
```

---

## 4. "왜 4마켓 동시"가 가능한가?

질문: 마켓마다 API 형식·정책·카테고리·옵션 규칙이 다 다른데, 어떻게 한 상품을 동시에 올릴 수 있을까?

**답: Lonit이 마켓별 변환을 자동으로 합니다.**

```mermaid
flowchart LR
    subgraph STD["📐 Lonit 표준 형식"]
        T[상품명: 무신사 스탠다드 후드<br>가격: 25,000원<br>옵션: S/M/L<br>카테고리: 후드티<br>이미지: 5장]
    end
    
    STD --> V{마켓별 변환}
    
    V -->|네이버 SEO 강화| N[스마트스토어<br>제목: 모델명 추가<br>태그: 자동 생성<br>카테고리: 패션 > 상의 > 후드]
    V -->|쿠팡 옵션 매칭| C[쿠팡<br>itemName 변환<br>옵션 30자 제한 적용<br>카테고리: 5단계]
    V -->|롯데온 정책| L[롯데온<br>매장 ID 적용<br>발주 정책 결합<br>카테고리: 4단계]
    V -->|11번가 KC| E[11번가<br>KC 정보 자동 입력<br>brand 병기<br>카테고리: 4단계]
    
    style STD fill:#fef3c7,stroke:#f59e0b,stroke-width:2px
    style V fill:#fce7f3,stroke:#ec4899,stroke-width:2px
```

각 마켓의 **고유한 규칙은 [4. 4마켓 노출 전략](04-market-strategy/index.md)**에서 자세히 설명합니다.

---

## 5. 자동 vs 수동 — 무엇을 셀러가 하고 무엇을 Lonit이 할까

```mermaid
flowchart TB
    subgraph USER["👤 셀러가 하는 일"]
        H1[상품 골라 익스텐션 클릭]
        H2[가격 정책 1번 설정]
        H3[업로드 버튼 클릭]
        H4[송장 입력]
        H5[CS 답변 작성]
    end
    
    subgraph Lonit_auto["🤖 Lonit이 자동으로 하는 일"]
        A1[상품 데이터 추출]
        A2[카테고리 자동 매핑]
        A3[SEO 상품명 최적화]
        A4[가격 계산]
        A5[옵션 형식 변환]
        A6[4마켓 API 호출]
        A7[가격·재고 자동 동기화]
        A8[주문 자동 통합]
        A9[송장 4마켓 분배]
    end
    
    style USER fill:#fef3c7,stroke:#f59e0b
    style Lonit_auto fill:#dcfce7,stroke:#22c55e
```

!!! tip "💡 셀러는 '결정'만 합니다"
    "어떤 상품을 올릴지", "얼마에 팔지" 같은 **결정**은 사람이. 그 외 반복 작업(매핑·변환·동기화·분배)은 모두 Lonit이.

---

## 6. 멀티마켓 동시 운영의 안전장치

4마켓을 동시에 운영하면 한 마켓이 느리거나 에러가 나도 다른 마켓에 영향 없어야 합니다. Lonit의 안전장치:

```mermaid
flowchart TB
    Action[셀러 액션] --> Q[작업 큐]
    
    Q --> M1{마켓 1<br>스마트스토어}
    Q --> M2{마켓 2<br>쿠팡}
    Q --> M3{마켓 3<br>롯데온}
    Q --> M4{마켓 4<br>11번가}
    
    M1 -->|성공| OK1[✅]
    M1 -.->|실패 시| R1[자동 재시도 3회]
    R1 -->|여전히 실패| F1[❌ 에러 기록<br>다른 마켓 영향 없음]
    
    M2 -->|성공| OK2[✅]
    M3 -->|성공| OK3[✅]
    M4 -->|성공| OK4[✅]
    
    style M1 fill:#dbeafe
    style M2 fill:#dbeafe
    style M3 fill:#dbeafe
    style M4 fill:#dbeafe
    style F1 fill:#fee2e2,stroke:#dc2626
```

**핵심 안전장치**:

- **마켓별 독립 실행**: 한 마켓 실패가 다른 마켓 막지 않음
- **자동 재시도**: 일시적 에러(네트워크 타임아웃 등)는 3회 자동 재시도
- **속도 제한**: 마켓 API의 호출 한도(분당 N회)를 자동으로 지킴
- **계정별 격리**: 한 셀러의 작업이 다른 셀러에 영향 없음

자세한 트러블슈팅은 [8. 트러블슈팅](08-troubleshooting.md) 참고.

---

!!! success "📌 한 줄 요약"
    **Lonit = 12개 사이트 → 4마켓 → 자동 동기화** 를 한 화면에서 관리하는 컨트롤타워. 셀러는 결정만, 반복 작업은 자동.

## 7. 한 줄 요약

> **Lonit = 12개 사이트 → 4마켓 → 자동 동기화** 를 한 화면에서 관리하는 컨트롤타워.

다음 챕터에서는 같은 일을 하는 **T사**와 무엇이 어떻게 다른지 봅니다.

<div class="lonit-cards">

<a class="lonit-card" href="../03-vs-others/">
<span class="lonit-card-icon">🆚</span>
<h3>3. T사와 비교</h3>
<p>차이점·장단점·갈아타기 가이드</p>
</a>

<a class="lonit-card" href="../04-market-strategy/">
<span class="lonit-card-icon">🎯</span>
<h3>4. 마켓별 노출 전략</h3>
<p>알고리즘 차이 + 잘 노출되는 법</p>
</a>

</div>
