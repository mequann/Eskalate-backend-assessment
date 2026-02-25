
export interface BaseResponse<T> {
  Success: boolean;
  Message: string;
  Object: T | null;
  Errors: string[] | null;
}

export interface PaginatedResponse<T> {
  Success: boolean;
  Message: string;
  Object: T[];
  PageNumber: number;
  PageSize: number;
  TotalSize: number;
  Errors: null;
}

export const successResponse = <T>(data: T, message = 'Success'): BaseResponse<T> => ({
  Success: true,
  Message: message,
  Object: data,
  Errors: null
});

export const errorResponse = (message: string, errors: string[] = []): BaseResponse<null> => ({
  Success: false,
  Message: message,
  Object: null,
  Errors: errors
});

export const paginatedResponse = <T>(
  data: T[],
  page: number,
  pageSize: number,
  total: number,
  message = 'Success'
): PaginatedResponse<T> => ({
  Success: true,
  Message: message,
  Object: data,
  PageNumber: page,
  PageSize: pageSize,
  TotalSize: total,
  Errors: null
});