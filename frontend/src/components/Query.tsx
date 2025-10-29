import React, { useState, useEffect } from "react";
import {
  queryService,
  QueryOptions,
  QueryResult,
} from "../services/queryService";

const Query: React.FC = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [statuses, setStatuses] = useState<string[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [results, setResults] = useState<QueryResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState<QueryOptions>({
    category: "",
    status: "",
    type: "",
  });

  useEffect(() => {
    loadOptions();
    loadResults();
  }, []);

  const loadOptions = async () => {
    try {
      const [categoriesData, statusesData, typesData] = await Promise.all([
        queryService.getCategories(),
        queryService.getStatuses(),
        queryService.getTypes(),
      ]);
      setCategories(categoriesData);
      setStatuses(statusesData);
      setTypes(typesData);
    } catch (error) {
      console.error("Failed to load options:", error);
    }
  };

  const loadResults = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await queryService.search(filters);
      setResults(data);
    } catch (error) {
      setError("查询失败，请重试");
      console.error("Query error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof QueryOptions, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadResults();
  };

  const handleReset = () => {
    setFilters({
      category: "",
      status: "",
      type: "",
    });
  };

  const handleTestData = () => {
    queryService
      .postTestData(100)
      .then((res) => {
        loadResults();
      })
      .catch((error: any) => {
        console.error("Test data error:", error);
        setError(`测试数据失败: ${error.message}`);
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
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
              >
                <option value="">全部</option>
                {categories.map((category) => (
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
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
              >
                <option value="">全部</option>
                {statuses.map((status) => (
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
                value={filters.type}
                onChange={(e) => handleFilterChange("type", e.target.value)}
              >
                <option value="">全部</option>
                {types.map((type) => (
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
        <h3>查询结果 ({results.length} 条记录)</h3>
        {loading ? (
          <div className="loading">查询中...</div>
        ) : results.length === 0 ? (
          <div className="empty-state">
            <h3>暂无数据</h3>
            <p>请调整查询条件后重试</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>名称</th>
                  <th>分类</th>
                  <th>状态</th>
                  <th>类型</th>
                  <th>描述</th>
                  <th>创建时间</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result) => (
                  <tr key={result.id}>
                    <td>{result.id}</td>
                    <td>{result.name}</td>
                    <td>{result.category}</td>
                    <td>{result.status}</td>
                    <td>{result.type}</td>
                    <td>{result.description}</td>
                    <td>{result.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Query;
