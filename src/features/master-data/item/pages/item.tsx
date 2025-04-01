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
import UseGetItems from "../hooks/useGetItems";
import useDeleteItem from "../hooks/useDeleteItem";
import { BreadcrumbContext } from "../../../../context/breadcrumb";

interface IData {
  cost_per_g: number;
  cost_per_kg: number;
  cost_per_unit: number;
  customer_code: string;
  description: string;
  id: number;
  image: string;
  item_code: string;
  item_name: string;
  price_per_g: number;
  price_per_kg: number;
  price_per_unit: number;
  type: string;
  weight_g: number;
}

const Item = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [items, setItems] = useState<IData[]>([]);
  const [tableParams, setTableParams] = useState<ITableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });
  const { data, isLoading } = UseGetItems({
    page: tableParams.pagination.current,
    limit: tableParams.pagination.pageSize,
  });
  const { mutateAsync: deleteAction } = useDeleteItem();
  const navigate = useNavigate();
  const [isOpenConfirmationModal, setIsOpenConfirmationModal] =
    useState<boolean>(false);
  const [selectedRowId, setSelectedRowId] = useState<number>(0);
  const { setBreadcrumb } = useContext(BreadcrumbContext);

  useEffect(() => {
    setBreadcrumb([
      {
        title: "Data Master",
      },
      {
        title: "Item",
      },
    ]);
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

  const columns: TableColumnsType<IData> = [
    { title: "Nama", dataIndex: "item_name", responsive: ["md"] },
    { title: "Kode", dataIndex: "item_code", responsive: ["md"] },
    { title: "Berat (gr)", dataIndex: "weight_g", responsive: ["md"] },
    { title: "Harga Jual", dataIndex: "price_per_unit", responsive: ["md"] },
    { title: "Harga Produksi", dataIndex: "cost_per_unit", responsive: ["md"] },
    { title: "Tipe", dataIndex: "type", responsive: ["md"] },
    { title: "Kode Pelanggan", dataIndex: "customer_code", responsive: ["md"] },
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

  const openDeleteConfirmation = (id: number) => {
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

  const goToForm = (mode: string, id?: number) => {
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
        title="Hapus Data Item"
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
            Tambah Item
          </Button>
        </div>
        <Table
          className="mt-8"
          dataSource={items}
          columns={columns}
          loading={isLoading}
          pagination={tableParams.pagination}
          onChange={handleTableChange}
        />
      </Content>
    </>
  );
};

export default Item;
