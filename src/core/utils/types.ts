type StringSortParameter = `${'-' | '+'}${string}`;

type PaginateResult<T> = {
  total: number;
  pageCount: number;
  data: T[];
  length: number;
  limit: number;
  page: number;
};

type DriverStats = {
  driver: string;
  totalDistance: number;
  totalCost: number;
  vehicles: [
    {
      vehicle: string;
      distance: number;
      cost: number
    }
  ];
}