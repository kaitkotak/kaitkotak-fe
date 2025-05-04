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
} from "antd";
import { Content } from "antd/es/layout/layout";
import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import useCreatePurchaseOrder from "../hooks/useCreatePurchaseOrder";
import useUpdatePurchaseOrder from "../hooks/useUpdatePurchaseOrder";
import UseGetPurchaseOrder from "../hooks/useGetPurchaseOrder";
import { BreadcrumbContext } from "../../../context/breadcrumb";
import { MinusCircleOutlined } from "@ant-design/icons";
import UseGetCustomerList from "../../master-data/customer/hooks/useGetCustomerList";
import dayjs from "dayjs";
import UseGetItemList from "../../master-data/item/hooks/useGetItemList";
import { checkPermission } from "../../../libs/checkPermission";

const PurchaseOrderForm = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const { mutateAsync: create, isPending: isPendingCreate } =
    useCreatePurchaseOrder();
  const { mutateAsync: update, isPending: isPendingUpdate } =
    useUpdatePurchaseOrder();
  const navigate = useNavigate();
  const params = useParams();
  const { data, isLoading } = UseGetPurchaseOrder({
    id: params.id ?? "",
  });
  const [form] = Form.useForm();
  const { setBreadcrumb } = useContext(BreadcrumbContext);
  const { data: customerListResponse } = UseGetCustomerList();
  const [customerList, setCustomerList] = useState<ICustomerList[]>([]);
  const { data: itemListResponse } = UseGetItemList();
  const [itemList, setItemList] = useState<IItemList[]>([]);

  useEffect(() => {
    setBreadcrumb([
      {
        title: "Purchase Order",
      },
      {
        title: params.id ? "Edit Purchase Order" : "Tambah Purchase Order",
      },
    ]);
  }, []);

  useEffect(() => {
    if (params.id) {
      form.setFieldsValue(data?.data.data);
      form.setFieldValue("order_date", dayjs(data?.data.data.order_date));
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
    }
  }, [itemListResponse]);

  const submit: FormProps<IPurchaseOrderForm>["onFinish"] = (values) => {
    values.purchase_order_items = values.purchase_order_items.map(
      (item: IPurchaseOrderItems) => ({
        ...item,
        quantity: item.remaining_quantity,
      })
    );

    if (params.id) {
      update({ ...values, id: params.id });
    } else {
      create(values);
    }
  };

  const back = () => {
    navigate("/purchase-order");
  };

  const calculateSubstotal = (idx: number) => {
    const qty: number =
      form.getFieldValue([`purchase_order_items`, idx, "remaining_quantity"]) ??
      0;
    const pricePerUnit: number =
      form.getFieldValue([`purchase_order_items`, idx, "price_per_unit"]) ?? 0;

    form.setFieldValue(
      [`purchase_order_items`, idx, "price_total"],
      qty * pricePerUnit
    );

    calculateTotalAmount();
  };

  const calculateTotalAmount = () => {
    let totalAmount: number = 0;
    form.getFieldValue("purchase_order_items").forEach((element: any) => {
      totalAmount += element.price_total;
    });
    form.setFieldValue("price_total", totalAmount);
  };

  const selectItem = (idx: number, value: number) => {
    const selectedItem: IItemList = itemList.filter(
      (item: IItemList) => item.id === value
    )[0];

    form.setFieldValue(
      [`purchase_order_items`, idx, "price_per_unit"],
      Number(selectedItem.price_per_unit)
    );
    form.setFieldValue([`invoice_items`, idx, "remaining_quantity"], 0);

    calculateSubstotal(idx);
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
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            purchase_order_items: [
              {
                item_id: "",
                remaining_quantity: 0,
                price_per_unit: 0,
                price_total: 0,
              },
            ],
          }}
          onFinish={submit}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item<IPurchaseOrderForm>
                label="Tanggal"
                name="order_date"
                rules={[
                  { required: true, message: "Silahkan masukan kode item!" },
                ]}
              >
                <DatePicker style={{ width: "100%" }} format="DD-MM-YYYY" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item<IPurchaseOrderForm>
                label="No Purchase Order"
                name="order_number"
                rules={[{ required: true, message: "Silahkan masukan berat!" }]}
              >
                <Input style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item<IPurchaseOrderForm>
                label="Nama Pelanggan"
                name="customer_id"
                rules={[
                  { required: true, message: "Silahkan masukan kode item!" },
                ]}
              >
                <Select
                  showSearch
                  placeholder="Pilih Pelanggan"
                  optionFilterProp="label"
                  options={customerList.map((s: ICustomerList) => ({
                    value: s.id,
                    label: s.full_name,
                  }))}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item<IPurchaseOrderForm>
                    label="Tax"
                    name="tax"
                    rules={[
                      { required: true, message: "Silahkan masukan berat!" },
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
                  <Form.Item<IPurchaseOrderForm>
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

          <h2 className="text-lg font-bold mb-3">Items</h2>

          <Form.List
            name="purchase_order_items"
            rules={[
              {
                validator: async (_, names) => {
                  if (!names || names.length < 1) {
                    return Promise.reject(new Error("At least 1 Item"));
                  }
                },
              },
            ]}
          >
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }, index) => (
                  <Row gutter={16}>
                    <Col xs={{ span: 24 }} lg={{ span: 10 }}>
                      <Form.Item
                        label={index === 0 ? "Kode Item" : ""}
                        {...restField}
                        name={[name, "item_id"]}
                        rules={[
                          {
                            required: true,
                            message: "Silahkan masukan kode item!",
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
                          }))}
                          onChange={(value: number) => selectItem(index, value)}
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={{ span: 12 }} lg={{ span: 4 }}>
                      <Form.Item
                        label={index === 0 ? "Jumlah Item" : ""}
                        name={[name, "remaining_quantity"]}
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
                        label={index === 0 ? "Harga Satuan" : ""}
                        name={[name, "price_per_unit"]}
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
                        label={index === 0 ? "Substotal" : ""}
                        name={[name, "price_total"]}
                      >
                        <InputNumber
                          readOnly
                          style={{ width: "100%" }}
                          addonBefore="Rp"
                        />
                      </Form.Item>
                    </Col>

                    {fields.length > 1 ? (
                      <Col span={1}>
                        <MinusCircleOutlined
                          className="dynamic-delete-button"
                          style={index === 0 ? { marginTop: "35px" } : {}}
                          onClick={() => {
                            remove(index);
                            calculateTotalAmount();
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

                  {checkPermission("purchase_order.update") && (
                    <Form.Item label={null}>
                      <Button
                        type="default"
                        variant="outlined"
                        htmlType="button"
                        onClick={() => add()}
                      >
                        Tambah Item
                      </Button>
                    </Form.Item>
                  )}

                  {checkPermission("purchase_order.update") && (
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
        </Form>
      </Content>
    </Spin>
  );
};

export default PurchaseOrderForm;
