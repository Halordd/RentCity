import {
  apiOperations,
  type ApiOperationKey,
  type ApiOperationKeyByMethod,
  type ApiPathParams,
  type ApiQuery,
  type ApiRequestBody
} from "./generated";
import { http } from "./httpClient";

type QueryValue = boolean | number | string | null | undefined;
type PathValue = number | string;

type ApiClientOptions<K extends ApiOperationKey> = {
  params?: { [P in keyof ApiPathParams<K>]: PathValue };
  query?: Partial<ApiQuery<K>> & Record<string, QueryValue>;
};

function buildOperationPath<K extends ApiOperationKey>(key: K, params?: ApiClientOptions<K>["params"]): string {
  const operation = apiOperations[key];
  return operation.path.replace(/\{([^}]+)\}/g, (_, name: string) => {
    const value = (params as Record<string, PathValue> | undefined)?.[name];
    if (value === undefined || value === null || value === "") {
      throw new Error(`Missing API path param "${name}" for ${key}`);
    }
    return encodeURIComponent(String(value));
  });
}

export const apiClient = {
  get<TResponse, K extends ApiOperationKeyByMethod<"GET"> = ApiOperationKeyByMethod<"GET">>(
    key: K,
    options?: ApiClientOptions<K>
  ): Promise<TResponse> {
    return http.get<TResponse>(buildOperationPath(key, options?.params), options?.query);
  },

  post<TResponse, K extends ApiOperationKeyByMethod<"POST"> = ApiOperationKeyByMethod<"POST">>(
    key: K,
    body?: ApiRequestBody<K>,
    options?: ApiClientOptions<K>
  ): Promise<TResponse> {
    return http.post<TResponse>(buildOperationPath(key, options?.params), body);
  },

  patch<TResponse, K extends ApiOperationKeyByMethod<"PATCH"> = ApiOperationKeyByMethod<"PATCH">>(
    key: K,
    body?: ApiRequestBody<K>,
    options?: ApiClientOptions<K>
  ): Promise<TResponse> {
    return http.patch<TResponse>(buildOperationPath(key, options?.params), body);
  },

  delete<TResponse, K extends ApiOperationKeyByMethod<"DELETE"> = ApiOperationKeyByMethod<"DELETE">>(
    key: K,
    options?: ApiClientOptions<K>
  ): Promise<TResponse> {
    return http.delete<TResponse>(buildOperationPath(key, options?.params));
  }
};
