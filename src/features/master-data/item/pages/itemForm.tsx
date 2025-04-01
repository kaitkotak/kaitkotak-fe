import {
  Button,
  Col,
  Flex,
  Form,
  FormProps,
  Input,
  Row,
  Spin,
  theme,
} from "antd";
import { Content } from "antd/es/layout/layout";
import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect } from "react";
import useCreateItem from "../hooks/useCreateItem";
import useUpdateItem from "../hooks/useUpdateItem";
import UseGetItem from "../hooks/useGetItem";
import { BreadcrumbContext } from "../../../../context/breadcrumb";

const ItemForm = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const { mutateAsync: create } = useCreateItem();
  const { mutateAsync: update } = useUpdateItem();
  const navigate = useNavigate();
  const params = useParams();
  const { data, isLoading } = UseGetItem({
    id: params.id ?? "",
  });
  const [form] = Form.useForm();
  const { setBreadcrumb } = useContext(BreadcrumbContext);

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
    }
  }, [data]);

  const submit: FormProps<IItemnForm>["onFinish"] = (values) => {
    if (params.id) {
      update({ ...values, id: params.id });
    } else {
      create(values);
    }
  };

  const back = () => {
    navigate("/master/item");
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
          // autoComplete="off"
          layout="vertical"
          onFinish={submit}
        >
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
                label="Berat (gr)"
                name="weight_g"
                rules={[{ required: true, message: "Silahkan masukan berat!" }]}
              >
                <Input />
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
            <Input />
          </Form.Item>

          <Form.Item<IItemnForm>
            label="Harga Jual (kg)"
            name="price_per_kg"
            rules={[
              { required: true, message: "Silahkan masukan harga per kg!" },
            ]}
          >
            <Input />
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
            <Input />
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
            <Input />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item<IItemnForm>
                label="Tipe"
                name="type"
                rules={[{ required: true, message: "Silahkan pilih tipe!" }]}
              >
                <Input />
              </Form.Item>
            </Col>

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
          </Row>

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

export default ItemForm;
