import "./App.css";
import { ConfigProvider, message } from "antd";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BreadcrumbProvider } from "./context/breadcrumb";
import { Outlet } from "react-router-dom";
import { MessageProvider } from "./context/message";
import { UserProvider } from "./context/user";
import { useEffect } from "react";
import { setMessageApi } from "./libs/messageHolder";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      throwOnError: true,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
});

function App() {
  const [msgApi, contextHolder] = message.useMessage();

  useEffect(() => {
    setMessageApi(msgApi);
  }, [msgApi]);

  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <BreadcrumbProvider>
          <MessageProvider>
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
              {contextHolder}
              <Outlet />
              {/* <OwnLayout /> */}
            </ConfigProvider>
          </MessageProvider>
        </BreadcrumbProvider>
      </UserProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
