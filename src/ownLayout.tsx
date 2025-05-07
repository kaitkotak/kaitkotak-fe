import { Avatar, Breadcrumb, Button, Layout, Menu, Spin, theme } from "antd";
import {
  DatabaseOutlined,
  FileProtectOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ProductOutlined,
  ShopOutlined,
  SwitcherOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import Sider from "antd/es/layout/Sider";
import { useContext, useEffect, useMemo, useState } from "react";
import { Header } from "antd/es/layout/layout";
import { ItemType } from "antd/es/menu/interface";
import { Outlet, useNavigate } from "react-router-dom";
import { BreadcrumbContext } from "./context/breadcrumb";
import useWindowDimensions from "./libs/useWindowDimensions";
import { useUser } from "./context/user";
import useLogout from "./features/login/hooks/useLogout";
import useGetUserInfo from "./features/login/hooks/useGetUserInfo";

const OwnLayout = () => {
  const userInfo = useUser();
  let menus: ItemType<any>[] = [
    {
      key: "/production",
      label: "Produksi",
      icon: <ProductOutlined />,
      permission: "production.access",
    },
    {
      key: "/purchase-order",
      label: "Purchase Order",
      icon: <FileProtectOutlined />,
      permission: "purchase_order.access",
    },
    {
      key: "/sales",
      label: "Penjualan",
      icon: <ShopOutlined />,
      permission: "sales.access",
    },
    {
      key: "/raw-material",
      label: "Bahan Baku",
      icon: <SwitcherOutlined />,
      permission: "raw_material.access",
    },
    {
      key: "/user",
      label: "Pengguna",
      icon: <TeamOutlined />,
      permission: "user.access",
    },
    {
      key: "",
      label: "Data Master",
      icon: <DatabaseOutlined />,
      children: [
        {
          key: "/master/item",
          label: "Item",
          permission: "master_item.access",
        },
        {
          key: "/master/customer",
          label: "Pelanggan",
          permission: "master_customer.access",
        },
        {
          key: "/master/sales-people",
          label: "Sales",
          permission: "master_sales.access",
        },
        {
          key: "/master/transportation",
          label: "Transportasi",
          permission: "master_transportation.access",
        },
      ],
    },
  ];

  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const navigate = useNavigate();
  const { breadcrumb } = useContext(BreadcrumbContext);
  const { width } = useWindowDimensions();
  const { mutateAsync: logout } = useLogout();
  const { mutateAsync: getUserInfo } = useGetUserInfo();

  useEffect(() => {
    getUserInfo();
  }, []);

  const filterMenusByPermission = (
    menus: ItemType<any>[],
    permissions: string[]
  ): ItemType<any>[] =>
    menus
      .map((menu) => {
        if (menu.children) {
          const filteredChildren = filterMenusByPermission(
            menu.children,
            permissions
          );
          if (filteredChildren.length > 0) {
            return { ...menu, children: filteredChildren };
          }
          return null;
        }
        return permissions.includes(menu.permission!) ? menu : null;
      })
      .filter(Boolean) as ItemType<any>[];

  const accesableMenus = useMemo(() => {
    if (!userInfo?.userInfo?.permissions) return [];
    return filterMenusByPermission(menus, userInfo.userInfo.permissions);
  }, [userInfo]);

  const clickMenuHandler = (val: any) => {
    if (val.key) {
      navigate(val.key);
    }
  };

  if (userInfo.loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "35%" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Layout className="h-screen">
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
            <Avatar size={40}>
              {Array.from(userInfo.userInfo?.name ?? "")[0].toUpperCase()}
            </Avatar>
          </div>

          {!collapsed && (
            <div>
              <p className="text-sm font-bold">{userInfo.userInfo?.name}</p>
              <p className="text-xs font-bold">
                {userInfo.userInfo?.job_title}
              </p>
            </div>
          )}
        </div>

        <Menu
          theme="light"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={accesableMenus}
          style={{ background: "#014F42", color: "#ffffff" }}
          onClick={clickMenuHandler}
        />
      </Sider>
      <Layout className={collapsed ? "sm:ml-[80px]" : "sm:ml-[200px]"}>
        <Header
          style={{ padding: 0, background: colorBgContainer }}
          className="flex"
        >
          <div className="flex justify-between w-full">
            <div className="flex">
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
            </div>

            <p
              className="mr-4 cursor-pointer text-[#570808] font-bold"
              onClick={() => logout()}
            >
              Keluar
            </p>
          </div>
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
