import { theme } from "antd";
import { Content } from "antd/es/layout/layout";
import { useUser } from "../../../context/user";
import { useContext, useEffect } from "react";
import { BreadcrumbContext } from "../../../context/breadcrumb";

const Home = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const { userInfo } = useUser();
  const { setBreadcrumb } = useContext(BreadcrumbContext);

  useEffect(() => {
    setBreadcrumb([
      {
        title: "",
      },
    ]);
  }, []);

  return (
    <Content
      style={{
        margin: "24px 16px",
        padding: 24,
        background: colorBgContainer,
        borderRadius: borderRadiusLG,
      }}
    >
      <h2 className="text-2xl font-bold">Selamat Datang {userInfo?.name}!</h2>
    </Content>
  );
};

export default Home;
