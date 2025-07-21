import {
  Button,
  Col,
  Flex,
  Form,
  FormProps,
  Image,
  // Image,
  Input,
  Row,
  Select,
  // Space,
  Spin,
  theme,
  Upload,
  UploadFile,
  UploadProps,
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
import useUpload from "../../../../hooks/useUpload";
import { getBase64 } from "../../../../libs/getBase64";
import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { useCheckPermission } from "../../../../hooks/useCheckPermission";

const CustomerForm = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const { mutateAsync: create, isPending: isPendingCreate } =
    useCreateCustomer();
  const { mutateAsync: update, isPending: isPendingUpdate } =
    useUpdateCustomer();
  const navigate = useNavigate();
  const params = useParams();
  const { data, isLoading } = UseGetCustomer({
    id: params.id ?? "",
  });
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const {
    mutateAsync: upload,
    data: uploadResponse,
    isPending: isPendingUpload,
  } = useUpload();
  const [SalesParams, _] = useState<ITableParams>({
    pagination: {
      current: 1,
      pageSize: 100,
    },
  });
  const { data: salesResponse, refetch: refetchSales, isLoading: isSalesLoading, isRefetching: isSalesRefecthing } = UseGetSalesPeople({
    page: SalesParams.pagination.current,
    limit: SalesParams.pagination.pageSize,
  });
  const [salesOption, setSalesOption] = useState<ISalesPeople[]>([]);
  const { setBreadcrumb } = useContext(BreadcrumbContext);
  const checkPermission = useCheckPermission();

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

    localStorage.setItem("isForm", 'true');
  }, []);

  useEffect(() => {
    if (params.id) {
      form.setFieldsValue(data?.data.data);

      if (data?.data.data.npwp_photo) {
        setFileList([
          {
            uid: "-1",
            name: "default.png",
            status: "done",
            url: `${import.meta.env.VITE_API_URL}/file/download/${
              data?.data.data.npwp_photo
            }`,
          },
        ]);
      }
    }
  }, [data]);

  useEffect(() => {
    if (salesResponse) {
      setSalesOption(salesResponse.data.data);
    }
  }, [salesResponse]);

  useEffect(() => {
    form.setFieldValue("npwp_photo", uploadResponse?.data.data.name);
  }, [uploadResponse]);

  const submit: FormProps<ICustomer>["onFinish"] = (values) => {
    if (values.npwp_photo && !values.npwp_photo.includes("temp")) {
      delete values.npwp_photo;
    }

    if (params.id) {
      update({ ...values, id: params.id });
    } else {
      create(values);
    }
  };

  const back = () => {
    navigate("/master/customer");
  };

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);

    if (newFileList.length) {
      upload(newFileList[0].originFileObj as File);
    } else {
      form.setFieldValue("npwp_photo", "");
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
        isLoading || isPendingCreate || isPendingUpdate || isPendingUpload || isSalesLoading || isSalesRefecthing
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
          <Button onClick={() => refetchSales()} icon={<ReloadOutlined />} className={'mb-4'} color="primary"
                  variant="solid">
            <span className="hidden md:inline">Refresh Data Master</span>
          </Button>
        </div>

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
              options={salesOption.map((s) => ({
                value: s.id,
                label: s.full_name,
              }))}
            />
          </Form.Item>

          <Form.Item<ICustomer>
            label="Alamat"
            name="address"
            rules={[{ required: true, message: "Silahkan masukan alamat!" }]}
          >
            <TextArea />
          </Form.Item>

          <Form.Item<ICustomer>
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
              beforeUpload={() => false}
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
          </Form.Item>

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

            {checkPermission("master_customer.update") && (
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

export default CustomerForm;
