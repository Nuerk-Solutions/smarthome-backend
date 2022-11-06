type StringSortParameter = `${'-' | '+'}${string}`;

type PaginateResult<T> = {
  total: number;
  pageCount: number;
  data: T[];
  length: number;
  limit: number;
  page: number;
};
