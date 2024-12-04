/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface Ship {
  /** ID */
  id?: number;
  /**
   * Ship name
   * @minLength 1
   * @maxLength 255
   */
  ship_name: string;
  /** Description */
  description?: string | null;
  /**
   * Year
   * @min -2147483648
   * @max 2147483647
   */
  year: number;
  /**
   * Length
   * @min -2147483648
   * @max 2147483647
   */
  length: number;
  /**
   * Displacement
   * @min -2147483648
   * @max 2147483647
   */
  displacement: number;
  /**
   * Crew
   * @min -2147483648
   * @max 2147483647
   */
  crew?: number | null;
  /**
   * Country
   * @minLength 1
   * @maxLength 255
   */
  country: string;
  /**
   * Photo
   * @minLength 1
   * @maxLength 255
   */
  photo?: string;
}

export interface FightShip {
  ship?: Ship;
  /**
   * Admiral
   * @minLength 1
   * @maxLength 255
   */
  admiral: string;
}

export interface Fight {
  /** ID */
  id?: number;
  /**
   * Fight name
   * @minLength 1
   * @maxLength 255
   */
  fight_name?: string | null;
  /**
   * Result
   * @minLength 1
   * @maxLength 255
   */
  result?: string | null;
  /**
   * Sailors
   * @min -2147483648
   * @max 2147483647
   */
  sailors?: number | null;
  /** Status */
  status?: "dr" | "del" | "f" | "c" | "r";
  /**
   * Created at
   * @format date-time
   */
  created_at?: string;
  /**
   * Formed at
   * @format date-time
   */
  formed_at?: string | null;
  /**
   * Completed at
   * @format date-time
   */
  completed_at?: string | null;
  /** Creator */
  creator?: number | null;
  /** Moderator */
  moderator?: number | null;
  ships?: FightShip[];
}

export interface User {
  /**
   * Email адрес
   * @format email
   * @minLength 1
   * @maxLength 254
   */
  email: string;
  /**
   * Пароль
   * @minLength 1
   */
  password: string;
  /**
   * Is staff
   * @default false
   */
  is_staff?: boolean;
  /**
   * Is superuser
   * @default false
   */
  is_superuser?: boolean;
}

