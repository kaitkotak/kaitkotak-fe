import {
  FileAddOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import {
  Button,
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
import UseGetPurchaseOrders from "../hooks/useGetPurchaseOrders";
import useDeletePurchaseOrder from "../hooks/useDeletePurchaseOrder";
import Search from "antd/es/input/Search";
import { useCheckPermission } from "../../../hooks/useCheckPermission";

interface IData {
  id: number;
  order_number: string;
  customer_name: string;
  order_date: string;
  price_total: number;
}

const PurchaseOrder = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [purchaseOrders, setPurchaseOrders] = useState<IData[]>([]);
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
  const { data, isLoading } = UseGetPurchaseOrders(paginationParams);
  const { setBreadcrumb } = useContext(BreadcrumbContext);
  const navigate = useNavigate();
  const [isOpenConfirmationModal, setIsOpenConfirmationModal] =
    useState<boolean>(false);
  const [selectedRowId, setSelectedRowId] = useState<number>(0);
  const { mutateAsync: deleteAction } = useDeletePurchaseOrder();
  const checkPermission = useCheckPermission();

  useEffect(() => {
    setBreadcrumb([
      {
        title: "Purchase Order",
      },
    ]);
  }, []);

  useEffect(() => {
    setPurchaseOrders(() => {
      return data?.data.data.map((purchaseOrder: IData) => {
        let date = new Date(purchaseOrder.order_date);
        return {
          ...purchaseOrder,
          order_date: format(date, "dd/MM/yyyy"),
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
    { title: "No Purchase Order", dataIndex: "order_number" },
    { title: "Nama Pelanggan", dataIndex: "customer_name" },
    { title: "Tanggal", dataIndex: "order_date" },
    { title: "Harga Total", dataIndex: "price_total" },
    {
      dataIndex: "action",
      render: (_, record) => (
        <Space size="middle">
          {checkPermission("purchase_order.update") && (
            <Tooltip title="Edit">
              <EditOutlined
                className="cursor-pointer"
                onClick={() => goToForm("edit", record.id)}
              />
            </Tooltip>
          )}

          {checkPermission("purchase_order.delete") && (
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
          <Search
            placeholder="Pencarian..."
            onSearch={handleSearch}
            style={{ width: "100%", maxWidth: 150 }}
          />

          {checkPermission("purchase_order.create") && (
            <Button
              color="primary"
              variant="solid"
              icon={<FileAddOutlined />}
              onClick={() => {
                goToForm("create");
              }}
            >
              <span className="hidden md:inline">Tambah Purchase Order</span>
            </Button>
          )}
        </div>
        <Table
          className="mt-8"
          dataSource={purchaseOrders}
          columns={columns}
          loading={isLoading}
          pagination={tableParams.pagination}
          rowKey={"id"}
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
    </Spin>
  );
};

export default PurchaseOrder;
