import { useContext, useEffect, useState } from "react";
import UseGetItems from "../../master-data/item/hooks/useGetItems";
import {
  Button,
  Card,
  DatePicker,
  Flex,
  InputNumber,
  Space,
  Spin,
  theme,
} from "antd";
import { Content } from "antd/es/layout/layout";
import { useNavigate, useParams } from "react-router-dom";
import useCreateProduction from "../hooks/useCreateProduction";
import { BreadcrumbContext } from "../../../context/breadcrumb";
import UseGetProduction from "../hooks/useGetProduction";
import useUpdateProduction from "../hooks/useUpdateProduction";
import dayjs, { Dayjs } from "dayjs";

const ProductionForm = () => {
  const { data: itemResponse } = UseGetItems({
    page: 1,
    limit: 100,
  });
  const [_, setItems] = useState<IItem[]>([]);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [productionItems, setProductionItems] = useState<IProductionItem[]>([]);
  const navigate = useNavigate();
  const { mutateAsync: create } = useCreateProduction();
  const { id } = useParams();
  const { setBreadcrumb } = useContext(BreadcrumbContext);
  const { data } = UseGetProduction(id ?? "");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { mutateAsync: update } = useUpdateProduction();
  const submitButtonText: string = id ? "Simpan Perubahan" : "Proses Produksi";
  const [productionDate, setProductionDate] = useState<Dayjs | null>(null);

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
    if (!itemResponse?.data?.data) return;

    const baseItems = itemResponse.data.data;
    const productionItems = baseItems.map((item: IItem) => {
      const matched = data?.data?.data?.production_items?.find(
        (prodItem: IProductionItemResponse) => prodItem.item_id === item.id
      );

      return {
        id: item.id,
        quantity: matched ? matched.quantity : 0,
        image: item.image,
        name: item.item_name,
        code: item.item_code,
      };
    });

    setProductionDate(dayjs(data?.data.data.production_date));
    setItems(baseItems);
    setProductionItems(productionItems);
    setIsLoading(false);
  }, [itemResponse, data]);

  const qtyButtonHandler = (id: number, type: "increase" | "decrease") => {
    const selectedItems: IProductionItem[] = productionItems.map(
      (productionItem: IProductionItem) => {
        if (productionItem.id === id) {
          if (type === "decrease" && productionItem.quantity > 0) {
            productionItem.quantity -= 1;
          } else if (type === "increase") {
            productionItem.quantity += 1;
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
      production_date: dayjs(productionDate).format("YYYY-MM-DD"),
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
    <Spin spinning={isLoading}>
      <Content
        style={{
          margin: "24px 16px",
          padding: 24,
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}
      >
        {id && (
          <div className="flex flex-col gap-1">
            <label>Date</label>
            <DatePicker
              style={{ width: "30%", marginBottom: "16px" }}
              format="DD-MM-YYYY"
              value={productionDate}
              onChange={setProductionDate}
            />
          </div>
        )}

        {id && <p className="text-lg font-bold mb-3">Item</p>}

        <div className="flex gap-3 mb-6 flex-wrap">
          {productionItems.map((item: IProductionItem) => (
            <Card
              hoverable
              cover={
                <img
                  alt="item-image"
                  src={`${import.meta.env.VITE_API_URL}/file/download/${
                    item.image
                  }`}
                  style={{ height: "9.375rem" }}
                />
              }
              key={item.id}
            >
              <p className="text-lg font-bold">{item.name}</p>
              <p
                className="text-xs mb-4
              "
              >
                {item.code}
              </p>

              <Flex justify="center">
                <Space size={8}>
                  <Button onClick={() => qtyButtonHandler(item.id, "increase")}>
                    +
                  </Button>
                  <InputNumber
                    value={item.quantity}
                    min={0}
                    style={{ textAlign: "center" }}
                    onChange={(val) => manualInputQty(item.id, val)}
                  />
                  <Button onClick={() => qtyButtonHandler(item.id, "decrease")}>
                    -
                  </Button>
                </Space>
              </Flex>
            </Card>
          ))}
        </div>

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
            {submitButtonText}
          </Button>
        </Flex>
      </Content>
    </Spin>
  );
};

export default ProductionForm;
