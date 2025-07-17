import { Spin, Table, TableColumnsType, theme } from "antd";
import { Content } from "antd/es/layout/layout";
import { useContext, useEffect, useState } from "react";
import { BreadcrumbContext } from "../../../context/breadcrumb";
import useGetPaymentHistory from "../hooks/useGetPaymentHistory";
import { useParams } from "react-router-dom";
import { format } from "date-fns";

interface IData {
  id: number;
  amount: number;
  invoice_number: string;
  customer_name: string;
  created_at: string;
  created_by_name: string;
}

const PaymentHistory = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [paymentHistory, setPaymentHistory] = useState<IData[]>([]);
  const params = useParams();
  const { data, isLoading } = useGetPaymentHistory({
    id: params.id!,
  });
  const { setBreadcrumb } = useContext(BreadcrumbContext);

  useEffect(() => {
    setBreadcrumb([
      {
        title: "Penjualan",
      },
      {
        title: `Riwayat Pembayaran`,
      },
    ]);
  }, []);

  useEffect(() => {
    setPaymentHistory(
      data?.data.data.map((payment: IData) => ({
        ...payment,
        created_at: format(payment.created_at, "dd/MM/yyyy"),
      }))
    );
  }, [data]);

  const columns: TableColumnsType<IData> = [
    { title: "Tanggal", dataIndex: "created_at" },
    { title: "Jumlah Pembayaran", dataIndex: "amount" },
    { title: "PIC", dataIndex: "created_by_name" },
  ];

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
        <Table
          className="mt-8"
          dataSource={paymentHistory}
          columns={columns}
          loading={isLoading}
          rowKey={"id"}
          scroll={{ x: "max-content" }}
          pagination={false}
        />
      </Content>
    </Spin>
  );
};

export default PaymentHistory;
