# 커스텀 도메인 (docs.lonit.kr) 설정 가이드

매뉴얼을 `docs.lonit.kr` 같은 커스텀 도메인으로 서빙하려면 **DNS 설정 → CNAME 파일 → GitHub Pages 등록** 순서로 진행해야 합니다.

⚠️ **순서가 중요합니다**. CNAME 파일을 먼저 추가하면 `cksdud5785-design.github.io/lonit-manual/` 로의 접근이 깨집니다 (한 번 발생해서 즉시 롤백한 경험 있음).

---

## 1단계: Cloudflare DNS 설정

[Cloudflare 대시보드](https://dash.cloudflare.com) → `lonit.kr` 도메인 → DNS → Records:

| Type | Name | Content | Proxy | TTL |
|------|------|---------|-------|-----|
| CNAME | `docs` | `cksdud5785-design.github.io` | ❌ DNS only | Auto |

**중요**:
- Proxy는 **반드시 OFF** (회색 구름) — Cloudflare 프록시 켜면 GitHub Pages SSL 검증이 실패합니다.
- `cksdud5785-design.github.io` 끝에 `.` 도 `/lonit-manual` 도 붙이지 않음.

DNS 전파 대기: 보통 1~5분, 최대 24시간.

전파 확인:
```bash
dig docs.lonit.kr CNAME +short
# 결과: cksdud5785-design.github.io.
```

또는 [whatsmydns.net](https://whatsmydns.net) 에서 `docs.lonit.kr` 검색.

---

## 2단계: 매뉴얼 레포에 CNAME 파일 추가

DNS가 전파된 것을 확인한 후:

```bash
cd /c/Users/com/lonit-manual
echo "docs.lonit.kr" > docs/CNAME
git add docs/CNAME
git commit -m "feat: docs.lonit.kr 커스텀 도메인 활성화"
git push
mkdocs gh-deploy --force
```

이러면 mkdocs가 `Based on your CNAME file, your documentation should be available shortly at: http://docs.lonit.kr` 메시지를 출력합니다.

---

## 3단계: GitHub Pages에서 확인

1. https://github.com/cksdud5785-design/lonit-manual/settings/pages 이동
2. **Custom domain** 필드에 `docs.lonit.kr` 가 자동 채워져 있는지 확인 (CNAME 파일을 자동 감지)
3. **Enforce HTTPS** 체크박스가 활성화되면 켜기 (인증서 발급에 1~5분 추가 소요)

---

## 4단계: 검증

```bash
curl -sI https://docs.lonit.kr/ | head -1
# 예상: HTTP/2 200
```

또는 브라우저로 https://docs.lonit.kr 접속.

---

## 트러블슈팅

### "DNS check failed" 경고

- Cloudflare proxy가 켜져 있는지 (꺼야 함)
- DNS 전파 대기 (`dig docs.lonit.kr` 로 확인)

### "Both http and https" 경고 (HTTPS 강제 안 켜짐)

- GitHub Pages는 도메인 검증 후 Let's Encrypt 인증서를 발급함 (1~5분)
- 발급 완료 후 "Enforce HTTPS" 체크박스 활성화

### `cksdud5785-design.github.io/lonit-manual/` URL이 더 이상 안 보임

- 정상. 커스텀 도메인 설정 후 github.io URL은 `docs.lonit.kr` 으로 자동 리다이렉트.

### CNAME 추가했는데 docs.lonit.kr이 안 열림

- DNS 전파 안 됨 → 5분 대기 후 재시도
- DNS 전파됐는데도 안 됨 → CNAME 파일 삭제 + push + 다시 1단계부터

---

## 롤백 (커스텀 도메인 해제)

```bash
rm docs/CNAME
git commit -am "revert: 커스텀 도메인 해제"
git push
mkdocs gh-deploy --force
```

`cksdud5785-design.github.io/lonit-manual/` URL이 즉시 복원됨.

---

## 검색엔진 등록 (도메인 확정 후)

도메인을 `docs.lonit.kr` 로 확정한 후 다음 작업:

1. **Google Search Console**
   - https://search.google.com/search-console
   - `docs.lonit.kr` 속성 추가 → DNS 또는 HTML 파일 인증
   - sitemap 제출: `https://docs.lonit.kr/sitemap.xml`

2. **Naver 웹마스터 도구**
   - https://searchadvisor.naver.com
   - `docs.lonit.kr` 사이트 등록
   - sitemap 제출: `https://docs.lonit.kr/sitemap.xml`

3. **robots.txt 검증**
   - 위 두 도구에서 `https://docs.lonit.kr/robots.txt` 가 인식되는지 확인

이 과정 자동화 못 함 (각 콘솔 로그인 필요). 5분 정도 걸립니다.
