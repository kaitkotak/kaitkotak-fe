import { Avatar, Button, Layout, Menu, theme } from "antd";
import {
  DatabaseOutlined,
  FileProtectOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ProductOutlined,
  ShopOutlined,
  SwitcherOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Sider from "antd/es/layout/Sider";
import { useState } from "react";
import { Content, Header } from "antd/es/layout/layout";
import { ItemType, MenuItemType } from "antd/es/menu/interface";

const OwnLayout = () => {
  let menus: ItemType<MenuItemType>[] = [
    {
      key: "1",
      label: "Produksi",
      icon: <ProductOutlined />,
    },
    {
      key: "2",
      label: "Purchase Order",
      icon: <FileProtectOutlined />,
    },
    {
      key: "3",
      label: "Penjualan",
      icon: <ShopOutlined />,
    },
    {
      key: "4",
      label: "Bahan Baku",
      icon: <SwitcherOutlined />,
    },
    {
      key: "5",
      label: "Pengguna",
      icon: <TeamOutlined />,
    },
    {
      key: "6",
      label: "Data Master",
      icon: <DatabaseOutlined />,
      children: [
        {
          key: 7,
          label: "Item",
        },
        {
          key: 8,
          label: "Pelanggan",
        },
        {
          key: 9,
          label: "Sales",
        },
        {
          key: 10,
          label: "Transportasi",
        },
      ],
    },
  ];

  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout className="h-screen">
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
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
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
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          Content
        </Content>
      </Layout>
    </Layout>
  );
};

export default OwnLayout;
