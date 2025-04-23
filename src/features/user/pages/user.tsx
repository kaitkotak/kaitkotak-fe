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
import { useNavigate } from "react-router-dom";
import Search from "antd/es/input/Search";

interface IData {
  id: number;
  order_number: string;
  customer_name: string;
  order_date: string;
  price_total: number;
}

const User = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [sales, _] = useState<IData[]>([]);
  const [tableParams, setTableParams] = useState<ITableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });
  const [__, setPaginationParams] = useState<ICustomTablePaginationConfig>({
    page: tableParams.pagination.current,
    limit: tableParams.pagination.pageSize,
  });
  // const { data, isLoading } = UseGetPurchaseOrders(paginationParams);
  const { setBreadcrumb } = useContext(BreadcrumbContext);
  const navigate = useNavigate();
  const [isOpenConfirmationModal, setIsOpenConfirmationModal] =
    useState<boolean>(false);
  const [___, setSelectedRowId] = useState<number>(0);
  // const { mutateAsync: deleteAction } = useDeletePurchaseOrder();

  useEffect(() => {
    setBreadcrumb([
      {
        title: "Pengguna",
      },
    ]);
  }, []);

  // useEffect(() => {
  //   setSales(() => {
  //     return data?.data.data.map((purchaseOrder: IData) => {
  //       let date = new Date(purchaseOrder.order_date);
  //       return {
  //         ...purchaseOrder,
  //         order_date: format(date, "dd/MM/yyyy"),
  //       };
  //     });
  //   });

  //   setTableParams({
  //     pagination: {
  //       ...tableParams.pagination,
  //       total: data?.data.meta.total,
  //     },
  //   });
  // }, [data]);

  const columns: TableColumnsType<IData> = [
    { title: "Nama", dataIndex: "order_number" },
    { title: "Jabatan", dataIndex: "customer_name" },
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
    // deleteAction({ id: selectedRowId });
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

          <Button
            color="primary"
            variant="solid"
            icon={<FileAddOutlined />}
            onClick={() => {
              goToForm("create");
            }}
          >
            <span className="hidden md:inline">Tambah Pengguna</span>
          </Button>
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
    </Spin>
  );
};

export default User;
