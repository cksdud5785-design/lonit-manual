# 시스템 구조 한눈에 보기

> Lonit이 **어떻게** 동작하는지 그림으로 이해하기.

이 챕터는 코드나 어려운 용어 없이, **그림 위주로** Lonit의 동작을 설명합니다. 강의에서는 이 챕터부터 시작합니다.

---

## 1. 한 장으로 보는 Lonit

```mermaid
flowchart TB
    subgraph INPUT["📥 입력 (소싱처)"]
        direction LR
        I1[👗 무신사]
        I2[🛍️ SSG]
        I3[🏬 롯데아이몰]
        I4[+ 9개 사이트]
    end

    subgraph CORE["⚙️ Lonit 핵심"]
        direction TB
        S1[1️⃣ 수집] --> S2[2️⃣ 정책 적용]
        S2 --> S3[3️⃣ 4마켓 변환]
        S3 --> S4[4️⃣ 업로드]
        S4 --> S5[5️⃣ 자동 동기화]
        S5 --> S6[6️⃣ 주문·CS]
    end

    subgraph OUTPUT["📤 출력 (마켓)"]
        direction LR
        O1[🛒 스마트스토어]
        O2[📦 쿠팡]
        O3[🏪 롯데온]
        O4[🎁 11번가]
    end

    INPUT ==>|크롬 익스텐션| CORE
    CORE ==>|API| OUTPUT
    
    style CORE fill:#eef2ff,stroke:#6366f1,stroke-width:2px
    style INPUT fill:#fef3c7,stroke:#f59e0b
    style OUTPUT fill:#dbeafe,stroke:#3b82f6
```

**왼쪽**(소싱처)에서 상품을 받아 **가운데**(Lonit)에서 가공한 뒤 **오른쪽**(마켓)에 보냅니다.

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

```mermaid
flowchart LR
    A[👤 셀러] -->|상품 페이지에서<br>익스텐션 클릭| B[🌐 크롬 익스텐션]
    B -->|자동 추출| C[📝 상품 데이터]
    C --> D{무엇을 추출?}
    D --> D1[상품명]
    D --> D2[가격]
    D --> D3[옵션·사이즈]
    D --> D4[이미지 여러 장]
    D --> D5[상세 설명]
    D --> D6[브랜드]
    
    C ==> L[(💾 Lonit 저장)]
```

!!! note "수집은 곧 '복제'가 아닙니다"
    Lonit은 소싱처의 **상품 정보**를 가져옵니다. 가격·이미지·설명을 그대로 마켓에 올리는 게 아니라, [가격 정책](07-pricing.md)을 적용해 새로운 판매가를 계산하고, [SEO 최적화](04-market-strategy/smartstore.md)로 상품명을 다듬어 올립니다.

### 2-2. 등록 (Upload)

```mermaid
flowchart TB
    P[📦 상품 1개] --> M{4마켓 변환}
    
    M -->|네이버 형식| MN[스마트스토어 페이로드]
    M -->|쿠팡 형식| MC[쿠팡 페이로드]
    M -->|롯데온 형식| ML[롯데온 페이로드]
    M -->|11번가 형식| ME[11번가 페이로드]
    
    MN -->|API 호출| AN[📤 스마트스토어]
    MC -->|API 호출| AC[📤 쿠팡]
    ML -->|API 호출| AL[📤 롯데온]
    ME -->|API 호출| AE[📤 11번가]
    
    AN --> R{결과}
    AC --> R
    AL --> R
    AE --> R
    
    R -->|성공| OK[✅ 등록 완료]
    R -->|실패| F[⚠️ 에러 로그]
    
    style M fill:#fce7f3,stroke:#ec4899
    style R fill:#eef2ff,stroke:#6366f1
```

**핵심 포인트**: 4마켓은 **동시에 병렬로** 업로드됩니다. 1개 마켓이 느려도 다른 3개는 영향 없음.

### 2-3. 동기화 (Sync)

이건 Lonit의 **가장 큰 가치**입니다. 등록 후엔 아무것도 안 해도 자동.

```mermaid
sequenceDiagram
    participant MUSINSA as 무신사
    participant L as Lonit
    participant MK as 4마켓
    
    loop 매 5분마다
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

**감지 → 적용까지 평균 5초**. 무신사에서 가격이 바뀐 뒤 5초 후엔 4마켓에도 반영되어 있습니다.

### 2-4. 주문·CS

```mermaid
flowchart TB
    subgraph MK["🛒 4마켓에서 주문 발생"]
        OM1[스마트스토어 주문]
        OM2[쿠팡 주문]
        OM3[롯데온 주문]
        OM4[11번가 주문]
    end

    OM1 -->|매분 동기화| Lonit
    OM2 -->|매분 동기화| Lonit
    OM3 -->|매분 동기화| Lonit
    OM4 -->|매분 동기화| Lonit
    
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
    V -->|CP 옵션 매칭| C[쿠팡<br>itemName 변환<br>옵션 30자 제한 적용<br>카테고리: 5단계]
    V -->|LOTTE POLICY| L[롯데온<br>매장 ID 적용<br>발주 정책 결합<br>카테고리: 4단계]
    V -->|11번가 KC| E[11번가<br>KC 인증 자동 입력<br>brand 병기<br>카테고리: 4단계]
    
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
