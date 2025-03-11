import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Button, ConfigProvider, Divider, Input, Space } from "antd";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <ConfigProvider
        theme={{
          components: {
            Button: {
              colorPrimary: "#25675C",
              algorithm: true, // Enable algorithm
            },
            Input: {
              colorPrimary: "#eb2f96",
              algorithm: true, // Enable algorithm
            },
          },
        }}
      >
        <Space>
          <div className="text-6xl">We Will Back Soon</div>
        </Space>
      </ConfigProvider>
    </>
  );
}

export default App;
