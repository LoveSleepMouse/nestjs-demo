import { httpMiddleware } from "../utils/httpMiddleware";
import { QueryOptionsValues } from "./queryService";

// BFF统一响应接口
export interface BffResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
  requestId: string;
}

// 用户信息接口
export interface UserInfo {
  id: number;
  username: string;
  email: string;
  role: string;
  permissions: string[];
  lastLoginTime: string;
}

// 查询结果接口
export interface QueryResult {
  id: number;
  name: string;
  category: string;
  status: string;
  type: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  priority: number;
  tags: string[];
}

// 查询结果包装接口
export interface QueryResponse {
  items: QueryResult[];
}

export interface QueryOptions {
  filters: {
    categories: string[];
    statuses: string[];
    types: string[];
  };
}

// BFF服务类
export class BffService {
  // 用户认证相关
  async login(
    username: string,
    password: string
  ): Promise<BffResponse<{ user: UserInfo; token: string }>> {
    try {
      const response = await httpMiddleware.post("/auth/login", {
        username,
        password,
      });

      // 数据转换和增强
      const userInfo: UserInfo = {
        id: response.data.user.id,
        username: response.data.user.username,
        email: response.data.user.email,
        role: this.determineUserRole(response.data.user.username),
        permissions: this.getUserPermissions(response.data.user.username),
        lastLoginTime: new Date().toISOString(),
      };

      return {
        success: true,
        data: {
          user: userInfo,
          token: response.data.access_token,
        },
        message: "登录成功",
        timestamp: new Date().toISOString(),
        requestId: response.data.requestId || "",
      };
    } catch (error) {
      throw {
        success: false,
        data: null,
        message: "登录失败，请检查用户名和密码",
        timestamp: new Date().toISOString(),
        requestId: "",
      };
    }
  }

  async getUserProfile(): Promise<BffResponse<UserInfo>> {
    try {
      const response = await httpMiddleware.get("/auth/profile");

      const userInfo: UserInfo = {
        id: response.data.id,
        username: response.data.username,
        email: response.data.email,
        role: this.determineUserRole(response.data.username),
        permissions: this.getUserPermissions(response.data.username),
        lastLoginTime: new Date().toISOString(),
      };

      return {
        success: true,
        data: userInfo,
        message: "获取用户信息成功",
        timestamp: new Date().toISOString(),
        requestId: response.data.requestId || "",
      };
    } catch (error) {
      throw {
        success: false,
        data: null,
        message: "获取用户信息失败",
        timestamp: new Date().toISOString(),
        requestId: "",
      };
    }
  }

  // 数据查询相关
  async getQueryOptions(): Promise<BffResponse<QueryOptions>> {
    try {
      // 并行获取基础数据和查询结果
      const [categoriesRes, statusesRes, typesRes] = await Promise.all([
        httpMiddleware.get("/query/categories"),
        httpMiddleware.get("/query/statuses"),
        httpMiddleware.get("/query/types"),
      ]);

      const response: QueryOptions = {
        filters: {
          categories: categoriesRes.data || [],
          statuses: statusesRes.data || [],
          types: typesRes.data || [],
        },
      };

      return {
        success: true,
        data: response,
        message: `查询成功`,
        timestamp: new Date().toISOString(),
        requestId: categoriesRes.requestId || "",
      };
    } catch (error) {
      throw {
        success: false,
        data: null,
        message: "查询失败，请稍后重试",
        timestamp: new Date().toISOString(),
        requestId: "",
      };
    }
  }

  // 获取查询数据
  async getQueryData(
    options: QueryOptionsValues
  ): Promise<BffResponse<QueryResult[]>> {
    try {
      const response = await httpMiddleware.get("/query/search", {
        params: options,
      });
      // 数据转换和增强
      const rawResults = response.data || [];
      const enhancedResults: QueryResult[] = rawResults.map(
        (item: any, index: number) => ({
          id: item.id,
          name: item.name,
          category: item.category,
          status: item.status,
          type: item.type,
          description: item.description,
          createdAt: item.createdAt,
          updatedAt: new Date().toISOString(),
          priority: this.calculatePriority(item),
          tags: this.generateTags(item),
        })
      );

      return {
        success: true,
        data: enhancedResults,
        message: `查询成功，共找到 ${enhancedResults.length} 条记录`,
        timestamp: new Date().toISOString(),
        requestId: response.data.requestId || "",
      };
    } catch (error) {
      throw {
        success: false,
        data: null,
        message: "获取查询数据失败",
        timestamp: new Date().toISOString(),
        requestId: "",
      };
    }
  }

  // 自定义新增数据
  async postTestData(params: { num: number }): Promise<BffResponse<void>> {
    try {
      const response = await httpMiddleware.post("/query/test-data", params);
      return response;
    } catch (error) {
      throw {
        success: false,
        data: null,
        message: "新增数据失败",
        timestamp: new Date().toISOString(),
        requestId: "",
      };
    }
  }

  // 私有辅助方法
  private determineUserRole(username: string): string {
    return username === "admin" ? "admin" : "user";
  }

  private getUserPermissions(username: string): string[] {
    const basePermissions = ["read"];
    if (username === "admin") {
      return [...basePermissions, "write", "delete", "manage"];
    }
    return basePermissions;
  }

  private calculatePriority(item: QueryResult): number {
    // 根据状态和类型计算优先级
    const statusPriority = {
      进行中: 3,
      已完成: 1,
      暂停: 4,
      计划中: 2,
    };
    const typePriority = {
      内部: 2,
      外部: 3,
    };
    return (
      (statusPriority[item.status as keyof typeof statusPriority] || 3) +
      (typePriority[item.type as keyof typeof typePriority] || 2)
    );
  }

  private generateTags(item: any): string[] {
    const tags = [];
    if (item.category) tags.push(item.category);
    if (item.status) tags.push(item.status);
    if (item.type) tags.push(item.type);
    return tags;
  }

  private getAllTags(items: QueryResult[]): string[] {
    const tagSet = new Set<string>();
    items.forEach((item) => {
      item.tags.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet);
  }

  private groupBy(
    items: QueryResult[],
    key: keyof QueryResult
  ): Record<string, number> {
    return items.reduce((acc, item) => {
      const value = String(item[key]);
      acc[value] = (acc[value] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  private calculateTrends(items: QueryResult[]): any {
    // 简单的趋势计算逻辑
    const now = new Date();
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const recentItems = items.filter(
      (item) => new Date(item.createdAt) > lastWeek
    );

    return {
      weeklyGrowth: recentItems.length,
      completionRate:
        (items.filter((item) => item.status === "已完成").length /
          items.length) *
        100,
      averagePriority:
        items.reduce((sum, item) => sum + item.priority, 0) / items.length,
    };
  }
}

// 导出单例实例
export const bffService = new BffService();
