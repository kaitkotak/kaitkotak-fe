import {
  Button,
  Col,
  Flex,
  Form,
  FormProps,
  // Image,
  Input,
  Row,
  Spin,
  theme,
  // Upload,
  // UploadFile,
  // UploadProps,
} from "antd";
import { Content } from "antd/es/layout/layout";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import UseGetDetailSalesPeople from "../hooks/useGetDetailSalesPeople";
import useCreateSalesPeople from "../hooks/useCreateSalesPeople";
import useUpdateSalesPeople from "../hooks/useUpdateSalesPeople";
import TextArea from "antd/es/input/TextArea";
// import { PlusOutlined } from "@ant-design/icons";
// import useUpload from "../../../../hooks/useUpload";

const SalesPeopleForm = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const { mutateAsync: create } = useCreateSalesPeople();
  const { mutateAsync: update } = useUpdateSalesPeople();
  const navigate = useNavigate();
  const params = useParams();
  const { data, isLoading } = UseGetDetailSalesPeople({
    id: params.id ?? "",
  });
  const [form] = Form.useForm();
  // const [photoList, setPhotoList] = useState<UploadFile[]>([]);
  // const [ktpPhotoList, setKtpPhotoList] = useState<UploadFile[]>([]);
  // const [previewOpen, setPreviewOpen] = useState(false);
  // const [previewImage, setPreviewImage] = useState("");
  // const { mutateAsync: upload, data: uploadResponse } = useUpload();
  // const [photo, setPhoto] = useState<string>("");
  // const [ktpPhoto, setKtpPhoto] = useState<string>("");
  // const [fileChange, setFileChange] = useState<string>("");

  useEffect(() => {
    if (params.id) {
      form.setFieldsValue(data?.data.data);
    }
  }, [data]);

  // useEffect(() => {
  //   if (fileChange === "photo") {
  //     setPhoto(uploadResponse?.data.data.name);
  //   } else {
  //     setKtpPhoto(uploadResponse?.data.data.name);
  //   }
  // }, [uploadResponse]);

  const submit: FormProps<ISalesPeople>["onFinish"] = (values) => {
    if (params.id) {
      update({
        ...values,
        id: params.id,
        // ktp_photo: ktpPhoto,
        // profile_photo: photo,
      });
    } else {
      create({
        ...values,
        // ktp_photo: ktpPhoto,
        // profile_photo: photo
      });
    }
  };

  const back = () => {
    navigate("/master/transportation");
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
  //   if (fileChange === "photo") {
  //     setPhotoList(newFileList);
  //   } else {
  //     setKtpPhotoList(newFileList);
  //   }
  //   upload(newFileList[0].originFileObj as File);
  // };

  // const uploadButton = (
  //   <button style={{ border: 0, background: "none" }} type="button">
  //     <PlusOutlined />
  //     <div style={{ marginTop: 8 }}>Upload</div>
  //   </button>
  // );

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

          {/* <Row>
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
                    handleChange($event);
                    setFileChange("photo");
                  }}
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
                    handleChange($event);
                    setFileChange("ktpPhoto");
                  }}
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
          </Row> */}

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

export default SalesPeopleForm;