import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, HeadersDefaults, ResponseType } from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({ securityWorker, secure, format, ...axiosConfig }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({ ...axiosConfig, baseURL: axiosConfig.baseURL || "http://127.0.0.1:8000" });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(params1: AxiosRequestConfig, params2?: AxiosRequestConfig): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method && this.instance.defaults.headers[method.toLowerCase() as keyof HeadersDefaults]) || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] = property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem));
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (type === ContentType.FormData && body && body !== null && typeof body === "object") {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (type === ContentType.Text && body && body !== null && typeof body !== "string") {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title Snippets API
 * @version v1
 * @license BSD License
 * @termsOfService https://www.google.com/policies/terms/
 * @baseUrl http://127.0.0.1:8000
 * @contact <contact@snippets.local>
 *
 * Test description
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  fights = {
    /**
     * No description
     *
     * @tags fights
     * @name FightsList
     * @request GET:/fights/
     * @secure
     */
    fightsList: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/fights/`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags fights
     * @name FightsUpdate
     * @request PUT:/fights/
     * @secure
     */
    fightsUpdate: (data: Fight, params: RequestParams = {}) =>
      this.request<Fight, any>({
        path: `/fights/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags fights
     * @name FightsShipsUpdate
     * @request PUT:/fights/{fight_id}/ships/{ship_id}/
     * @secure
     */
    fightsShipsUpdate: (fightId: string, shipId: string, data: FightShip, params: RequestParams = {}) =>
      this.request<FightShip, any>({
        path: `/fights/${fightId}/ships/${shipId}/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags fights
     * @name FightsShipsDelete
     * @request DELETE:/fights/{fight_id}/ships/{ship_id}/
     * @secure
     */
    fightsShipsDelete: (fightId: string, shipId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/fights/${fightId}/ships/${shipId}/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags fights
     * @name FightsRead
     * @request GET:/fights/{id}/
     * @secure
     */
    fightsRead: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/fights/${id}/`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags fights
     * @name FightsUpdate2
     * @request PUT:/fights/{id}/
     * @originalName fightsUpdate
     * @duplicate
     * @secure
     */
    fightsUpdate2: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/fights/${id}/`,
        method: "PUT",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags fights
     * @name FightsDelete
     * @request DELETE:/fights/{id}/
     * @secure
     */
    fightsDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/fights/${id}/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags fights
     * @name FightsCompleteList
     * @request GET:/fights/{id}/complete/
     * @secure
     */
    fightsCompleteList: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/fights/${id}/complete/`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags fights
     * @name FightsCompleteUpdate
     * @request PUT:/fights/{id}/complete/
     * @secure
     */
    fightsCompleteUpdate: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/fights/${id}/complete/`,
        method: "PUT",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags fights
     * @name FightsCompleteDelete
     * @request DELETE:/fights/{id}/complete/
     * @secure
     */
    fightsCompleteDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/fights/${id}/complete/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags fights
     * @name FightsEditList
     * @request GET:/fights/{id}/edit/
     * @secure
     */
    fightsEditList: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/fights/${id}/edit/`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags fights
     * @name FightsEditUpdate
     * @request PUT:/fights/{id}/edit/
     * @secure
     */
    fightsEditUpdate: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/fights/${id}/edit/`,
        method: "PUT",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags fights
     * @name FightsEditDelete
     * @request DELETE:/fights/{id}/edit/
     * @secure
     */
    fightsEditDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/fights/${id}/edit/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags fights
     * @name FightsFormList
     * @request GET:/fights/{id}/form/
     * @secure
     */
    fightsFormList: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/fights/${id}/form/`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags fights
     * @name FightsFormUpdate
     * @request PUT:/fights/{id}/form/
     * @secure
     */
    fightsFormUpdate: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/fights/${id}/form/`,
        method: "PUT",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags fights
     * @name FightsFormDelete
     * @request DELETE:/fights/{id}/form/
     * @secure
     */
    fightsFormDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/fights/${id}/form/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
  login = {
    /**
     * No description
     *
     * @tags login
     * @name LoginCreate
     * @request POST:/login/
     * @secure
     */
    loginCreate: (data: User, params: RequestParams = {}) =>
      this.request<User, any>({
        path: `/login/`,
        method: "POST",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),
  };
  ships = {
    /**
     * No description
     *
     * @tags ships
     * @name ShipsList
     * @request GET:/ships/
     * @secure
     */
    shipsList: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/ships/`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags ships
     * @name ShipsCreate
     * @request POST:/ships/
     * @secure
     */
    shipsCreate: (data: Ship, params: RequestParams = {}) =>
      this.request<Ship, any>({
        path: `/ships/`,
        method: "POST",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags ships
     * @name ShipsRead
     * @request GET:/ships/{id}/
     * @secure
     */
    shipsRead: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/ships/${id}/`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags ships
     * @name ShipsCreate2
     * @request POST:/ships/{id}/
     * @originalName shipsCreate
     * @duplicate
     * @secure
     */
    shipsCreate2: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/ships/${id}/`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags ships
     * @name ShipsUpdate
     * @request PUT:/ships/{id}/
     * @secure
     */
    shipsUpdate: (id: string, data: Ship, params: RequestParams = {}) =>
      this.request<Ship, any>({
        path: `/ships/${id}/`,
        method: "PUT",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags ships
     * @name ShipsDelete
     * @request DELETE:/ships/{id}/
     * @secure
     */
    shipsDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/ships/${id}/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags ships
     * @name ShipsDraftList
     * @request GET:/ships/{id}/draft/
     * @secure
     */
    shipsDraftList: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/ships/${id}/draft/`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags ships
     * @name ShipsDraftCreate
     * @request POST:/ships/{id}/draft/
     * @secure
     */
    shipsDraftCreate: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/ships/${id}/draft/`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags ships
     * @name ShipsDraftUpdate
     * @request PUT:/ships/{id}/draft/
     * @secure
     */
    shipsDraftUpdate: (id: string, data: Ship, params: RequestParams = {}) =>
      this.request<Ship, any>({
        path: `/ships/${id}/draft/`,
        method: "PUT",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags ships
     * @name ShipsDraftDelete
     * @request DELETE:/ships/{id}/draft/
     * @secure
     */
    shipsDraftDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/ships/${id}/draft/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags ships
     * @name ShipsImageList
     * @request GET:/ships/{id}/image/
     * @secure
     */
    shipsImageList: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/ships/${id}/image/`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags ships
     * @name ShipsImageCreate
     * @request POST:/ships/{id}/image/
     * @secure
     */
    shipsImageCreate: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/ships/${id}/image/`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags ships
     * @name ShipsImageUpdate
     * @request PUT:/ships/{id}/image/
     * @secure
     */
    shipsImageUpdate: (id: string, data: Ship, params: RequestParams = {}) =>
      this.request<Ship, any>({
        path: `/ships/${id}/image/`,
        method: "PUT",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags ships
     * @name ShipsImageDelete
     * @request DELETE:/ships/{id}/image/
     * @secure
     */
    shipsImageDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/ships/${id}/image/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
  users = {
    /**
     * No description
     *
     * @tags users
     * @name UsersAuthCreate
     * @request POST:/users/auth/
     * @secure
     */
    usersAuthCreate: (data: User, params: RequestParams = {}) =>
      this.request<User, any>({
        path: `/users/auth/`,
        method: "POST",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UsersCheckList
     * @request GET:/users/check/
     * @secure
     */
    usersCheckList: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/users/check/`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UsersProfile
     * @request PUT:/users/profile/
     * @secure
     */
    usersProfile: (data: User, params: RequestParams = {}) =>
      this.request<User, any>({
        path: `/users/profile/`,
        method: "PUT",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),
  };
}
