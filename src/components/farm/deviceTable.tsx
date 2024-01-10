import { useCustom } from "@refinedev/core";
import { IDevice } from "../../interfaces";

type farmComponentProps = {
  farm_id: string;
  apiUrl: string;
};

const DeviceTable: React.FC<farmComponentProps> = ({ farm_id, apiUrl }) => {
  const { data, isLoading } = useCustom<IDevice[]>({
    url: `${apiUrl}/farms/${farm_id}/devices`,
    method: "get",
  });

  return (
    <>
      Device List
      {farm_id !== "" && apiUrl && (
        <ul>
          {data?.data.map((device) => (
            <li key={device.device_id}>{device.device_id}</li>
          ))}
        </ul>
      )}
    </>
  );
};

export default DeviceTable;
