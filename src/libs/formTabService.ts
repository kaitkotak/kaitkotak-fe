export const updateFormTab = (key: string, value: any) => {
    localStorage.setItem(key, JSON.stringify(value))
}

export const removeFormTab = (key: string) => {
    localStorage.removeItem(key)
}
