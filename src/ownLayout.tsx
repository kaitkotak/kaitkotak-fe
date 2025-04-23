import { Avatar, Breadcrumb, Button, Layout, Menu, theme } from "antd";
import {
  DatabaseOutlined,
  FileProtectOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ProductOutlined,
  ShopOutlined,
  SwitcherOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Sider from "antd/es/layout/Sider";
import { useContext, useState } from "react";
import { Header } from "antd/es/layout/layout";
import { ItemType, MenuItemType } from "antd/es/menu/interface";
import { Outlet, useNavigate } from "react-router-dom";
import { BreadcrumbContext } from "./context/breadcrumb";
import useWindowDimensions from "./libs/useWindowDimensions";

const OwnLayout = () => {
  let menus: ItemType<MenuItemType>[] = [
    {
      key: "/production",
      label: "Produksi",
      icon: <ProductOutlined />,
    },
    {
      key: "/purchase-order",
      label: "Purchase Order",
      icon: <FileProtectOutlined />,
    },
    {
      key: "/sales",
      label: "Penjualan",
      icon: <ShopOutlined />,
    },
    {
      key: "/raw-material",
      label: "Bahan Baku",
      icon: <SwitcherOutlined />,
    },
    // {
    //   key: "5",
    //   label: "Pengguna",
    //   icon: <TeamOutlined />,
    // },
    {
      key: "",
      label: "Data Master",
      icon: <DatabaseOutlined />,
      children: [
        {
          key: "/master/item",
          label: "Item",
        },
        {
          key: "/master/customer",
          label: "Pelanggan",
        },
        {
          key: "/master/sales-people",
          label: "Sales",
        },
        {
          key: "/master/transportation",
          label: "Transportasi",
        },
      ],
    },
  ];

  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const navigate = useNavigate();
  // const [_, contextHolder] = message.useMessage();
  const { breadcrumb } = useContext(BreadcrumbContext);
  const { width } = useWindowDimensions();

  const clickMenuHandler = (val: any) => {
    if (val.key) {
      navigate(val.key);
    }
  };

  return (
    <Layout className="h-screen">
      {/* {contextHolder} */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className="py-6 !fixed"
        breakpoint="sm"
        collapsedWidth={width < 576 ? "0" : "80"}
        onCollapse={setCollapsed}
        style={{
          background: "#014F42",
          height: "100%",
          zIndex: "100",
        }}
      >
        <div className="flex gap-2 mb-10 px-4">
          <div className="my-auto mx-0">
            <Avatar size={40} icon={<UserOutlined />} />
          </div>

          {!collapsed && (
            <div>
              <p className="text-sm font-bold">User Name</p>
              <p className="text-xs font-bold">Jabatan</p>
            </div>
          )}
        </div>

        <Menu
          theme="light"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={menus}
          style={{ background: "#014F42", color: "#ffffff" }}
          onClick={clickMenuHandler}
        />
      </Sider>
      <Layout className={collapsed ? "sm:ml-[80px]" : "sm:ml-[200px]"}>
        <Header
          style={{ padding: 0, background: colorBgContainer }}
          className="flex"
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />

          <Breadcrumb items={breadcrumb} style={{ margin: "auto 0" }} />
        </Header>

        <div
          onClick={() => {
            if (width < 576) {
              setCollapsed(true);
            }
          }}
        >
          <Outlet />
        </div>
      </Layout>
    </Layout>
  );
};

export default OwnLayout;
