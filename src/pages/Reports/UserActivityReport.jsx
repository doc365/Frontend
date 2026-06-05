import { useState, useMemo } from "react";
import { Typography, DatePicker, Select, Input, Button, Table, Tag, Badge } from "antd";
import { SearchOutlined, ExportOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useNotifications } from "../../context/NotificationContext";
import { REPORT_CATEGORIES, REPORT_ACTIONS } from "../../mock/data";
import styles from "./Reports.module.scss";

const { Text } = Typography;
const { RangePicker } = DatePicker;

const ALL_ACTIONS_FLAT = Object.values(REPORT_ACTIONS).flat();

function fmtTime(iso) {
  const d = new Date(iso);
  return `${d.toLocaleDateString("en-GB")} ${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}:${String(d.getSeconds()).padStart(2,"0")}`;
}

function toCSV(rows) {
  const headers = ["Display name","User ID","Staff ID","IP address","Time","Category","Action","Object"];
  const lines = [
    headers.join(","),
    ...rows.map((r) =>
      [r.displayName, r.userId, r.staffId, r.ipAddress, fmtTime(r.time), r.category, r.action, `"${r.object}"`].join(",")
    ),
  ];
  return lines.join("\n");
}

function downloadCSV(content, filename) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

export default function UserActivityReport() {
  const { activityLog } = useNotifications(); // live — updates when new actions happen

  const defaultTo   = dayjs();
  const defaultFrom = dayjs().subtract(7, "day");

  const [dateRange,    setDateRange]    = useState([defaultFrom, defaultTo]);
  const [category,     setCategory]     = useState("All");
  const [action,       setAction]       = useState("All");
  const [userSearch,   setUserSearch]   = useState("");
  const [objectSearch, setObjectSearch] = useState("");
  const [results,      setResults]      = useState(null); // null = not yet searched, show all

  const actionOptions = useMemo(() => {
    if (category === "All") return ["All", ...ALL_ACTIONS_FLAT];
    return ["All", ...(REPORT_ACTIONS[category] ?? [])];
  }, [category]);

  const handleSearch = () => {
    const [from, to] = dateRange ?? [null, null];
    const filtered = activityLog.filter((row) => {
      const t = dayjs(row.time);
      if (from && t.isBefore(from, "minute")) return false;
      if (to   && t.isAfter(to,   "minute")) return false;
      if (category !== "All" && row.category !== category) return false;
      if (action   !== "All" && row.action   !== action)   return false;
      if (userSearch) {
        const q = userSearch.toLowerCase();
        if (!row.displayName.toLowerCase().includes(q) &&
            !row.userId.toLowerCase().includes(q) &&
            !(row.staffId || "").toLowerCase().includes(q)) return false;
      }
      if (objectSearch && !row.object.toLowerCase().includes(objectSearch.toLowerCase())) return false;
      return true;
    });
    setResults(filtered);
  };

  const displayData = results ?? activityLog;

  const handleExport = () => {
    downloadCSV(toCSV(displayData), `UserActivityReport_${dayjs().format("YYYYMMDD_HHmmss")}.csv`);
  };

  const columns = [
    { title: "Display name", dataIndex: "displayName", key: "displayName", sorter: (a,b) => a.displayName.localeCompare(b.displayName), render: (v) => <Text strong style={{ fontSize: 13 }}>{v}</Text> },
    { title: "User ID",      dataIndex: "userId",      key: "userId",      render: (v) => <Text style={{ fontSize: 12 }}>{v}</Text> },
    { title: "IP address",   dataIndex: "ipAddress",   key: "ipAddress",   render: (v) => <Text style={{ fontSize: 12, fontFamily: "monospace" }}>{v}</Text> },
    { title: "Time",         dataIndex: "time",        key: "time",        sorter: (a,b) => new Date(a.time)-new Date(b.time), defaultSortOrder: "descend", render: (v) => <Text style={{ fontSize: 12 }}>{fmtTime(v)}</Text> },
    { title: "Category",     dataIndex: "category",    key: "category",    render: (v) => <Tag color="blue">{v}</Tag> },
    { title: "Action",       dataIndex: "action",      key: "action",      render: (v) => <Text style={{ fontSize: 12 }}>{v}</Text> },
    { title: "Object",       dataIndex: "object",      key: "object",      ellipsis: true, render: (v) => <Text style={{ fontSize: 12, color: "#555" }}>{v}</Text> },
  ];

  return (
    <div className={styles.reportPage}>
      <div className={styles.filterPanel}>
        <div className={styles.filterGrid}>
          <div className={styles.filterField}>
            <Text className={styles.filterLabel}>From / To</Text>
            <RangePicker showTime={{ format: "HH:mm" }} format="D/M/YYYY HH:mm" value={dateRange} onChange={setDateRange} style={{ width: "100%" }} />
          </div>
          <div className={styles.filterField}>
            <Text className={styles.filterLabel}>Category</Text>
            <Select value={category} onChange={(v) => { setCategory(v); setAction("All"); }} style={{ width: "100%" }}
              options={["All", ...REPORT_CATEGORIES].map((c) => ({ value: c, label: c }))} />
          </div>
          <div className={styles.filterField}>
            <Text className={styles.filterLabel}>User</Text>
            <Input placeholder="Search by display name or user ID..." value={userSearch} onChange={(e) => setUserSearch(e.target.value)} onPressEnter={handleSearch} />
          </div>
          <div className={styles.filterField}>
            <Text className={styles.filterLabel}>Action</Text>
            <Select value={action} onChange={setAction} style={{ width: "100%" }}
              options={actionOptions.map((a) => ({ value: a, label: a }))} />
          </div>
          <div className={styles.filterField}>
            <Text className={styles.filterLabel}>Object</Text>
            <Input placeholder="Search by object name..." value={objectSearch} onChange={(e) => setObjectSearch(e.target.value)} onPressEnter={handleSearch} />
          </div>
        </div>
        <div className={styles.filterActions}>
          <Button icon={<ExportOutlined />} onClick={handleExport} disabled={!displayData.length}>Export</Button>
          <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>Search</Button>
        </div>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={displayData}
        pagination={{ pageSize: 10, showTotal: (t, r) => `${r[0]}–${r[1]} of ${t} records` }}
        scroll={{ x: 960 }}
        size="small"
        className={styles.table}
        locale={{ emptyText: "No records found." }}
      />
    </div>
  );
}
