(function () {

  const API_URL = "http://localhost:5000/api/events";
  const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes of inactivity

  let sessionId = localStorage.getItem("session_id");
  const lastActivity = parseInt(localStorage.getItem("last_activity") || "0", 10);
  const now = Date.now();

  if (!sessionId || now - lastActivity > SESSION_TIMEOUT_MS) {
    sessionId = crypto.randomUUID();
    localStorage.setItem("session_id", sessionId);
  }

  localStorage.setItem("last_activity", String(now));

  function touchActivity() {
    localStorage.setItem("last_activity", String(Date.now()));
  }

  async function sendEvent(eventData) {
    try {
      await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      });
    } catch (err) {
      console.error(err);
    }
  }


  function getElementLabel(el) {
    if (!el) return null;
    const text = (el.textContent || "").trim();
    if (text && text.length <= 40) return text;
    if (el.id) return `#${el.id}`;
    if (el.className) return `.${String(el.className).split(" ")[0]}`;
    return el.tagName ? el.tagName.toLowerCase() : null;
  }


  // PAGE VIEW
  sendEvent({
    session_id: sessionId,
    event_type: "page_view",
    page_url: window.location.pathname,
    timestamp: new Date(),
  });


  // CLICK
  document.addEventListener("click", (e) => {

    touchActivity();

    sendEvent({
      session_id: sessionId,
      event_type: "click",
      page_url: window.location.pathname,
      timestamp: new Date(),
      click_x: e.clientX + window.scrollX,
      click_y: e.clientY + window.scrollY,
      element_text: getElementLabel(e.target),
    });

  });

})();