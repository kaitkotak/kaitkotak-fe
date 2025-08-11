import {
    Button,
    Col,
    DatePicker,
    Flex,
    Form,
    FormProps,
    Input,
    InputNumber,
    Row,
    Select,
    Spin,
    theme,
} from 'antd'
import { Content } from 'antd/es/layout/layout'
import { useNavigate, useParams } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'
import { BreadcrumbContext } from '../../../context/breadcrumb'
import {
    FileDoneOutlined,
    MinusCircleOutlined,
    ProfileOutlined,
    ReloadOutlined,
} from '@ant-design/icons'
import UseGetCustomerList from '../../master-data/customer/hooks/useGetCustomerList'
import UseGetSalesPeopleList from '../../master-data/salesPeople/hooks/useGetSalesPeopleList'
import UseGetTransportatonList from '../../master-data/transportation/hooks/useGetTransportationList'
import useGetSalesDetail from '../hooks/useGetSalesDetail'
import dayjs from 'dayjs'
import useCreateSales from '../hooks/useCreateSales'
import useUpdateSales from '../hooks/useUpdateSales'
import UseGetPurchaseOrderList from '../../purchase-order/hooks/useGetPurchaseOrderList'
import { useCheckPermission } from '../../../hooks/useCheckPermission'
import UseGetPurchaseOrderItems from '../hooks/useGetPurchaseOrderItems'

