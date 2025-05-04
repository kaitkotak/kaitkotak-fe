import { Result } from "antd";

const AccessDenied = () => (
  <Result
    status="403"
    title="403"
    subTitle="Maaf, Anda tidak memiliki izin untuk mengakses halaman ini."
  />
);

export default AccessDenied;
