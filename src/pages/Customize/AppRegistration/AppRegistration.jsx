import { useState } from "react";
import { Typography, Button, Table, Input, Badge, Tooltip, Popconfirm, message, Drawer, Form, Space } from "antd";
import { PlusOutlined, EditOutlined, ReloadOutlined, GlobalOutlined, StopOutlined, CheckCircleOutlined, DeleteOutlined, SearchOutlined, CopyOutlined, FilterOutlined } from "@ant-design/icons";
import { useNotifications } from "../../../context/NotificationContext";
import styles from "./AppRegistration.module.scss";

const { Title, Text } = Typography;

function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

function generateSecret() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  return Array.from({ length: 40 }, () => chars[Math.floor(Math.random() * chars.length)]).join("") + "=";
}

function SecretCell({ secret }) {
  const short = secret.slice(0, 24) + "...";
  return (
    <Tooltip title={secret} placement="top">
      <Text style={{ fontSize: 13, cursor: "default", borderBottom: "1px dashed #aaa" }}>{short}</Text>
    </Tooltip>
  );
}

const INITIAL_APPS = [
  { id: "1", name: "MOS Portal", clientId: generateUUID(), secret: generateSecret(), redirectUri: "https://portal.avepoint.com", status: "Active", lastModified: "1/6/2026 13:58:57" },
];

