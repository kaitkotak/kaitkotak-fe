import {
  FileAddOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import {
  Button,
  Modal,
  Space,
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
import UseGetCustomers from "../hooks/useGetCustomers";
import useDeleteCustomer from "../hooks/useDeleteCustomer";
import { BreadcrumbContext } from "../../../../context/breadcrumb";

interface IData {
  id: string;
  driver_name: string;
  vehicle_number: string;
  phone_number: string;
}

const Customer = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [transportations, setTransportations] = useState<IData[]>([]);
  const [tableParams, setTableParams] = useState<ITableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });
  const { data, isLoading } = UseGetCustomers({
    page: tableParams.pagination.current,
    limit: tableParams.pagination.pageSize,
  });
  const { mutateAsync: deleteAction } = useDeleteCustomer();
  const navigate = useNavigate();
  const [isOpenConfirmationModal, setIsOpenConfirmationModal] =
    useState<boolean>(false);
  const [selectedRowId, setSelectedRowId] = useState<string>("");
  const { setBreadcrumb } = useContext(BreadcrumbContext);

  useEffect(() => {
    setBreadcrumb([
      {
        title: "Data Master",
      },
      {
        title: "Pelanggan",
      },
    ]);
  }, []);

  useEffect(() => {
    setTransportations(data?.data.data);
    setTableParams({
      pagination: {
        ...tableParams.pagination,
        total: data?.data.meta.total,
      },
    });
  }, [data]);

  const columns: TableColumnsType<IData> = [
    { title: "Nama", dataIndex: "full_name", responsive: ["md"] },
    { title: "Kode", dataIndex: "customer_code", responsive: ["md"] },
    { title: "No HP", dataIndex: "phone_number", responsive: ["md"] },
    { title: "Nama Sales", dataIndex: "sales_rep_id", responsive: ["md"] },
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

  const openDeleteConfirmation = (id: string) => {
    setIsOpenConfirmationModal(true);
    setSelectedRowId(id);
  };

  const handleTableChange: TableProps<IData>["onChange"] = (pagination) => {
    setTableParams({
      pagination,
    });
  };

  const handleSearch = (keyword: string) => {
    setTableParams((val: ITableParams) => ({
      ...val,
      filter: keyword,
    }));
  };

  const goToForm = (mode: string, id?: string) => {
    const path: string = mode === "create" ? "create" : `edit/${id}`;
    navigate(path);
  };

  const handleOk = () => {
    deleteAction({ id: selectedRowId });
    setIsOpenConfirmationModal(false);
  };

  const handleCancel = () => {
    setIsOpenConfirmationModal(false);
  };

  return (
    <>
      <Modal
        title="Hapus Data Pelanggan"
        open={isOpenConfirmationModal}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Hapus"
        cancelText="Batal"
      >
        <p>Anda yakin ingin menghapus data ini?</p>
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
          <Search
            placeholder="Pencarian..."
            onSearch={handleSearch}
            style={{ width: 200 }}
          />

          <Button
            color="primary"
            variant="solid"
            icon={<FileAddOutlined />}
            onClick={() => goToForm("create")}
          >
            Tambah Pelanggan
          </Button>
        </div>
        <Table
          className="mt-8"
          dataSource={transportations}
          columns={columns}
          loading={isLoading}
          pagination={tableParams.pagination}
          onChange={handleTableChange}
        />
      </Content>
    </>
  );
};

export default Customer;
