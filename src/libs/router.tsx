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
import ProtectedRoute from "./protectedRoute";
import AccessDeniedPage from "../features/error/pages/accessDenied";
import Home from "../features/home/pages/home";
import PaymentHistories from "../features/payment/pages/paymentHistories";
import PaymentForm from "../features/payment/pages/paymentForm";
import PaymentHistory from "../features/sales/pages/paymentHistory";

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
            path: "home",
            element: <Home />,
          },
          {
            path: "production",
            children: [
              {
                path: "",
                element: (
                  <ProtectedRoute requiredPermission="production.access">
                    <Production />
                  </ProtectedRoute>
                ),
              },
              {
                path: "plan",
                element: (
                  <ProtectedRoute requiredPermission="production.access">
                    <ProductionPlan />
                  </ProtectedRoute>
                ),
              },
              {
                path: "create",
                element: (
                  <ProtectedRoute requiredPermission="production.create">
                    <ProductionForm />
                  </ProtectedRoute>
                ),
              },
              {
                path: "edit/:id",
                element: (
                  <ProtectedRoute requiredPermission="production.update">
                    <ProductionForm />
                  </ProtectedRoute>
                ),
              },
            ],
          },
          {
            path: "purchase-order",
            children: [
              {
                path: "",
                element: (
                  <ProtectedRoute requiredPermission="purchase_order.access">
                    <PurchaseOrder />
                  </ProtectedRoute>
                ),
              },
              {
                path: "create",
                element: (
                  <ProtectedRoute requiredPermission="purchase_order.create">
                    <PurchaseOrderForm />
                  </ProtectedRoute>
                ),
              },
              {
                path: "edit/:id",
                element: (
                  <ProtectedRoute requiredPermission="purchase_order.update">
                    <PurchaseOrderForm />
                  </ProtectedRoute>
                ),
              },
            ],
          },
          {
            path: "sales",
            children: [
              {
                path: "",
                element: (
                  <ProtectedRoute requiredPermission="sales.access">
                    <Sales />
                  </ProtectedRoute>
                ),
              },
              {
                path: "create",
                element: (
                  <ProtectedRoute requiredPermission="sales.create">
                    <SalesForm />
                  </ProtectedRoute>
                ),
              },
              {
                path: "edit/:id",
                element: (
                  <ProtectedRoute requiredPermission="sales.update">
                    <SalesForm />
                  </ProtectedRoute>
                ),
              },
              {
                path: "payment-history/:id",
                element: (
                  <ProtectedRoute requiredPermission="sales.access">
                    <PaymentHistory />
                  </ProtectedRoute>
                ),
              },
            ],
          },
          {
            path: "payment",
            children: [
              {
                path: "",
                element: (
                  <ProtectedRoute requiredPermission="payment.access">
                    <PaymentHistories />
                  </ProtectedRoute>
                ),
              },
              {
                path: "create",
                element: (
                  <ProtectedRoute requiredPermission="payment.create">
                    <PaymentForm />
                  </ProtectedRoute>
                ),
              },
              {
                path: "edit/:id",
                element: (
                  <ProtectedRoute requiredPermission="payment.update">
                    <PaymentForm />
                  </ProtectedRoute>
                ),
              },
            ],
          },
          {
            path: "raw-material",
            element: (
              <ProtectedRoute requiredPermission="raw_material.access">
                <RawMaterial />
              </ProtectedRoute>
            ),
          },
          {
            path: "user",
            children: [
              {
                path: "",
                element: (
                  <ProtectedRoute requiredPermission="user.access">
                    <User />
                  </ProtectedRoute>
                ),
              },
              {
                path: "create",
                element: (
                  <ProtectedRoute requiredPermission="user.create">
                    <UserForm />
                  </ProtectedRoute>
                ),
              },
              {
                path: "edit/:id",
                element: (
                  <ProtectedRoute requiredPermission="user.update">
                    <UserForm />
                  </ProtectedRoute>
                ),
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
                    element: (
                      <ProtectedRoute requiredPermission="master_transportation.access">
                        <Transportation />
                      </ProtectedRoute>
                    ),
                  },
                  {
                    path: "create",
                    element: (
                      <ProtectedRoute requiredPermission="master_transportation.create">
                        <TransportationForm />
                      </ProtectedRoute>
                    ),
                  },
                  {
                    path: "edit/:id",
                    element: (
                      <ProtectedRoute requiredPermission="master_transportation.update">
                        <TransportationForm />
                      </ProtectedRoute>
                    ),
                  },
                ],
              },
              {
                path: "sales-people",
                children: [
                  {
                    path: "",
                    element: (
                      <ProtectedRoute requiredPermission="master_sales.access">
                        <SalesPeople />
                      </ProtectedRoute>
                    ),
                  },
                  {
                    path: "create",
                    element: (
                      <ProtectedRoute requiredPermission="master_sales.create">
                        <SalesPeopleForm />
                      </ProtectedRoute>
                    ),
                  },
                  {
                    path: "edit/:id",
                    element: (
                      <ProtectedRoute requiredPermission="master_sales.update">
                        <SalesPeopleForm />
                      </ProtectedRoute>
                    ),
                  },
                ],
              },
              {
                path: "customer",
                children: [
                  {
                    path: "",
                    element: (
                      <ProtectedRoute requiredPermission="master_customer.access">
                        <Customer />
                      </ProtectedRoute>
                    ),
                  },
                  {
                    path: "create",
                    element: (
                      <ProtectedRoute requiredPermission="master_customer.create">
                        <CustomerForm />
                      </ProtectedRoute>
                    ),
                  },
                  {
                    path: "edit/:id",
                    element: (
                      <ProtectedRoute requiredPermission="master_customer.update">
                        <CustomerForm />
                      </ProtectedRoute>
                    ),
                  },
                ],
              },
              {
                path: "item",
                children: [
                  {
                    path: "",
                    element: (
                      <ProtectedRoute requiredPermission="master_item.access">
                        <Item />
                      </ProtectedRoute>
                    ),
                  },
                  {
                    path: "create",
                    element: (
                      <ProtectedRoute requiredPermission="master_item.create">
                        <ItemForm />
                      </ProtectedRoute>
                    ),
                  },
                  {
                    path: "edit/:id",
                    element: (
                      <ProtectedRoute requiredPermission="master_item.update">
                        <ItemForm />
                      </ProtectedRoute>
                    ),
                  },
                ],
              },
            ],
          },
          {
            path: "403",
            element: <AccessDeniedPage />,
          },
        ],
      },
    ],
  },
]);
