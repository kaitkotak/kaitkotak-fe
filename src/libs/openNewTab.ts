import { useContext } from 'react'
import { TabsContext } from '../context/tabs.tsx'
import { ActiveTabContext } from '../context/activeTab.tsx'
import { useNavigate } from 'react-router-dom'

export const OpenNewTab = (props: ITabsItem) => {
    const { setTabs } = useContext(TabsContext)
    const { setActiveTab } = useContext(ActiveTabContext)
    const navigate = useNavigate()

    setTabs((prevVal: ITabsItem[]) => [...prevVal, props])
    setActiveTab(props.key)
    navigate(props.key)
}
