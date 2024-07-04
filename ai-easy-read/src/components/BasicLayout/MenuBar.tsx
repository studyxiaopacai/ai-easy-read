import Icon, {
  CarOutlined,
  FileAddOutlined,
  GithubOutlined,
  SearchOutlined,
  SettingOutlined,
  ReadOutlined,
} from "@ant-design/icons";
import { App, Button, Flex, Space } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import chatSvg from "./chat.svg?react";
import localforage from "localforage";
import "@/index.css"; // 确保你引入了这个 CSS 文件

export function MenuBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { message } = App.useApp();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <Flex className="flex-none py-5 px-8 w-full border-b justify-between">
      <Space size="large">
        <Button
          type="text"
          size="large"
          icon={<ReadOutlined />}
          onClick={() => navigate("/pdfreader")}
          className={isActive("/pdfreader") ? "active" : ""}
        >
          文献阅读
        </Button>
        <Button
          type="text"
          size="large"
          icon={<CarOutlined />}
          onClick={() => navigate("/paper/create")}
          className={isActive("/onlineread") ? "active" : ""}
        >
          文献管理
        </Button>
        <Button
          type="text"
          size="large"
          icon={<FileAddOutlined />}
          onClick={() =>
            document.getElementById("recover-button-upload")?.click()
          }
          className={isActive("/paper/edit") ? "active" : ""}
        >
          本地加载
        </Button>
        <input
          id="recover-button-upload"
          type="file"
          accept=".json"
          onChange={async (event) => {
            const file = event.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = async (e: any) => {
                const content = e.target.result;
                try {
                  const parsedJSON = JSON.parse(content);
                  await Promise.all(
                    Object.keys(parsedJSON).map(async (keyName) => {
                      await localforage.setItem(keyName, parsedJSON[keyName]);
                    })
                  );
                  message.success("操作成功");
                } catch (error) {
                  message.error("发生错误");
                }
              };
              reader.readAsText(file);
            }
          }}
          className="hidden"
        />
        <Button
          type="text"
          size="large"
          icon={<Icon component={chatSvg} />}
          onClick={() => navigate("/conversation")}
          className={isActive("/conversation") ? "active" : ""}
        >
          对话模式
        </Button>
        <Button
          type="text"
          size="large"
          icon={<SearchOutlined />}
          onClick={() => navigate("/dictionary")}
          className={isActive("/dictionary") ? "active" : ""}
        >
          翻译词典
        </Button>
        <Button
          type="text"
          size="large"
          icon={<SettingOutlined />}
          onClick={() => navigate("/setting")}
          className={isActive("/setting") ? "active" : ""}
        >
          基础设置
        </Button>
      </Space>
      <Space>
        <Button
          type="text"
          size="small"
          icon={<GithubOutlined />}
          onClick={() => {
            window.open("https://github.com/studyxiaopacai");
          }}
        ></Button>
      </Space>
    </Flex>
  );
}
