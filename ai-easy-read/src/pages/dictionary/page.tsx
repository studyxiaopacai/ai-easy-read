import { DictionaryItem, lookup } from "@/apis/iciba/lookup";
import { BasicLayout } from "@/components";
import { AutoComplete, Button, Flex, Input, SelectProps, Space } from "antd";
import { useState } from "react";
import dictionaryImage from "./dictionary.png";
import debounce from "lodash/debounce";

export default function DictionaryPage() {
  const [options, setOptions] = useState<SelectProps<object>["options"]>([]);
  const [currentValue, setCurrentValue] = useState("");
  const [result, setResult] = useState<DictionaryItem | null>(null);

  // 定义防抖函数
  const debouncedSearch = debounce(async (value) => {
    if (!value) return;
    const result = await lookup(value);
    const resultOptions = result.message.map((item: DictionaryItem) => ({
      label: item.key,
      value: item.key,
    }));
    // 显示前 4 个结果
    setOptions(resultOptions.slice(0, 4) || []);
  }, 500); // 1秒的防抖延迟

  const handleSearch = async (value: string) => {
    // 使用防抖函数
    debouncedSearch(value);
  };

  const handleSelect = async (value: string) => {
    const result = await lookup(value);
    setResult(result.message[0]);
  };

  return (
    <BasicLayout>
      <Flex
        vertical
        justify="center"
        align="center"
        gap="small"
        className="pb-20"
      >
        <img
          src={dictionaryImage}
          width={180}
          height={180}
          draggable={false}
          className="unselectable"
        />
        <AutoComplete
          className="w-[400px]"
          options={options}
          onChange={(value) => setCurrentValue(value)}
          onSelect={handleSelect}
          onSearch={handleSearch}
        >
          <Input.Search
            size="large"
            placeholder="请输入"
            onSearch={handleSearch}
            enterButton={
              <Button
                onClick={async () => {
                  handleSelect(currentValue);
                }}
              >
                搜索
              </Button>
            }
          />
        </AutoComplete>

        {result && (
          <Space
            direction="vertical"
            align="start"
            size="large"
            className="w-[400px] px-10 py-16"
            style={{ textAlign: 'left' }}
          >
            <h1>{result.key}</h1>
            {result.means.map((item, index) => {
              return (
                <div key={`mean-${index}`}>
                  <h2>{item.part || "-"}</h2>
                  <p>{item.means.join("; ")}</p>
                </div>
              );
            })}
          </Space>
        )}
      </Flex>
    </BasicLayout>
  );
}
