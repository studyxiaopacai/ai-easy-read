import {
  getAlapiCnToken,
  setAlapiCnToken as setLocalAlapiCnToken,
} from "@/utils/translate/providers/alapi-cn";
import {
  TranslateProvider,
  getTranslateProvider,
  setTranslateProvider,
} from "@/utils/translate/translate";
import {
  getYoudaoApiKey,
  getYoudaoAppId,
  setYoudaoApiKey as setLocalYoudaoApiKey,
  setYoudaoAppId as setLocalYoudaoAppId,
  translateText,
} from "@/utils/translate/providers/youdao";
import { ProFormRadio, ProFormText } from "@ant-design/pro-components";
import { Button, message } from "antd";
import { useEffect, useState } from "react";

export function TabFanyi() {
  const [provider, setProvider] = useState<TranslateProvider>("gemeni-pro");
  const [alapiCnToken, setAlapiCnToken] = useState<string>();
  const [youdaoApiKey, setYoudaoApiKeyState] = useState<string>();
  const [youdaoAppId, setYoudaoAppIdState] = useState<string>();

  useEffect(() => {
    getTranslateProvider().then((value) => {
      if (value) {
        setProvider(value);
      }
    });
  }, []);

  useEffect(() => {
    getAlapiCnToken().then((value) => {
      if (value) {
        setAlapiCnToken(value);
      }
    });

    getYoudaoApiKey().then((value) => {
      if (value) {
        setYoudaoApiKeyState(value);
      }
    });

    getYoudaoAppId().then((value) => {
      if (value) {
        setYoudaoAppIdState(value);
      }
    });
  }, []);

  const handleProviderChange = (value: TranslateProvider) => {
    setProvider(value);
    setTranslateProvider(value);
  };

  const handleAlapiCnTokenChange = (value: string) => {
    setAlapiCnToken(value);
    setLocalAlapiCnToken(value);
  };

  const handleYoudaoApiKeyChange = (value: string) => {
    setYoudaoApiKeyState(value);
  };

  const handleYoudaoAppIdChange = (value: string) => {
    setYoudaoAppIdState(value);
  };

  const saveYoudaoCredentials = () => {
    if (youdaoApiKey && youdaoAppId) {
      setLocalYoudaoApiKey(youdaoApiKey);
      setLocalYoudaoAppId(youdaoAppId);
    }
  };

  const testYoudaoAPI = async () => {
    try {
      const translatedText = await translateText("Hello, how are you?");
      message.success(`翻译结果: ${translatedText}`);
    } catch (error) {
      message.error(`翻译失败: ${(error as Error).message}`);
    }
  };

  return (
    <div className="my-4">
      <ProFormRadio.Group
        label="翻译"
        fieldProps={{
          onChange: (e) => handleProviderChange(e.target.value),
          value: provider,
          defaultValue: "alapi-cn",
        }}
        options={[
          {
            label: "Gemeni Pro",
            value: "gemeni-pro",
          },
          {
            label: "APNIC",
            value: "alapi-cn",
          },
          {
            label: "有道文档翻译",
            value: "youdao",
          },
        ]}
      />
      {provider === "alapi-cn" && (
        <ProFormText
          label="APNIC TOKEN"
          fieldProps={{
            className: "w-[300px]",
            value: alapiCnToken,
            onChange: (e) => handleAlapiCnTokenChange(e.currentTarget.value),
          }}
        />
      )}
      {provider === "youdao" && (
        <>
        <ProFormText
            label="有道 App ID"
            fieldProps={{
              className: "w-[300px]",
              value: youdaoAppId,
              onChange: (e) => handleYoudaoAppIdChange(e.currentTarget.value),
            }}
          />
          <ProFormText
            label="有道 API Key"
            fieldProps={{
              className: "w-[300px]",
              value: youdaoApiKey,
              onChange: (e) => handleYoudaoApiKeyChange(e.currentTarget.value),
            }}
          />
          <Button type="primary" onClick={saveYoudaoCredentials}>
            保存
          </Button>
          <Button type="primary" onClick={testYoudaoAPI} style={{ marginLeft: '10px' }}>
            测试
          </Button>
        </>
      )}
    </div>
  );
}
