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
import UseGetTransportations from "../hooks/useGetTransportations";
import { useNavigate } from "react-router-dom";
import useDeleteTransportation from "../hooks/useDeleteTransportation";
import { BreadcrumbContext } from "../../../../context/breadcrumb";
import { checkPermission } from "../../../../libs/checkPermission";

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
      pageSize: 10,
    },
  });
  const [paginationParams, setPaginationParams] =
    useState<ICustomTablePaginationConfig>({
      page: tableParams.pagination.current,
      limit: tableParams.pagination.pageSize,
    });
  const { data, isLoading } = UseGetTransportations(paginationParams);
  const { mutateAsync: deleteAction } = useDeleteTransportation();
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
        title: "Transportasi",
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
    { title: "Nama Pengemudi", dataIndex: "driver_name" },
    { title: "No HP", dataIndex: "phone_number" },
    { title: "No Kendaraan", dataIndex: "vehicle_number" },
    {
      dataIndex: "action",
      render: (_, record) => (
        <Space size="middle">
          {checkPermission("master_transportation.update") && (
            <Tooltip title="Edit">
              <EditOutlined
                className="cursor-pointer"
                onClick={() => goToForm("edit", record.id)}
              />
            </Tooltip>
          )}

          {checkPermission("master_transportation.delete") && (
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

  const openDeleteConfirmation = (id: string) => {
    setIsOpenConfirmationModal(true);
    setSelectedRowId(id);
  };

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

  const handleSearch = (keyword: string) => {
    setPaginationParams((val: ICustomTablePaginationConfig) => ({
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
            placeholder="Pencarian..."
            onSearch={handleSearch}
            style={{ width: "100%", maxWidth: 150 }}
          />

          {checkPermission("master_transportation.create") && (
            <Button
              color="primary"
              variant="solid"
              icon={<FileAddOutlined />}
              onClick={() => goToForm("create")}
            >
              <span className="hidden md:inline">Tambah Transportasi</span>
            </Button>
          )}
        </div>
        <Table
          className="mt-8"
          dataSource={transportations}
          columns={columns}
          loading={isLoading}
          pagination={tableParams.pagination}
          scroll={{ x: "max-content" }}
          onChange={handleTableChange}
        />
      </Content>
    </>
  );
};

export default Transportation;
