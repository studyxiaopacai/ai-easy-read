import React, { useState, useEffect } from 'react';
import { Input, message } from 'antd';
import { translateText, getYoudaoApiKey, getYoudaoAppId } from '@/utils/translate/providers/youdao';

const { TextArea } = Input;

const DocumentTranslation: React.FC = () => {
  const [textToTranslate, setTextToTranslate] = useState<string>('');
  const [translatedText, setTranslatedText] = useState<string>('');

  const handleTranslate = async (text: string) => {
    try {
      const apiKey = await getYoudaoApiKey();
      const appId = await getYoudaoAppId();
      if (!apiKey || !appId) {
        message.warning('请先设置有道 API Key 和 App ID');
        return;
      }

      const cleanedText = text.replace(/\n/g, ' '); // 移除换行符
      const result = await translateText(cleanedText);
      setTranslatedText(result);
    } catch (error) {
      console.error('Translation failed', error);
      message.error('翻译失败');
    }
  };

  useEffect(() => {
    const handleMouseUp = async () => {
      const selectedText = window.getSelection()?.toString();
      if (selectedText && selectedText !== textToTranslate) {
        setTextToTranslate(selectedText.replace(/\n/g, ' ')); // 移除换行符
        await handleTranslate(selectedText);
      }
    };

    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [textToTranslate]);

  return (
    <div>
      <TextArea
        rows={10}
        value={textToTranslate}
        onChange={(e) => setTextToTranslate(e.target.value.replace(/\n/g, ' '))} // 移除换行符
        placeholder="请输入要翻译的文本"
      />
      <div>
        <h3 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#1890ff',
          marginTop: '20px',
          borderBottom: '2px solid #1890ff',
          paddingBottom: '5px'
        }}>翻译结果：</h3>
        <p>{translatedText}</p>
      </div>
    </div>
  );
};

export default DocumentTranslation;
