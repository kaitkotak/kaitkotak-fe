import {
  Button,
  Col,
  Flex,
  Form,
  FormProps,
  Image,
  Input,
  Row,
  Spin,
  theme,
  Upload,
  UploadFile,
  UploadProps,
} from "antd";
import { Content } from "antd/es/layout/layout";
import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import UseGetDetailSalesPeople from "../hooks/useGetDetailSalesPeople";
import useCreateSalesPeople from "../hooks/useCreateSalesPeople";
import useUpdateSalesPeople from "../hooks/useUpdateSalesPeople";
import TextArea from "antd/es/input/TextArea";
import { BreadcrumbContext } from "../../../../context/breadcrumb";
import { PlusOutlined } from "@ant-design/icons";
import useUpload from "../../../../hooks/useUpload";
import { getBase64 } from "../../../../libs/getBase64";

const SalesPeopleForm = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const { mutateAsync: create, isPending: isPendingCreate } =
    useCreateSalesPeople();
  const { mutateAsync: update, isPending: isPendingUpdate } =
    useUpdateSalesPeople();
  const navigate = useNavigate();
  const params = useParams();
  const { data, isLoading } = UseGetDetailSalesPeople({
    id: params.id ?? "",
  });
  const [form] = Form.useForm();
  const [photoList, setPhotoList] = useState<UploadFile[]>([]);
  const [ktpPhotoList, setKtpPhotoList] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const {
    mutateAsync: upload,
    data: uploadResponse,
    isPending: isPendingUpload,
  } = useUpload();
  const [fileChange, setFileChange] = useState<string>("");
  const { setBreadcrumb } = useContext(BreadcrumbContext);

  useEffect(() => {
    setBreadcrumb([
      {
        title: "Data Master",
      },
      {
        title: "Sales",
      },
      {
        title: params.id ? "Edit Sales" : "Tambah Sales",
      },
    ]);
  }, []);

  useEffect(() => {
    if (params.id) {
      form.setFieldsValue(data?.data.data);

      if (data?.data.data.profile_photo) {
        setPhotoList([
          {
            uid: "-1",
            name: "default.png",
            status: "done",
            url: `${import.meta.env.VITE_API_URL}/file/download/${
              data?.data.data.profile_photo
            }`,
          },
        ]);
      }

      if (data?.data.data.ktp_photo) {
        setKtpPhotoList([
          {
            uid: "-1",
            name: "default.png",
            status: "done",
            url: `${import.meta.env.VITE_API_URL}/file/download/${
              data?.data.data.ktp_photo
            }`,
          },
        ]);
      }
    }
  }, [data]);

  useEffect(() => {
    form.setFieldValue(
      fileChange === "photo" ? "profile_photo" : "ktp_photo",
      uploadResponse?.data.data.name
    );
  }, [uploadResponse]);

  const submit: FormProps<ISalesPeople>["onFinish"] = (values) => {
    if (params.id) {
      update({
        ...values,
        id: params.id,
      });
    } else {
      create(values);
    }
  };

  const back = () => {
    navigate("/master/sales-people");
  };

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleProfilePhotoChange: UploadProps["onChange"] = ({
    fileList: newFileList,
  }) => {
    setPhotoList(newFileList);

    if (newFileList.length) {
      upload(newFileList[0].originFileObj as File);
    } else {
      form.setFieldValue("profile_photo", "");
    }
  };

  const handlePhotoKtpChange: UploadProps["onChange"] = ({
    fileList: newFileList,
  }) => {
    setKtpPhotoList(newFileList);

    if (newFileList.length) {
      upload(newFileList[0].originFileObj as File);
    } else {
      form.setFieldValue("ktp_photo", "");
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
        isLoading || isPendingCreate || isPendingUpdate || isPendingUpload
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
        <Form
          form={form}
          autoComplete="off"
          layout="vertical"
          onFinish={submit}
        >
          <Form.Item<ISalesPeople>
            label="Nama"
            name="full_name"
            rules={[{ required: true, message: "Silahkan masukan nama!" }]}
          >
            <Input />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item<ISalesPeople>
                label="No KTP"
                name="ktp"
                rules={[
                  { required: true, message: "Silahkan masukan no KTP!" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item<ISalesPeople>
                label="No HP"
                name="phone_number"
                rules={[{ required: true, message: "Silahkan masukan no HP!" }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item<ISalesPeople>
            label="Alamat"
            name="address"
            rules={[{ required: true, message: "Silahkan masukan no KTP!" }]}
          >
            <TextArea />
          </Form.Item>

          <Row>
            <Col span={12}>
              <Form.Item<ISalesPeople>
                label="Foto"
                name="profile_photo"
                rules={[
                  { required: true, message: "Silahkan upload foto sales!" },
                ]}
              >
                <Upload
                  listType="picture-card"
                  fileList={photoList}
                  accept=".png,.jpg,.jpeg,.webp"
                  onPreview={handlePreview}
                  onChange={($event) => {
                    setFileChange("photo");
                    handleProfilePhotoChange($event);
                  }}
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
                      afterOpenChange: (visible) =>
                        !visible && setPreviewImage(""),
                    }}
                    src={previewImage}
                  />
                )}
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item<ISalesPeople>
                label="Foto KTP"
                name="ktp_photo"
                rules={[
                  { required: true, message: "Silahkan upload foto KTP!" },
                ]}
              >
                <Upload
                  listType="picture-card"
                  fileList={ktpPhotoList}
                  accept=".png,.jpg,.jpeg,.webp"
                  onPreview={handlePreview}
                  onChange={($event) => {
                    setFileChange("ktpPhoto");
                    handlePhotoKtpChange($event);
                  }}
                  beforeUpload={() => false}
                >
                  {ktpPhotoList.length >= 1 ? null : uploadButton}
                </Upload>
                {previewImage && (
                  <Image
                    wrapperStyle={{ display: "none" }}
                    preview={{
                      visible: previewOpen,
                      onVisibleChange: (visible) => setPreviewOpen(visible),
                      afterOpenChange: (visible) =>
                        !visible && setPreviewImage(""),
                    }}
                    src={previewImage}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>

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

export default SalesPeopleForm;
