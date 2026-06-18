(function () {

  const API_URL = "http://localhost:5000/api/events";

  let sessionId = localStorage.getItem("session_id");

  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem("session_id", sessionId);
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


  // PAGE VIEW
  sendEvent({
    session_id: sessionId,
    event_type: "page_view",
    page_url: window.location.pathname,
    timestamp: new Date(),
  });


  // CLICK
  document.addEventListener("click", (e) => {

    sendEvent({
      session_id: sessionId,
      event_type: "click",
      page_url: window.location.pathname,
      timestamp: new Date(),
      click_x: e.clientX,
      click_y: e.clientY,
    });

  });

})();