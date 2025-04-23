import {
  Button,
  Checkbox,
  Flex,
  Form,
  FormProps,
  Input,
  Spin,
  theme,
} from "antd";
import { Content } from "antd/es/layout/layout";
import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect } from "react";
// import { PlusOutlined } from "@ant-design/icons";
// import useCreateCustomer from "../hooks/useCreateCustomer";
// import useUpdateCustomer from "../hooks/useUpdateCustomer";
// import UseGetCustomer from "../hooks/useGetCustomer";
// import UseGetSalesPeople from "../../salesPeople/hooks/useGetSalesPeople";
// import useUpload from "../../../../hooks/useUpload";
// import { getBase64 } from "../../../../libs/getBase64";
import { BreadcrumbContext } from "../../../context/breadcrumb";

const UserForm = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  // const { mutateAsync: create, isPending: isPendingCreate } =
  //   useCreateCustomer();
  // const { mutateAsync: update, isPending: isPendingUpdate } =
  //   useUpdateCustomer();
  const navigate = useNavigate();
  const params = useParams();
  // const { data, isLoading } = UseGetCustomer({
  //   id: params.id ?? "",
  // });
  const [form] = Form.useForm();
  // const {
  //   mutateAsync: upload,
  //   data: uploadResponse,
  //   isPending: isPendingUpload,
  // } = useUpload();
  // const { data: salesResponse } = UseGetSalesPeople({
  //   page: SalesParams.pagination.current,
  //   limit: SalesParams.pagination.pageSize,
  // });
  const { setBreadcrumb } = useContext(BreadcrumbContext);

  useEffect(() => {
    setBreadcrumb([
      {
        title: "Pengguna",
      },
      {
        title: params.id ? "Edit Pengguna" : "Tambah Pengguna",
      },
    ]);
  }, []);

  // useEffect(() => {
  //   if (params.id) {
  //     form.setFieldsValue(data?.data.data);

  //     if (data?.data.data.npwp_photo) {
  //       setFileList([
  //         {
  //           uid: "-1",
  //           name: "default.png",
  //           status: "done",
  //           url: `${import.meta.env.VITE_API_URL}/file/download/${
  //             data?.data.data.npwp_photo
  //           }`,
  //         },
  //       ]);
  //     }
  //   }
  // }, [data]);

  // useEffect(() => {
  //   if (salesResponse) {
  //     setSalesOption(salesResponse.data.data);
  //   }
  // }, [salesResponse]);

  // useEffect(() => {
  //   form.setFieldValue("npwp_photo", uploadResponse?.data.data.name);
  // }, [uploadResponse]);

  const submit: FormProps<ICustomer>["onFinish"] = (values) => {
    console.log(values);
    // if (values.npwp_photo && !values.npwp_photo.includes("temp")) {
    //   delete values.npwp_photo;
    // }
    // if (params.id) {
    //   update({ ...values, id: params.id });
    // } else {
    //   create(values);
    // }
  };

  const back = () => {
    navigate("/user");
  };

  return (
    <Spin spinning={false}>
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
          initialValues={{
            permission: [
              {
                name: "Data Master Item",
                menu: false,
                create: false,
                update: false,
                delete: true,
              },
              {
                name: "Data Master Pelanggan",
                menu: false,
                create: false,
                update: false,
                delete: true,
              },
              {
                name: "Data Master Sales",
                menu: false,
                create: false,
                update: false,
                delete: true,
              },
              {
                name: "Data Master Transportasi",
                menu: false,
                create: false,
                update: false,
                delete: true,
              },
              {
                name: "Bahan Baku",
                menu: false,
                create: false,
                update: false,
                delete: true,
                stockOpname: false,
              },
              {
                name: "Produksi",
                menu: false,
                create: false,
                update: false,
                delete: true,
              },
              {
                name: "Purchase Order",
                menu: false,
                create: false,
                update: false,
                delete: true,
              },
              {
                name: "Penjualan",
                menu: false,
                create: false,
                update: false,
                delete: true,
              },
              {
                name: "Pengguna",
                menu: false,
                create: false,
                update: false,
                delete: true,
              },
            ],
          }}
          onFinish={submit}
        >
          <Form.Item<ICustomer>
            label="Nama"
            name="full_name"
            rules={[{ required: true, message: "Silahkan masukan nama!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<ICustomer>
            label="Kata Sandi"
            name="full_name"
            rules={[
              { required: true, message: "Silahkan masukan kata sandi!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item<ICustomer>
            label="Jabatan"
            name="full_name"
            rules={[{ required: true, message: "Silahkan masukan jabatan!" }]}
          >
            <Input />
          </Form.Item>

          <h2 className="text-xl mb-3 font-bold">Hak Akses</h2>

          <Form.List name="permission">
            {(fields) => (
              <>
                {fields.map(({ name }) => (
                  <>
                    <label className="text-lg font-bold mb-1">
                      {form.getFieldValue(["permission", name, "name"])}
                    </label>
                    <div className="flex gap-2 flex-wrap mb-2">
                      <Form.Item
                        name={[name, "menu"]}
                        style={{ marginBottom: 0 }}
                      >
                        <Checkbox>Akses Menu</Checkbox>
                      </Form.Item>

                      <Form.Item
                        name={[name, "create"]}
                        style={{ marginBottom: 0 }}
                      >
                        <Checkbox>Tambah Data</Checkbox>
                      </Form.Item>

                      <Form.Item
                        name={[name, "update"]}
                        style={{ marginBottom: 0 }}
                      >
                        <Checkbox>Edit Data</Checkbox>
                      </Form.Item>

                      <Form.Item
                        name={[name, "delete"]}
                        style={{ marginBottom: 0 }}
                      >
                        <Checkbox>Hapus Data</Checkbox>
                      </Form.Item>

                      {name === 4 && (
                        <Form.Item
                          name={[name, "stockOpname"]}
                          style={{ marginBottom: 0 }}
                        >
                          <Checkbox>Stok Opname</Checkbox>
                        </Form.Item>
                      )}
                    </div>
                  </>
                ))}
              </>
            )}
          </Form.List>

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

export default UserForm;
