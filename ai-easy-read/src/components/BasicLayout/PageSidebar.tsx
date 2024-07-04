import { Button, Tooltip } from "antd";
import {
  BookOutlined,
  FieldTimeOutlined,
  HomeOutlined,
  ReadOutlined,
  TagOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import '@/index.css'

export function PageSidebar() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col flex-none h-full w-[300px] relative border-r border-gray-300 shadow-lg">
      <header className="px-4 py-2 flex flex-col items-center border-b border-gray-300 gap-2">
        <div className="font-bold text-lg">Easy Paper Reader</div>
        <div className="text-lg">AI辅助文献阅读器</div>
      </header>
      <div className="flex flex-1 flex-col  items-start py-8 px-10 gap-6 overflow-auto">
        <Button
          icon={<HomeOutlined />}
          // type="primary"
          className="text-left text-lg h-20 w-full"
          onClick={() => navigate("/")}
        >
          个人空间
        </Button>
        <Button
          icon={<ReadOutlined />}
          // type="primary"
          className="text-left text-lg h-20 w-full"
          onClick={() => navigate("/papers/mine")}
        >
          我的论文
        </Button>
        <Button
          icon={<TagOutlined />}
          // type="primary"
          className="text-left text-lg h-20 w-full"
          onClick={() => navigate("/tags")}
        >
          全部标签
        </Button>
        <Button
          icon={<BookOutlined />}
          // type="primary"
          className="text-left text-lg h-20 w-full"
          onClick={() => navigate("/comments")}
        >
          我的笔记
        </Button>
        <Button
          icon={<FieldTimeOutlined />}
          // type="primary"
          className="text-left text-lg h-20 w-full"
          onClick={() => navigate("/timeline")}
        >
          时光荏苒
        </Button>
      </div>
      <footer className="absolute bottom-1 left-0 w-full flex justify-between text-xs px-5 pt-1 bg-white border-gray-300 text-gray-400 border-t">
        <span>&copy; 2024</span>
        <Tooltip overlay={`Build: ${import.meta.env.BUILD_DATE}`}>
          <div>v{import.meta.env.PACKAGE_VERSION}</div>
        </Tooltip>
        <a
          href="https://github.com/studyxiaopacai"
          target="_blank"
          className="text-gray-400 hover:underline"
        >
          Chen Honglei
        </a>
        <span>MIT LICENSED</span>
      </footer>
    </div>
  );
}
