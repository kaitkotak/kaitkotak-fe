import { FileAddOutlined, EditOutlined } from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Flex,
  Form,
  FormProps,
  InputNumber,
  Modal,
  Spin,
  Table,
  TableColumnsType,
  TableProps,
  theme,
} from "antd";
import { Content } from "antd/es/layout/layout";
import { useContext, useEffect, useState } from "react";
import UseGetRawMaterials from "../hooks/useGetRawMaterials";
import { BreadcrumbContext } from "../../../context/breadcrumb";
import { format } from "date-fns";
import TextArea from "antd/es/input/TextArea";
import useCreateRawMaterial from "../hooks/useCreateRawMaterial";
import id from "antd/es/date-picker/locale/id_ID";
import { parseDateDDMMYYYY } from "../../../libs/dateParser";

interface IData {
  stock_date: string;
  type: string;
  quantity: number;
  note: string;
}

const RawMaterial = () => {
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
  const { data, isLoading } = UseGetRawMaterials(paginationParams);
  const {
    mutateAsync: create,
    isPending: isCreatePending,
    isSuccess: isCreateSuccess,
  } = useCreateRawMaterial();
  const [isOpenFormModal, setIsOpenFormModal] = useState<boolean>(false);
  const { setBreadcrumb } = useContext(BreadcrumbContext);
  const [currentStock, setCurrentStock] = useState<number>(0);
  const [formTitle, setFormTitle] = useState<string>("");
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

  useEffect(() => {
    setBreadcrumb([
      {
        title: "Bahan Baku",
      },
    ]);
  }, []);

  useEffect(() => {
    setRawMaterials(() => {
      return data?.data.data.map((rawMaterial: IData) => {
        let date = new Date(rawMaterial.stock_date);
        return {
          ...rawMaterial,
          stock_date: format(date, "dd/MM/yyyy"),
        };
      });
    });

    setCurrentStock(data?.data.total_available_stock);

    setTableParams({
      pagination: {
        ...tableParams.pagination,
        total: data?.data.meta.total,
      },
    });
  }, [data]);

  useEffect(() => {
    if (isCreateSuccess) {
      setIsOpenFormModal(false);
      form.resetFields();
    }
  }, [isCreateSuccess]);

  const columns: TableColumnsType<IData> = [
    { title: "Tanggal", dataIndex: "stock_date" },
    { title: "Tipe", dataIndex: "type" },
    { title: "Jumlah (kg)", dataIndex: "quantity" },
    { title: "Catatan", dataIndex: "note" },
  ];

  const handleTableChange: TableProps<IData>["onChange"] = (pagination) => {
    setTableParams({
      pagination,
    });
  };

  const handleDateFilter = (_: any, dateStrings: string[]) => {
    console.log(dateStrings);
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

  const submit: FormProps<IRawMaterialPayload>["onFinish"] = (values) => {
    create({
      quantity: values.quantity,
      type: "IN",
      note: values.note,
      stock_date: format(new Date(), "yyyy-MM-dd"),
      is_opname: formTitle === "Stok Opname",
    });
  };

  const handleCancel = () => {
    form.resetFields();
    setIsOpenFormModal(false);
  };

  return (
    <Spin spinning={isCreatePending}>
      <Modal
        title={formTitle}
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
          <Form.Item<IRawMaterialPayload>
            label="Jumlah (kg)"
            name="quantity"
            rules={[
              { required: true, message: "Silahkan masukan jumlah (kg)!" },
            ]}
          >
            <InputNumber style={{ width: "100%" }} addonAfter="kg" />
          </Form.Item>

          {formTitle === "Stok Opname" && (
            <Form.Item<IRawMaterialPayload> label="Catatan" name="note">
              <TextArea />
            </Form.Item>
          )}

          <Flex gap="middle" justify="end">
            <Form.Item label={null}>
              <Button type="primary" htmlType="submit">
                Simpan
              </Button>
            </Form.Item>
          </Flex>
        </Form>
      </Modal>

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
            onChange={handleDateFilter}
          />

          <Flex gap={4}>
            <div className="px-3 py-1 m-auto border rounded">
              Stok : {currentStock}kg
            </div>

            <Button
              color="primary"
              variant="solid"
              icon={<FileAddOutlined />}
              onClick={() => {
                setFormTitle("Stok Masuk");
                setIsOpenFormModal(true);
              }}
            >
              <span className="hidden md:inline">Tambah Stok</span>
            </Button>

            <Button
              color="primary"
              variant="solid"
              icon={<EditOutlined />}
              onClick={() => {
                setFormTitle("Stok Opname");
                setIsOpenFormModal(true);
              }}
            >
              <span className="hidden md:inline">Stok Opname</span>
            </Button>
          </Flex>
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
    </Spin>
  );
};

export default RawMaterial;
