import { createBrowserRouter, Navigate } from "react-router-dom";
import Transportation from "../features/master-data/transportation/pages/transportation";
import App from "../App";
import TransportationForm from "../features/master-data/transportation/pages/transportationForm";
import SalesPeople from "../features/master-data/salesPeople/pages/salesPeople";
import SalesPeopleForm from "../features/master-data/salesPeople/pages/salesPeopleForm";
import Customer from "../features/master-data/customer/pages/customer";
import CustomerForm from "../features/master-data/customer/pages/customerForm";
import Item from "../features/master-data/item/pages/item";
import ItemForm from "../features/master-data/item/pages/itemForm";
import Production from "../features/production/pages/production";
import ProductionForm from "../features/production/pages/productionForm";
import PurchaseOrder from "../features/purchase-order/pages/purchaseOrder";
import PurchaseOrderForm from "../features/purchase-order/pages/purchaseOrderForm";
import ProductionPlan from "../features/production/pages/productionPlan";
import Sales from "../features/sales/pages/sales";
import SalesForm from "../features/sales/pages/salesForm";
import User from "../features/user/pages/user";
import UserForm from "../features/user/pages/userForm";
import RawMaterial from "../features/raw-material/pages/rawMaterial";
import Login from "../features/login/pages/login";
import OwnLayout from "../ownLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Navigate to="login" />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "/",
        element: <OwnLayout />,
        children: [
          {
            path: "production",
            children: [
              {
                path: "",
                element: <Production />,
              },
              {
                path: "plan",
                element: <ProductionPlan />,
              },
              {
                path: "create",
                element: <ProductionForm />,
              },
              {
                path: "edit/:id",
                element: <ProductionForm />,
              },
            ],
          },
          {
            path: "purchase-order",
            children: [
              {
                path: "",
                element: <PurchaseOrder />,
              },
              {
                path: "create",
                element: <PurchaseOrderForm />,
              },
              {
                path: "edit/:id",
                element: <PurchaseOrderForm />,
              },
            ],
          },
          {
            path: "sales",
            children: [
              {
                path: "",
                element: <Sales />,
              },
              {
                path: "create",
                element: <SalesForm />,
              },
              {
                path: "edit/:id",
                element: <SalesForm />,
              },
            ],
          },
          {
            path: "raw-material",
            element: <RawMaterial />,
          },
          {
            path: "user",
            children: [
              {
                path: "",
                element: <User />,
              },
              {
                path: "create",
                element: <UserForm />,
              },
              {
                path: "edit/:id",
                element: <UserForm />,
              },
            ],
          },
          {
            path: "master",
            children: [
              {
                path: "transportation",
                children: [
                  {
                    path: "",
                    element: <Transportation />,
                  },
                  {
                    path: "create",
                    element: <TransportationForm />,
                  },
                  {
                    path: "edit/:id",
                    element: <TransportationForm />,
                  },
                ],
              },
              {
                path: "sales-people",
                children: [
                  {
                    path: "",
                    element: <SalesPeople />,
                  },
                  {
                    path: "create",
                    element: <SalesPeopleForm />,
                  },
                  {
                    path: "edit/:id",
                    element: <SalesPeopleForm />,
                  },
                ],
              },
              {
                path: "customer",
                children: [
                  {
                    path: "",
                    element: <Customer />,
                  },
                  {
                    path: "create",
                    element: <CustomerForm />,
                  },
                  {
                    path: "edit/:id",
                    element: <CustomerForm />,
                  },
                ],
              },
              {
                path: "item",
                children: [
                  {
                    path: "",
                    element: <Item />,
                  },
                  {
                    path: "create",
                    element: <ItemForm />,
                  },
                  {
                    path: "edit/:id",
                    element: <ItemForm />,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
]);
