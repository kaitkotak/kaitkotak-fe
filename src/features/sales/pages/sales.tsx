import {
  FileAddOutlined,
  EditOutlined,
  DeleteOutlined,
  FileExcelOutlined,
} from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Flex,
  Form,
  FormProps,
  Modal,
  Space,
  Spin,
  Table,
  TableColumnsType,
  TableProps,
  theme,
  Tooltip,
} from "antd";
import { Content } from "antd/es/layout/layout";
import { useContext, useEffect, useState } from "react";
import { BreadcrumbContext } from "../../../context/breadcrumb";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import Search from "antd/es/input/Search";
import id from "antd/es/date-picker/locale/id_ID";
import { parseDateDDMMYYYY } from "../../../libs/dateParser";
import UseGetSales from "../hooks/useGetSales";
import useDeleteSales from "../hooks/useDeleteSales";

const Sales = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [sales, setSales] = useState<ISales[]>([]);
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
  const { data, isLoading } = UseGetSales(paginationParams);
  const { setBreadcrumb } = useContext(BreadcrumbContext);
  const navigate = useNavigate();
  const [isOpenConfirmationModal, setIsOpenConfirmationModal] =
    useState<boolean>(false);
  const [selectedRowId, setSelectedRowId] = useState<number>(0);
  const { mutateAsync: deleteAction } = useDeleteSales();
  const idLocale: typeof id = {
    ...id,
    lang: {
      ...id.lang,
      fieldDateFormat: "YYYY-MM-DD",
      fieldDateTimeFormat: "YYYY-MM-DD HH:mm:ss",
      yearFormat: "YYYY",
      cellYearFormat: "YYYY",
    },
  };
  const { RangePicker } = DatePicker;
  const [isOpenFormModal, setIsOpenFormModal] = useState<boolean>(false);
  const [form] = Form.useForm();

  useEffect(() => {
    setBreadcrumb([
      {
        title: "Penjualan",
      },
    ]);
  }, []);

  useEffect(() => {
    setSales(() => {
      return data?.data.data.map((purchaseOrder: ISales) => {
        let date = new Date(purchaseOrder.invoice_date);
        return {
          ...purchaseOrder,
          invoice_date: format(date, "dd/MM/yyyy"),
        };
      });
    });

    setTableParams({
      pagination: {
        ...tableParams.pagination,
        total: data?.data.meta.total,
      },
    });
  }, [data]);

  const columns: TableColumnsType<ISales> = [
    { title: "No Invoice", dataIndex: "order_number" },
    { title: "No PO", dataIndex: "purchase_order_no" },
    { title: "Tanggal", dataIndex: "invoice_date" },
    { title: "Pelanggan", dataIndex: "customer_name" },
    { title: "Sales", dataIndex: "sales_rep_name" },
    {
      dataIndex: "action",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Edit">
            <EditOutlined
              className="cursor-pointer"
              onClick={() => goToForm("edit", record.id)}
            />
          </Tooltip>

          <Tooltip title="Hapus">
            <DeleteOutlined
              className="cursor-pointer"
              onClick={() => openDeleteConfirmation(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const handleTableChange: TableProps<ISales>["onChange"] = (pagination) => {
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

  const openDeleteConfirmation = (id: number) => {
    setIsOpenConfirmationModal(true);
    setSelectedRowId(id);
  };

  const handleOk = () => {
    deleteAction({ id: selectedRowId });
    setIsOpenConfirmationModal(false);
  };

  const handleDateFilter = (_: any, dateStrings: string[]) => {
    if (dateStrings[0] !== "" && dateStrings[1] !== "") {
      setPaginationParams((prevVal) => ({
        ...prevVal,
        date_from: format(
          new Date(parseDateDDMMYYYY(dateStrings[0])),
          "yyyy-MM-dd"
        ),
        date_to: format(
          new Date(parseDateDDMMYYYY(dateStrings[1])),
          "yyyy-MM-dd"
        ),
      }));
    } else {
      setPaginationParams((prevVal) => ({
        ...prevVal,
        date_from: "",
        date_to: "",
      }));
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setIsOpenFormModal(false);
  };

  const submit: FormProps<any>["onFinish"] = (values) => {
    console.log(values);
  };

  return (
    <Spin spinning={isLoading}>
      <Content
        style={{
          margin: "24px 16px",
          padding: 24,
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}
      >
        <div className="flex justify-between flex-col md:flex-row gap-2 md:gap-0">
          <div className="flex gap-2 flex-col sm:flex-row">
            <Search
              placeholder="Pencarian..."
              onSearch={handleSearch}
              // style={{ width: "100%", maxWidth: 150 }}
              className="w-full md:w-[150px]"
            />

            <RangePicker
              locale={idLocale}
              format={"DD/MM/YYYY"}
              className="w-full md:w-auto"
              onChange={handleDateFilter}
            />
          </div>

          <div className="flex gap-2">
            <Button
              color="primary"
              variant="solid"
              icon={<FileExcelOutlined />}
              onClick={() => {
                setIsOpenFormModal(true);
              }}
            >
              <span className="hidden sm:inline md:hidden lg:inline">
                Download Laporan
              </span>
            </Button>

            <Button
              color="primary"
              variant="solid"
              icon={<FileAddOutlined />}
              onClick={() => {
                goToForm("create");
              }}
            >
              <span className="hidden sm:inline md:hidden lg:inline">
                Tambah Penjualan
              </span>
            </Button>
          </div>
        </div>
        <Table
          className="mt-8"
          dataSource={sales}
          columns={columns}
          // loading={isLoading}
          pagination={tableParams.pagination}
          scroll={{ x: "max-content" }}
          onChange={handleTableChange}
        />
      </Content>

      <Modal
        title="Hapus Data Purchase Order"
        open={isOpenConfirmationModal}
        onOk={handleOk}
        onCancel={() => setIsOpenConfirmationModal(false)}
        okText="Hapus"
        cancelText="Batal"
      >
        <p>Anda yakin ingin menghapus data ini?</p>
      </Modal>

      <Modal
        title="Pilih Tanggal Laporan"
        open={isOpenFormModal}
        onCancel={handleCancel}
        okText="Simpan"
        cancelText="Batal"
        footer={null}
      >
        <Form
          form={form}
          autoComplete="off"
          layout="vertical"
          onFinish={submit}
          className="!mt-4"
        >
          <Form.Item<any>
            name="production_date"
            rules={[
              { required: true, message: "Silahkan masukan tanggal produksi" },
            ]}
          >
            <RangePicker style={{ width: "100%" }} format="DD-MM-YYYY" />
          </Form.Item>

          <Flex gap="middle" justify="end">
            <Form.Item label={null}>
              <Button type="primary" htmlType="submit">
                Download
              </Button>
            </Form.Item>
          </Flex>
        </Form>
      </Modal>
    </Spin>
  );
};

export default Sales;
