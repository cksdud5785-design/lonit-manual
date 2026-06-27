(function () {
  "use strict";

  var VERSION_KEY = "lonit.chatWidget.visibilityVersion";
  var VERSION = "2026-06-27-pc-visible-v2";

  onReady(function () {
    window.setTimeout(ensureChatVisibility, 120);
    window.setTimeout(ensureChatVisibility, 900);
  });

  function ensureChatVisibility() {
    var root = document.getElementById("lonit-chat-root");
    var launcher = document.querySelector(".lonit-chat-launcher");
    var shouldForceOpen = isDesktop() && safeGet(VERSION_KEY) !== VERSION;

    if (root) {
      root.removeAttribute("hidden");
      root.setAttribute("data-lonit-verified", VERSION);

      if (shouldForceOpen) {
        root.classList.add("is-open", "lonit-chat-force-open");
        safeSet(VERSION_KEY, VERSION);
      }
    }

    if (launcher) {
      launcher.hidden = false;
      launcher.removeAttribute("hidden");
      launcher.setAttribute("data-lonit-verified", VERSION);
      launcher.style.display = "inline-flex";
      launcher.style.visibility = "visible";
      launcher.style.opacity = "1";

      if (shouldForceOpen) {
        launcher.setAttribute("aria-expanded", "true");
      }
    }

    if (!root && !launcher) {
      createFallbackLauncher();
    }
  }

  function createFallbackLauncher() {
    if (document.getElementById("lonit-chat-fallback-launcher")) {
      return;
    }

    var fallback = document.createElement("button");
    fallback.id = "lonit-chat-fallback-launcher";
    fallback.type = "button";
    fallback.textContent = "💬 Lonit 채팅";
    fallback.setAttribute("aria-label", "Lonit 채팅 열기");
    fallback.style.cssText = [
      "position:fixed",
      "right:20px",
      "bottom:20px",
      "z-index:2147483000",
      "min-height:46px",
      "padding:0 16px",
      "border:0",
      "border-radius:999px",
      "background:linear-gradient(135deg,#4f46e5,#8b5cf6 52%,#ec4899)",
      "color:#fff",
      "font-weight:800",
      "font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
      "box-shadow:0 18px 44px -18px rgba(79,70,229,.9)",
      "cursor:pointer"
    ].join(";");

    fallback.addEventListener("click", function () {
      window.location.href = "mailto:support@lonit.kr?subject=Lonit%20%EC%B1%84%ED%8C%85%20%EB%AC%B8%EC%9D%98";
    });

    document.body.appendChild(fallback);
  }

  function isDesktop() {
    return window.matchMedia && window.matchMedia("(min-width: 1200px)").matches;
  }

  function safeGet(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  }

  function safeSet(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch (error) {
      // Ignore storage failures. Visibility is still enforced for the current page load.
    }
  }

  function onReady(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback, { once: true });
    } else {
      callback();
    }
  }
})();
