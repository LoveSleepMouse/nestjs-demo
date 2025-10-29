import { Injectable } from "@nestjs/common";

export interface QueryOptions {
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

@Injectable()
export class QueryService {
  // 模拟数据
  private data: QueryResult[] = [
    {
      id: 1,
      name: "项目A",
      category: "开发",
      status: "进行中",
      type: "内部",
      description: "这是一个内部开发项目",
      createdAt: "2024-01-15",
    },
    {
      id: 2,
      name: "项目B",
      category: "测试",
      status: "已完成",
      type: "外部",
      description: "这是一个外部测试项目",
      createdAt: "2024-01-10",
    },
    {
      id: 3,
      name: "项目C",
      category: "维护",
      status: "暂停",
      type: "内部",
      description: "这是一个内部维护项目",
      createdAt: "2024-01-05",
    },
    {
      id: 4,
      name: "项目D",
      category: "开发",
      status: "进行中",
      type: "外部",
      description: "这是一个外部开发项目",
      createdAt: "2024-01-20",
    },
    {
      id: 5,
      name: "项目E",
      category: "测试",
      status: "已完成",
      type: "内部",
      description: "这是一个内部测试项目",
      createdAt: "2024-01-12",
    },
  ];

  getCategories(): string[] {
    return ["开发", "测试", "维护", "设计"];
  }

  getStatuses(): string[] {
    return ["进行中", "已完成", "暂停", "计划中"];
  }

  getTypes(): string[] {
    return ["内部", "外部"];
  }

  query(options: QueryOptions): QueryResult[] {
    let results = [...this.data];

    if (options.category) {
      results = results.filter((item) => item.category === options.category);
    }

    if (options.status) {
      results = results.filter((item) => item.status === options.status);
    }

    if (options.type) {
      results = results.filter((item) => item.type === options.type);
    }

    return results;
  }

  postTestData(num: number): QueryResult[] {
    const result = [...this.data];
    this.data.push({
      id: result.length + 1,
      name: `项目${result.length + 1}`,
      category: "设计",
      status: "进行中",
      type: "外部",
      description: `这是一个外部设计项目，美滋滋${num}`,
      createdAt: "2024-01-12",
    });
    return result;
  }
}
