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
import { useContext, useEffect, useState } from "react";
import useCreateItem from "../hooks/useCreateItem";
import useUpdateItem from "../hooks/useUpdateItem";
import UseGetItem from "../hooks/useGetItem";
import { BreadcrumbContext } from "../../../../context/breadcrumb";
import FormItem from "antd/es/form/FormItem";
import { getBase64 } from "../../../../libs/getBase64";
import useUpload from "../../../../hooks/useUpload";
import { PlusOutlined } from "@ant-design/icons";

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
  }, []);

  useEffect(() => {
    if (params.id) {
      form.setFieldsValue(data?.data.data);

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

  return (
    <Spin
      spinning={
        isLoading || isPendingUpload || isPendingCreate || isPendingUpdate
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
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
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
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
            />
          </Form.Item>

          <Form.Item<IItemnForm>
            label="Harga Produksi (gr)"
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
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
            />
          </Form.Item>

          <Form.Item<IItemnForm>
            label="Harga Produksi (kg)"
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
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
            />
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
                  name="customer_code"
                  rules={[
                    { required: true, message: "Silahkan pilih pelanggan!" },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            )}
          </Row>

          <FormItem<IItemnForm> label="Foto Item" name="image" rules={[]}>
            <Upload
              action=""
              listType="picture-card"
              fileList={photoList}
              accept=".png,.jpg,.jpeg,.webp"
              onPreview={handlePreview}
              onChange={handleChange}
              beforeUpload={() => false}
            >
              {photoList.length >= 1 ? null : uploadButton}
            </Upload>

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

            <Form.Item label={null}>
              <Button type="primary" htmlType="submit">
                Simpan
              </Button>
            </Form.Item>
          </Flex>
        </Form>
      </Content>
    </Spin>
  );
};

export default ItemForm;
