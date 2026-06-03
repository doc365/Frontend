import { useState, useEffect } from "react";
import { Tabs, Table, Input, Tag, Typography, Breadcrumb, Switch, Checkbox, Button, Card, Space, message, Divider } from "antd";
import { FilterOutlined, SearchOutlined, HomeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../../context/NotificationContext";
import { MOCK_ANNOUNCEMENTS } from "../../mock/data";
import styles from "./Announcements.module.scss";

const { Text } = Typography;

const TYPE_COLOR = {
  Add:    "green",
  Update: "blue",
  Delete: "red",
};

const CATEGORY_COLOR = {
  User:    "purple",
  Role:    "orange",
  Product: "cyan",
};

function formatTime(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return `${d.toISOString().split("T")[0]} ${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
}

// ── Announcements Tab ─────────────────────────────────
function AnnouncementsTab() {
  const { notifications } = useNotifications();
  const [search, setSearch] = useState("");

  // Merge seeded mock + live notifications from the feed
  const liveRows = notifications.map((n) => ({
    id: n.id,
    name: n.title,
    type: n.type === "success" ? "Add" : n.type === "error" ? "Delete" : "Update",
    category: "User",
    publishedTime: n.time instanceof Date ? n.time.toISOString() : n.time,
    details: n.message,
    actor: n.actor || "System",
  }));

  // Deduplicate: live rows take priority, fill with seeded data not already represented
  const liveIds = new Set(liveRows.map((r) => r.id));
  const seedRows = MOCK_ANNOUNCEMENTS.filter((a) => !liveIds.has(a.id));
  const allRows = [...liveRows, ...seedRows].sort(
    (a, b) => new Date(b.publishedTime) - new Date(a.publishedTime)
  );

  const filtered = allRows.filter((r) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return r.name.toLowerCase().includes(q) || r.details.toLowerCase().includes(q) || r.actor.toLowerCase().includes(q);
  });

  const columns = [
    {
      title: "Announcement name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (v) => <Text strong style={{ fontSize: 13 }}>{v}</Text>,
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (v) => <Tag color={TYPE_COLOR[v] || "default"}>{v}</Tag>,
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (v) => <Tag color={CATEGORY_COLOR[v] || "default"}>{v}</Tag>,
    },
    {
      title: "Published time",
      dataIndex: "publishedTime",
      key: "publishedTime",
      sorter: (a, b) => new Date(a.publishedTime) - new Date(b.publishedTime),
      defaultSortOrder: "descend",
      render: (v) => <Text style={{ fontSize: 12 }}>{formatTime(v)}</Text>,
    },
    {
      title: "Details",
      dataIndex: "details",
      key: "details",
      render: (v) => <Text type="secondary" style={{ fontSize: 12 }}>{v}</Text>,
    },
  ];

  return (
    <div className={styles.tabContent}>
      <div className={styles.tableToolbar}>
        <FilterOutlined className={styles.filterIcon} />
        <Input
          placeholder="Search by name, details or actor..."
          prefix={<SearchOutlined />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchInput}
          allowClear
        />
      </div>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={filtered}
        pagination={{ pageSize: 10, showTotal: (t) => `${t} announcements` }}
        className={styles.table}
        locale={{ emptyText: "No announcements to show." }}
        size="small"
      />
    </div>
  );
}

// ── Notification Settings Tab ─────────────────────────
const CATEGORIES = [
  "Service interruption",
  "Environment updates (product releases)",
  "Additional configurations required",
  "Information (new features)",
];

const RECIPIENTS = [
  "Tenant owners in MOS Platform",
  "Service admins in MOS Platform",
  "Custom recipients",
];

function NotificationSettingsTab() {
  const [enabled, setEnabled] = useState(true);
  const [categories, setCategories] = useState(CATEGORIES);
  const [recipients, setRecipients] = useState([RECIPIENTS[0], RECIPIENTS[1]]);

  const toggleCategory = (cat) =>
    setCategories((prev) => prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]);

  const toggleRecipient = (rec) =>
    setRecipients((prev) => prev.includes(rec) ? prev.filter((r) => r !== rec) : [...prev, rec]);

  return (
    <div className={styles.tabContent}>
      <Card className={styles.notifCard}>
        <div className={styles.notifHeader}>
          <div>
            <Text strong style={{ fontSize: 15 }}>Enable announcement notification</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 13 }}>
              Enable email notifications for announcements and configure recipients for specified categories.
            </Text>
          </div>
          <Switch checked={enabled} onChange={setEnabled} />
        </div>

        {enabled && (
          <>
            <Divider />
            <Text strong style={{ display: "block", marginBottom: 12 }}>
              Send notifications when announcements with the following categories are published:
            </Text>
            <div className={styles.checkList}>
              {CATEGORIES.map((cat) => (
                <Checkbox key={cat} checked={categories.includes(cat)} onChange={() => toggleCategory(cat)}>
                  {cat}
                </Checkbox>
              ))}
            </div>

            <Divider />
            <Text strong style={{ display: "block", marginBottom: 12 }}>
              Who should receive announcement notifications?
            </Text>
            <div className={styles.checkList}>
              {RECIPIENTS.map((rec) => (
                <Checkbox key={rec} checked={recipients.includes(rec)} onChange={() => toggleRecipient(rec)}>
                  {rec}
                </Checkbox>
              ))}
            </div>

            <Divider />
            <div className={styles.notifFooter}>
              <Space>
                <Button onClick={() => message.info("Changes discarded")}>Cancel</Button>
                <Button type="primary" onClick={() => message.success("Settings saved")}>Save</Button>
              </Space>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────
export default function Announcements() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <Breadcrumb
        className={styles.breadcrumb}
        items={[
          { title: <span className={styles.breadcrumbLink} onClick={() => navigate("/")}><HomeOutlined /> Home</span> },
          { title: "Announcement center" },
        ]}
      />

      <Tabs
        defaultActiveKey="announcements"
        className={styles.tabs}
        items={[
          { key: "announcements",  label: "Announcements",          children: <AnnouncementsTab /> },
          { key: "notification",   label: "Notification settings",  children: <NotificationSettingsTab /> },
        ]}
      />
    </div>
  );
}
