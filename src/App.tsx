import "./App.css";
import { ConfigProvider, Space } from "antd";

function App() {
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
