import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

// 请求配置接口
interface RequestConfig extends AxiosRequestConfig {
  skipAuth?: boolean; // 是否跳过认证
  skipLogging?: boolean; // 是否跳过日志
  retryCount?: number; // 重试次数
}

// 响应数据接口
interface ApiResponse<T = any> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: string;
  requestId: string;
}

// HTTP中间件类
export class HttpMiddleware {
  private api: AxiosInstance;
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 10000, // 10秒超时
    });

    this.setupInterceptors();
  }

  // 设置拦截器
  private setupInterceptors() {
    // 请求拦截器
    this.api.interceptors.request.use(
      (config: any) => {
        const requestConfig = config as RequestConfig;
        const requestId = this.generateRequestId();

        // 添加请求ID
        config.headers["X-Request-ID"] = requestId;
        config.headers["X-Timestamp"] = new Date().toISOString();
        config.headers["X-Client-Version"] = "1.0.0";

        // 自动添加认证token（除非跳过）
        if (!requestConfig.skipAuth) {
          const token = localStorage.getItem("token");
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }

        // 记录请求日志（除非跳过）
        if (!requestConfig.skipLogging) {
          this.logRequest(config, requestId);
        }

        // 处理请求数据
        this.processRequestData(config);

        return config;
      },
      (error) => {
        console.error("❌ 请求配置错误:", error);
        return Promise.reject(error);
      }
    );

    // 响应拦截器
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        const requestId = response.config.headers["X-Request-ID"];

        // 记录响应日志
        this.logResponse(response, requestId);

        // 处理响应数据
        const processedResponse = this.processResponseData(response);

        return processedResponse;
      },
      (error) => {
        const requestId = error.config?.headers?.["X-Request-ID"];

        // 记录错误日志
        this.logError(error, requestId);

        // 处理错误
        this.handleError(error);

        return Promise.reject(error);
      }
    );
  }

  // 生成请求ID
  private generateRequestId(): string {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }

  // 记录请求日志
  private logRequest(config: any, requestId: string) {
    console.log("🚀 发送请求:", {
      requestId,
      url: `${config.baseURL}${config.url}`,
      method: config.method?.toUpperCase(),
      params: config.params,
      data: config.data,
      headers: {
        Authorization: config.headers.Authorization ? "Bearer ***" : "None",
        "X-Request-ID": requestId,
        "X-Timestamp": config.headers["X-Timestamp"],
        "X-Client-Version": config.headers["X-Client-Version"],
      },
    });
  }

  // 记录响应日志
  private logResponse(response: AxiosResponse, requestId: string) {
    console.log("✅ 请求成功:", {
      requestId,
      url: response.config.url,
      method: response.config.method?.toUpperCase(),
      status: response.status,
      dataLength: Array.isArray(response.data) ? response.data.length : "N/A",
      responseTime: this.calculateResponseTime(
        response.config.headers["X-Timestamp"]
      ),
    });
  }

  // 记录错误日志
  private logError(error: any, requestId: string) {
    console.error("❌ 请求失败:", {
      requestId,
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      status: error.response?.status,
      message: error.message,
      data: error.response?.data,
    });
  }

  // 计算响应时间
  private calculateResponseTime(timestamp: string): string {
    const startTime = new Date(timestamp).getTime();
    const endTime = new Date().getTime();
    return `${endTime - startTime}ms`;
  }

  // 处理请求数据
  private processRequestData(config: any) {
    if (config.data && typeof config.data === "object") {
      // 添加客户端信息
      config.data.clientInfo = {
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        platform: navigator.platform,
        language: navigator.language,
      };
    }
  }

  // 处理响应数据
  private processResponseData(response: AxiosResponse): AxiosResponse {
    const requestId = response.config.headers["X-Request-ID"];

    // 统一响应格式
    if (response.data && typeof response.data === "object") {
      response.data = {
        data: response.data,
        success: true,
        timestamp: new Date().toISOString(),
        requestId,
      };
    }

    return response;
  }

  // 处理错误
  private handleError(error: any) {
    if (error.response?.status === 401) {
      // 未授权，清除token并跳转到登录页
      localStorage.removeItem("token");
      window.location.href = "/login";
    } else if (error.response?.status >= 500) {
      console.error("服务器错误，请稍后重试");
    } else if (error.response?.status >= 400) {
      console.error("请求错误，请检查参数");
    } else if (!error.response) {
      console.error("网络错误，请检查网络连接");
    }
  }

  // 公共请求方法
  async request<T = any>(config: RequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.api.request(config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // GET请求
  async get<T = any>(
    url: string,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: "GET", url });
  }

  // POST请求
  async post<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: "POST", url, data });
  }

  // PUT请求
  async put<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: "PUT", url, data });
  }

  // DELETE请求
  async delete<T = any>(
    url: string,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: "DELETE", url });
  }
}

// 创建默认实例
export const httpMiddleware = new HttpMiddleware("http://localhost:3001");
