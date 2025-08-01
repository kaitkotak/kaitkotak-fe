import {
  Button,
  Col,
  Flex,
  Form,
  FormProps,
  Image,
  Input,
  InputNumber,
  Row,
  Select,
  Spin,
  theme,
  Upload,
  UploadFile,
  UploadProps,
} from "antd";
import { Content } from "antd/es/layout/layout";
import { useNavigate, useParams } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import useCreateItem from "../hooks/useCreateItem";
import useUpdateItem from "../hooks/useUpdateItem";
import UseGetItem from "../hooks/useGetItem";
import { BreadcrumbContext } from "../../../../context/breadcrumb";
import FormItem from "antd/es/form/FormItem";
import { getBase64 } from "../../../../libs/getBase64";
import useUpload from "../../../../hooks/useUpload";
import {PlusOutlined, ReloadOutlined} from "@ant-design/icons";
import UseGetCustomers from "../../customer/hooks/useGetCustomers";
import ImgCrop from "antd-img-crop";
import TextArea from "antd/es/input/TextArea";
import { useCheckPermission } from "../../../../hooks/useCheckPermission";

const ItemForm = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const { mutateAsync: create, isPending: isPendingCreate } = useCreateItem();
  const { mutateAsync: update, isPending: isPendingUpdate } = useUpdateItem();
  const navigate = useNavigate();
  const params = useParams();
  const { data, isLoading } = UseGetItem({
    id: params.id ?? "",
  });
  const [form] = Form.useForm();
  const { setBreadcrumb } = useContext(BreadcrumbContext);
  const itemType = [
    {
      label: "Retail",
      value: "retail",
    },
    {
      label: "Custom",
      value: "custom",
    },
  ];
  const [selectedType, setSelectedType] = useState<string>("");
  const [photoList, setPhotoList] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const {
    mutateAsync: upload,
    data: uploadResponse,
    isPending: isPendingUpload,
  } = useUpload();
  const { data: customerResponse, refetch: refetchCustomer, isRefetching: isRefetchingCustomer} = UseGetCustomers({
    page: 1,
    limit: 100,
  });
  const [customerOption, setCustomerOption] = useState<ICustomer[]>([]);
  const checkPermission = useCheckPermission();

  useEffect(() => {
    setBreadcrumb([
      {
        title: "Data Master",
      },
      {
        title: "Item",
      },
      {
        title: params.id ? "Edit Item" : "Tambah Item",
      },
    ]);

    localStorage.setItem("isForm", 'true');
  }, []);

  useEffect(() => {
    if (params.id) {
      form.setFieldsValue(data?.data.data);
      form.setFieldValue("customer", data?.data.data.customer_id);
      setSelectedType(data?.data.data.type);

      if (data?.data.data.image) {
        setPhotoList([
          {
            uid: "-1",
            name: "default.png",
            status: "done",
            url: `${import.meta.env.VITE_API_URL}/file/download/${
              data?.data.data.image
            }`,
          },
        ]);
      }
    }
  }, [data]);

  useEffect(() => {
    form.setFieldValue("image", uploadResponse?.data.data.name);
  }, [uploadResponse]);

  useEffect(() => {
    if (customerResponse) {
      setCustomerOption(customerResponse.data.data);
    }
  }, [customerResponse]);

  const submit: FormProps<IItemnForm>["onFinish"] = (values) => {
    if (values.image && !values.image.includes("temp")) {
      delete values.image;
    }

    if (params.id) {
      update({ ...values, id: params.id });
    } else {
      create(values);
    }
  };

  const back = () => {
    navigate("/master/item");
  };

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setPhotoList(newFileList);

    if (newFileList.length) {
      upload(newFileList[0].originFileObj as File);
    } else {
      form.setFieldValue("image", "");
    }
  };

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  const calculatePrice = (val: number | null, key: string) => {
    val = val ?? 0;

    switch (key) {
      case "cost_per_g":
        form.setFieldValue(
          "cost_per_kg",
          Number(`${parseFloat((val * 1000).toString()).toFixed(2)}`)
        );
        form.setFieldValue(
          "cost_per_unit",
          Number(
            `${parseFloat(
              (val * form.getFieldValue("weight_g")).toString()
            ).toFixed(2)}`
          )
        );
        break;

      case "cost_per_kg":
        form.setFieldValue(
          "cost_per_g",
          Number(`${parseFloat((val / 1000).toString()).toFixed(2)}`)
        );
        form.setFieldValue(
          "cost_per_unit",
          Number(
            `${parseFloat(
              ((val / 1000) * form.getFieldValue("weight_g")).toString()
            ).toFixed(2)}`
          )
        );
        break;

      case "cost_per_unit":
        const costPerGr = val / form.getFieldValue("weight_g");
        form.setFieldValue(
          "cost_per_g",
          Number(`${parseFloat(costPerGr.toString()).toFixed(2)}`)
        );
        form.setFieldValue(
          "cost_per_kg",
          Number(`${parseFloat((costPerGr * 1000).toString()).toFixed(2)}`)
        );
        break;

      case "price_per_g":
        form.setFieldValue(
          "price_per_kg",
          Number(`${parseFloat((val * 1000).toString()).toFixed(2)}`)
        );
        form.setFieldValue(
          "price_per_unit",
          Number(
            `${parseFloat(
              (val * form.getFieldValue("weight_g")).toString()
            ).toFixed(2)}`
          )
        );
        break;

      case "price_per_kg":
        form.setFieldValue(
          "price_per_g",
          Number(`${parseFloat((val / 1000).toString()).toFixed(2)}`)
        );
        form.setFieldValue(
          "price_per_unit",

          Number(
            `${parseFloat(
              ((val / 1000) * form.getFieldValue("weight_g")).toString()
            ).toFixed(2)}`
          )
        );
        break;

      case "price_per_unit":
        const pricePerGr = val / form.getFieldValue("weight_g");
        form.setFieldValue(
          "price_per_g",
          Number(`${parseFloat(pricePerGr.toString()).toFixed(2)}`)
        );
        form.setFieldValue(
          "price_per_kg",
          Number(`${parseFloat((pricePerGr * 1000).toString()).toFixed(2)}`)
        );
        break;

      default:
        break;
    }
  };

  const limitFraction = (event: React.FocusEvent, key: string) => {
    const val: string = Number(
      (event.target as HTMLInputElement).value.replace(/\,/g, "")
      // .replace(/\,/g, ".")
    ).toString();

    form.setFieldValue(
      key,
      Number(`${parseFloat(val).toFixed(2)}`)
      // .replace(/\./g, "#") // temporarily replace dot to avoid confusion
      // .replace(/#(\d{2})$/, ",$1") // convert last 2 digits to decimal with comma
      // .replace(/\B(?=(\d{3})+(?!\d))/g, ".") // add thousand separator
    );

    // calculatePrice(Number(`${parseFloat(val).toFixed(2)}`), key);
  };

  return (
    <Spin
      spinning={
        isLoading || isPendingUpload || isPendingCreate || isPendingUpdate || isRefetchingCustomer
      }
    >
      <Content
        style={{
          margin: "24px 16px",
          padding: 24,
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}
      >
        <div className="flex justify-end">
          <Button onClick={() => refetchCustomer()} icon={<ReloadOutlined />} className={'mb-4'} color="primary"
                  variant="solid">
            <span className="hidden md:inline">Refresh Data Master</span>
          </Button>
        </div>

        <Form form={form} layout="vertical" onFinish={submit}>
          <Form.Item<IItemnForm>
            label="Nama"
            name="item_name"
            rules={[{ required: true, message: "Silahkan masukan nama!" }]}
          >
            <Input />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item<IItemnForm>
                label="Kode Item"
                name="item_code"
                rules={[
                  { required: true, message: "Silahkan masukan kode item!" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item<IItemnForm>
                label="Berat"
                name="weight_g"
                rules={[{ required: true, message: "Silahkan masukan berat!" }]}
              >
                <InputNumber style={{ width: "100%" }} addonAfter="gr" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item<IItemnForm> label="Deskripsi" name="description">
            <TextArea />
          </Form.Item>

          <Form.Item<IItemnForm>
            label="Harga Jual (unit)"
            name="price_per_unit"
            rules={[
              { required: true, message: "Silahkan masukan harga per unit!" },
            ]}
          >
            <InputNumber
              style={{ width: "100%" }}
              addonBefore="Rp"
              // formatter={convertToRupiah}
              // parser={(value) =>
              //   value?.replace(/\$\s?|(,*)/g, "") as unknown as number
              // }
              onChange={(value: number | null) =>
                calculatePrice(value, "price_per_unit")
              }
              onBlur={(e) => limitFraction(e, "price_per_unit")}
            />
          </Form.Item>

          <Form.Item<IItemnForm>
            label="Harga Jual (gr)"
            name="price_per_g"
            rules={[
              { required: true, message: "Silahkan masukan harga per g!" },
            ]}
          >
            <InputNumber
              style={{ width: "100%" }}
              addonBefore="Rp"
              // formatter={convertToRupiah}
              onChange={(value: number | null) =>
                calculatePrice(value, "price_per_g")
              }
              onBlur={(e) => limitFraction(e, "price_per_g")}
            />
          </Form.Item>

          <Form.Item<IItemnForm>
            label="Harga Jual (kg)"
            name="price_per_kg"
            rules={[
              { required: true, message: "Silahkan masukan harga per kg!" },
            ]}
          >
            <InputNumber
              style={{ width: "100%" }}
              addonBefore="Rp"
              // formatter={convertToRupiah}
              onChange={(value: number | null) =>
                calculatePrice(value, "price_per_kg")
              }
              onBlur={(e) => limitFraction(e, "price_per_kg")}
            />
          </Form.Item>

          <Form.Item<IItemnForm>
            label="Biaya Produksi (unit)"
            name="cost_per_unit"
            rules={[
              {
                required: true,
                message: "Silahkan masukan biaya produksi per unit!",
              },
            ]}
          >
            <InputNumber
              style={{ width: "100%" }}
              addonBefore="Rp"
              // formatter={convertToRupiah}
              onChange={(value: number | null) =>
                calculatePrice(value, "cost_per_unit")
              }
              onBlur={(e) => limitFraction(e, "cost_per_unit")}
            />
          </Form.Item>

          <Form.Item<IItemnForm>
            label="Biaya Produksi (gr)"
            name="cost_per_g"
            rules={[
              {
                required: true,
                message: "Silahkan masukan biaya produksi per g!",
              },
            ]}
          >
            <InputNumber
              style={{ width: "100%" }}
              addonBefore="Rp"
              // formatter={convertToRupiah}
              onChange={(value: number | null) =>
                calculatePrice(value, "cost_per_g")
              }
              onBlur={(e) => limitFraction(e, "cost_per_g")}
            />
          </Form.Item>

          <Form.Item<IItemnForm>
            label="Biaya Produksi (kg)"
            name="cost_per_kg"
            rules={[
              {
                required: true,
                message: "Silahkan masukan biaya produksi per kg!",
              },
            ]}
          >
            <InputNumber
              style={{ width: "100%" }}
              addonBefore="Rp"
              // formatter={convertToRupiah}
              onChange={(value: number | null) =>
                calculatePrice(value, "cost_per_kg")
              }
              onBlur={(e) => limitFraction(e, "cost_per_kg")}
            />
          </Form.Item>

          <Form.Item<IItemnForm>
            label="Berat Bahan Baku"
            name="raw_material_quantity"
            rules={[
              { required: true, message: "Silahkan masukan berat bahan baku!" },
            ]}
          >
            <InputNumber style={{ width: "100%" }} addonAfter="gr" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={selectedType !== "custom" ? 24 : 12}>
              <Form.Item<IItemnForm>
                label="Tipe"
                name="type"
                rules={[{ required: true, message: "Silahkan pilih tipe!" }]}
              >
                <Select options={itemType} onSelect={setSelectedType} />
              </Form.Item>
            </Col>

            {selectedType === "custom" && (
              <Col span={12}>
                <Form.Item<IItemnForm>
                  label="Kode Pelanggan"
                  name="customer"
                  rules={[
                    { required: true, message: "Silahkan pilih pelanggan!" },
                  ]}
                >
                  <Select
                    showSearch
                    placeholder="Pilih Pelanggan"
                    optionFilterProp="label"
                    options={customerOption.map((s) => ({
                      value: s.id,
                      label: s.customer_code,
                    }))}
                  />
                </Form.Item>
              </Col>
            )}
          </Row>

          <FormItem<IItemnForm> label="Foto Item" name="image" rules={[]}>
            <ImgCrop rotationSlider aspect={1 / 1}>
              <Upload
                action=""
                listType="picture-card"
                fileList={photoList}
                accept=".png,.jpg,.jpeg,.webp"
                onPreview={handlePreview}
                onChange={handleChange}
                customRequest={({ onSuccess }) => {
                  setTimeout(() => {
                    if (onSuccess) {
                      onSuccess("ok");
                    }
                  }, 0);
                }}
              >
                {photoList.length >= 1 ? null : uploadButton}
              </Upload>
            </ImgCrop>

            {previewImage && (
              <Image
                wrapperStyle={{ display: "none" }}
                preview={{
                  visible: previewOpen,
                  onVisibleChange: (visible) => setPreviewOpen(visible),
                  afterOpenChange: (visible) => !visible && setPreviewImage(""),
                }}
                src={previewImage}
              />
            )}
          </FormItem>

          <Flex gap="middle" justify="end">
            <Form.Item label={null}>
              <Button
                type="default"
                variant="outlined"
                htmlType="button"
                onClick={back}
              >
                Batal
              </Button>
            </Form.Item>

            {checkPermission("master_item.update") && (
              <Form.Item label={null}>
                <Button type="primary" htmlType="submit">
                  Simpan
                </Button>
              </Form.Item>
            )}
          </Flex>
        </Form>
      </Content>
    </Spin>
  );
};

export default ItemForm;
