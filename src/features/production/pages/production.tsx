import {
  FileAddOutlined,
  EditOutlined,
  DeleteOutlined,
  BookOutlined,
  FileExcelOutlined,
} from "@ant-design/icons";
import {
  Button,
  DatePicker,
  DatePickerProps,
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
import id from "antd/es/date-picker/locale/id_ID";
import UseGetProductions from "../hooks/useGetProductions";
import { useNavigate } from "react-router-dom";
import { parseDateDDMMYYYY } from "../../../libs/dateParser";
import useDeleteProduction from "../hooks/useDeleteProduction";
import { useCheckPermission } from "../../../hooks/useCheckPermission";
import { Dayjs } from "dayjs";

interface IData {
  id: number;
  production_date: string;
  total_quantity: number;
}

const Production = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [rawMaterials, setRawMaterials] = useState<IData[]>([]);
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
  const { data, isLoading } = UseGetProductions(paginationParams);
  const [isOpenFormModal, setIsOpenFormModal] = useState<boolean>(false);
  const [isOpenDownloadFormModal, setIsOpenDownloadFormModal] =
    useState<boolean>(false);
  const { setBreadcrumb } = useContext(BreadcrumbContext);
  const [form] = Form.useForm();
  const { RangePicker } = DatePicker;
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
  const navigate = useNavigate();
  const [isOpenConfirmationModal, setIsOpenConfirmationModal] =
    useState<boolean>(false);
  const [selectedRowId, setSelectedRowId] = useState<number>(0);
  const { mutateAsync: deleteAction } = useDeleteProduction();
  const checkPermission = useCheckPermission();

  useEffect(() => {
    setBreadcrumb([
      {
        title: "Produksi",
      },
    ]);
  }, []);

  useEffect(() => {
    setRawMaterials(() => {
      return data?.data.data.map((rawMaterial: IData) => {
        let date = new Date(rawMaterial.production_date);
        return {
          ...rawMaterial,
          production_date: format(date, "dd/MM/yyyy"),
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

  const columns: TableColumnsType<IData> = [
    { title: "Tanggal", dataIndex: "production_date" },
    { title: "Jumlah", dataIndex: "total_quantity" },
    {
      dataIndex: "action",
      render: (_, record) => (
        <Space size="middle">
          {checkPermission("production.update") && (
            <Tooltip title="Edit">
              <EditOutlined
                className="cursor-pointer"
                onClick={() => goToForm(record.id)}
              />
            </Tooltip>
          )}

          {checkPermission("production.delete") && (
            <Tooltip title="Hapus">
              <DeleteOutlined
                className="cursor-pointer"
                onClick={() => openDeleteConfirmation(record.id)}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  const handleTableChange: TableProps<IData>["onChange"] = (pagination) => {
    setTableParams({
      pagination,
    });

    setPaginationParams((prevVal) => ({
      ...prevVal,
      page: pagination.current ?? 1,
      limit: pagination.pageSize ?? 10,
    }));
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

  const submit: FormProps<any>["onFinish"] = (values) => {
    localStorage.setItem("productionDate", values["production_date"]["$d"]);
    navigate("create");
  };

  const handleCancel = () => {
    form.resetFields();
    setIsOpenFormModal(false);
  };

  const goToForm = (id?: number) => {
    navigate(`edit/${id}`);
  };

  const openDeleteConfirmation = (id: number) => {
    setIsOpenConfirmationModal(true);
    setSelectedRowId(id);
  };

  const handleOk = () => {
    deleteAction({ id: selectedRowId });
    setIsOpenConfirmationModal(false);
  };

  const downloadReport: FormProps<any>["onFinish"] = (values) => {
    window.open(
      `${
        import.meta.env.VITE_API_URL
      }/production/download/report?date_from=${values.production_report_date[0].format(
        "YYYY-MM-DD"
      )}&date_to=${values.production_report_date[1].format("YYYY-MM-DD")}`,
      "_blank"
    );
    setIsOpenDownloadFormModal(false);
  };

  const getYearMonth = (date: Dayjs) => date.year() * 12 + date.month();

  const disabled31DaysDate: DatePickerProps["disabledDate"] = (
    current,
    { from, type }
  ) => {
    if (from) {
      const minDate = from.add(-30, "days");
      const maxDate = from.add(30, "days");

      switch (type) {
        case "year":
          return (
            current.year() < minDate.year() || current.year() > maxDate.year()
          );

        case "month":
          return (
            getYearMonth(current) < getYearMonth(minDate) ||
            getYearMonth(current) > getYearMonth(maxDate)
          );

        default:
          return Math.abs(current.diff(from, "days")) >= 31;
      }
    }

    return false;
  };

  return (
    <Spin spinning={false}>
      <Content
        style={{
          margin: "24px 16px",
          padding: 24,
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}
      >
        <div className="flex justify-between">
          <RangePicker
            locale={idLocale}
            format={"DD/MM/YYYY"}
            className="w-[12.5rem] md:w-auto"
            onChange={handleDateFilter}
          />

          <div className="flex gap-2">
            <Button
              color="primary"
              variant="solid"
              icon={<FileExcelOutlined />}
              onClick={() => {
                setIsOpenDownloadFormModal(true);
              }}
            >
              <span className="hidden md:inline">Download Laporan</span>
            </Button>

            <Button
              color="primary"
              variant="solid"
              icon={<BookOutlined />}
              onClick={() => {
                navigate("plan");
              }}
            >
              <span className="hidden md:inline">Rencana Produksi</span>
            </Button>

            {checkPermission("production.create") && (
              <Button
                color="primary"
                variant="solid"
                icon={<FileAddOutlined />}
                onClick={() => {
                  setIsOpenFormModal(true);
                }}
              >
                <span className="hidden md:inline">Tambah Produksi</span>
              </Button>
            )}
          </div>
        </div>
        <Table
          className="mt-8"
          dataSource={rawMaterials}
          columns={columns}
          loading={isLoading}
          pagination={tableParams.pagination}
          rowKey="id"
          scroll={{ x: "max-content" }}
          onChange={handleTableChange}
        />
      </Content>

      <Modal
        title="Pilih Tanggal Produksi"
        open={isOpenFormModal}
        // onOk={submit}
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
            <DatePicker style={{ width: "100%" }} format="DD-MM-YYYY" />
          </Form.Item>

          <Flex gap="middle" justify="end">
            <Form.Item label={null}>
              <Button type="primary" htmlType="submit">
                Lanjutkan
              </Button>
            </Form.Item>
          </Flex>
        </Form>
      </Modal>

      <Modal
        title="Hapus Data Produksi"
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
        open={isOpenDownloadFormModal}
        onCancel={handleCancel}
        okText="Simpan"
        cancelText="Batal"
        footer={null}
      >
        <Form
          form={form}
          autoComplete="off"
          layout="vertical"
          onFinish={downloadReport}
          className="!mt-4"
        >
          <Form.Item<any>
            name="production_report_date"
            rules={[
              { required: true, message: "Silahkan masukan tanggal penjualan" },
            ]}
          >
            <RangePicker
              style={{ width: "100%" }}
              format="DD-MM-YYYY"
              disabledDate={disabled31DaysDate}
            />
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

export default Production;
