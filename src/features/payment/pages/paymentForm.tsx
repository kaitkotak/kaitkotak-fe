import {
  Button,
  Col,
  DatePicker,
  Flex,
  Form,
  FormProps,
  InputNumber,
  Row,
  Select,
  Spin,
  theme,
} from "antd";
import { Content } from "antd/es/layout/layout";
import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { BreadcrumbContext } from "../../../context/breadcrumb";
import { MinusCircleOutlined } from "@ant-design/icons";
import UseGetCustomerList from "../../master-data/customer/hooks/useGetCustomerList";
import dayjs from "dayjs";
import { useCheckPermission } from "../../../hooks/useCheckPermission";
import useCreatePayment from "../hooks/useCreatePayment";
import useUpdatePayment from "../hooks/useUpdatePayment";
import UseGetPayment from "../hooks/useGetPayment";
import UseGetPaymentInvoices from "../hooks/useGetPaymentInvoices";
import UseGetAllPaymentInvoices from "../hooks/useGetAllPaymentInvoices";

const PaymentForm = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const { mutateAsync: create, isPending: isPendingCreate } =
    useCreatePayment();
  const { mutateAsync: update, isPending: isPendingUpdate } =
    useUpdatePayment();
  const navigate = useNavigate();
  const params = useParams();
  const { data, isLoading } = UseGetPayment(params.id ?? "");
  const [form] = Form.useForm();
  const { setBreadcrumb } = useContext(BreadcrumbContext);
  const { data: customerListResponse } = UseGetCustomerList({payment: true});
  const [customerList, setCustomerList] = useState<ICustomerList[]>([]);
  const [invoicesList, setInvoiceList] = useState<IPaymentInvoiceList[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const checkPermission = useCheckPermission();
  const {
    mutateAsync: getPaymentInvoices,
    isPending: isGetPaymentInvoicesPending,
    isSuccess: isGetPaymentInvoicesSuccess,
    data: paymentInvoicesResponse,
  } = UseGetPaymentInvoices();
  const {
    mutateAsync: getAllPaymentInvoices,
    isPending: isAllGetPaymentInvoicesPending,
    isSuccess: isAllGetPaymentInvoicesSuccess,
    data: allPaymentInvoicesResponse,
  } = UseGetAllPaymentInvoices();

  useEffect(() => {
    setBreadcrumb([
      {
        title: "Pembayaran",
      },
      {
        title: params.id ? "Edit Pembayaran" : "Tambah Pembayaran",
      },
    ]);
  }, []);

  useEffect(() => {
    if (data) {
      if (params.id) {
        getAllPaymentInvoices(data?.data.data.customer_id);
        getPaymentInvoices(data?.data.data.customer_id);
        form.setFieldsValue({
          ...data?.data.data,
          created_at: dayjs(data?.data.data.created_at),
          payment_items: data?.data.data.invoice_items,
        });

        setSelectedCustomer(data?.data.data.customer_id);
      }
    }
  }, [data]);

  useEffect(() => {
    if (customerListResponse) {
      setCustomerList(customerListResponse.data.data);
    }
  }, [customerListResponse]);

  useEffect(() => {
    if (!params.id && isGetPaymentInvoicesSuccess) {
      form.setFieldsValue({
        payment_items: paymentInvoicesResponse.data.data.map(
          (selected: IPaymentInvoiceList) => ({
            ...selected,
            invoice_id: selected.id,
          })
        ),
      });
    }
  }, [isGetPaymentInvoicesSuccess]);

  useEffect(() => {
    if (isAllGetPaymentInvoicesSuccess && allPaymentInvoicesResponse) {
      setInvoiceList(
        allPaymentInvoicesResponse.data.data.map(
          (response: IPaymentInvoiceList) => ({
            ...response,
            invoice_id: response.id,
            disabled: params.id
              ? form
                  .getFieldValue("payment_items")
                  .some(
                    (selectedInvoice: IPaymentInvoiceList) =>
                      Number(selectedInvoice.invoice_id) === response.id
                  )
              : true,
          })
        )
      );
    }
  }, [isAllGetPaymentInvoicesSuccess]);

  const submit: FormProps<IPaymentForm>["onFinish"] = (values) => {
    const payload: IPaymentFormPayload = {
      customer_id: values.customer_id,
      payment_items: values.payment_items.map((paymentitem: any) => ({
        invoice_id: paymentitem.invoice_id,
        amount: paymentitem.amount,
      })),
    };

    if (params.id) {
      update({ payload, id: params.id });
    } else {
      create(payload);
    }
  };

  const back = () => {
    navigate("/payment");
  };

  const calculateTotalAmount = () => {
    let totalAmount: number = 0;
    form.getFieldValue("payment_items").forEach((element: any) => {
      totalAmount += element.amount ?? 0;
    });
    form.setFieldValue("total_amount", totalAmount);
  };

  const selectInvoice = (idx: number, value: number) => {
    const selectedInvoice: IPaymentInvoiceList = invoicesList.filter(
      (item: IPaymentInvoiceList) => item.id === value
    )[0];

    form.setFieldValue(
      [`payment_items`, idx, "amount_due"],
      selectedInvoice.amount_due
    );
    form.setFieldValue([`payment_items`, idx, "amount"], 0);

    calculateTotalAmount();
    renewInvoiceList();
  };

  const handleCustomerChange = (val: string) => {
    getPaymentInvoices(val);
    getAllPaymentInvoices(val);
    setSelectedCustomer(val);
    calculateTotalAmount();
  };

  const renewInvoiceList = () => {
    let newItemList: IPaymentInvoiceList[] = invoicesList.map(
      (item: IPaymentInvoiceList) => ({
        ...item,
        disabled: form
          .getFieldValue("payment_items")
          .some(
            (selectedInvoice: IPaymentInvoiceList) =>
              Number(selectedInvoice.invoice_id) === item.id
          ),
      })
    );
    setInvoiceList(newItemList);
  };

  return (
    <Spin
      spinning={
        isLoading ||
        isPendingCreate ||
        isPendingUpdate ||
        isGetPaymentInvoicesPending ||
        isAllGetPaymentInvoicesPending
      }
    >
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
          onFinish={submit}
          initialValues={{
            payment_items: [{ invoice_id: "", amount_due: 0, amount: 0 }],
          }}
        >
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item<IPaymentForm>
                label="Nama Pelanggan"
                name="customer_id"
              >
                <Select
                  placeholder="Pilih Pelanggan"
                  optionFilterProp="label"
                  options={customerList.map((s: ICustomerList) => ({
                    value: s.id,
                    label: s.full_name,
                  }))}
                  disabled={params.id ? true : false}
                  onChange={handleCustomerChange}
                />
              </Form.Item>
            </Col>
          </Row>

          {selectedCustomer && (
            <>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item<IPaymentForm>
                    label="Tanggal"
                    name="created_at"
                    rules={[
                      {
                        required: true,
                        message: "Silahkan pilih tanggal pembayaran!",
                      },
                    ]}
                  >
                    <DatePicker style={{ width: "100%" }} format="DD-MM-YYYY" />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item<IPaymentForm>
                    label="Total Harga"
                    name="total_amount"
                  >
                    <InputNumber
                      style={{ width: "100%" }}
                      addonBefore="Rp"
                      readOnly
                    />
                  </Form.Item>
                </Col>
              </Row>

              <h2 className="text-lg font-bold mb-3">Invoice</h2>

              <Form.List
                name="payment_items"
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
                            label={"No Invoice"}
                            {...restField}
                            name={[name, "invoice_id"]}
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
                              options={invoicesList.map(
                                (s: IPaymentInvoiceList) => ({
                                  value: s.id,
                                  label: s.invoice_number,
                                  disabled: s.disabled,
                                })
                              )}
                              onChange={(value: string) =>
                                selectInvoice(index, Number(value))
                              }
                            />
                          </Form.Item>
                        </Col>

                        <Col xs={{ span: 12 }} lg={{ span: 6 }}>
                          <Form.Item
                            label={"Sisa Tagihan"}
                            name={[name, "amount_due"]}
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
                              readOnly
                            />
                          </Form.Item>
                        </Col>

                        <Col xs={{ span: 23 }} lg={{ span: 6 }}>
                          <Form.Item
                            label={"Pembayaran"}
                            name={[name, "amount"]}
                            labelCol={{
                              className:
                                index === 0 ? "block" : "lg:hidden block",
                            }}
                          >
                            <InputNumber
                              style={{ width: "100%" }}
                              addonBefore="Rp"
                              max={form.getFieldValue([
                                `payment_items`,
                                index,
                                "amount_due",
                              ])}
                              onChange={calculateTotalAmount}
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
                                renewInvoiceList();
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

                      {form.getFieldValue("payment_items").length <
                        invoicesList.length && (
                        <Form.Item label={null}>
                          <Button
                            type="default"
                            variant="outlined"
                            htmlType="button"
                            onClick={() => {
                              renewInvoiceList();
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

                      {checkPermission("payment.update") && (
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

export default PaymentForm;