const SalesForm = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken()
    const { mutateAsync: create, isPending: isPendingCreate } = useCreateSales()
    const { mutateAsync: update, isPending: isPendingUpdate } = useUpdateSales()
    const navigate = useNavigate()
    const params = useParams()
    const { data, isLoading } = useGetSalesDetail({
        id: params.id ?? '',
    })
    const [form] = Form.useForm()
    const { setBreadcrumb } = useContext(BreadcrumbContext)
    const {
        data: customerListResponse,
        refetch: refetchCustomerList,
        isRefetching: isCustomerListRefetching,
    } = UseGetCustomerList()
    const [customerList, setCustomerList] = useState<ICustomerList[]>([])
    const [itemList, setItemList] = useState<ISalesItemList[]>([])
    const [selectedCustomer, setSelectedCustomer] = useState<string | null>(
        null
    )
    const {
        data: salesPeopleListResponse,
        refetch: refetchSalesPeopleList,
        isRefetching: isSalesPeopleListRefetching,
    } = UseGetSalesPeopleList()
    const [salesPeople, setSalesPeople] = useState<ISalesPeopleList[]>([])
    const {
        data: transportationListResponse,
        refetch: refetchTransportationList,
        isRefetching: isTransportationListRefetching,
    } = UseGetTransportatonList()
    const [transportations, setTransportations] = useState<
        ITransportationList[]
    >([])
    const {
        data: purchaseOrderResponse,
        refetch: refetchPurchaseOrder,
        isRefetching: isPurchaseOrderRefetching,
    } = UseGetPurchaseOrderList()
    const [_, setPurchaseOrders] = useState<IPurchaseOrderList[]>([])
    const checkPermission = useCheckPermission()
    const {
        mutateAsync: getPurchaseOrderItems,
        isPending: isGetPurchaseOrderItemsPending,
        isSuccess: isGetPurchaseOrderItemsSuccess,
        data: purchaseOrderItemsResponse,
    } = UseGetPurchaseOrderItems()

    useEffect(() => {
        setBreadcrumb([
            {
                title: 'Penjualan',
            },
            {
                title: params.id ? 'Edit Penjualan' : 'Tambah Penjualan',
            },
        ])

        localStorage.setItem('isForm', 'true')
    }, [])

    useEffect(() => {
        if (params.id && data) {
            getPurchaseOrderItems(data?.data.data.customer_id)
            form.setFieldsValue({
                ...data?.data.data,
                invoice_date: dayjs(data?.data.data.invoice_date),
                due_date: dayjs(data?.data.data.due_date),
                invoice_items: data?.data.data.invoice_items.map(
                    (item: any) => ({
                        ...item,
                        id: `${item.purchase_order_id}-${item.item_id}`,
                        po_id: item.purchase_order_id,
                    })
                ),
            })

            setSelectedCustomer(data?.data.data.customer_id)
        }
    }, [data])

    useEffect(() => {
        if (customerListResponse) {
            setCustomerList(customerListResponse.data.data)
        }
    }, [customerListResponse])

    useEffect(() => {
        if (salesPeopleListResponse) {
            setSalesPeople(salesPeopleListResponse.data.data)
        }
    }, [salesPeopleListResponse])

    useEffect(() => {
        if (transportationListResponse) {
            setTransportations(transportationListResponse.data.data)
        }
    }, [transportationListResponse])

    useEffect(() => {
        if (purchaseOrderResponse) {
            setPurchaseOrders(purchaseOrderResponse.data.data)
        }
    }, [purchaseOrderResponse])

    useEffect(() => {
        if (isGetPurchaseOrderItemsSuccess && purchaseOrderItemsResponse) {
            setItemList(
                purchaseOrderItemsResponse.data.data.map(
                    (response: ISalesItemList) => ({
                        ...response,
                        // id: `${selected.id}-${item.item_id}`,
                        //         po_id: selected.id,
                        disabled: true,
                    })
                )
            )
        }
    }, [isGetPurchaseOrderItemsSuccess])

    const submit: FormProps<ISalesForm>['onFinish'] = (values) => {
        const payload: ISalesFormPayload = {
            customer_id: values.customer_id,
            invoice_date: dayjs(values.invoice_date).format('YYYY-MM-DD'),
            due_date: dayjs(values.due_date).format('YYYY-MM-DD'),
            due_days: values.due_days,
            tax: values.tax,
            sales_rep_id: values.sales_rep_id ?? null,
            transport_vehicle_id: values.transport_vehicle_id ?? null,
            invoice_items: values.invoice_items.map(
                (item: ISalesFormPayloadItem) => ({
                    po_id: item.po_id,
                    item_id: item.item_id,
                    quantity: item.quantity,
                    price_per_unit: item.price_per_unit,
                    price_total: item.price_total,
                })
            ),
        }

        if (params.id) {
            update({ payload, id: params.id })
        } else {
            create(payload)
        }
    }

    const back = () => {
        navigate('/sales')
    }

    const calculateSubstotal = (idx: number) => {
        const qty: number =
            form.getFieldValue([`invoice_items`, idx, 'quantity']) ?? 0
        const pricePerUnit: number =
            form.getFieldValue([`invoice_items`, idx, 'price_per_unit']) ?? 0

        form.setFieldValue(
            [`invoice_items`, idx, 'price_total'],
            qty * pricePerUnit
        )

        calculateTotalAmount()
    }

    const calculateTotalAmount = () => {
        let totalAmount: number = 0
        form.getFieldValue('invoice_items').forEach((element: any) => {
            totalAmount += element.price_total
        })
        form.setFieldValue('price_total', totalAmount)
    }

    const selectItem = (idx: number, value: string) => {
        const selectedItem: ISalesItemList = itemList.filter(
            (item: ISalesItemList) => item.id === value
        )[0]

        form.setFieldValue(
            [`invoice_items`, idx, 'item_id'],
            Number(selectedItem.item_id)
        )
        form.setFieldValue(
            [`invoice_items`, idx, 'price_per_unit'],
            Number(selectedItem.price_per_unit)
        )
        form.setFieldValue([`invoice_items`, idx, 'quantity'], 0)

        calculateSubstotal(idx)
        renewItemList()
    }

    const handleCustomerChange = (val: string) => {
        getPurchaseOrderItems(val)
        // const selectedPurchaseOrder: IPurchaseOrderList[] = purchaseOrders.filter(
        //   (purchaseOrder: IPurchaseOrderList) =>
        //     purchaseOrder.customer_id === Number(val)
        // );

        setSelectedCustomer(val)

        form.setFieldsValue({
            invoice_items: [],
        })
        // form.setFieldsValue({
        //   invoice_items: selectedPurchaseOrder.flatMap(
        //     (selected: IPurchaseOrderList) =>
        //       selected.purchase_order_items.map((item) => ({
        //         ...item,
        //         id: `${selected.id}-${item.item_id}`,
        //         po_id: selected.id,
        //       }))
        //   ),
        // });

        // calculateTotalAmount();
    }

    const handleDueDateChange = () => {
        if (
            form.getFieldValue('due_date') &&
            form.getFieldValue('invoice_date')
        ) {
            form.setFieldValue(
                'due_days',
                dayjs(form.getFieldValue('due_date'))
                    .startOf('day')
                    .diff(
                        dayjs(form.getFieldValue('invoice_date')).startOf(
                            'day'
                        ),
                        'day',
                        true
                    )
            )
        }
    }

    const renewItemList = () => {
        let newItemList: ISalesItemList[] = itemList.map(
            (item: ISalesItemList) => ({
                ...item,
                disabled: form
                    .getFieldValue('invoice_items')
                    .some(
                        (selectedItem: ISalesPurchaseOrderList) =>
                            selectedItem.id === item.id
                    ),
            })
        )
        setItemList(newItemList)
    }

    const updateDueDate = () => {
        const date = dayjs(form.getFieldValue('invoice_date'))
        const dueDays = form.getFieldValue('due_days')

        form.setFieldValue('due_date', date.add(dueDays, 'day'))
    }

    const refreshMasterData = () => {
        refetchCustomerList()
        refetchSalesPeopleList()
        refetchTransportationList()
        refetchPurchaseOrder()
    }

    return (
        <Spin
            spinning={
                isLoading ||
                isPendingCreate ||
                isPendingUpdate ||
                isGetPurchaseOrderItemsPending ||
                isCustomerListRefetching ||
                isSalesPeopleListRefetching ||
                isTransportationListRefetching ||
                isPurchaseOrderRefetching
            }
        >
            <Content
                style={{
                    margin: '24px 16px',
                    padding: 24,
                    background: colorBgContainer,
                    borderRadius: borderRadiusLG,
                }}
            >
                <div className="flex justify-end gap-3 mb-5">
                    <Button
                        onClick={refreshMasterData}
                        icon={<ReloadOutlined />}
                        className={'mb-4'}
                        color="primary"
                        variant="solid"
                    >
                        <span className="hidden md:inline">
                            Refresh Data Master
                        </span>
                    </Button>

                    {params.id && (
                        <div className="flex gap-3">
                            <Button
                                color="primary"
                                variant="solid"
                                icon={<FileDoneOutlined />}
                                onClick={() => {
                                    window.open(
                                        `${
                                            import.meta.env.VITE_API_URL
                                        }/invoice/download/invoice/${
                                            params.id
                                        }`,
                                        '_blank'
                                    )
                                }}
                            >
                                <span className="hidden sm:inline md:inline">
                                    Download Invoice
                                </span>
                            </Button>

                            <Button
                                color="primary"
                                variant="solid"
                                icon={<ProfileOutlined />}
                                onClick={() => {
                                    window.open(
                                        `${
                                            import.meta.env.VITE_API_URL
                                        }/invoice/download/surat-jalan/${
                                            params.id
                                        }`,
                                        '_blank'
                                    )
                                }}
                            >
                                <span className="hidden sm:inline md:inline">
                                    Download Surat Jalan
                                </span>
                            </Button>
                        </div>
                    )}
                </div>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={submit}
                    // initialValues={{
                    //   invoice_items: [
                    //     { item_id: "", quantity: 0, price_per_unit: 0, price_total: 0 },
                    //   ],
                    // }}
                >
                    {params.id && (
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item<ISalesForm>
                                    label="No Invoice"
                                    name="invoice_number"
                                >
                                    <Input readOnly />
                                </Form.Item>
                            </Col>
                        </Row>
                    )}

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item<ISalesForm>
                                label="Tanggal"
                                name="invoice_date"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            'Silahkan pilih tanggal penjualan!',
                                    },
                                ]}
                            >
                                <DatePicker
                                    style={{ width: '100%' }}
                                    format="DD-MM-YYYY"
                                    onChange={() => handleDueDateChange()}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item<ISalesForm>
                                label="Nama Pelanggan"
                                name="customer_id"
                            >
                                <Select
                                    placeholder="Pilih Pelanggan"
                                    optionFilterProp="label"
                                    options={customerList.map(
                                        (s: ICustomerList) => ({
                                            value: s.id,
                                            label: s.full_name,
                                        })
                                    )}
                                    onChange={handleCustomerChange}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    {selectedCustomer && !isGetPurchaseOrderItemsPending && (
                        <>
                            <Row gutter={16}>
                                <Col xs={{ span: 24 }} lg={{ span: 24 }}>
                                    <Row gutter={16}>
                                        <Col span={12}>
                                            <Form.Item<ISalesForm>
                                                label="Tax"
                                                name="tax"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message:
                                                            'Silahkan masukan tax!',
                                                    },
                                                ]}
                                            >
                                                <InputNumber
                                                    style={{ width: '100%' }}
                                                    addonAfter="%"
                                                    max={100}
                                                />
                                            </Form.Item>
                                        </Col>

                                        <Col span={12}>
                                            <Form.Item<ISalesForm>
                                                label="Total Harga"
                                                name="price_total"
                                            >
                                                <InputNumber
                                                    style={{ width: '100%' }}
                                                    addonBefore="Rp"
                                                    readOnly
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                                    <Row gutter={16}>
                                        <Col span={12}>
                                            <Form.Item<ISalesForm>
                                                label="Sales"
                                                name="sales_rep_id"
                                            >
                                                <Select
                                                    placeholder="Pilih Sales"
                                                    optionFilterProp="label"
                                                    options={salesPeople.map(
                                                        (
                                                            s: ISalesPeopleList
                                                        ) => ({
                                                            value: s.id,
                                                            label: s.full_name,
                                                        })
                                                    )}
                                                    allowClear={true}
                                                />
                                            </Form.Item>
                                        </Col>

                                        <Col span={12}>
                                            <Form.Item<ISalesForm>
                                                label="Transportasi"
                                                name="transport_vehicle_id"
                                            >
                                                <Select
                                                    placeholder="Pilih Transportasi"
                                                    optionFilterProp="label"
                                                    options={transportations.map(
                                                        (
                                                            s: ITransportationList
                                                        ) => ({
                                                            value: s.id,
                                                            label: s.driver_name,
                                                        })
                                                    )}
                                                    allowClear={true}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Col>

                                <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                                    <Row gutter={16}>
                                        <Col span={18}>
                                            <Form.Item<ISalesForm>
                                                label="Tanggal Jatuh Tempo"
                                                name="due_date"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message:
                                                            'Silahkan pilih tanggal jatuh tempo!',
                                                    },
                                                ]}
                                            >
                                                <DatePicker
                                                    style={{ width: '100%' }}
                                                    format="DD-MM-YYYY"
                                                    onChange={() =>
                                                        handleDueDateChange()
                                                    }
                                                />
                                            </Form.Item>
                                        </Col>

                                        <Col span={6}>
                                            <Form.Item<ISalesForm>
                                                label="Hari"
                                                name="due_days"
                                            >
                                                <InputNumber
                                                    style={{ width: '100%' }}
                                                    onChange={updateDueDate}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>

                            <h2 className="text-lg font-bold mb-3">Items</h2>

                            <Form.List
                                name="invoice_items"
                                rules={[
                                    {
                                        validator: async (_, names) => {
                                            if (!names || names.length < 1) {
                                                return Promise.reject(
                                                    new Error('Minimal 1 Item')
                                                )
                                            }
                                        },
                                    },
                                ]}
                            >
                                {(fields, { add, remove }) => (
                                    <>
                                        {fields.map(
                                            (
                                                { key, name, ...restField },
                                                index
                                            ) => (
                                                <Row
                                                    gutter={16}
                                                    key={key}
                                                    className="border rounded p-2 mb-2 lg:border-0 lg:p-0 lg:mb-0"
                                                >
                                                    <Col
                                                        xs={{ span: 24 }}
                                                        lg={{ span: 10 }}
                                                    >
                                                        <Form.Item
                                                            label={'Kode Item'}
                                                            {...restField}
                                                            name={[name, 'id']}
                                                            labelCol={{
                                                                className:
                                                                    index === 0
                                                                        ? 'block'
                                                                        : 'lg:hidden block',
                                                            }}
                                                            rules={[
                                                                {
                                                                    required:
                                                                        true,
                                                                    message:
                                                                        'Silahkan pilih item!',
                                                                },
                                                            ]}
                                                        >
                                                            <Select
                                                                showSearch
                                                                placeholder="Pilih Item"
                                                                optionFilterProp="label"
                                                                options={itemList.map(
                                                                    (
                                                                        s: ISalesItemList
                                                                    ) => ({
                                                                        value: s.id,
                                                                        label: `${s.item_name} (${s.po_number})`,
                                                                        disabled:
                                                                            s.disabled,
                                                                    })
                                                                )}
                                                                onChange={(
                                                                    value: string
                                                                ) =>
                                                                    selectItem(
                                                                        index,
                                                                        value
                                                                    )
                                                                }
                                                            />
                                                        </Form.Item>
                                                    </Col>

                                                    <Col
                                                        xs={{ span: 12 }}
                                                        lg={{ span: 4 }}
                                                    >
                                                        <Form.Item
                                                            label={
                                                                'Jumlah Item'
                                                            }
                                                            name={[
                                                                name,
                                                                'quantity',
                                                            ]}
                                                            labelCol={{
                                                                className:
                                                                    index === 0
                                                                        ? 'block'
                                                                        : 'lg:hidden block',
                                                            }}
                                                            rules={[
                                                                {
                                                                    required:
                                                                        true,
                                                                    message:
                                                                        'Silahkan masukan jumlah item!',
                                                                },
                                                            ]}
                                                        >
                                                            <InputNumber
                                                                style={{
                                                                    width: '100%',
                                                                }}
                                                                addonAfter="unit"
                                                                onChange={() =>
                                                                    calculateSubstotal(
                                                                        index
                                                                    )
                                                                }
                                                            />
                                                        </Form.Item>
                                                    </Col>

                                                    <Col
                                                        xs={{ span: 12 }}
                                                        lg={{ span: 4 }}
                                                    >
                                                        <Form.Item
                                                            label={
                                                                'Harga Satuan'
                                                            }
                                                            name={[
                                                                name,
                                                                'price_per_unit',
                                                            ]}
                                                            labelCol={{
                                                                className:
                                                                    index === 0
                                                                        ? 'block'
                                                                        : 'lg:hidden block',
                                                            }}
                                                            rules={[
                                                                {
                                                                    required:
                                                                        true,
                                                                    message:
                                                                        'Silahkan masukan harga satuan!',
                                                                },
                                                            ]}
                                                        >
                                                            <InputNumber
                                                                style={{
                                                                    width: '100%',
                                                                }}
                                                                addonBefore="Rp"
                                                                onChange={() =>
                                                                    calculateSubstotal(
                                                                        index
                                                                    )
                                                                }
                                                            />
                                                        </Form.Item>
                                                    </Col>

                                                    <Col
                                                        xs={{ span: 23 }}
                                                        lg={{ span: 5 }}
                                                    >
                                                        <Form.Item
                                                            label={'Substotal'}
                                                            name={[
                                                                name,
                                                                'price_total',
                                                            ]}
                                                            labelCol={{
                                                                className:
                                                                    index === 0
                                                                        ? 'block'
                                                                        : 'lg:hidden block',
                                                            }}
                                                        >
                                                            <InputNumber
                                                                readOnly
                                                                style={{
                                                                    width: '100%',
                                                                }}
                                                                addonBefore="Rp"
                                                            />
                                                        </Form.Item>
                                                    </Col>

                                                    {fields.length > 1 ? (
                                                        <Col
                                                            xs={{ span: 2 }}
                                                            lg={{ span: 1 }}
                                                            className={
                                                                index === 0
                                                                    ? 'mt-9'
                                                                    : 'mt-8 lg:mt-1'
                                                            }
                                                        >
                                                            <MinusCircleOutlined
                                                                onClick={() => {
                                                                    remove(
                                                                        index
                                                                    )
                                                                    calculateTotalAmount()
                                                                    renewItemList()
                                                                }}
                                                            />
                                                        </Col>
                                                    ) : null}
                                                </Row>
                                            )
                                        )}

                                        <Flex gap="middle" justify="end">
                                            <Form.Item label={null}>
                                                <Button
                                                    type="default"
                                                    variant="outlined"
                                                    htmlType="button"
                                                    onClick={back}
                                                >
                                                    Batal
                                                </Button>
                                            </Form.Item>

                                            {form.getFieldValue('invoice_items')
                                                .length < itemList.length && (
                                                <Form.Item label={null}>
                                                    <Button
                                                        type="default"
                                                        variant="outlined"
                                                        htmlType="button"
                                                        onClick={() => {
                                                            renewItemList()
                                                            add({
                                                                item_id: '',
                                                                quantity: 0,
                                                                price_per_unit: 0,
                                                                price_total: 0,
                                                            })
                                                        }}
                                                    >
                                                        Tambah Item
                                                    </Button>
                                                </Form.Item>
                                            )}

                                            {checkPermission(
                                                'sales.update'
                                            ) && (
                                                <Form.Item label={null}>
                                                    <Button
                                                        type="primary"
                                                        htmlType="submit"
                                                    >
                                                        Simpan
                                                    </Button>
                                                </Form.Item>
                                            )}
                                        </Flex>
                                    </>
                                )}
                            </Form.List>
                        </>
                    )}
                </Form>
            </Content>
        </Spin>
    )
}

export default SalesForm