export default function AppRegistration() {
  const [apps, setApps] = useState(INITIAL_APPS);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [search, setSearch] = useState("");
  const [addDrawer, setAddDrawer] = useState(false);
  const [editDrawer, setEditDrawer] = useState({ open: false, app: null });
  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const { addNotification } = useNotifications();

  const selectedApp = selectedRows[0] || null;
  const singleSelected = selectedKeys.length === 1;

  const filtered = apps.filter((a) => a.name.toLowerCase().includes(search.toLowerCase()));

  const handleAdd = (values) => {
    const newApp = {
      id: Date.now().toString(),
      name: values.appName,
      clientId: generateUUID(),
      secret: generateSecret(),
      redirectUri: values.redirectUri || "",
      status: "Active",
      lastModified: new Date().toLocaleString(),
    };
    setApps((prev) => [...prev, newApp]);
    addNotification({ type: "success", title: "App registered", message: `You added app registration: ${values.appName}` });
    message.success("App registered successfully");
    addForm.resetFields();
    setAddDrawer(false);
  };

  const handleEdit = (values) => {
    setApps((prev) => prev.map((a) =>
      a.id === editDrawer.app.id
        ? { ...a, name: values.appName, redirectUri: values.redirectUri || "", lastModified: new Date().toLocaleString() }
        : a
    ));
    addNotification({ type: "info", title: "App updated", message: `You updated app: ${values.appName}` });
    message.success("App updated");
    setEditDrawer({ open: false, app: null });
  };

  const handleRegenerate = () => {
    if (!singleSelected) return;
    setApps((prev) => prev.map((a) =>
      a.id === selectedApp.id ? { ...a, secret: generateSecret(), lastModified: new Date().toLocaleString() } : a
    ));
    addNotification({ type: "info", title: "Secret regenerated", message: `Secret regenerated for: ${selectedApp.name}` });
    message.success("Secret regenerated");
    setSelectedKeys([]); setSelectedRows([]);
  };

  const handleActivate = () => {
    setApps((prev) => prev.map((a) => selectedKeys.includes(a.id) ? { ...a, status: "Active", lastModified: new Date().toLocaleString() } : a));
    addNotification({ type: "success", title: "App activated", message: `Activated ${selectedKeys.length} app(s)` });
    message.success("Activated");
    setSelectedKeys([]); setSelectedRows([]);
  };

  const handleDeactivate = () => {
    setApps((prev) => prev.map((a) => selectedKeys.includes(a.id) ? { ...a, status: "Inactive", lastModified: new Date().toLocaleString() } : a));
    addNotification({ type: "warning", title: "App deactivated", message: `Deactivated ${selectedKeys.length} app(s)` });
    message.success("Deactivated");
    setSelectedKeys([]); setSelectedRows([]);
  };

  const handleDelete = () => {
    const names = selectedRows.map((r) => r.name).join(", ");
    setApps((prev) => prev.filter((a) => !selectedKeys.includes(a.id)));
    addNotification({ type: "error", title: "App deleted", message: `Deleted: ${names}` });
    message.success("Deleted");
    setSelectedKeys([]); setSelectedRows([]);
  };

  const openEdit = () => {
    if (!selectedApp) return;
    editForm.setFieldsValue({ appName: selectedApp.name, redirectUri: selectedApp.redirectUri });
    setEditDrawer({ open: true, app: selectedApp });
  };

  const allActive = selectedRows.every((r) => r.status === "Active");
  const allInactive = selectedRows.every((r) => r.status === "Inactive");

  const columns = [
    { title: "App name", dataIndex: "name", key: "name", sorter: (a, b) => a.name.localeCompare(b.name), render: (name) => <Text style={{ color: "#5a67d8", cursor: "pointer" }}>{name}</Text> },
    { title: "Client ID", dataIndex: "clientId", key: "clientId", render: (id) => <Text style={{ fontSize: 12, color: "#666" }}>{id.slice(0, 26)}...</Text> },
    { title: "Secret", dataIndex: "secret", key: "secret", render: (s) => <SecretCell secret={s} /> },
    { title: "Status", dataIndex: "status", key: "status", render: (s) => <Badge status={s === "Active" ? "success" : "default"} text={s} /> },
    { title: "Last modified time", dataIndex: "lastModified", key: "lastModified", sorter: (a, b) => a.lastModified.localeCompare(b.lastModified) },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.infoCard}>
        <Title level={5} style={{ margin: 0 }}>App registration</Title>
        <Text type="secondary">Register an app to access or modify the resources in your MOS tenant.</Text>
      </div>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <Space wrap>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setAddDrawer(true)}>Add registration</Button>
          <Button icon={<EditOutlined />} disabled={!singleSelected} onClick={openEdit}>Edit</Button>
          <Button icon={<ReloadOutlined />} disabled={!singleSelected} onClick={handleRegenerate}>Regenerate secret</Button>
          {selectedKeys.length > 0 && (allInactive || (!allActive && !allInactive)) && (
            <Button icon={<CheckCircleOutlined />} onClick={handleActivate}>Activate</Button>
          )}
          {selectedKeys.length > 0 && (allActive || (!allActive && !allInactive)) && (
            <Button icon={<StopOutlined />} onClick={handleDeactivate}>Deactivate</Button>
          )}
          {selectedKeys.length > 0 && (
            <Popconfirm title={`Delete ${selectedKeys.length} app(s)?`} onConfirm={handleDelete} okText="Delete" okButtonProps={{ danger: true }}>
              <Button danger icon={<DeleteOutlined />}>Delete</Button>
            </Popconfirm>
          )}
        </Space>
        <Space>
          <FilterOutlined style={{ fontSize: 16, color: "#888", cursor: "pointer" }} />
          <Input prefix={<SearchOutlined />} placeholder="Search by app name" value={search} onChange={(e) => setSearch(e.target.value)} allowClear style={{ width: 220 }} />
        </Space>
      </div>

      {/* Table */}
      <div className={styles.tableWrapper}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={filtered}
          rowSelection={{ selectedRowKeys: selectedKeys, onChange: (keys, rows) => { setSelectedKeys(keys); setSelectedRows(rows); } }}
          pagination={{ showTotal: (t) => `Total ${t} item${t !== 1 ? "s" : ""}`, pageSizeOptions: ["10", "20"], showSizeChanger: true }}
          scroll={{ x: 700 }}
        />
      </div>

      {/* Add Drawer */}
      <Drawer
        title="Add registration"
        open={addDrawer}
        onClose={() => { setAddDrawer(false); addForm.resetFields(); }}
        size={520}
        footer={
          <Space style={{ float: "right" }}>
            <Button onClick={() => { setAddDrawer(false); addForm.resetFields(); }}>Cancel</Button>
            <Button type="primary" onClick={() => addForm.submit()}>Save</Button>
          </Space>
        }
      >
        <Text type="secondary" style={{ display: "block", marginBottom: 20 }}>Create an app to receive a set of client credentials.</Text>
        <Form form={addForm} layout="vertical" onFinish={handleAdd}>
          <Form.Item name="appName" label={<span>App name <span style={{ color: "red" }}>*</span></span>} rules={[{ required: true, message: "App name is required" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="redirectUri" label="Redirect URI" extra="Example: https://example.com">
            <Input placeholder="https://example.com" />
          </Form.Item>
        </Form>
      </Drawer>

      {/* Edit Drawer */}
      <Drawer
        title="Edit app registration"
        open={editDrawer.open}
        onClose={() => setEditDrawer({ open: false, app: null })}
        size={520}
        footer={
          <Space style={{ float: "right" }}>
            <Button onClick={() => setEditDrawer({ open: false, app: null })}>Cancel</Button>
            <Button type="primary" onClick={() => editForm.submit()}>Save</Button>
          </Space>
        }
      >
        {editDrawer.app && (
          <>
            {/* Client ID & Secret read-only */}
            <div className={styles.credentialRow}>
              <Text strong className={styles.credLabel}>Client ID</Text>
              <div className={styles.credValue}>
                <Text style={{ fontSize: 13 }}>{editDrawer.app.clientId}</Text>
                <Button type="text" size="small" icon={<CopyOutlined />} onClick={() => { navigator.clipboard.writeText(editDrawer.app.clientId); message.success("Copied!"); }} />
              </div>
            </div>
            <div className={styles.credentialRow}>
              <Text strong className={styles.credLabel}>Secret</Text>
              <div className={styles.credValue}>
                <Tooltip title={editDrawer.app.secret}>
                  <Text style={{ fontSize: 13 }}>{editDrawer.app.secret.slice(0, 32)}...</Text>
                </Tooltip>
                <Button type="text" size="small" icon={<CopyOutlined />} onClick={() => { navigator.clipboard.writeText(editDrawer.app.secret); message.success("Copied!"); }} />
              </div>
            </div>
            <div style={{ marginBottom: 20 }} />
            <Form form={editForm} layout="vertical" onFinish={handleEdit}>
              <Form.Item name="appName" label={<span>App name <span style={{ color: "red" }}>*</span></span>} rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="redirectUri" label="Redirect URI" extra="Example: https://example.com">
                <Input placeholder="https://example.com" />
              </Form.Item>
            </Form>
          </>
        )}
      </Drawer>
    </div>
  );
}
