import { FileAddOutlined, EditOutlined } from "@ant-design/icons";
import {
  Button,
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
import { BreadcrumbContext } from "../../../../context/breadcrumb";
import { useCheckPermission } from "../../../../hooks/useCheckPermission";

const Item = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [items, setItems] = useState<IItem[]>([]);
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
  const { data, isLoading } = UseGetItems(paginationParams);
  const navigate = useNavigate();
  const { setBreadcrumb } = useContext(BreadcrumbContext);
  const checkPermission = useCheckPermission();

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

  const columns: TableColumnsType<IItem> = [
    { title: "Nama", dataIndex: "item_name" },
    { title: "Kode", dataIndex: "item_code" },
    { title: "Berat (gr)", dataIndex: "weight_g" },
    { title: "Harga Jual", dataIndex: "price_per_unit" },
    { title: "Harga Produksi", dataIndex: "cost_per_unit" },
    { title: "Tipe", dataIndex: "type" },
    { title: "Kode Pelanggan", dataIndex: "customer_code" },
    {
      dataIndex: "action",
      render: (_, record) => (
        <Space size="middle">
          {checkPermission("master_item.update") && (
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

  const handleTableChange: TableProps<IItem>["onChange"] = (pagination) => {
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

  return (
    <>
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

          {checkPermission("master_item.create") && (
            <Button
              color="primary"
              variant="solid"
              icon={<FileAddOutlined />}
              onClick={() => goToForm("create")}
            >
              <span className="hidden md:inline">Tambah Item</span>
            </Button>
          )}
        </div>
        <Table
          className="mt-8"
          dataSource={items}
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

export default Item;
