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
  Space,
  Spin,
  theme,
} from "antd";
import { Content } from "antd/es/layout/layout";
import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { BreadcrumbContext } from "../../../context/breadcrumb";
import {
  FileDoneOutlined,
  MinusCircleOutlined,
  ProfileOutlined,
} from "@ant-design/icons";
import UseGetCustomerList from "../../master-data/customer/hooks/useGetCustomerList";
import UseGetItemList from "../../master-data/item/hooks/useGetItemList";
import UseGetSalesPeopleList from "../../master-data/salesPeople/hooks/useGetSalesPeopleList";
import UseGetTransportatonList from "../../master-data/transportation/hooks/useGetTransportationList";
import useGetSalesDetail from "../hooks/useGetSalesDetail";
import dayjs from "dayjs";
import useCreateSales from "../hooks/useCreateSales";
import useUpdateSales from "../hooks/useUpdateSales";
import UseGetPurchaseOrderList from "../../purchase-order/hooks/useGetPurchaseOrderList";
import { useCheckPermission } from "../../../hooks/useCheckPermission";

const SalesForm = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const { mutateAsync: create, isPending: isPendingCreate } = useCreateSales();
  const { mutateAsync: update, isPending: isPendingUpdate } = useUpdateSales();
  const navigate = useNavigate();
  const params = useParams();
  const { data, isLoading } = useGetSalesDetail({
    id: params.id ?? "",
  });
  const [form] = Form.useForm();
  const { setBreadcrumb } = useContext(BreadcrumbContext);
  const { data: customerListResponse } = UseGetCustomerList();
  const [customerList, setCustomerList] = useState<ICustomerList[]>([]);
  const { data: itemListResponse } = UseGetItemList();
  const [itemList, setItemList] = useState<IItemList[]>([]);
  const [masterItemList, setMasterItemList] = useState<IItemList[]>([]);
  const [purchaseOrderNo, setPurchaseOrderNo] = useState<string | null>(null);
  const { data: salesPeopleListResponse } = UseGetSalesPeopleList();
  const [salesPeople, setSalesPeople] = useState<ISalesPeopleList[]>([]);
  const { data: transportationListResponse } = UseGetTransportatonList();
  const [transportations, setTransportations] = useState<ITransportationList[]>(
    []
  );
  const { data: purchaseOrderResponse } = UseGetPurchaseOrderList();
  const [purchaseOrders, setPurchaseOrders] = useState<IPurchaseOrderList[]>(
    []
  );
  const checkPermission = useCheckPermission();

  useEffect(() => {
    setBreadcrumb([
      {
        title: "Penjualan",
      },
      {
        title: params.id ? "Edit Penjualan" : "Tambah Penjualan",
      },
    ]);
  }, []);

  useEffect(() => {
    if (params.id) {
      form.setFieldsValue(data?.data.data);
      form.setFieldValue("invoice_date", dayjs(data?.data.data.invoice_date));
      form.setFieldValue("due_date", dayjs(data?.data.data.due_date));
      setPurchaseOrderNo(data?.data.data.purchase_order_id);

      setTimeout(() => {
        setInintialItemList(data?.data.data.purchase_order_id);
      }, 100);
    }
  }, [data]);

  useEffect(() => {
    if (customerListResponse) {
      setCustomerList(customerListResponse.data.data);
    }
  }, [customerListResponse]);

  useEffect(() => {
    if (itemListResponse) {
      setItemList(itemListResponse.data.data);
      setMasterItemList(itemListResponse.data.data);
    }
  }, [itemListResponse]);

  useEffect(() => {
    if (salesPeopleListResponse) {
      setSalesPeople(salesPeopleListResponse.data.data);
    }
  }, [salesPeopleListResponse]);

  useEffect(() => {
    if (transportationListResponse) {
      setTransportations(transportationListResponse.data.data);
    }
  }, [transportationListResponse]);

  useEffect(() => {
    if (purchaseOrderResponse) {
      setPurchaseOrders(purchaseOrderResponse.data.data);
    }
  }, [purchaseOrderResponse]);

  const submit: FormProps<ISalesForm>["onFinish"] = (values) => {
    values.invoice_date = dayjs(values.invoice_date).format("YYYY-MM-DD");
    values.due_date = dayjs(values.due_date).format("YYYY-MM-DD");
    values.invoice_items = values.invoice_items.map((item: ISalesItem) => {
      item.po_item_id = item.id;
      return item;
    });
    values.po_id = values.purchase_order_id;
    delete values.invoice_number;

    if (params.id) {
      update({ ...values, id: params.id });
    } else {
      create(values);
    }
  };

  const back = () => {
    navigate("/sales");
  };

  const calculateSubstotal = (idx: number) => {
    const qty: number =
      form.getFieldValue([`invoice_items`, idx, "quantity"]) ?? 0;
    const pricePerUnit: number =
      form.getFieldValue([`invoice_items`, idx, "price_per_unit"]) ?? 0;

    form.setFieldValue(
      [`invoice_items`, idx, "price_total"],
      qty * pricePerUnit
    );

    calculateTotalAmount();
  };

  const calculateTotalAmount = () => {
    let totalAmount: number = 0;
    form.getFieldValue("invoice_items").forEach((element: any) => {
      totalAmount += element.price_total;
    });
    form.setFieldValue("price_total", totalAmount);
  };

  const selectItem = (idx: number, value: number) => {
    const selectedItem: IItemList = itemList.filter(
      (item: IItemList) => item.id === value
    )[0];

    form.setFieldValue(
      [`invoice_items`, idx, "price_per_unit"],
      Number(selectedItem.price_per_unit)
    );
    form.setFieldValue([`invoice_items`, idx, "quantity"], 0);

    calculateSubstotal(idx);
    renewItemList();
  };

  const handleCustomerChange = (val: string) => {
    console.log(val);
    const selectedPurchaseOrder: IPurchaseOrderList[] = purchaseOrders.filter(
      (purchaseOrder: IPurchaseOrderList) =>
        purchaseOrder.customer_id === Number(val)
    );

    console.log(
      "purchaseOrder",
      selectedPurchaseOrder.flatMap((selected: IPurchaseOrderList) => [
        ...selected.purchase_order_items,
      ])
    );
    setInintialItemList(val);

    setPurchaseOrderNo(val);
    form.setFieldsValue({
      // customer_id: selectedPurchaseOrder.customer_id,
      // tax: selectedPurchaseOrder.tax,
      // price_total: selectedPurchaseOrder.price_total,
      invoice_items: selectedPurchaseOrder.flatMap(
        (selected: IPurchaseOrderList) => [...selected.purchase_order_items]
      ),
    });
  };

  const handleDueDateChange = (val: any) => {
    form.setFieldValue(
      "due_days",
      dayjs(val).startOf("day").diff(dayjs().startOf("day"), "day", true)
    );
  };

  const setInintialItemList = (val: string) => {
    const selectedPurchaseOrder: IPurchaseOrderList[] = purchaseOrders.filter(
      (purchaseOrder: IPurchaseOrderList) =>
        purchaseOrder.customer_id === Number(val)
    );

    const itemFromCustomer = selectedPurchaseOrder.flatMap(
      (selected: IPurchaseOrderList) => [...selected.purchase_order_items]
    );

    const itemFromCustomerIds = itemFromCustomer.map(
      (val: IPurchaseOrderItems) => val.item_id
    );

    setItemList(() =>
      masterItemList.filter((val: IItemList) => {
        val.disabled = true;
        // if (itemFromCustomerIds.includes(val.id)) {
        //   val.purchase_number = itemFromCustomer.filter(
        //     (item) =>
        //       item.item_id === val.id
        //   )[0].order_number;
        // }

        return itemFromCustomerIds.includes(val.id);
      })
    );
  };

  const renewItemList = () => {
    let newItemList: IItemList[] = itemList.map((item: IItemList) => ({
      ...item,
      disabled: form
        .getFieldValue("invoice_items")
        .some(
          (selectedItem: IPurchaseOrderItems) =>
            selectedItem.item_id === item.id
        ),
    }));

    setItemList(newItemList);
  };

  return (
    <Spin spinning={isLoading || isPendingCreate || isPendingUpdate}>
      <Content
        style={{
          margin: "24px 16px",
          padding: 24,
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}
      >
        {params.id && (
          <div className="flex justify-end gap-3 mb-5">
            <Button
              color="primary"
              variant="solid"
              icon={<FileDoneOutlined />}
              onClick={() => {
                window.open(
                  `${import.meta.env.VITE_API_URL}/invoice/download/invoice/${
                    params.id
                  }`,
                  "_blank"
                );
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
                  }/invoice/download/surat-jalan/${params.id}`,
                  "_blank"
                );
              }}
            >
              <span className="hidden sm:inline md:inline">
                Download Surat Jalan
              </span>
            </Button>
          </div>
        )}

        <Form
          form={form}
          layout="vertical"
          onFinish={submit}
          initialValues={{
            invoice_items: [
              { item_id: "", quantity: 0, price_per_unit: 0, price_total: 0 },
            ],
          }}
        >
          {params.id && (
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item<ISalesForm> label="No Invoice" name="invoice_number">
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
                    message: "Silahkan pilih tanggal penjualan!",
                  },
                ]}
              >
                <DatePicker style={{ width: "100%" }} format="DD-MM-YYYY" />
              </Form.Item>
            </Col>

            <Col span={12}>
              {/* <Form.Item<ISalesForm>
                label="No Purchase Order"
                name="purchase_order_id"
                rules={[
                  { required: true, message: "Silahkan pilih purchase order!" },
                ]}
              >
                <Select
                  placeholder="Pilih Purchase Order"
                  optionFilterProp="label"
                  disabled={params && params.id ? true : false}
                  options={purchaseOrders.map((s: IPurchaseOrderList) => ({
                    value: s.id,
                    label: s.order_number,
                  }))}
                  onChange={handleCustomerChange}
                />
              </Form.Item> */}
              <Form.Item<ISalesForm> label="Nama Pelanggan" name="customer_id">
                <Select
                  placeholder="Pilih Pelanggan"
                  optionFilterProp="label"
                  options={customerList.map((s: ICustomerList) => ({
                    value: s.id,
                    label: s.full_name,
                  }))}
                  onChange={handleCustomerChange}
                />
              </Form.Item>
            </Col>
          </Row>

          {purchaseOrderNo && (
            <>
              <Row gutter={16}>
                <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                  <Form.Item<ISalesForm>
                    label="Nama Pelanggan"
                    name="customer_id"
                  >
                    <Select
                      disabled
                      placeholder="Pilih Pelanggan"
                      optionFilterProp="label"
                      options={customerList.map((s: ICustomerList) => ({
                        value: s.id,
                        label: s.full_name,
                      }))}
                    />
                  </Form.Item>
                </Col>

                <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item<ISalesForm>
                        label="Tax"
                        name="tax"
                        rules={[
                          {
                            required: true,
                            message: "Silahkan masukan tax!",
                          },
                        ]}
                      >
                        <InputNumber
                          style={{ width: "100%" }}
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
                          style={{ width: "100%" }}
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
                        rules={[
                          { required: true, message: "Silahkan pilih sales!" },
                        ]}
                      >
                        <Select
                          placeholder="Pilih Sales"
                          optionFilterProp="label"
                          options={salesPeople.map((s: ISalesPeopleList) => ({
                            value: s.id,
                            label: s.full_name,
                          }))}
                        />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item<ISalesForm>
                        label="Transportasi"
                        name="transport_vehicle_id"
                        rules={[
                          {
                            required: true,
                            message: "Silahkan pilih transportasi!",
                          },
                        ]}
                      >
                        <Select
                          placeholder="Pilih Transportasi"
                          optionFilterProp="label"
                          options={transportations.map(
                            (s: ITransportationList) => ({
                              value: s.id,
                              label: s.driver_name,
                            })
                          )}
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
                            message: "Silahkan pilih tanggal jatuh tempo!",
                          },
                        ]}
                      >
                        <DatePicker
                          style={{ width: "100%" }}
                          format="DD-MM-YYYY"
                          onChange={handleDueDateChange}
                        />
                      </Form.Item>
                    </Col>

                    <Col span={6}>
                      <Form.Item<ISalesForm> label="Hari" name="due_days">
                        <InputNumber style={{ width: "100%" }} />
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
                        return Promise.reject(new Error("Minimal 1 Item"));
                      }
                    },
                  },
                ]}
              >
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }, index) => (
                      <Row
                        gutter={16}
                        key={key}
                        className="border rounded p-2 mb-2 lg:border-0 lg:p-0 lg:mb-0"
                      >
                        <Col xs={{ span: 24 }} lg={{ span: 10 }}>
                          <Form.Item
                            label={"Kode Item"}
                            {...restField}
                            name={[name, "item_id"]}
                            labelCol={{
                              className:
                                index === 0 ? "block" : "lg:hidden block",
                            }}
                            rules={[
                              {
                                required: true,
                                message: "Silahkan pilih item!",
                              },
                            ]}
                          >
                            <Select
                              showSearch
                              placeholder="Pilih Item"
                              optionFilterProp="label"
                              options={itemList.map((s: IItemList) => ({
                                value: s.id,
                                label: s.item_name,
                                disabled: s.disabled,
                                // purchaseNumber: s.purchaseNumber,
                              }))}
                              optionRender={(option) => (
                                <Space>
                                  <span
                                    role="img"
                                    aria-label={option.data.label}
                                  >
                                    {option.data.label}
                                  </span>
                                  ({option.data.value})
                                </Space>
                              )}
                              onChange={(value: number) =>
                                selectItem(index, value)
                              }
                            />
                          </Form.Item>
                        </Col>

                        <Col xs={{ span: 12 }} lg={{ span: 4 }}>
                          <Form.Item
                            label={"Jumlah Item"}
                            name={[name, "quantity"]}
                            labelCol={{
                              className:
                                index === 0 ? "block" : "lg:hidden block",
                            }}
                            rules={[
                              {
                                required: true,
                                message: "Silahkan masukan jumlah item!",
                              },
                            ]}
                          >
                            <InputNumber
                              style={{ width: "100%" }}
                              addonAfter="unit"
                              onChange={() => calculateSubstotal(index)}
                            />
                          </Form.Item>
                        </Col>

                        <Col xs={{ span: 12 }} lg={{ span: 4 }}>
                          <Form.Item
                            label={"Harga Satuan"}
                            name={[name, "price_per_unit"]}
                            labelCol={{
                              className:
                                index === 0 ? "block" : "lg:hidden block",
                            }}
                            rules={[
                              {
                                required: true,
                                message: "Silahkan masukan harga satuan!",
                              },
                            ]}
                          >
                            <InputNumber
                              style={{ width: "100%" }}
                              addonBefore="Rp"
                              onChange={() => calculateSubstotal(index)}
                            />
                          </Form.Item>
                        </Col>

                        <Col xs={{ span: 23 }} lg={{ span: 5 }}>
                          <Form.Item
                            label={"Substotal"}
                            name={[name, "price_total"]}
                            labelCol={{
                              className:
                                index === 0 ? "block" : "lg:hidden block",
                            }}
                          >
                            <InputNumber
                              readOnly
                              style={{ width: "100%" }}
                              addonBefore="Rp"
                            />
                          </Form.Item>
                        </Col>

                        {fields.length > 1 ? (
                          <Col
                            xs={{ span: 2 }}
                            lg={{ span: 1 }}
                            className={index === 0 ? "mt-9" : "mt-8 lg:mt-1"}
                          >
                            <MinusCircleOutlined
                              onClick={() => {
                                remove(index);
                                calculateTotalAmount();
                                renewItemList();
                              }}
                            />
                          </Col>
                        ) : null}
                      </Row>
                    ))}

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

                      {form.getFieldValue("invoice_items").length <
                        itemList.length && (
                        <Form.Item label={null}>
                          <Button
                            type="default"
                            variant="outlined"
                            htmlType="button"
                            onClick={() => {
                              renewItemList();
                              add({
                                item_id: "",
                                quantity: 0,
                                price_per_unit: 0,
                                price_total: 0,
                              });
                            }}
                          >
                            Tambah Item
                          </Button>
                        </Form.Item>
                      )}

                      {checkPermission("sales.update") && (
                        <Form.Item label={null}>
                          <Button type="primary" htmlType="submit">
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
  );
};

export default SalesForm;
