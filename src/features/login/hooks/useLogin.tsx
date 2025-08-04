import { useMutation } from '@tanstack/react-query'
import axiosInstance from '../../../libs/axios'
import useGetUserInfo from './useGetUserInfo'
import { useContext } from 'react'
import { TabsContext } from '../../../context/tabs.tsx'

const useLogin = () => {
    const url: string = '/auth/login'
    const { mutateAsync: getUserInfo } = useGetUserInfo()
    const { setTabs } = useContext(TabsContext)

    return useMutation({
        mutationKey: ['createUser'],
        mutationFn: async (paylod: ILoginPayload) => {
            return await axiosInstance.post(url, paylod)
        },
        onSuccess: () => {
            setTabs([{ key: '/home', label: 'Beranda' }])
            getUserInfo()
        },
    })
}

export default useLogin
