import { httpMiddleware } from "../utils/httpMiddleware";

export interface QueryOptionsValues {
  category?: string;
  status?: string;
  type?: string;
}

export interface QueryResult {
  id: number;
  name: string;
  category: string;
  status: string;
  type: string;
  description: string;
  createdAt: string;
}

export const queryService = {
  async getCategories(): Promise<string[]> {
    const response = await httpMiddleware.get("/query/categories");
    return response.data;
  },

  async getStatuses(): Promise<string[]> {
    const response = await httpMiddleware.get("/query/statuses");
    return response.data;
  },

  async getTypes(): Promise<string[]> {
    const response = await httpMiddleware.get("/query/types");
    return response.data;
  },

  async search(options: QueryOptionsValues): Promise<QueryResult[]> {
    const response = await httpMiddleware.get("/query/search", {
      params: options,
    });
    return response.data;
  },

  async postTestData(num: number): Promise<void> {
    const response = await httpMiddleware.post("/query/test-data", { num });
    return response.data;
  },
};
