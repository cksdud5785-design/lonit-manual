(function () {
  "use strict";

  var STORAGE_KEY = "lonit.chatWidget.v1";
  var CONSENT_KEY = "lonit.chatWidget.accepted";
  var DEFAULT_NICKNAME = "셀러";
  var POPUP_PARAM = "lonitChat";

  var defaultMessages = [
    {
      role: "notice",
      author: "Lonit",
      text: "전체채팅에 오신 걸 환영합니다. 첫 메시지를 남겨보세요!",
      time: "방금"
    },
    {
      role: "assistant",
      author: "가이드봇",
      text: "스마트스토어 · 쿠팡 · 롯데온 · 11번가 자동화에서 막히는 지점을 짧게 남기면 관련 매뉴얼 방향을 안내할게요.",
      time: "방금"
    }
  ];

  var updateItems = [
    {
      title: "빠른 질문 예시",
      body: "스마트스토어 연결, 쿠팡 오류, 가격 정책, 주문 CS처럼 키워드로 질문하면 위젯이 바로 가이드 답변을 제안합니다."
    },
    {
      title: "로컬 저장 안내",
      body: "이 위젯의 메시지와 닉네임은 현재 브라우저에만 저장됩니다. 실제 상담/실시간 채팅 서버와는 연결되어 있지 않습니다."
    },
    {
      title: "팝업 모드",
      body: "상단의 팝업 버튼을 누르면 채팅 패널만 별도 창으로 열어 매뉴얼을 보면서 질문을 정리할 수 있습니다."
    }
  ];

  var quickReplies = [
    "스마트스토어 연결",
    "쿠팡 오류",
    "가격 정책",
    "주문 CS"
  ];

  var state = loadState();
  var elements = {};

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  function init() {
    if (document.getElementById("lonit-chat-root")) {
      return;
    }

    state.popup = isPopupMode();
    if (state.popup) {
      state.open = true;
      document.documentElement.classList.add("lonit-chat-only");
    } else if (typeof state.open !== "boolean") {
      state.open = window.matchMedia("(min-width: 1200px)").matches;
    }

    buildWidget();
    bindEvents();
    switchTab(state.tab || "chat");
    applyState();
    renderMessages();
    renderUpdates();
  }

  function buildWidget() {
    var launcher = document.createElement("button");
    launcher.type = "button";
    launcher.className = "lonit-chat-launcher";
    launcher.setAttribute("aria-controls", "lonit-chat-root");
    launcher.setAttribute("aria-expanded", String(state.open));
    launcher.innerHTML = '<span class="lonit-chat-launcher__icon" aria-hidden="true">💬</span><span class="lonit-chat-launcher__text">Lonit 채팅</span>';

    var root = document.createElement("section");
    root.id = "lonit-chat-root";
    root.className = "lonit-chat-widget";
    root.setAttribute("aria-label", "Lonit 오른쪽 채팅 패널");
    root.setAttribute("data-font", state.font || "md");
    root.innerHTML = [
      '<header class="lonit-chat-header">',
      '  <div class="lonit-chat-title-row">',
      '    <div>',
      '      <p class="lonit-chat-eyebrow">BETA · MANUAL CHAT</p>',
      '      <h2 class="lonit-chat-title">Lonit 가이드 채팅</h2>',
      '      <span class="lonit-chat-status">문서 기반 안내 가능</span>',
      '    </div>',
      '    <div class="lonit-chat-tools" aria-label="채팅 도구">',
      '      <button type="button" data-lonit-action="font-down" aria-label="채팅 글자 작게">A-</button>',
      '      <button type="button" data-lonit-action="nickname">닉네임</button>',
      '      <button type="button" data-lonit-action="popout">팝업</button>',
      '      <button type="button" data-lonit-action="close" aria-label="채팅 닫기">닫기</button>',
      '      <button type="button" data-lonit-action="font-up" aria-label="채팅 글자 크게">A+</button>',
      '    </div>',
      '  </div>',
      '  <nav class="lonit-chat-tabs" aria-label="채팅 탭">',
      '    <button type="button" data-lonit-tab="chat" class="is-active">전체 채팅</button>',
      '    <button type="button" data-lonit-tab="updates">공지</button>',
      '  </nav>',
      '</header>',
      '<div class="lonit-chat-body">',
      '  <section class="lonit-chat-panel is-active" data-lonit-panel="chat" aria-label="전체 채팅">',
      '    <div class="lonit-chat-messages" aria-live="polite"></div>',
      '    <div class="lonit-chat-consent" aria-live="polite">',
      '      <div class="lonit-chat-consent-card">',
      '        <h3>Lonit 채팅 이용 안내</h3>',
      '        <p>오른쪽 패널에서 매뉴얼 질문을 빠르게 정리할 수 있습니다.</p>',
      '        <ol>',
      '          <li>입력 내용은 현재 브라우저에만 저장됩니다.</li>',
      '          <li>개인정보·계정 비밀번호는 입력하지 마세요.</li>',
      '          <li>실제 상담 연결 전까지 답변은 문서 기반 안내입니다.</li>',
      '        </ol>',
      '        <button type="button" class="lonit-chat-accept" data-lonit-action="accept">동의하고 채팅 시작</button>',
      '      </div>',
      '    </div>',
      '    <footer class="lonit-chat-footer">',
      '      <div class="lonit-chat-chip-row" aria-label="빠른 질문"></div>',
      '      <div class="lonit-chat-actions" aria-label="빠른 반응">',
      '        <button type="button" class="lonit-chat-action-button" data-lonit-quick="도움됐어요 ▲">▲ 도움됐어요</button>',
      '        <button type="button" class="lonit-chat-action-button" data-lonit-quick="상담이 필요해요 ▼">상담 필요 ▼</button>',
      '      </div>',
      '      <form class="lonit-chat-composer">',
      '        <input type="text" maxlength="240" autocomplete="off" placeholder="질문을 입력하세요" aria-label="채팅 메시지 입력">',
      '        <button type="submit" class="lonit-chat-send">보내기</button>',
      '      </form>',
      '    </footer>',
      '  </section>',
      '  <section class="lonit-chat-panel" data-lonit-panel="updates" aria-label="공지">',
      '    <div class="lonit-chat-updates"></div>',
      '  </section>',
      '</div>'
    ].join("");

    document.body.appendChild(root);
    document.body.appendChild(launcher);

    elements.root = root;
    elements.launcher = launcher;
    elements.messages = root.querySelector(".lonit-chat-messages");
    elements.consent = root.querySelector(".lonit-chat-consent");
    elements.form = root.querySelector(".lonit-chat-composer");
    elements.input = root.querySelector(".lonit-chat-composer input");
    elements.chips = root.querySelector(".lonit-chat-chip-row");
    elements.updates = root.querySelector(".lonit-chat-updates");

    quickReplies.forEach(function (label) {
      var chip = document.createElement("button");
      chip.type = "button";
      chip.className = "lonit-chat-chip";
      chip.setAttribute("data-lonit-quick", label);
      chip.textContent = label;
      elements.chips.appendChild(chip);
    });
  }

  function bindEvents() {
    elements.launcher.addEventListener("click", function () {
      setOpen(!state.open);
    });

    elements.root.addEventListener("click", function (event) {
      var actionButton = event.target.closest("[data-lonit-action]");
      var tabButton = event.target.closest("[data-lonit-tab]");
      var quickButton = event.target.closest("[data-lonit-quick]");

      if (actionButton) {
        runAction(actionButton.getAttribute("data-lonit-action"));
      }

      if (tabButton) {
        switchTab(tabButton.getAttribute("data-lonit-tab"));
      }

      if (quickButton) {
        submitMessage(quickButton.getAttribute("data-lonit-quick"));
      }
    });

    elements.form.addEventListener("submit", function (event) {
      event.preventDefault();
      submitMessage(elements.input.value);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && state.open && !state.popup) {
        setOpen(false);
      }
    });
  }

  function runAction(action) {
    if (action === "close") {
      if (state.popup) {
        window.close();
      }
      setOpen(false);
      return;
    }

    if (action === "accept") {
      state.accepted = true;
      localStorage.setItem(CONSENT_KEY, "true");
      applyState();
      elements.input.focus();
      return;
    }

    if (action === "nickname") {
      var nextNickname = window.prompt("채팅에서 사용할 닉네임을 입력하세요.", state.nickname || DEFAULT_NICKNAME);
      if (nextNickname && nextNickname.trim()) {
        state.nickname = nextNickname.trim().slice(0, 18);
        saveState();
      }
      return;
    }

    if (action === "font-down" || action === "font-up") {
      changeFont(action === "font-up" ? 1 : -1);
      return;
    }

    if (action === "popout") {
      openPopout();
    }
  }

  function setOpen(open) {
    state.open = open;
    applyState();
    saveState();
    if (open) {
      window.setTimeout(function () {
        elements.input.focus();
        scrollToBottom();
      }, 80);
    }
  }

  function applyState() {
    elements.root.classList.toggle("is-open", state.open);
    elements.root.setAttribute("data-font", state.font || "md");
    elements.launcher.setAttribute("aria-expanded", String(state.open));
    elements.launcher.hidden = Boolean(state.popup);
    elements.consent.classList.toggle("is-visible", !state.accepted);
    elements.input.disabled = !state.accepted;
  }

  function switchTab(tabName) {
    state.tab = tabName;
    elements.root.querySelectorAll("[data-lonit-tab]").forEach(function (button) {
      button.classList.toggle("is-active", button.getAttribute("data-lonit-tab") === tabName);
    });
    elements.root.querySelectorAll("[data-lonit-panel]").forEach(function (panel) {
      panel.classList.toggle("is-active", panel.getAttribute("data-lonit-panel") === tabName);
    });
    saveState();
  }

  function changeFont(delta) {
    var order = ["sm", "md", "lg"];
    var currentIndex = order.indexOf(state.font || "md");
    var nextIndex = Math.max(0, Math.min(order.length - 1, currentIndex + delta));
    state.font = order[nextIndex];
    applyState();
    saveState();
  }

  function submitMessage(rawText) {
    var text = String(rawText || "").trim();
    if (!text || !state.accepted) {
      return;
    }

    state.messages.push({
      role: "user",
      author: state.nickname || DEFAULT_NICKNAME,
      text: text,
      time: formatTime(new Date())
    });

    elements.input.value = "";
    renderMessages();
    saveState();

    window.setTimeout(function () {
      state.messages.push({
        role: "assistant",
        author: "가이드봇",
        text: createGuideReply(text),
        time: formatTime(new Date())
      });
      renderMessages();
      saveState();
    }, 320);
  }

  function renderMessages() {
    elements.messages.innerHTML = "";
    state.messages.slice(-60).forEach(function (message) {
      var item = document.createElement("article");
      item.className = "lonit-chat-message is-" + message.role;

      var meta = document.createElement("div");
      meta.className = "lonit-chat-message__meta";
      meta.textContent = (message.author || "Lonit") + " · " + (message.time || "방금");

      var bubble = document.createElement("div");
      bubble.className = "lonit-chat-message__bubble";
      bubble.textContent = message.text;

      if (message.role !== "notice") {
        item.appendChild(meta);
      }
      item.appendChild(bubble);
      elements.messages.appendChild(item);
    });
    scrollToBottom();
  }

  function renderUpdates() {
    elements.updates.innerHTML = "";
    updateItems.forEach(function (item) {
      var card = document.createElement("article");
      card.className = "lonit-chat-update-card";

      var title = document.createElement("strong");
      title.textContent = item.title;

      var body = document.createElement("p");
      body.textContent = item.body;

      card.appendChild(title);
      card.appendChild(body);
      elements.updates.appendChild(card);
    });
  }

  function createGuideReply(text) {
    var normalized = text.toLowerCase();

    if (hasAny(normalized, ["스마트", "smartstore", "스토어", "naver", "네이버"])) {
      return "스마트스토어 쪽이면 ‘4마켓 노출 전략 > 스마트스토어’와 ‘5분 빠른 시작’을 먼저 확인해보세요. 상품명/옵션/가격 동기화 상태를 함께 점검하면 원인 파악이 빠릅니다.";
    }

    if (hasAny(normalized, ["쿠팡", "coupang", "오류", "에러", "반려"])) {
      return "쿠팡 오류는 카테고리 매핑, 옵션명 길이, 필수 고시정보 누락에서 자주 발생합니다. 오류 문구를 그대로 복사해두고 ‘트러블슈팅’ 문서의 반려/검수 항목부터 확인해보세요.";
    }

    if (hasAny(normalized, ["가격", "마진", "수수료", "배송비", "정책"])) {
      return "가격 정책은 원가 + 플랫폼 수수료 + 배송비 + 목표 마진 순서로 보는 게 안전합니다. ‘가격 정책’ 문서에서 마켓별 보정값을 먼저 맞춰보세요.";
    }

    if (hasAny(normalized, ["주문", "cs", "문의", "반품", "교환", "배송"])) {
      return "주문/CS는 상태값 동기화가 핵심입니다. ‘주문 + CS’ 문서에서 주문 수집 주기, 송장 입력, 교환/반품 템플릿 흐름을 확인해보세요.";
    }

    if (hasAny(normalized, ["도움", "해결", "좋아요", "▲"])) {
      return "도움이 되었다니 다행입니다. 자주 묻는 질문은 공지 탭이나 트러블슈팅 문서에 계속 정리해둘게요.";
    }

    if (hasAny(normalized, ["상담", "필요", "▼", "연락"])) {
      return "상담이 필요하면 문의 내용을 짧게 정리해 support@lonit.kr 로 보내주세요. 계정 정보나 비밀번호는 메시지에 포함하지 않는 것을 권장합니다.";
    }

    return "좋아요. 질문을 조금 더 구체적으로 적어주면 관련 문서 위치를 더 정확히 안내할 수 있어요. 예: ‘쿠팡 옵션 반려’, ‘스마트스토어 가격 동기화’, ‘주문 CS 템플릿’.";
  }

  function openPopout() {
    if (state.popup) {
      return;
    }

    var url = new URL(window.location.href);
    url.searchParams.set(POPUP_PARAM, "popup");
    var popup = window.open(url.toString(), "lonitChatPopup", "width=420,height=720,menubar=no,toolbar=no,location=no,status=no");
    if (popup) {
      popup.focus();
    }
  }

  function loadState() {
    var fallback = {
      open: undefined,
      popup: false,
      accepted: localStorage.getItem(CONSENT_KEY) === "true",
      nickname: DEFAULT_NICKNAME,
      font: "md",
      tab: "chat",
      messages: defaultMessages.slice()
    };

    try {
      var saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      return Object.assign(fallback, saved, {
        accepted: localStorage.getItem(CONSENT_KEY) === "true" || Boolean(saved.accepted),
        messages: Array.isArray(saved.messages) && saved.messages.length ? saved.messages : fallback.messages
      });
    } catch (error) {
      return fallback;
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        open: Boolean(state.open),
        accepted: Boolean(state.accepted),
        nickname: state.nickname || DEFAULT_NICKNAME,
        font: state.font || "md",
        tab: state.tab || "chat",
        messages: state.messages.slice(-60)
      }));
    } catch (error) {
      // localStorage can be unavailable in strict privacy modes. The widget still works for the current page view.
    }
  }

  function isPopupMode() {
    try {
      return new URL(window.location.href).searchParams.get(POPUP_PARAM) === "popup";
    } catch (error) {
      return false;
    }
  }

  function scrollToBottom() {
    if (elements.messages) {
      elements.messages.scrollTop = elements.messages.scrollHeight;
    }
  }

  function hasAny(text, keywords) {
    return keywords.some(function (keyword) {
      return text.indexOf(keyword) > -1;
    });
  }

  function formatTime(date) {
    return date.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
  }
})();
