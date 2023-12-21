import { useApiUrl, useCustom } from "@refinedev/core";
import React from "react";

export const DashboardPage: React.FC = () => {
  interface DataTest {
    farm_id: string;
    name: string;
  }

  const apiUrl = useApiUrl();

  const { data, isLoading } = useCustom<DataTest[]>({
    url: `http://localhost:8000/api/farms`,
    method: "get",
    config: {
      headers: {
        "x-custom-header": "foo-bar",
      },
    },
  });

  const products = data?.data ?? [];

  return (
    <div>
      {products.map((product: DataTest) => (
        <ul key={product.farm_id}>
          <li key={product.farm_id}>{product.farm_id}</li>
        </ul>
      ))}
    </div>
  );
};
