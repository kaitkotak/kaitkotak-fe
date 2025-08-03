import React, { JSX, useState } from 'react'

interface ITabsProps {
    children: React.ReactNode
}

export const ActiveTabContext = React.createContext<any>({
    activeTab: [],
    setActiveTab: () => {},
})

export const ActiveTabProvider: React.FunctionComponent<ITabsProps> = ({
    children,
}: ITabsProps): JSX.Element => {
    const ACTIVE_TAB_STORAGE_KEY = 'lapan_active_tab'
    const [activeTab, setActiveTab] = useState<string>(
        localStorage.getItem(ACTIVE_TAB_STORAGE_KEY) || '/home'
    )

    return (
        <ActiveTabContext.Provider
            value={{
                activeTab,
                setActiveTab,
            }}
        >
            {children}
        </ActiveTabContext.Provider>
    )
}
