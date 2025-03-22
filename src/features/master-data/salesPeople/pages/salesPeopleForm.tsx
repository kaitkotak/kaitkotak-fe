import {
  Button,
  Flex,
  Form,
  FormProps,
  Input,
  Spin,
  theme,
  // Upload,
  // UploadFile,
} from "antd";
import { Content } from "antd/es/layout/layout";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import UseGetDetailSalesPeople from "../hooks/useGetDetailSalesPeople";
import useCreateSalesPeople from "../hooks/useCreateSalesPeople";
import useUpdateSalesPeople from "../hooks/useUpdateSalesPeople";
import TextArea from "antd/es/input/TextArea";

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
  // const [fileList, setFileList] = useState<UploadFile[]>([]);

  useEffect(() => {
    form.setFieldsValue(data?.data.data);
  }, [data]);

  const submit: FormProps<ISalesPeople>["onFinish"] = (values) => {
    if (params.id) {
      update({ ...values, id: params.id });
    } else {
      create(values);
    }
  };

  const back = () => {
    navigate("/master/transportation");
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
          <Form.Item<ISalesPeople>
            label="Nama"
            name="full_name"
            rules={[{ required: true, message: "Silahkan masukan nama!" }]}
          >
            <Input />
          </Form.Item>

          <Flex>
            <Form.Item<ISalesPeople>
              label="No KTP"
              name="ktp"
              rules={[{ required: true, message: "Silahkan masukan no KTP!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item<ISalesPeople>
              label="No HP"
              name="phone_number"
              rules={[{ required: true, message: "Silahkan masukan no HP!" }]}
            >
              <Input />
            </Form.Item>
          </Flex>

          <Form.Item<ISalesPeople>
            label="Alamat"
            name="address"
            rules={[{ required: true, message: "Silahkan masukan no KTP!" }]}
          >
            <TextArea />
          </Form.Item>

          <Form.Item<ISalesPeople>
            label="No KTP"
            name="ktp"
            rules={[{ required: true, message: "Silahkan masukan no KTP!" }]}
          >
            {/* <Upload
              action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
              listType="picture-card"
              fileList={fileList}
              onPreview={handlePreview}
              onChange={handleChange}
            >
              {fileList.length >= 8 ? null : uploadButton}
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
            )} */}
          </Form.Item>

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
