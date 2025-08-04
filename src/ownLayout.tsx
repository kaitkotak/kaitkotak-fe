import {
    Avatar,
    Breadcrumb,
    Button,
    Layout,
    Menu,
    Modal,
    Spin,
    Tabs,
    theme,
} from 'antd'
import {
    DatabaseOutlined,
    FileProtectOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    ProductOutlined,
    ShopOutlined,
    SwitcherOutlined,
    TeamOutlined,
} from '@ant-design/icons'
import Sider from 'antd/es/layout/Sider'
import { useContext, useEffect, useMemo, useState } from 'react'
import { Header } from 'antd/es/layout/layout'
import { ItemType } from 'antd/es/menu/interface'
import { Outlet, useNavigate } from 'react-router-dom'
import { BreadcrumbContext } from './context/breadcrumb'
import useWindowDimensions from './libs/useWindowDimensions'
import { useUser } from './context/user'
import useLogout from './features/login/hooks/useLogout'
import useGetUserInfo from './features/login/hooks/useGetUserInfo'
import { TabsContext } from './context/tabs.tsx'
import { ActiveTabContext } from './context/activeTab.tsx'
import { removeFormTab } from './libs/formTabService.ts'

const OwnLayout = () => {
    const userInfo = useUser()
    const menus: ItemType<any>[] = [
        {
            key: '/production',
            label: 'Produksi',
            icon: <ProductOutlined />,
            permission: 'production.access',
        },
        {
            key: '/purchase-order',
            label: 'Purchase Order',
            icon: <FileProtectOutlined />,
            permission: 'purchase_order.access',
        },
        {
            key: '/sales',
            label: 'Penjualan',
            icon: <ShopOutlined />,
            permission: 'sales.access',
        },
        {
            key: '/payment',
            label: 'Pembayaran',
            icon: <ShopOutlined />,
            permission: 'payment.access',
        },
        {
            key: '/raw-material',
            label: 'Bahan Baku',
            icon: <SwitcherOutlined />,
            permission: 'raw_material.access',
        },
        {
            key: '/user',
            label: 'Pengguna',
            icon: <TeamOutlined />,
            permission: 'user.access',
        },
        {
            key: '',
            label: 'Data Master',
            icon: <DatabaseOutlined />,
            children: [
                {
                    key: '/master/item',
                    label: 'Item',
                    permission: 'master_item.access',
                },
                {
                    key: '/master/customer',
                    label: 'Pelanggan',
                    permission: 'master_customer.access',
                },
                {
                    key: '/master/sales-people',
                    label: 'Sales',
                    permission: 'master_sales.access',
                },
                {
                    key: '/master/transportation',
                    label: 'Transportasi',
                    permission: 'master_transportation.access',
                },
            ],
        },
    ]

    const [collapsed, setCollapsed] = useState(false)
    const {
        token: { colorBgContainer },
    } = theme.useToken()
    const navigate = useNavigate()
    const { breadcrumb } = useContext(BreadcrumbContext)
    const { width } = useWindowDimensions()
    const { mutateAsync: logout } = useLogout()
    const { mutateAsync: getUserInfo } = useGetUserInfo()
    const [isOpenConfirmationModal, setIsOpenConfirmationModal] =
        useState(false)
    const [targetUrl, setTargetUrl] = useState<string>('')
    const TABS_STORAGE_KEY = 'lapan_tabs'
    const ACTIVE_TAB_STORAGE_KEY = 'lapan_active_tab'
    const { tabs, setTabs } = useContext(TabsContext)
    const { activeTab, setActiveTab } = useContext(ActiveTabContext)

    useEffect(() => {
        getUserInfo()
    }, [])

    // 📦 Keep localStorage in sync
    useEffect(() => {
        localStorage.setItem(TABS_STORAGE_KEY, JSON.stringify(tabs))
    }, [tabs])

    useEffect(() => {
        localStorage.setItem(ACTIVE_TAB_STORAGE_KEY, activeTab)
    }, [activeTab])

    // ➕ Add tab when navigating to a new route
    useEffect(() => {
        const exists = tabs.find((tab: any) => tab.key === location.pathname)
        if (!exists) {
            const found = menus.find((menu) => menu.path === location.pathname)
            if (found) {
                setTabs((prev: any) => [
                    ...prev,
                    { key: found.path, label: found.label },
                ])
            }
        }
        setActiveTab(location.pathname)
    }, [location])

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
                    )
                    if (filteredChildren.length > 0) {
                        return { ...menu, children: filteredChildren }
                    }
                    return null
                }
                return permissions.includes(menu.permission!) ? menu : null
            })
            .filter(Boolean) as ItemType<any>[]

    const accesableMenus = useMemo(() => {
        if (!userInfo?.userInfo?.permissions) return []
        return filterMenusByPermission(menus, userInfo.userInfo.permissions)
    }, [userInfo])

    const clickMenuHandler = (val: any) => {
        if (val.key) {
            const ifForm: boolean = localStorage.getItem('isForm') === 'true'

            if (ifForm) {
                setIsOpenConfirmationModal(true)
                setTargetUrl(val.key)
            } else {
                let selectedMenu = menus.find((menu) => menu.key === val.key)
                const isMaster: boolean = val.key.includes('/master')

                if (isMaster) {
                    selectedMenu = menus
                        .at(-1)
                        .children.find((menu: any) => menu.key === val.key)
                }

                if (!tabs.find((tab: any) => tab.key === val.key)) {
                    setTabs((prev: any) => [
                        ...prev,
                        {
                            key: val.key,
                            label: isMaster
                                ? `Master-${selectedMenu.label}`
                                : selectedMenu.label,
                        },
                    ])
                }

                setActiveTab(val.key)
                navigate(val.key)
            }
        }
    }

    const handleOk = () => {
        navigate(targetUrl)
        setIsOpenConfirmationModal(false)
        localStorage.setItem('isForm', 'false')
    }

    const handleCancel = () => {
        setIsOpenConfirmationModal(false)
    }

    const onTabChange = (key: string) => {
        navigate(key)
        setActiveTab(key)
    }

    const handleTabRemove = (targetKey: string) => {
        const newTabs = tabs.filter((tab: any) => tab.key !== targetKey)
        let newActiveKey = activeTab

        if (targetKey === activeTab) {
            const lastTab = newTabs[newTabs.length - 1]
            newActiveKey = lastTab?.key || '/home'
            navigate(newActiveKey)
        }

        setTabs(newTabs)
        setActiveTab(newActiveKey)
        console.log(`form_tab_${targetKey}`)
        removeFormTab(`form_tab_${targetKey}`)
        // navigate(newActiveKey)
    }

    if (userInfo.loading) {
        return (
            <div style={{ textAlign: 'center', marginTop: '35%' }}>
                <Spin size="large" />
            </div>
        )
    }

    return (
        <Layout className="h-screen">
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                className="py-6 !fixed"
                breakpoint="sm"
                collapsedWidth={width < 576 ? '0' : '80'}
                onCollapse={setCollapsed}
                style={{
                    background: '#014F42',
                    height: '100%',
                    zIndex: '100',
                }}
            >
                <div className="flex gap-2 mb-10 px-4">
                    <div className="my-auto mx-0">
                        {userInfo ? (
                            <Avatar size={40}>
                                {Array.from(
                                    userInfo.userInfo?.name ?? ''
                                )[0]?.toUpperCase()}
                            </Avatar>
                        ) : (
                            <Avatar size={40}>?</Avatar>
                        )}
                    </div>

                    {!collapsed && (
                        <div>
                            <p className="text-sm font-bold">
                                {userInfo.userInfo?.name}
                            </p>
                            <p className="text-xs font-bold">
                                {userInfo.userInfo?.job_title}
                            </p>
                        </div>
                    )}
                </div>

                <Menu
                    theme="light"
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    items={accesableMenus}
                    style={{ background: '#014F42', color: '#ffffff' }}
                    onClick={clickMenuHandler}
                />
            </Sider>
            <Layout className={collapsed ? 'sm:ml-[80px]' : 'sm:ml-[200px]'}>
                <Header
                    style={{
                        padding: 0,
                        background: colorBgContainer,
                        margin: 0,
                    }}
                >
                    <Tabs
                        hideAdd
                        onChange={onTabChange}
                        activeKey={activeTab}
                        type="editable-card"
                        onEdit={(key, action) =>
                            action === 'remove' &&
                            handleTabRemove(key as string)
                        }
                        items={tabs.map((tab: any) => ({
                            key: tab.key,
                            label: tab.label,
                            closable: tabs.length > 1,
                            children: (
                                <div className={'-mt-4'}>
                                    <div className="flex justify-between w-full bg-white">
                                        <div className="flex">
                                            <Button
                                                type="text"
                                                icon={
                                                    collapsed ? (
                                                        <MenuUnfoldOutlined />
                                                    ) : (
                                                        <MenuFoldOutlined />
                                                    )
                                                }
                                                onClick={() =>
                                                    setCollapsed(!collapsed)
                                                }
                                                style={{
                                                    fontSize: '16px',
                                                    width: 64,
                                                    height: 64,
                                                }}
                                            />

                                            <Breadcrumb
                                                items={breadcrumb}
                                                style={{ margin: 'auto 0' }}
                                            />
                                        </div>

                                        <p
                                            className="mr-4 cursor-pointer text-[#570808] font-bold my-auto"
                                            onClick={() => logout()}
                                        >
                                            Keluar
                                        </p>
                                    </div>

                                    <Outlet />
                                </div>
                            ),
                        }))}
                    />
                </Header>

                <Modal
                    title="Tinggalkan Halaman ini?"
                    open={isOpenConfirmationModal}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    okText="Ya"
                    cancelText="Tidak"
                >
                    <p>Anda yakin ingin meninggalkan halaman ini?</p>
                </Modal>

                <div
                    onClick={() => {
                        if (width < 576) {
                            setCollapsed(true)
                        }
                    }}
                ></div>
            </Layout>
        </Layout>
    )
}

export default OwnLayout
