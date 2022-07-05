

// export function assignPaging(params) {
//   params.pageIndex = Number(params.pageIndex) || 1;
//   params.take = Number(params.pageSize) || Number(params.take) || 10;
//   params.skip = (params.pageIndex - 1) * params.take;

//   delete params.pageSize;
//   return params;
// }
import { IPaginationOptions } from '../interface/index.interface';

export const infinityPagination = <T>(
  data: T[],
  options: IPaginationOptions,
) => {
  return {
    data,
    hasNextPage: data.length === options.limit,
  };
};