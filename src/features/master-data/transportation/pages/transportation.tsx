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
import { useEffect, useState } from "react";
import UseGetTransportations from "../hooks/useGetTransportations";
import { useNavigate } from "react-router-dom";
import useDeleteTransportation from "../hooks/useDeleteTransportation";

interface IData {
  id: string;
  driver_name: string;
  vehicle_number: string;
  phone_number: string;
}

const Transportation = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [transportations, setTransportations] = useState<IData[]>([]);
  const [tableParams, setTableParams] = useState<ITableParams>({
    pagination: {
      current: 1,
      pageSize: 5,
    },
  });
  const { data, isLoading } = UseGetTransportations(tableParams);
  const { mutateAsync: deleteAction } = useDeleteTransportation();
  const navigate = useNavigate();
  const [isOpenConfirmationModal, setIsOpenConfirmationModal] =
    useState<boolean>(false);
  const [selectedRowId, setSelectedRowId] = useState<string>("");

  useEffect(() => {
    setTransportations(data?.data.data);
  }, [data]);

  const columns: TableColumnsType<IData> = [
    { title: "Nama Pengemudi", dataIndex: "driver_name", responsive: ["md"] },
    { title: "No HP", dataIndex: "phone_number", responsive: ["md"] },
    { title: "No Kendaraan", dataIndex: "vehicle_number", responsive: ["md"] },
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
        title="Hapus Data Transportasi"
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
            placeholder="input search text"
            onSearch={handleSearch}
            style={{ width: 200 }}
          />

          <Button
            color="primary"
            variant="solid"
            icon={<FileAddOutlined />}
            onClick={() => goToForm("create")}
          >
            Tambah Transportasi
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

export default Transportation;
