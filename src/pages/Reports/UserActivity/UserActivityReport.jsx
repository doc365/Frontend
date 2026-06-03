import { useState, useMemo } from "react";
import { Table, Input, Select, Button, DatePicker, Space, Typography, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import { useNotifications } from "../../../context/NotificationContext";
import styles from "./UserActivityReport.module.scss";

const { Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const CATEGORIES = ["All", "Account", "System", "Product"];
const ACTIONS = ["All", "Sign in", "Sign out", "Add a local user", "Edit user or group", "Delete user or group", "Activate user or group", "Deactivate user or group", "Edit permissions", "Register app", "Export users"];

export default function UserActivityReport() {
  const { activityLog } = useNotifications();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [action, setAction] = useState("All");
  const [objectSearch, setObjectSearch] = useState("");
  const [dateRange, setDateRange] = useState(null);
  const [filtered, setFiltered] = useState(null);

  const handleSearch = () => {
    let result = [...activityLog];
    if (search) result = result.filter((r) => r.displayName.toLowerCase().includes(search.toLowerCase()) || r.userId.toLowerCase().includes(search.toLowerCase()) || r.staffId?.toLowerCase().includes(search.toLowerCase()));
    if (category !== "All") result = result.filter((r) => r.category === category);
    if (action !== "All") result = result.filter((r) => r.action === action);
    if (objectSearch) result = result.filter((r) => r.object?.toLowerCase().includes(objectSearch.toLowerCase()));
    if (dateRange) {
      const [from, to] = dateRange;
      result = result.filter((r) => new Date(r.time) >= from.toDate() && new Date(r.time) <= to.toDate());
    }
    setFiltered(result);
  };

  const data = filtered ?? activityLog;

  const handleExport = () => {
    if (!data.length) { message.warning("No data to export"); return; }
    const rows = [
      ["MOS Platform - User Activity Report"],
      [`Exported: ${new Date().toLocaleString()}`],
      [],
      ["Display Name", "User ID", "Staff & Student ID", "IP Address", "Time", "Category", "Action", "Object"],
      ...data.map((r) => [r.displayName, r.userId, r.staffId || "—", r.ip, new Date(r.time).toLocaleString(), r.category, r.action, r.object]),
    ];
    const ws = XLSX.utils.aoa_to_sheet(rows);
    ws["!cols"] = [18, 14, 14, 14, 18, 12, 24, 28].map((w) => ({ wch: w }));
    ws["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 7 } }, { s: { r: 1, c: 0 }, e: { r: 1, c: 7 } }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "User Activity");
    XLSX.writeFile(wb, `user_activity_report_${Date.now()}.xlsx`);
    message.success(`Exported ${data.length} records`);
  };

  const columns = [
    { title: "Display name", dataIndex: "displayName", key: "displayName", sorter: (a, b) => a.displayName.localeCompare(b.displayName) },
    { title: "User ID", dataIndex: "userId", key: "userId", sorter: true, render: (v) => <Text style={{ fontSize: 12 }}>{v}</Text> },
    { title: "Staff & Student ID", dataIndex: "staffId", key: "staffId", responsive: ["lg"] },
    { title: "IP address", dataIndex: "ip", key: "ip", responsive: ["md"] },
    { title: "Time", dataIndex: "time", key: "time", sorter: (a, b) => new Date(b.time) - new Date(a.time), render: (v) => new Date(v).toLocaleString() },
    { title: "Category", dataIndex: "category", key: "category" },
    { title: "Action", dataIndex: "action", key: "action" },
    { title: "Object", dataIndex: "object", key: "object", render: (v) => <Text style={{ fontSize: 12 }}>{v}</Text> },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.filterCard}>
        <div className={styles.filterRow}>
          <div className={styles.filterField}>
            <Text className={styles.label}>From / To</Text>
            <RangePicker showTime format="D/M/YYYY HH:mm" onChange={setDateRange} style={{ width: "100%" }} />
          </div>
          <div className={styles.filterField}>
            <Text className={styles.label}>Category</Text>
            <Select value={category} onChange={setCategory} style={{ width: "100%" }}>
              {CATEGORIES.map((c) => <Option key={c} value={c}>{c}</Option>)}
            </Select>
          </div>
        </div>
        <div className={styles.filterRow}>
          <div className={styles.filterField}>
            <Text className={styles.label}>User</Text>
            <Input prefix={<SearchOutlined />} placeholder="Search by display name, user ID, or staff ID..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className={styles.filterField}>
            <Text className={styles.label}>Action</Text>
            <Select value={action} onChange={setAction} style={{ width: "100%" }}>
              {ACTIONS.map((a) => <Option key={a} value={a}>{a}</Option>)}
            </Select>
          </div>
          <div className={styles.filterField}>
            <Text className={styles.label}>Object</Text>
            <Input placeholder="Search by object name" value={objectSearch} onChange={(e) => setObjectSearch(e.target.value)} />
          </div>
        </div>
        <div className={styles.filterActions}>
          <Button onClick={handleExport}>Export</Button>
          <Button type="primary" onClick={handleSearch}>Search</Button>
        </div>
      </div>

      <div className={styles.tableCard}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={data}
          pagination={{ showTotal: (t) => `${t} records`, pageSizeOptions: ["10", "20", "50"], showSizeChanger: true }}
          scroll={{ x: 900 }}
          size="middle"
        />
      </div>
    </div>
  );
}
