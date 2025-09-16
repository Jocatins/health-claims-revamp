import axiosInstance from './axiosInstance';
import type { TariffListResponse, TariffQueryArgs } from '../../types/Tariff';

// Map camelCase params to API expected query keys
const buildParams = (args: TariffQueryArgs) => {
  const params: Record<string, string | number> = {};
  if (args.pageNumber !== undefined) params.PageNumber = args.pageNumber;
  if (args.pageSize !== undefined) params.PageSize = args.pageSize;
  if (args.sortedBy) params.SortedBy = args.sortedBy;
  if (args.sortDirection) params.SortDirection = args.sortDirection;
  return params;
};

export const fetchTariffs = async (args: TariffQueryArgs): Promise<TariffListResponse> => {
  const params = buildParams(args);
  const url = `/tariff/providers/${args.providerId}/hmos/${args.hmoId}`;
  const res = await axiosInstance.get(url, { params });
  return res.data;
};
