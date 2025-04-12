import { useContext, useEffect, useState } from "react";
import UseGetItems from "../../master-data/item/hooks/useGetItems";
import { Button, Card, Flex, InputNumber, Space, Spin, theme } from "antd";
import { Content } from "antd/es/layout/layout";
import { useNavigate, useParams } from "react-router-dom";
import useCreateProduction from "../hooks/useCreateProduction";
import { format } from "date-fns";
import { BreadcrumbContext } from "../../../context/breadcrumb";
import UseGetProduction from "../hooks/useGetProduction";
import useUpdateProduction from "../hooks/useUpdateProduction";

const ProductionForm = () => {
  const { data: itemResponse } = UseGetItems({
    page: 1,
    limit: 100,
  });
  const [_, setItems] = useState<IItem[]>([]);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const gridStyle: React.CSSProperties = {
    width: "25%",
    textAlign: "center",
  };
  const [productionItems, setProductionItems] = useState<IProductionItem[]>([]);
  const navigate = useNavigate();
  const { mutateAsync: create } = useCreateProduction();
  const { id } = useParams();
  const { setBreadcrumb } = useContext(BreadcrumbContext);
  const { data } = UseGetProduction(id!);
  const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);
  const { mutateAsync: update } = useUpdateProduction();

  useEffect(() => {
    if (!localStorage.getItem("productionDate") && !id) {
      navigate("/production");
    }

    setBreadcrumb([
      {
        title: "Produksi",
      },
      {
        title: id ? "Edit Produksi" : "Tambah Produksi",
      },
    ]);
  }, []);

  useEffect(() => {
    if (itemResponse) {
      setItems(itemResponse.data.data);
      setProductionItems(
        itemResponse.data.data.map((singleData: IItem) => ({
          id: singleData.id,
          quantity: 0,
          image: singleData.image,
          name: singleData.item_name,
          code: singleData.item_code,
        }))
      );
    }
  }, [itemResponse]);

  useEffect(() => {
    console.log(data, productionItems.length, isFirstLoad);
    console.log("if", data && productionItems.length && isFirstLoad);
    if (data && productionItems.length && isFirstLoad) {
      setProductionItems((prevVal: IProductionItem[]) => {
        return prevVal.map((prev: IProductionItem) => {
          const matchedData: IProductionItemResponse =
            data.data.data.production_items.filter(
              (singleData: IProductionItemResponse) =>
                prev.id === singleData.item_id
            )[0];

          if (matchedData) {
            prev.quantity = matchedData.quantity;
          }
          return prev;
        });
      });

      setIsFirstLoad(false);
    }
  }, [data, productionItems]);

  const qtyButtonHandler = (id: number, type: "increase" | "decrease") => {
    const selectedItems: IProductionItem[] = productionItems.map(
      (productionItem: IProductionItem) => {
        if (productionItem.id === id) {
          if (type === "increase") {
            productionItem.quantity += 1;
          } else {
            productionItem.quantity -= 1;
          }
        }

        return productionItem;
      }
    );

    setProductionItems(selectedItems);
  };

  const manualInputQty = (id: number, value: number | null) => {
    const selectedItems: IProductionItem[] = productionItems.map(
      (productionItem: IProductionItem) => {
        if (productionItem.id === id) {
          productionItem.quantity = value ?? 0;
        }

        return productionItem;
      }
    );

    setProductionItems(selectedItems);
  };

  const back = () => {
    navigate("/production");
  };

  const submit = () => {
    const payload: IProductionPayload = {
      production_date: format(new Date(), "yyyy-MM-dd"),
      production_items: productionItems.map(
        (productionItem: IProductionItem) => ({
          item_id: productionItem.id,
          quantity: productionItem.quantity,
        })
      ),
    };

    if (id) {
      update({ id, payload });
    } else {
      create(payload);
    }
  };

  return (
    <Spin spinning={isFirstLoad}>
      <Content
        style={{
          margin: "24px 16px",
          padding: 24,
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}
      >
        <Space size={16} direction="vertical">
          <Card>
            {productionItems.map((item: IProductionItem) => (
              <Card.Grid hoverable style={gridStyle}>
                <img
                  alt="item-image"
                  src={`${import.meta.env.VITE_API_URL}/file/download/${
                    item.image
                  }`}
                  width={100}
                />
                <p className="text-lg font-bold">{item.name}</p>
                <p className="text-xs">{item.code}</p>

                <Flex>
                  <Space size={8}>
                    <Button
                      onClick={() => qtyButtonHandler(item.id, "increase")}
                    >
                      +
                    </Button>
                    <InputNumber
                      value={item.quantity}
                      onChange={(val) => manualInputQty(item.id, val)}
                    />
                    <Button
                      onClick={() => qtyButtonHandler(item.id, "decrease")}
                    >
                      -
                    </Button>
                  </Space>
                </Flex>
              </Card.Grid>
            ))}
          </Card>

          <Flex gap="middle" justify="end">
            <Button
              type="default"
              variant="outlined"
              htmlType="button"
              onClick={back}
            >
              Batal
            </Button>

            <Button type="primary" onClick={submit}>
              Proses Produksi
            </Button>
          </Flex>
        </Space>
      </Content>
    </Spin>
  );
};

export default ProductionForm;
