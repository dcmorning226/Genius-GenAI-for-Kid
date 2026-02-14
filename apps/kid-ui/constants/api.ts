// Change this to your backend URL
export const API_BASE_URL = __DEV__
  ? "http://192.168.1.100:8000"
  : "https://api.companion.app";

export const WS_BASE_URL = __DEV__
  ? "ws://192.168.1.100:8000"
  : "wss://api.companion.app";
