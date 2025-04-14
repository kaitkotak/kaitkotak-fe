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
import RawMaterial from "../features/raw-material/pages/rawMaterial";
import Production from "../features/production/pages/production";
import ProductionForm from "../features/production/pages/productionForm";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Navigate to="/master/item" />,
      },
      {
        path: "production",
        children: [
          {
            path: "",
            element: <Production />,
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
        path: "raw-material",
        element: <RawMaterial />,
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
]);
