/**
 * CorsProxy.io
 * - A fast & simple way to fix CORS Errors
 * - The fastest CORS Proxy you'll find. It's free!
 * @see {@link https://corsproxy.io/}
 */
export function corsProxy(originUrl: string) {
  return `http://localhost:8080/` + encodeURIComponent(originUrl);
}
