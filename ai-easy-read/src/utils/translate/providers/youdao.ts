import axios from 'axios';
import localforage from 'localforage';
import CryptoJS from 'crypto-js';
import { message } from 'antd';

const YOUDAO_API_URL = 'https://openapi.youdao.com/api';
const YOUDAO_API_KEY = 'youdaoApiKey';
const YOUDAO_APP_ID = 'youdaoAppId';
const CORS_PROXY_URL = 'http://localhost:8080/';

// 获取有道 API Key
export async function getYoudaoApiKey(): Promise<string | null> {
  return await localforage.getItem<string>(YOUDAO_API_KEY);
}

// 设置有道 API Key
export async function setYoudaoApiKey(apiKey: string): Promise<void> {
  await localforage.setItem(YOUDAO_API_KEY, apiKey);
}

// 获取有道 App ID
export async function getYoudaoAppId(): Promise<string | null> {
  return await localforage.getItem<string>(YOUDAO_APP_ID);
}

// 设置有道 App ID
export async function setYoudaoAppId(appId: string): Promise<void> {
  await localforage.setItem(YOUDAO_APP_ID, appId);
}

// Truncate function as described in the Youdao API documentation
function truncate(q: string): string {
  const len = q.length;
  if (len <= 20) return q;
  return q.substring(0, 10) + len + q.substring(len - 10, len);
}

// Translate text using Youdao API with POST request
export async function translateText(query: string): Promise<string> {
  const appId = await getYoudaoAppId();
  const apiKey = await getYoudaoApiKey();
  if (!appId || !apiKey) {
    message.warning('请先设置有道 API Key 和 App ID');
  }
  const salt = (new Date()).getTime();
  const curtime = Math.round(new Date().getTime() / 1000);
  const str1 = appId + truncate(query) + salt + curtime + apiKey;
  const sign = CryptoJS.SHA256(str1).toString(CryptoJS.enc.Hex);

  const params = {
    q: query,
    appKey: appId,
    salt: salt.toString(),
    from: 'en',
    to: 'zh-CHS',
    sign: sign,
    signType: "v3",
    curtime: curtime.toString(),
  };

  const response = await axios.post(`${CORS_PROXY_URL}${YOUDAO_API_URL}`, null, {
    params: params,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    }
  });

  if (response.data && response.data.translation) {
    return response.data.translation[0];
  } else {
    throw new Error('翻译失败');
  }
}
