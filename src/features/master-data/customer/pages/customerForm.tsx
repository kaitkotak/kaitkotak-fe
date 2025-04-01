import {
  Button,
  Col,
  Flex,
  Form,
  FormProps,
  // Image,
  Input,
  Row,
  Select,
  // Space,
  Spin,
  theme,
  // Upload,
  // UploadFile,
  // UploadProps,
} from "antd";
import { Content } from "antd/es/layout/layout";
import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import TextArea from "antd/es/input/TextArea";
// import { PlusOutlined } from "@ant-design/icons";
import useCreateCustomer from "../hooks/useCreateCustomer";
import useUpdateCustomer from "../hooks/useUpdateCustomer";
import UseGetCustomer from "../hooks/useGetCustomer";
import UseGetSalesPeople from "../../salesPeople/hooks/useGetSalesPeople";
import { BreadcrumbContext } from "../../../../context/breadcrumb";
// import useUpload from "../hooks/useUpload";

const CustomerForm = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const { mutateAsync: create } = useCreateCustomer();
  const { mutateAsync: update } = useUpdateCustomer();
  const navigate = useNavigate();
  const params = useParams();
  const { data, isLoading } = UseGetCustomer({
    id: params.id ?? "",
  });
  const [form] = Form.useForm();
  // const [fileList, setFileList] = useState<UploadFile[]>([]);
  // const [previewOpen, setPreviewOpen] = useState(false);
  // const [previewImage, setPreviewImage] = useState("");
  // const { mutateAsync: upload } = useUpload();
  const [SalesParams, _] = useState<ITableParams>({
    pagination: {
      current: 1,
      pageSize: 100,
    },
  });
  const { data: salesResponse } = UseGetSalesPeople({
    page: SalesParams.pagination.current,
    limit: SalesParams.pagination.pageSize,
  });
  const [salesOption, setSalesOption] = useState<ISalesPeople[]>([]);
  const { setBreadcrumb } = useContext(BreadcrumbContext);

  useEffect(() => {
    setBreadcrumb([
      {
        title: "Data Master",
      },
      {
        title: "Pelanggan",
      },
      {
        title: params.id ? "Edit Pelanggan" : "Tambah Pelanggan",
      },
    ]);
  }, []);

  useEffect(() => {
    if (params.id) {
      form.setFieldsValue(data?.data.data);
    }
  }, [data]);

  useEffect(() => {
    if (salesResponse) {
      setSalesOption(salesResponse.data.data);
    }
  }, [salesResponse]);

  const submit: FormProps<ICustomer>["onFinish"] = (values) => {
    if (params.id) {
      update({ ...values, id: params.id });
    } else {
      create(values);
    }
  };

  const back = () => {
    navigate("/master/customer");
  };

  // const getBase64 = (file: FileType): Promise<string> =>
  //   new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.readAsDataURL(file as Blob);
  //     reader.onload = () => resolve(reader.result as string);
  //     reader.onerror = (error) => reject(error);
  //   });

  // const handlePreview = async (file: UploadFile) => {
  //   if (!file.url && !file.preview) {
  //     file.preview = await getBase64(file.originFileObj as FileType);
  //   }

  //   setPreviewImage(file.url || (file.preview as string));
  //   setPreviewOpen(true);
  // };

  // const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
  //   setFileList(newFileList);
  //   console.log(newFileList);
  //   // upload(fileList[0].originFileObj)
  // };

  // const uploadButton = (
  //   <button style={{ border: 0, background: "none" }} type="button">
  //     <PlusOutlined />
  //     <div style={{ marginTop: 8 }}>Upload</div>
  //   </button>
  // );

  const onChange = (value: string) => {
    console.log(`selected ${value}`);
  };

  const onSearch = (value: string) => {
    console.log("search:", value);
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
        <Form
          form={form}
          autoComplete="off"
          layout="vertical"
          onFinish={submit}
        >
          <Form.Item<ICustomer>
            label="Nama"
            name="full_name"
            rules={[{ required: true, message: "Silahkan masukan nama!" }]}
          >
            <Input />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item<ICustomer>
                label="Kode Pelanggan"
                name="customer_code"
                rules={[
                  {
                    required: true,
                    message: "Silahkan masukan no kode pelanggan!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item<ICustomer>
                label="No HP"
                name="phone_number"
                rules={[{ required: true, message: "Silahkan masukan no HP!" }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item<ICustomer>
                label="Kode Invoice"
                name="invoice_code"
                rules={[
                  {
                    required: true,
                    message: "Silahkan masukan no kode invoice!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item<ICustomer>
                label="No NPWP"
                name="npwp_number"
                rules={[
                  { required: true, message: "Silahkan masukan no NPWP!" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item<ICustomer>
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Silahkan masukan alamat email!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item<ICustomer>
            label="Nama Sales"
            name="sales_rep_id"
            rules={[{ required: true, message: "Silahkan pilih nama sales!" }]}
          >
            <Select
              showSearch
              placeholder="Pilih Sales"
              optionFilterProp="label"
              onSelect={onChange}
              onSearch={onSearch}
              options={salesOption.map((s) => ({
                value: s.id,
                label: s.full_name,
              }))}
            />
          </Form.Item>

          <Form.Item<ICustomer>
            label="Alamat"
            name="address"
            rules={[{ required: true, message: "Silahkan masukan no KTP!" }]}
          >
            <TextArea />
          </Form.Item>

          {/* <Form.Item<ICustomer>
            label="Foto NPWP"
            name="npwp_photo"
            rules={[{ required: true, message: "Silahkan upload foto NPWP!" }]}
          >
            <Upload
              listType="picture-card"
              fileList={fileList}
              accept=".png,.jpg,.jpeg,.webp"
              onPreview={handlePreview}
              onChange={handleChange}
            >
              {fileList.length >= 1 ? null : uploadButton}
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
          </Form.Item> */}

          <Flex gap="middle" align="end">
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

export default CustomerForm;
