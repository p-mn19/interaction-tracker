const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export type Session = {
  _id: string;
  eventCount: number;
  firstSeen: string;
  lastSeen: string;
};

export type TrackedEvent = {
  _id: string;
  session_id: string;
  event_type: "page_view" | "click";
  page_url: string;
  timestamp: string;
  click_x?: number | null;
  click_y?: number | null;
};

export type HeatmapPoint = {
  click_x: number;
  click_y: number;
};

export type TopPage = {
  page_url: string;
  totalEvents: number;
  sessionCount: number;
};

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Request failed with status ${res.status}`);
  }
  return res.json();
}

export function getSessions(): Promise<Session[]> {
  return fetch(`${API_URL}/api/sessions`).then((res) => handleResponse<Session[]>(res));
}

export function getSessionEvents(sessionId: string): Promise<TrackedEvent[]> {
  return fetch(`${API_URL}/api/sessions/${sessionId}`).then((res) =>
    handleResponse<TrackedEvent[]>(res)
  );
}

export function getPages(): Promise<string[]> {
  return fetch(`${API_URL}/api/pages`).then((res) => handleResponse<string[]>(res));
}

export function getHeatmap(pageUrl: string): Promise<HeatmapPoint[]> {
  return fetch(`${API_URL}/api/heatmap?page=${encodeURIComponent(pageUrl)}`).then((res) =>
    handleResponse<HeatmapPoint[]>(res)
  );
}

export function getTopPages(): Promise<TopPage[]> {
  return fetch(`${API_URL}/api/top-pages`).then((res) => handleResponse<TopPage[]>(res));
}