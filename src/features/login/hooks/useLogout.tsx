import { useMutation } from '@tanstack/react-query'
import axiosInstance from '../../../libs/axios'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { TabsContext } from '../../../context/tabs.tsx'

const useLogout = () => {
    const url: string = '/auth/logout'
    const navigate = useNavigate()
    const { setTabs } = useContext(TabsContext)

    return useMutation({
        mutationKey: ['logout'],
        mutationFn: async () => {
            return await axiosInstance.get(url)
        },
        onSuccess: () => {
            localStorage.clear()
            setTabs([])
            navigate('/')
        },
    })
}

export default useLogout
