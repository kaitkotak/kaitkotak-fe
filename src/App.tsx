import "./App.css";
import { ConfigProvider } from "antd";
import OwnLayout from "./ownLayout";

function App() {
  return (
    <>
      <ConfigProvider
        theme={{
          token: {
            // colorText: "#ffffff",
          },
          components: {
            Button: {
              colorPrimary: "#25675C",
              algorithm: true, // Enable algorithm
            },
            Input: {
              colorPrimary: "#eb2f96",
              algorithm: true, // Enable algorithm
            },
            Menu: {
              colorText: "#ffffff",
              itemSelectedColor: "#014F42",
              subMenuItemSelectedColor: "#ffffff",
            },
            Slider: {
              colorBgLayout: "#014F42",
            },
          },
        }}
      >
        <OwnLayout />
      </ConfigProvider>
    </>
  );
}

export default App;
