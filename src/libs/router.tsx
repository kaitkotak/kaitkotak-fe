import { createBrowserRouter } from "react-router-dom";
import Transportation from "../features/master-data/transportation/pages/transportation";
import App from "../App";
import TransportationForm from "../features/master-data/transportation/pages/transportationForm";
import SalesPeople from "../features/master-data/salesPeople/pages/salesPeople";
import SalesPeopleForm from "../features/master-data/salesPeople/pages/salesPeopleForm";

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
        ],
      },
    ],
  },
]);
