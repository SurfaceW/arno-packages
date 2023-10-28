export const DEFAULT_PAGE_SIZE = 20;

/**
 * Basic Offset Pagination
 * @doc https://www.prisma.io/docs/concepts/components/prisma-client/pagination#offset-pagination
 * @description currentPage count from 1
 */
export interface IOffsetPaginationData<DataType = any> {
  pageSize: number;
  current: number;
  total: number;
  data?: DataType;
}

/**
 * Cursor based pagination
 * @doc https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination
 */
export interface ICursorPaginationData<DataType = any> {
  pageSize: number;
  cursor: string;
  total: number;
  data?: DataType;
}
