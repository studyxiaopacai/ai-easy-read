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

// 定义 Paper 接口，用于类型检查
interface Paper {
  key: string;
  name: string;
  content: string;
  addedTime: string;
}

const HomePage: React.FC = () => {
  const [papers, setPapers] = useState<Paper[]>([]); // 保存所有上传的文件
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null); // 当前选中的文件
  const [isModalOpen, setIsModalOpen] = useState(false); // 控制 Modal 的显示
  const [mode, setMode] = useState<'ai' | 'translate'>('translate'); // 控制模式（AI 对话或文档翻译）

  // 从 localForage 加载保存的文件
  useEffect(() => {
    const loadPapers = async () => {
      const storedPapers = await localforage.getItem<Paper[]>('papers');
      if (storedPapers) {
        setPapers(storedPapers);
      }
    };
    loadPapers();
  }, []);

  // 保存文件到 localForage
  useEffect(() => {
    localforage.setItem('papers', papers);
  }, [papers]);

  // 处理文件上传
  const handleAddPaper = (fileList: File[]) => {
    const newPapersPromises = fileList.map(async (file: File) => {
      const content = await file.arrayBuffer(); // 将文件读取为 ArrayBuffer
      const base64Content = await arrayBufferToBase64(content); // 将 ArrayBuffer 转换为 base64
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

  // 将 ArrayBuffer 转换为 base64
  const arrayBufferToBase64 = (buffer: ArrayBuffer): Promise<string> => {
    return new Promise<string>((resolve) => {
      const blob = new Blob([buffer], { type: 'application/pdf' });
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  };

  // 处理文件删除
  const handleDelete = (key: string) => {
    setPapers(papers.filter(paper => paper.key !== key));
    message.success('文件已删除');
  };

  // 处理文件点击
  const handlePaperClick = (paper: Paper) => {
    setSelectedPaper(paper);
    setIsModalOpen(true);
  };

  // 处理 Modal 关闭
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedPaper(null);
  };

  // 表格列定义
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

  // 创建 PDF 查看插件实例
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
          open={isModalOpen} 
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
