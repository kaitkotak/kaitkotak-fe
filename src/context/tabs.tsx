import React, { JSX, useState } from 'react'

interface ITabsProps {
    children: React.ReactNode
}

export const TabsContext = React.createContext<any>({
    tabs: [],
    setTabs: () => {},
})

export const TabsProvider: React.FunctionComponent<ITabsProps> = ({
    children,
}: ITabsProps): JSX.Element => {
    const TABS_STORAGE_KEY = 'lapan_tabs'
    const [tabs, setTabs] = useState<ITabsItem[]>(() => {
        const stored = localStorage.getItem(TABS_STORAGE_KEY)
        return stored
            ? JSON.parse(stored)
            : [{ key: '/home', label: 'Beranda' }]
    })

    return (
        <TabsContext.Provider
            value={{
                tabs,
                setTabs,
            }}
        >
            {children}
        </TabsContext.Provider>
    )
}
