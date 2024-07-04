import React, { useState, useEffect } from 'react';
import { Table, Button, Upload, message, Modal, Radio } from 'antd';
import { UploadOutlined, DeleteOutlined, CloseOutlined } from '@ant-design/icons';
import localforage from 'localforage';
import { BasicLayout, ContentWrapper } from "@/components";
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import ConversationPage from '@/pages/pdfreader/ConversationPage';
import DocumentTranslation from '@/pages/pdfreader/DocumentTranslationPage';

interface Paper {
  key: string;
  name: string;
  content: string;
  addedTime: string;
}

const HomePage: React.FC = () => {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [mode, setMode] = useState<'ai' | 'translate'>('translate');

  useEffect(() => {
    const loadPapers = async () => {
      const storedPapers = await localforage.getItem<Paper[]>('papers');
      if (storedPapers) {
        setPapers(storedPapers);
      }
    };
    loadPapers();
  }, []);

  useEffect(() => {
    localforage.setItem('papers', papers);
  }, [papers]);

  const handleAddPaper = (fileList: File[]) => {
    const newPapersPromises = fileList.map(async (file: File) => {
      const content = await file.arrayBuffer();
      const base64Content = await arrayBufferToBase64(content);
      return {
        key: file.name + new Date().toISOString(),
        name: file.name,
        content: base64Content,
        addedTime: new Date().toLocaleString(),
      };
    });

    Promise.all(newPapersPromises).then(newPapers => {
      setPapers(prevPapers => [...newPapers, ...prevPapers]);
    });
  };

  const arrayBufferToBase64 = (buffer: ArrayBuffer): Promise<string> => {
    return new Promise<string>((resolve) => {
      const blob = new Blob([buffer], { type: 'application/pdf' });
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  };

  const handleDelete = (key: string) => {
    setPapers(papers.filter(paper => paper.key !== key));
    message.success('文件已删除');
  };

  const handlePaperClick = (paper: Paper) => {
    setSelectedPaper(paper);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedPaper(null);
  };

  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Paper) => (
        <a onClick={() => handlePaperClick(record)}>{text}</a>
      ),
    },
    {
      title: '添加时间',
      dataIndex: 'addedTime',
      key: 'addedTime',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Paper) => (
        <Button
          type="primary"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleDelete(record.key)}
        >
          删除
        </Button>
      ),
    },
  ];

  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  return (
    <BasicLayout mode="custom">
      <ContentWrapper className="flex flex-col">
        <div style={{ padding: '20px', display: 'flex', gap: '20px' }}>
          <div style={{ flex: 1 }}>
            <Table
              dataSource={papers}
              columns={columns}
              pagination={{ pageSize: 8 }}
              footer={() => (
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <Upload
                    multiple
                    beforeUpload={(file: any, fileList: any) => {
                      console.log('Uploading file:', file);
                      handleAddPaper(fileList as File[]);
                      return false;
                    }}
                    showUploadList={false}
                  >
                    <Button icon={<UploadOutlined />}>添加PDF文件</Button>
                  </Upload>
                </div>
              )}
            />
          </div>
        </div>
        <Modal
          visible={isModalVisible}
          title={selectedPaper?.name}
          onCancel={handleModalClose}
          footer={null}
          width="90%"
          style={{ top: 20 }}
        >
          {selectedPaper && (
            <div style={{ display: 'flex', flexDirection: 'row', height: '90vh'}}>
              <div style={{ flex: 5, position: 'relative', overflowY: 'auto', }}>
                <Button
                  type="primary"
                  icon={<CloseOutlined />}
                  style={{ position: 'absolute', top: 10, right: 10, zIndex: 1 }}
                  onClick={handleModalClose}
                />
                <Worker workerUrl="/pdf.worker.min.js">
                  <Viewer fileUrl={selectedPaper.content} plugins={[defaultLayoutPluginInstance]} />
                </Worker>
              </div>
              <div style={{ flex: 2, paddingLeft: '20px', overflowY: 'auto'  }}>
                <Radio.Group
                  value={mode}
                  onChange={(e) => setMode(e.target.value)}
                  style={{ marginBottom: '10px' }}
                >
                  <Radio.Button value="translate">文档翻译</Radio.Button>
                  <Radio.Button value="ai">AI 对话</Radio.Button>
                </Radio.Group>
                {mode === 'translate' ? <DocumentTranslation /> : <ConversationPage /> }
              </div>
            </div>
          )}
        </Modal>
      </ContentWrapper>
    </BasicLayout>
  );
};

export default HomePage;
