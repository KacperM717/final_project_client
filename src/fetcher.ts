export const API_URL = "http://localhost:5000";
// Strip off protocol and port
export const HOST = API_URL.replace(/(^https?:\/\/)|(:\d+$)/g, "");

// All responses from our API should have this shape
// If status code is not 200, then message behaves as an error
export type FetchResponse<T> = {
  msg: string;
  body?: T;
};

class Fetcher {
  baseUrl: string;
  options: any;
  constructor(baseUrl: string, options: any) {
    this.baseUrl = baseUrl;
    this.options = options;
  }
  BASE = async (path: string, options?: any) => {
    const absolutePath = path.match(/^https?:\/\/.*\//)
      ? path
      : this.baseUrl + path;
    return await fetch(absolutePath, { ...this.options, ...options });
  };

  POST_JSON = async (path: string, payload: any) =>
    await this.BASE(path, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    });
}

export default new Fetcher(API_URL, { credentials: "include" });
