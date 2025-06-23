interface ICustomer {
  id: string;
  customer_code: string;
  full_name: string;
  phone_number: string;
  sales_rep_id: number;
  address: string;
  email: string;
  invoice_code: string;
  npwp_number: string;
  npwp_photo?: string;
}

interface ICustomerList {
  id: number;
  customer_code: string;
  full_name: string;
}

interface ICustomerListParams {
  payment: boolean
}
