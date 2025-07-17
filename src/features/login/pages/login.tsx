import { Button, Form, FormProps, Input } from "antd";
import useLogin from "../hooks/useLogin";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import logo from "../../../assets/logo3.png";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import companyImg from "../../../assets/login.jpeg";

const Login = () => {
  const [form] = Form.useForm();
  const { mutateAsync: login, isPending, isSuccess } = useLogin();
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("userInfo")) {
      navigate("/home");
    }
  }, []);

  useEffect(() => {
    if (isSuccess) {
      navigate("/home");
    }
  }, [isSuccess]);

  const submit: FormProps<ILoginPayload>["onFinish"] = (values) => {
    login(values);
  };

  return (
    <div className="flex h-screen text-black">
      <div className="w-full sm:w-1/3 flex">
        <div className="px-6 my-auto w-full">
          {/* <div className="h-[181px] w-[181px] rounded mx-auto">
          </div> */}
          <img src={logo} alt="logo" className="mx-auto" width={"200px"} />

          <h3 className="text-3xl font-bold mt-4 mb-9">Selamat Datang,</h3>

          <Form
            form={form}
            autoComplete="off"
            layout="vertical"
            onFinish={submit}
          >
            <Form.Item<ILoginPayload>
              label="Username"
              name="username"
              rules={[
                { required: true, message: "Silahkan masukan username!" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item<ILoginPayload>
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Silahkan masukan password!" },
              ]}
            >
              <Input.Password
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>

            <Form.Item label={null}>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full"
                disabled={isPending}
              >
                {isPending ? "Masuk...." : "Masuk"}
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
      <div className="w-2/3 p-2 hidden sm:block">
        <img src={companyImg} className="bg-amber-900 h-full rounded" />
      </div>
    </div>
  );
};

export default Login;
