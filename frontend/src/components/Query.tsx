import React, { useState, useEffect } from "react";
import { bffService, QueryOptions, QueryResult } from "../services/bffService";
import { QueryOptionsValues } from "../services/queryService";

const Query: React.FC = () => {
  const [queryOptions, setQueryOptions] = useState<QueryOptions | null>(null);
  const [queryData, setQueryData] = useState<QueryResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [queryOptionsValues, setQueryOptionsValues] =
    useState<QueryOptionsValues>({
      category: "",
      status: "",
      type: "",
    });

  useEffect(() => {
    loadQueryOptions();
    loadQueryData();
  }, []);

  async function loadQueryData() {
    setLoading(true);
    setError("");
    try {
      const response = await bffService.getQueryData(queryOptionsValues);
      if (response.success) {
        setQueryData(response.data);
      } else {
        setError(response.message || "查询失败，请重试");
      }
    } catch (error) {
      setError("查询失败，请重试");
      console.error("Query error:", error);
    } finally {
      setLoading(false);
    }
  }

  const loadQueryOptions = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await bffService.getQueryOptions();
      if (response.success) {
        setQueryOptions(response.data);
      } else {
        setError(response.message || "查询失败，请重试");
      }
    } catch (error) {
      setError("查询失败，请重试");
      console.error("Query error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof QueryOptionsValues, value: string) => {
    setQueryOptionsValues((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // 重置到第一页
    }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadQueryData();
  };

  const handleReset = () => {
    setQueryOptionsValues({
      category: "",
      status: "",
      type: "",
    });
  };

  const handleTestData = () => {
    bffService.postTestData({ num: 100 }).then((response) => {
      if (response.success) {
        loadQueryData();
      } else {
        setError(response.message || "测试数据失败");
      }
    });
  };

  return (
    <div>
      <div className="card">
        <h2>数据查询</h2>
        <form onSubmit={handleSearch}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "20px",
            }}
          >
            <div className="form-group">
              <label htmlFor="category">分类:</label>
              <select
                id="category"
                value={queryOptionsValues.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
              >
                <option value="">全部</option>
                {queryOptions?.filters.categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="status">状态:</label>
              <select
                id="status"
                value={queryOptionsValues.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
              >
                <option value="">全部</option>
                {queryOptions?.filters.statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="type">类型:</label>
              <select
                id="type"
                value={queryOptionsValues.type}
                onChange={(e) => handleFilterChange("type", e.target.value)}
              >
                <option value="">全部</option>
                {queryOptions?.filters.types.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
            <button type="submit" className="btn" disabled={loading}>
              {loading ? "查询中..." : "查询"}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleReset}
            >
              重置
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleTestData}
            >
              测试数据
            </button>
          </div>
        </form>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card">
        {loading ? (
          <div className="loading">查询中...</div>
        ) : !queryData || queryData.length === 0 ? (
          <div className="empty-state">
            <h3>暂无数据</h3>
            <p>请调整查询条件后重试</p>
          </div>
        ) : (
          <>
            <div style={{ overflowX: "auto" }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>名称</th>
                    <th>分类</th>
                    <th>状态</th>
                    <th>类型</th>
                    <th>优先级</th>
                    <th>标签</th>
                    <th>描述</th>
                    <th>创建时间</th>
                  </tr>
                </thead>
                <tbody>
                  {queryData.map((result: QueryResult) => (
                    <tr key={result.id}>
                      <td>{result.id}</td>
                      <td>{result.name}</td>
                      <td>{result.category}</td>
                      <td>{result.status}</td>
                      <td>{result.type}</td>
                      <td>
                        <span
                          style={{
                            padding: "2px 6px",
                            borderRadius: "4px",
                            backgroundColor:
                              result.priority <= 2
                                ? "#d4edda"
                                : result.priority <= 3
                                ? "#fff3cd"
                                : "#f8d7da",
                            color:
                              result.priority <= 2
                                ? "#155724"
                                : result.priority <= 3
                                ? "#856404"
                                : "#721c24",
                          }}
                        >
                          {result.priority}
                        </span>
                      </td>
                      <td>
                        {result.tags.map((tag, index) => (
                          <span
                            key={index}
                            style={{
                              display: "inline-block",
                              margin: "1px",
                              padding: "1px 4px",
                              backgroundColor: "#e9ecef",
                              borderRadius: "2px",
                              fontSize: "12px",
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </td>
                      <td>{result.description}</td>
                      <td>{result.createdAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Query;
