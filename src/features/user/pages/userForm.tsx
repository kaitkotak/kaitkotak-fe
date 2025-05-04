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
import { BreadcrumbContext } from "../../../context/breadcrumb";
import UseGetUser from "../hooks/useGetUser";
import useCreateUser from "../hooks/useCreateUser";
import useUpdateUser from "../hooks/useUpdateUser";
import UseGetPermissionList from "../hooks/useGetPermissionList";
import { checkPermission } from "../../../libs/checkPermission";

const UserForm = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const { mutateAsync: create, isPending: isPendingCreate } = useCreateUser();
  const { mutateAsync: update, isPending: isPendingUpdate } = useUpdateUser();
  const navigate = useNavigate();
  const params = useParams();
  const { data, isLoading } = UseGetUser({
    id: params.id ?? "",
  });
  const [form] = Form.useForm();
  const { setBreadcrumb } = useContext(BreadcrumbContext);
  const { data: permissionResponse } = UseGetPermissionList();
  const groups = Form.useWatch("permissions", form);

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

  useEffect(() => {
    if (permissionResponse) {
      form.setFieldValue("permissions", permissionResponse.data.data);
    }

    if (params.id) {
      const newValue = form
        .getFieldValue("permissions")
        .map((permission: IPermissionList) => {
          const matchedPermission = data?.data.data.permissions.filter(
            (item: any) => item.code === permission.code
          )[0];

          if (matchedPermission) {
            permission.items.forEach((permissionItem: IPermissionItem) => {
              if (
                matchedPermission.items.some(
                  (item: string) => item === permissionItem.code
                )
              ) {
                permissionItem.value = true;
              }
            });
          }

          return permission;
        });
      form.setFieldsValue({ ...data?.data.data, permissions: newValue });
    }
  }, [data, permissionResponse]);

  // useEffect(() => {
  //   if (permissionResponse) {
  //     form.setFieldValue("permissions", permissionResponse.data.data);
  //   }
  // }, [permissionResponse]);

  const submit: FormProps<IUserResponse>["onFinish"] = (values) => {
    let permissions: number[] = [];
    values.permissions.forEach((permission: IPermissionList) => {
      permission.items.forEach((item: IPermissionItem) => {
        if (item.value === true) {
          permissions.push(item.id);
        }
      });
    });

    const payload: IUserPayload = { ...values, permissions };

    if (params.id) {
      update({ ...payload, id: params.id });
    } else {
      create(payload);
    }
  };

  const back = () => {
    navigate("/user");
  };

  return (
    <Spin spinning={isLoading || isPendingCreate || isPendingUpdate}>
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
            permissions: [],
          }}
          onFinish={submit}
        >
          <Form.Item<IUserResponse>
            label="Nama"
            name="name"
            rules={[{ required: true, message: "Silahkan masukan nama!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<IUserResponse>
            label="Username"
            name="username"
            rules={[{ required: true, message: "Silahkan masukan username!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<IUserResponse>
            label="Kata Sandi"
            name="password"
            rules={
              params.id
                ? []
                : [{ required: true, message: "Silahkan masukan kata sandi!" }]
            }
          >
            <Input />
          </Form.Item>

          <Form.Item<IUserResponse>
            label="Jabatan"
            name="job_title"
            rules={[{ required: true, message: "Silahkan masukan jabatan!" }]}
          >
            <Input />
          </Form.Item>

          <h2 className="text-xl mb-3 font-bold">Hak Akses</h2>

          <Form.List name="permissions">
            {(fields) => (
              <>
                {fields.map(({ name }, index) => (
                  <>
                    <label className="text-lg font-bold mb-1">
                      {groups[index].name}
                    </label>
                    <div className="flex gap-2 flex-wrap mb-2">
                      <Form.List name={[name, "items"]}>
                        {(subFields) => (
                          <>
                            {subFields.map((subField, childIndex) => (
                              <Form.Item
                                name={[subField.name, "value"]}
                                style={{ marginBottom: 0 }}
                                valuePropName="checked"
                              >
                                <Checkbox>
                                  {groups[index].items[childIndex].name}
                                </Checkbox>
                              </Form.Item>
                            ))}
                          </>
                        )}
                      </Form.List>
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

            {checkPermission("user.update") && (
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

export default UserForm;
