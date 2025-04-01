import { Avatar, Breadcrumb, Button, Layout, Menu, theme } from "antd";
import {
  DatabaseOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Sider from "antd/es/layout/Sider";
import { useContext, useState } from "react";
import { Header } from "antd/es/layout/layout";
import { ItemType, MenuItemType } from "antd/es/menu/interface";
import { Outlet, useNavigate } from "react-router-dom";
import { BreadcrumbContext } from "./context/breadcrumb";

const OwnLayout = () => {
  let menus: ItemType<MenuItemType>[] = [
    // {
    //   key: "1",
    //   label: "Produksi",
    //   icon: <ProductOutlined />,
    // },
    // {
    //   key: "2",
    //   label: "Purchase Order",
    //   icon: <FileProtectOutlined />,
    // },
    // {
    //   key: "3",
    //   label: "Penjualan",
    //   icon: <ShopOutlined />,
    // },
    // {
    //   key: "4",
    //   label: "Bahan Baku",
    //   icon: <SwitcherOutlined />,
    // },
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

  const clickMenuHandler = (val: any) => {
    console.log(val);
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
        className="py-6"
        style={{ background: "#014F42" }}
      >
        <div className="flex gap-2 mb-10 px-4">
          <div className="my-auto mx-0">
            <Avatar size={40} icon={<UserOutlined />} />
          </div>

          {!collapsed && (
            <div>
              <p className="text-xl font-bold">User Name</p>
              <p className="text-sm font-bold">Jabatan</p>
            </div>
          )}
        </div>

        <Menu
          theme="light"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={menus}
          color="#fffff"
          style={{ background: "#014F42", color: "#ffffff" }}
          onClick={clickMenuHandler}
        />
      </Sider>
      <Layout>
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

        <Outlet />
      </Layout>
    </Layout>
  );
};

export default OwnLayout;
