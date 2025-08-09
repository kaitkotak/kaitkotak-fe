import {
  FileAddOutlined,
  EditOutlined,
  FileExcelOutlined,
  HddOutlined,
} from "@ant-design/icons";
import {
  Button,
  Flex,
  Form,
  FormProps,
  InputNumber,
  Modal,
  Space,
  Spin,
  Table,
  TableColumnsType,
  TableProps,
  theme,
  Tooltip,
} from "antd";
import Search from "antd/es/input/Search";
import { Content } from "antd/es/layout/layout";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UseGetItems from "../hooks/useGetItems";
import { BreadcrumbContext } from "../../../../context/breadcrumb";
import { useCheckPermission } from "../../../../hooks/useCheckPermission";
import UseGetItemList from "../hooks/useGetItemList";
import useOpnameItem from "../hooks/useOpnameItem";
import {formatCurrency} from "../../../../libs/formatCurrency.ts";

const Item = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [items, setItems] = useState<IItem[]>([]);
  const [tableParams, setTableParams] = useState<ITableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });
  const [paginationParams, setPaginationParams] =
    useState<ICustomTablePaginationConfig>({
      page: tableParams.pagination.current,
      limit: tableParams.pagination.pageSize,
    });
  const { data, isLoading } = UseGetItems(paginationParams);
  const navigate = useNavigate();
  const { setBreadcrumb } = useContext(BreadcrumbContext);
  const checkPermission = useCheckPermission();
  const [isOpenOpnameModal, setIsOpenOpnameModal] = useState<boolean>(false);
  const [form] = Form.useForm();
  const { data: itemListResponse } = UseGetItemList();
  const {
    mutateAsync: opnameItem,
    isSuccess: isOpnameItemSuccess,
    isPending: isOpnameItemPending,
  } = useOpnameItem();

  useEffect(() => {
    setBreadcrumb([
      {
        title: "Data Master",
      },
      {
        title: "Item",
      },
    ]);

    localStorage.setItem("isForm", 'false');
  }, []);

  useEffect(() => {
    setItems(data?.data.data);
    setTableParams({
      pagination: {
        ...tableParams.pagination,
        total: data?.data.meta.total,
      },
    });
  }, [data]);

  useEffect(() => {
    if (itemListResponse) {
      form.setFieldValue("items", itemListResponse.data.data);
    }
  }, [itemListResponse]);

  useEffect(() => {
    if (isOpnameItemSuccess) {
      setIsOpenOpnameModal(false);
    }
  }, [isOpnameItemSuccess]);

  const columns: TableColumnsType<IItem> = [
    { title: "Nama", dataIndex: "item_name" },
    { title: "Kode", dataIndex: "item_code" },
    { title: "Berat (gr)", dataIndex: "weight_g", render: (_, record) => formatCurrency(record.weight_g, false) },
    { title: "Stok", dataIndex: "stock", render: (_, record) => formatCurrency(record.stock, false)},
    { title: "Harga Jual", dataIndex: "price_per_unit", render: (_, record) => formatCurrency(record.price_per_unit) },
    { title: "Harga Produksi", dataIndex: "cost_per_unit", render: (_, record) => formatCurrency(record.cost_per_unit) },
    { title: "Tipe", dataIndex: "type" },
    { title: "Kode Pelanggan", dataIndex: "customer_code" },
    {
      dataIndex: "action",
      render: (_, record) => (
        <Space size="middle">
          {checkPermission("master_item.update") && (
            <Tooltip title="Edit">
              <EditOutlined
                className="cursor-pointer"
                onClick={() => goToForm("edit", record.id)}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  const handleTableChange: TableProps<IItem>["onChange"] = (pagination) => {
    setTableParams({
      pagination,
    });

    setPaginationParams((prevVal) => ({
      ...prevVal,
      page: pagination.current ?? 1,
      limit: pagination.pageSize ?? 10,
    }));
  };

  const handleSearch = (keyword: string) => {
    setPaginationParams((val: ICustomTablePaginationConfig) => ({
      ...val,
      filter: keyword,
    }));
  };

  const goToForm = (mode: string, id?: number) => {
    const path: string = mode === "create" ? "create" : `edit/${id}`;
    navigate(path);
  };

  const downloadReport = () => {
    window.open(
      `${import.meta.env.VITE_API_URL}/master/items/download/report`,
      "_blank"
    );
  };

  const handleCancel = () => {
    setIsOpenOpnameModal(false);
  };

  const opnameStock: FormProps<IItemOpnameForm>["onFinish"] = (values) => {
    const payload: IItemOpnamePayload[] = values.items.map(
      (value: IItemList) => ({
        item_id: value.id,
        stock: value.stock,
      })
    );

    opnameItem(payload);
  };

  return (
    <>
      <Spin spinning={isOpnameItemPending}>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <div className="flex justify-between">
            <Search
              placeholder="Pencarian..."
              onSearch={handleSearch}
              style={{ width: "100%", maxWidth: 150 }}
            />

            <div className="flex gap-2">
              <Button
                color="primary"
                variant="solid"
                icon={<FileExcelOutlined />}
                onClick={() => downloadReport()}
              >
                <span className="hidden md:inline">Download Laporan</span>
              </Button>

              <Button
                color="primary"
                variant="solid"
                icon={<HddOutlined />}
                onClick={() => setIsOpenOpnameModal(true)}
              >
                <span className="hidden md:inline">Stok Opname</span>
              </Button>

              {checkPermission("master_item.create") && (
                <Button
                  color="primary"
                  variant="solid"
                  icon={<FileAddOutlined />}
                  onClick={() => goToForm("create")}
                >
                  <span className="hidden md:inline">Tambah Item</span>
                </Button>
              )}
            </div>
          </div>
          <Table
            className="mt-8"
            dataSource={items}
            columns={columns}
            loading={isLoading}
            pagination={tableParams.pagination}
            rowKey={"id"}
            scroll={{ x: "max-content" }}
            onChange={handleTableChange}
          />

          <Modal
            title="Opname Item Stok"
            open={isOpenOpnameModal}
            onCancel={handleCancel}
            okText="Simpan"
            cancelText="Batal"
            footer={null}
          >
            <Form
              form={form}
              autoComplete="off"
              onFinish={opnameStock}
              className="!mt-4"
            >
              <Form.List name="items">
                {(fields) => (
                  <>
                    {fields.map(({ key, name }) => (
                      <Form.Item<any>
                        name={[name, "stock"]}
                        label={form.getFieldValue(["items", name, "item_name"])}
                        key={key}
                        rules={[
                          {
                            required: true,
                            message: "Silahkan masukan stok",
                          },
                        ]}
                      >
                        <InputNumber className="w-full" />
                      </Form.Item>
                    ))}
                  </>
                )}
              </Form.List>

              <Flex gap="middle" justify="end">
                <Form.Item label={null}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    disabled={isOpnameItemPending}
                  >
                    Simpan
                  </Button>
                </Form.Item>
              </Flex>
            </Form>
          </Modal>
        </Content>
      </Spin>
    </>
  );
};

export default Item;
