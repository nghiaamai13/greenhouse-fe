export interface IIdentity {
  id: number;
  name: string;
  avatar: string;
  scope: string;
}

export interface ICustomerCreate {
  username: string;
  password: string;
}

export interface IDeviceCreate {
  name: string;
  label: string;
  device_profile_id: string;
  farm_id: string;
  is_gateway: boolean;
}

export interface IFarm {
  farm_id: string;
  descriptions: string;
  name: string;
  created_at: string;
  owner: Object[ICustomer];
  customer: Object[ICustomer];
  assigned_customer: string;
}

export interface IDevice {
  device_id: number;
  name: string;
  created_at: string;
  is_gateway: boolean;
  farm: Object[IFarm];
  device_profile: Object[IDeviceProfile];
}
export interface IDeviceProfile {
  profile_id: string;
  name: string;
  owner_id: string;
  created_at: string;
}

export interface ICustomer {
  user_id: string;
  username: string;
  created_at: string;
  created_by: string;
  role: string;
}

export interface IThreshold {
  farm_id: string;
  key: string;
  threshold_max: number;
  threshold_min: number;
  modified_by: string;
  modified_at: string;
  threshold_id: string;
}

export interface IThresholdAdd {
  key: string;
  threshold_max: number;
  threshold_min: number;
}
export interface ITelemetry {
  key: string;
  value: number;
  timestamp: string;
}

export type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};
