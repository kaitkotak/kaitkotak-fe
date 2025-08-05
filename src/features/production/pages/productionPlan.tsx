import { Spin, Table, TableColumnsType, theme } from "antd";
import { Content } from "antd/es/layout/layout";
import { useContext, useEffect, useState } from "react";
import { BreadcrumbContext } from "../../../context/breadcrumb";
import UseGetProductionPlan from "../hooks/useGetProductionPlan";
import {formatCurrency} from "../../../libs/formatCurrency.ts";

interface IData {
  id: number;
  production_date: string;
  total_quantity: number;
  production_requirements: number;
  stock: number
  stock_deficit: number
}

const ProductionPlan = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [productionPlan, setProductionPlan] = useState<IData[]>([]);
  const { data, isLoading } = UseGetProductionPlan();
  const { setBreadcrumb } = useContext(BreadcrumbContext);

  useEffect(() => {
    setBreadcrumb([
      {
        title: "Produksi",
      },
      {
        title: "Rencana Produksi",
      },
    ]);

    localStorage.setItem("isForm", 'false');
  }, []);

  useEffect(() => {
    setProductionPlan(data?.data.data);
  }, [data]);

  const columns: TableColumnsType<IData> = [
    { title: "Nama", dataIndex: "item_name" },
    { title: "Kode", dataIndex: "item_code" },
    { title: "Stok", dataIndex: "stock", render: (_, record) => formatCurrency(record.stock, false) },
    { title: "Kebutuhan", dataIndex: "production_requirements", render: (_, record) => formatCurrency(record.production_requirements, false) },
    { title: "Rencana Produksi", dataIndex: "stock_deficit", render: (_, record) => formatCurrency(record.stock_deficit, false) },
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
          dataSource={productionPlan}
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

export default ProductionPlan;
