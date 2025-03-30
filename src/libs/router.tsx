import { createBrowserRouter } from "react-router-dom";
import Transportation from "../features/master-data/transportation/pages/transportation";
import App from "../App";
import TransportationForm from "../features/master-data/transportation/pages/transportationForm";
import SalesPeople from "../features/master-data/salesPeople/pages/salesPeople";
import SalesPeopleForm from "../features/master-data/salesPeople/pages/salesPeopleForm";
import Customer from "../features/master-data/customer/pages/customer";
import CustomerForm from "../features/master-data/customer/pages/customerForm";
import Item from "../features/master-data/item/pages/item";
import ItemForm from "../features/master-data/item/pages/itemForm";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
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
