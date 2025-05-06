import "./App.css";
import { ConfigProvider } from "antd";
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BreadcrumbProvider } from "./context/breadcrumb";
import { Outlet } from "react-router-dom";
import { MessageProvider } from "./context/message";
import { UserProvider } from "./context/user";
// import useGetRefreshToken from "./features/login/hooks/useGetRefreshToken";

// const { toast } = useToast();
const jwtTokenErrors: string[] = ["Anda perlu login terlebih dahulu"];
// const { mutateAsync: getRefreshToken } = useGetRefreshToken();

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error: any) => {
      console.log(error);
      if (jwtTokenErrors.includes(error.response?.data.message)) {
        // getRefreshToken();
      }
      // toast({
      //   description: error.response?.data.message,
      //   variant: "destructive",
      // });
    },
  }),
  mutationCache: new MutationCache({
    onError: (error: Error) => {
      console.log("error mutation", error);
      // if (error.response?.data.message) {
      //   if (jwtTokenErrors.includes(error.response?.data.message)) {
      //     window.location.replace("/");
      //   }
      //   toast({
      //     description: error.response?.data.message,
      //     variant: "destructive",
      //   });
      // } else {4
      //   toast({
      //     description: error.response?.data.errors[0].msg,
      //     variant: "destructive",
      //   });
      // // }
    },
  }),
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

// message.config({
//   duration: 3,
// });

function App() {
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
