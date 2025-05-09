import { Spin, Table, TableColumnsType, theme } from "antd";
import { Content } from "antd/es/layout/layout";
import { useContext, useEffect, useState } from "react";
import { BreadcrumbContext } from "../../../context/breadcrumb";
import UseGetProductionPlan from "../hooks/useGetProductionPlan";

interface IData {
  id: number;
  production_date: string;
  total_quantity: number;
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
  }, []);

  useEffect(() => {
    setProductionPlan(data?.data.data);
  }, [data]);

  const columns: TableColumnsType<IData> = [
    { title: "Nama", dataIndex: "item_name" },
    { title: "Kode", dataIndex: "item_code" },
    { title: "Stok", dataIndex: "stock" },
    { title: "Rencana Produksi", dataIndex: "stock_deficit" },
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
          rowKey={'id'}
          scroll={{ x: "max-content" }}
          pagination={false}
        />
      </Content>
    </Spin>
  );
};

export default ProductionPlan;
