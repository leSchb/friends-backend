export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
}

export interface Pagination<T> {
  items: T[];
  meta: PaginationMeta;
}
