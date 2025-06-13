import {
  FileAddOutlined,
  EditOutlined,
  FileExcelOutlined,
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
import UseGetPaymentHistories from "../hooks/useGetPaymentHistories";
import { BreadcrumbContext } from "../../../context/breadcrumb";
import { useCheckPermission } from "../../../hooks/useCheckPermission";
import { format } from "date-fns";

interface IData {
  amount: number;
  created_at: string;
  created_by_name: string;
  customer_name: string;
  id: number;
  invoice_number: string;
}

const PaymentHistories = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [customers, setCustomers] = useState<IData[]>([]);
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
  const { data, isLoading } = UseGetPaymentHistories(paginationParams);
  const navigate = useNavigate();
  const [isOpenConfirmationModal, setIsOpenConfirmationModal] =
    useState<boolean>(false);
  const { setBreadcrumb } = useContext(BreadcrumbContext);
  const checkPermission = useCheckPermission();

  useEffect(() => {
    setBreadcrumb([
      {
        title: "Pembayaran",
      },
    ]);
  }, []);

  useEffect(() => {
    setCustomers(() => {
      return data?.data.data.map((rawMaterial: IData) => {
        let date = new Date(rawMaterial.created_at);
        return {
          ...rawMaterial,
          created_at: format(date, "dd/MM/yyyy"),
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
    { title: "Tanggal", dataIndex: "created_at" },
    { title: "Pelanggan", dataIndex: "customer_name" },
    { title: "No Invoice", dataIndex: "invoice_items" },
    { title: "Total Pembayaran", dataIndex: "total_amount" },
    { title: "PIC", dataIndex: "created_by_name" },
    {
      dataIndex: "action",
      render: (_, record) => (
        <Space size="middle">
          {checkPermission("payment.update") && (
            <Tooltip title="Edit">
              <EditOutlined
                className="cursor-pointer"
                onClick={() => goToForm("edit", record.id)}
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

  const handleOk = () => {
    // deleteAction({ id: selectedRowId });
    setIsOpenConfirmationModal(false);
  };

  const handleCancel = () => {
    setIsOpenConfirmationModal(false);
  };

  const downloadDebt = () => {
    window.open(
      `${import.meta.env.VITE_API_URL}/payment/download/accounts-receivable`,
      "_blank"
    );
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
            style={{ width: "100%", maxWidth: 150 }}
          />

          <div className="flex gap-3">
            <Button
              color="primary"
              variant="solid"
              icon={<FileExcelOutlined />}
              onClick={downloadDebt}
            >
              <span className="hidden md:inline">Download Penagihan</span>
            </Button>

            {checkPermission("payment.create") && (
              <Button
                color="primary"
                variant="solid"
                icon={<FileAddOutlined />}
                onClick={() => goToForm("create")}
              >
                <span className="hidden md:inline">Buat Pembayaran</span>
              </Button>
            )}
          </div>
        </div>
        <Table
          className="mt-8"
          dataSource={customers}
          columns={columns}
          loading={isLoading}
          pagination={tableParams.pagination}
          rowKey={"id"}
          scroll={{ x: "max-content" }}
          onChange={handleTableChange}
        />
      </Content>
    </>
  );
};

export default PaymentHistories;
