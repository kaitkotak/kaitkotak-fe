import "./App.css";
import { ConfigProvider } from "antd";
import OwnLayout from "./ownLayout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BreadcrumbProvider } from "./context/breadcrumb";

// const { toast } = useToast();
// const jwtTokenErrors: string[] = [
//   "Akses ditolak. Token tidak sesuai",
//   "Token tidak ditemukan",
// ];

const queryClient = new QueryClient({
  // queryCache: new QueryCache({
  //   onError: (error: Error) => {
  //     if (jwtTokenErrors.includes(error.response?.data.message)) {
  //       window.location.replace("/login");
  //     }
  //     toast({
  //       description: error.response?.data.message,
  //       variant: "destructive",
  //     });
  //   },
  // }),
  // mutationCache: new MutationCache({
  //   onError: (error: Error) => {
  //     if (error.response?.data.message) {
  //       if (jwtTokenErrors.includes(error.response?.data.message)) {
  //         window.location.replace("/");
  //       }
  //       toast({
  //         description: error.response?.data.message,
  //         variant: "destructive",
  //       });
  //     } else {4
  //       toast({
  //         description: error.response?.data.errors[0].msg,
  //         variant: "destructive",
  //       });
  //     // }
  //   },
  // }),
  defaultOptions: {
    queries: {
      retry: false,
      throwOnError: true,
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
      <BreadcrumbProvider>
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
      </BreadcrumbProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
