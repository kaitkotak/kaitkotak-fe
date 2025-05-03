import React, { JSX, useState } from "react";

interface IBreadcrumbProps {
  children: React.ReactNode;
}

interface IBreadcrumbItem {
  title: string;
}

export const BreadcrumbContext = React.createContext<any>({
  breadcrumb: [],
  setBreadcrumb: () => {},
});

export const BreadcrumbProvider: React.FunctionComponent<IBreadcrumbProps> = ({
  children,
}: IBreadcrumbProps): JSX.Element => {
  const [breadcrumb, setBreadcrumb] = useState<IBreadcrumbItem[]>([]);

  return (
    <BreadcrumbContext.Provider
      value={{
        breadcrumb,
        setBreadcrumb,
      }}
    >
      {children}
    </BreadcrumbContext.Provider>
  );
};
