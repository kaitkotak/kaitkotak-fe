interface ICustomTablePaginationConfig {
    page: number
    limit: number
    filter?: string
    date_from?: string
    date_to?: string
}

interface IDateRangeFilter {
    date_from: string
    date_to: string
}

interface ITabsItem {
    key: string
    label: string
}

interface ITabService {
    key: string
    value: any
}
