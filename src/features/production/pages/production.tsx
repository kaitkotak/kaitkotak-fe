import {
  FileAddOutlined,
  EditOutlined,
  DeleteOutlined,
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
import id from "antd/es/date-picker/locale/id_ID";
import UseGetProductions from "../hooks/useGetProductions";
import { useNavigate } from "react-router-dom";

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
  const [paginationParams, _] = useState<ICustomTablePaginationConfig>({
    page: tableParams.pagination.current,
    limit: tableParams.pagination.pageSize,
  });
  const { data, isLoading } = UseGetProductions(paginationParams);
  const [isOpenFormModal, setIsOpenFormModal] = useState<boolean>(false);
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
          <Tooltip title="Edit">
            <EditOutlined
              className="cursor-pointer"
              onClick={() => goToForm(record.id)}
            />
          </Tooltip>

          <Tooltip title="Hapus">
            <DeleteOutlined
              className="cursor-pointer"
              // onClick={() => openDeleteConfirmation(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const handleTableChange: TableProps<IData>["onChange"] = (pagination) => {
    setTableParams({
      pagination,
    });
  };

  // const handleDateFilter: DatePickerProps["onChange"] = (_, dateStr) => {
  //   console.log("date", dateStr);
  // };

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
            // onChange={handleDateFilter}
          />

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
        </div>
        <Table
          className="mt-8"
          dataSource={rawMaterials}
          columns={columns}
          loading={isLoading}
          pagination={tableParams.pagination}
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
    </Spin>
  );
};

export default Production;
