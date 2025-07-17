import { Button, Flex, Form, FormProps, Input, Spin, theme } from "antd";
import { Content } from "antd/es/layout/layout";
import useCreateTransportation from "../hooks/useCreateTransportation";
import { useNavigate, useParams } from "react-router-dom";
import UseGetTransportation from "../hooks/useGetTransportation";
import { useContext, useEffect } from "react";
import useUpdateTransportation from "../hooks/useUpdateTransportation";
import { BreadcrumbContext } from "../../../../context/breadcrumb";
import { useCheckPermission } from "../../../../hooks/useCheckPermission";

const TransportationForm = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const { mutateAsync: create } = useCreateTransportation();
  const { mutateAsync: update } = useUpdateTransportation();
  const navigate = useNavigate();
  const params = useParams();
  const { data, isLoading } = UseGetTransportation({
    id: params.id ?? "",
  });
  const [form] = Form.useForm();
  const { setBreadcrumb } = useContext(BreadcrumbContext);
  const checkPermission = useCheckPermission();

  useEffect(() => {
    setBreadcrumb([
      {
        title: "Data Master",
      },
      {
        title: "Transportasi",
      },
      {
        title: params.id ? "Edit Transportasi" : "Tambah Transportasi",
      },
    ]);
  }, []);

  useEffect(() => {
    if (params.id) {
      form.setFieldsValue(data?.data.data);
    }
  }, [data]);

  const submit: FormProps<ITransportationForm>["onFinish"] = (values) => {
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
          // autoComplete="off"
          layout="vertical"
          onFinish={submit}
        >
          <Form.Item<ITransportationForm>
            label="Nama"
            name="driver_name"
            rules={[{ required: true, message: "Silahkan masukan nama!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<ITransportationForm>
            label="No HP"
            name="phone_number"
            rules={[{ required: true, message: "Silahkan masukan no HP!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<ITransportationForm>
            label="No Kendaraan"
            name="vehicle_number"
            rules={[
              { required: true, message: "Silahkan masukan no kendaraan!" },
            ]}
          >
            <Input />
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

            {checkPermission("master_transportation.update") && (
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

export default TransportationForm;
