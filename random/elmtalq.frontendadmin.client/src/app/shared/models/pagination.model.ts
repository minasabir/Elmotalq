export interface PagedResult<T> {
    items: T[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}

// Shape returned by the backend (matches C# PagedResult<T>)
export interface PagedResultDto<T> {
    Items: T[];
    TotalCount: number;
    PageNumber: number;
    PageSize: number;
    TotalPages: number;
    HasPreviousPage: boolean;
    HasNextPage: boolean;
}

