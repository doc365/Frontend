import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table, Button, Input, Select, Space, Tag, Typography, Popconfirm,
  message, Badge, Tooltip, Drawer, Collapse, Checkbox, DatePicker, Radio,
} from "antd";
import {
  PlusOutlined, DeleteOutlined, StopOutlined, CheckCircleOutlined,
  SearchOutlined, ReloadOutlined, EditOutlined, TeamOutlined,
  UploadOutlined, DownloadOutlined, SafetyOutlined, FilterOutlined,
  RightOutlined,
} from "@ant-design/icons";
import * as XLSX from "xlsx";
import { useUsers } from "../../hooks/useUsers";
import { MOCK_PRODUCTS } from "../../mock/data";
import UserFormDrawer from "./UserFormDrawer";
import PermissionsDrawer from "./PermissionsDrawer";
import styles from "./UserManagement.module.scss";

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { Panel } = Collapse;

function ProductCell({ productAssignments }) {
  if (!productAssignments || productAssignments.length === 0)
    return <Text type="secondary" style={{ fontSize: 12 }}>None</Text>;
  const tooltipContent = (
    <div>
      {productAssignments.map(({ productId, roles }) => {
        const p = MOCK_PRODUCTS.find((x) => x.id === productId);
        return p ? <div key={productId}>{p.name}{roles?.length ? ` — ${roles.join(", ")}` : ""}</div> : null;
      })}
    </div>
  );
  return (
    <Tooltip title={tooltipContent} placement="left">
      <Text style={{ fontSize: 12, cursor: "default", borderBottom: "1px dashed #aaa" }}>
        {productAssignments.length} product(s)
      </Text>
    </Tooltip>
  );
}

const EMPTY_FILTERS = {
  signInMethod: [],
  role: [],
  status: [],
  product: [],
  roleInProduct: [],
  lastLoginRange: null,
};

function FilterDrawer({ open, onClose, onApply, initialFilters }) {
  const [local, setLocal] = useState(EMPTY_FILTERS);

  // sync when drawer opens
  useEffect(() => {
    if (open) setLocal(initialFilters);
  }, [open, initialFilters]);

  const toggle = (key, val) => {
    setLocal((prev) => {
      const arr = prev[key];
      return {
        ...prev,
        [key]: arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val],
      };
    });
  };

  const handleClear = () => setLocal(EMPTY_FILTERS);
  const handleApply = () => { onApply(local); onClose(); };

  const allRolesInProduct = MOCK_PRODUCTS.flatMap((p) => p.roles);
  const uniqueRolesInProduct = [...new Set(allRolesInProduct)];

  const panelHeader = (label, count) => (
    <span style={{ fontWeight: 500, fontSize: 14 }}>
      {label}
      {count > 0 && (
        <span className={styles.filterBadge}>{count}</span>
      )}
    </span>
  );

  return (
    <Drawer
      title={<Text strong style={{ fontSize: 16 }}>Filters</Text>}
      open={open}
      onClose={onClose}
      placement="right"
      width={420}
      styles={{ body: { padding: 0 } }}
      footer={
        <div className={styles.filterDrawerFooter}>
          <Button type="link" onClick={handleClear} style={{ padding: 0, color: "#555" }}>
            Clear all
          </Button>
          <Space>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="primary" onClick={handleApply}>Apply</Button>
          </Space>
        </div>
      }
    >
      <Collapse
        bordered={false}
        expandIconPosition="end"
        expandIcon={({ isActive }) => (
          <RightOutlined rotate={isActive ? 90 : 0} style={{ fontSize: 12 }} />
        )}
        className={styles.filterCollapse}
      >
        {/* Sign-in method */}
        <Panel
          header={panelHeader("Sign-in method", local.signInMethod.length)}
          key="signIn"
          className={styles.filterPanel}
        >
          <div className={styles.checkGroup}>
            {["Local user", "Singpass user"].map((v) => (
              <Checkbox
                key={v}
                checked={local.signInMethod.includes(v)}
                onChange={() => toggle("signInMethod", v)}
              >
                {v}
              </Checkbox>
            ))}
          </div>
        </Panel>

        {/* Role */}
        <Panel
          header={panelHeader("Role", local.role.length)}
          key="role"
          className={styles.filterPanel}
        >
          <div className={styles.checkGroup}>
            {["Administrator", "Tenant User"].map((v) => (
              <Checkbox
                key={v}
                checked={local.role.includes(v)}
                onChange={() => toggle("role", v)}
              >
                {v}
              </Checkbox>
            ))}
          </div>
        </Panel>

        {/* Status */}
        <Panel
          header={panelHeader("Status", local.status.length)}
          key="status"
          className={styles.filterPanel}
        >
          <div className={styles.checkGroup}>
            {["Active", "Inactive"].map((v) => (
              <Checkbox
                key={v}
                checked={local.status.includes(v)}
                onChange={() => toggle("status", v)}
              >
                {v}
              </Checkbox>
            ))}
          </div>
        </Panel>

        {/* Product */}
        <Panel
          header={panelHeader("Product", local.product.length)}
          key="product"
          className={styles.filterPanel}
        >
          <div className={styles.checkGroup}>
            {MOCK_PRODUCTS.map((p) => (
              <Checkbox
                key={p.id}
                checked={local.product.includes(p.id)}
                onChange={() => toggle("product", p.id)}
              >
                {p.icon} {p.name}
              </Checkbox>
            ))}
          </div>
        </Panel>

        {/* Role in product */}
        <Panel
          header={panelHeader("Role in product", local.roleInProduct.length)}
          key="roleInProduct"
          className={styles.filterPanel}
        >
          <div className={styles.checkGroup}>
            {uniqueRolesInProduct.map((v) => (
              <Checkbox
                key={v}
                checked={local.roleInProduct.includes(v)}
                onChange={() => toggle("roleInProduct", v)}
              >
                {v}
              </Checkbox>
            ))}
          </div>
        </Panel>

        {/* Last login time */}
        <Panel
          header={panelHeader("Last login time", local.lastLoginRange ? 1 : 0)}
          key="lastLogin"
          className={styles.filterPanel}
        >
          <RangePicker
            style={{ width: "100%" }}
            value={local.lastLoginRange}
            onChange={(val) => setLocal((prev) => ({ ...prev, lastLoginRange: val }))}
            format="D/M/YYYY"
          />
        </Panel>
      </Collapse>
    </Drawer>
  );
}

export default function UserManagement() {
  const { users, loading, total, fetchUsers, deleteUsers, deactivateUsers, activateUsers } = useUsers();
  const navigate = useNavigate();
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [sorter, setSorter] = useState({ field: "name", order: "asc" });
  const [formDrawer, setFormDrawer] = useState({ open: false, user: null });
  const [permDrawer, setPermDrawer] = useState({ open: false, user: null });
  const [filterOpen, setFilterOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState(EMPTY_FILTERS);

  const activeFilterCount = useMemo(() => {
    const f = appliedFilters;
    return (
      f.signInMethod.length +
      f.role.length +
      f.status.length +
      f.product.length +
      f.roleInProduct.length +
      (f.lastLoginRange ? 1 : 0)
    );
  }, [appliedFilters]);

  const load = useCallback(() => {
    fetchUsers({
      page: pagination.current,
      pageSize: pagination.pageSize,
      search,
      sortField: sorter.field,
      sortOrder: sorter.order,
      filters: appliedFilters,
    });
  }, [fetchUsers, pagination, search, sorter, appliedFilters]);

  useEffect(() => { load(); }, [load]);

  const handleTableChange = (pag, _, sort) => {
    setPagination({ current: pag.current, pageSize: pag.pageSize });
    if (sort?.field) setSorter({ field: sort.field, order: sort.order === "descend" ? "desc" : "asc" });
  };

  const bulkState = useMemo(() => {
    if (!selectedRows.length) return null;
    const allActive = selectedRows.every((u) => u.status === "Active");
    const allInactive = selectedRows.every((u) => u.status === "Inactive");
    return { allActive, allInactive, mixed: !allActive && !allInactive };
  }, [selectedRows]);

  const handleDelete = async (ids) => {
    await deleteUsers(ids);
    setSelectedKeys([]); setSelectedRows([]);
    message.success(`Deleted ${ids.length} user(s)`);
    load();
  };

  const handleDeactivate = async (ids) => {
    await deactivateUsers(ids);
    setSelectedKeys([]); setSelectedRows([]);
    message.success(`Deactivated ${ids.length} user(s)`);
    load();
  };

  const handleActivate = async (ids) => {
    await activateUsers(ids);
    setSelectedKeys([]); setSelectedRows([]);
    message.success(`Activated ${ids.length} user(s)`);
    load();
  };

  const handleExport = () => {
    if (!users.length) { message.warning("No data to export"); return; }
    const wb = XLSX.utils.book_new();
    const rows = [
      ["MOS Platform - User Export"],
      [`Exported: ${new Date().toLocaleString()}  |  Page ${pagination.current}, ${users.length} records`],
      [],
      ["User ID", "Display Name", "Full Name", "Email", "Staff & Student ID", "Sex", "Mobile Phone", "Role", "Sign-in Method", "Status", "Last Login", "Created At", "Products & Roles"],
      ...users.map((u) => [
        u.userId, u.name, u.fullName, u.email, u.staffId || "", u.sex || "", u.phone || "",
        u.role, u.signInMethod, u.status, u.lastLogin || "—", u.createdAt,
        (u.productAssignments || []).map(({ productId, roles }) => {
          const p = MOCK_PRODUCTS.find((x) => x.id === productId);
          return p ? `${p.name} (${(roles || []).join(", ")})` : "";
        }).filter(Boolean).join(" | "),
      ]),
    ];
    const ws = XLSX.utils.aoa_to_sheet(rows);
    ws["!cols"] = [14, 18, 22, 28, 14, 8, 14, 16, 14, 10, 18, 12, 40].map((w) => ({ wch: w }));
    ws["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 12 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: 12 } },
    ];
    XLSX.utils.book_append_sheet(wb, ws, "Users");
    XLSX.writeFile(wb, `mos_users_page${pagination.current}_${users.length}rows.xlsx`);
    message.success(`Exported ${users.length} users`);
  };

  const columns = [
    {
      title: "Display Name", dataIndex: "name", key: "name", sorter: true,
      render: (name, record) => (
        <div>
          <Text strong>{name}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>{record.userId}</Text>
        </div>
      ),
    },
    { title: "User ID", dataIndex: "userId", key: "userId", responsive: ["md"] },
    {
      title: "Role", dataIndex: "role", key: "role",
      render: (role) => <Tag color={role === "Administrator" ? "purple" : "blue"}>{role}</Tag>,
    },
    { title: "Sign-in Method", dataIndex: "signInMethod", key: "signInMethod", responsive: ["lg"] },
    {
      title: "Product", key: "product", responsive: ["md"],
      render: (_, record) => <ProductCell productAssignments={record.productAssignments} />,
    },
    {
      title: "Status", dataIndex: "status", key: "status",
      render: (status) => <Badge status={status === "Active" ? "success" : "default"} text={status} />,
    },
    {
      title: "Last Login", dataIndex: "lastLogin", key: "lastLogin", sorter: true, responsive: ["xl"],
      render: (val) => <Text style={{ fontSize: 12 }}>{val || "—"}</Text>,
    },
    {
      title: "Actions", key: "actions",
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit">
            <Button type="text" size="small" icon={<EditOutlined />} onClick={() => setFormDrawer({ open: true, user: record })} />
          </Tooltip>
          <Tooltip title="Permissions">
            <Button type="text" size="small" icon={<TeamOutlined />} onClick={() => setPermDrawer({ open: true, user: record })} />
          </Tooltip>
          <Popconfirm title="Delete user?" description="Cannot be undone." onConfirm={() => handleDelete([record.id])} okText="Delete" okButtonProps={{ danger: true }}>
            <Tooltip title="Delete">
              <Button type="text" size="small" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <Title level={4} style={{ margin: 0 }}>User Management</Title>
          <Text type="secondary">Manage platform users and permissions</Text>
        </div>
      </div>

      {/* Top toolbar */}
      <div className={styles.toolbar}>
        <Space wrap>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setFormDrawer({ open: true, user: null })}>
            Add User
          </Button>
          <Tooltip title="Import coming soon">
            <Button icon={<UploadOutlined />} disabled>Import</Button>
          </Tooltip>
          <Button icon={<DownloadOutlined />} onClick={handleExport} disabled={selectedKeys.length === 0}>
            Export{selectedKeys.length > 0 ? ` (${selectedKeys.length})` : ""}
          </Button>
          <Button icon={<SafetyOutlined />} onClick={() => navigate("/users/admin-roles")}>
            Manage admin roles
          </Button>
        </Space>

        <Space wrap>
          <Input
            placeholder="Search name, email, user ID..."
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPagination((p) => ({ ...p, current: 1 })); }}
            allowClear
            className={styles.searchInput}
          />
          <Button
            icon={<FilterOutlined />}
            onClick={() => setFilterOpen(true)}
            className={activeFilterCount > 0 ? styles.filterBtnActive : ""}
          >
            Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
          </Button>
          <Button icon={<ReloadOutlined />} onClick={load} />
        </Space>
      </div>

      {/* Bulk action bar */}
      {selectedKeys.length > 0 && bulkState && (
        <div className={styles.bulkBar}>
          <Text>{selectedKeys.length} selected</Text>
          <Space>
            {(bulkState.allInactive || bulkState.mixed) && (
              <Popconfirm title={`Activate ${selectedKeys.length} user(s)?`} onConfirm={() => handleActivate(selectedKeys)} okText="Activate">
                <Button icon={<CheckCircleOutlined />} size="small">Activate</Button>
              </Popconfirm>
            )}
            {(bulkState.allActive || bulkState.mixed) && (
              <Popconfirm title={`Deactivate ${selectedKeys.length} user(s)?`} onConfirm={() => handleDeactivate(selectedKeys)} okText="Deactivate">
                <Button icon={<StopOutlined />} size="small">Deactivate</Button>
              </Popconfirm>
            )}
            <Popconfirm title={`Delete ${selectedKeys.length} user(s)?`} description="Cannot be undone." onConfirm={() => handleDelete(selectedKeys)} okText="Delete" okButtonProps={{ danger: true }}>
              <Button danger icon={<DeleteOutlined />} size="small">Delete</Button>
            </Popconfirm>
          </Space>
        </div>
      )}

      <div className={styles.tableWrapper}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={users}
          loading={loading}
          onChange={handleTableChange}
          rowSelection={{
            selectedRowKeys: selectedKeys,
            onChange: (keys, rows) => { setSelectedKeys(keys); setSelectedRows(rows); },
          }}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50"],
            showTotal: (t, range) => `${range[0]}-${range[1]} of ${t} users`,
            onShowSizeChange: (_, size) => setPagination({ current: 1, pageSize: size }),
          }}
          scroll={{ x: 700 }}
        />
      </div>

      {/* Filter side drawer */}
      <FilterDrawer
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        onApply={(f) => { setAppliedFilters(f); setPagination((p) => ({ ...p, current: 1 })); }}
        initialFilters={appliedFilters}
      />

      <UserFormDrawer
        open={formDrawer.open}
        user={formDrawer.user}
        onClose={() => setFormDrawer({ open: false, user: null })}
        onSuccess={() => { setFormDrawer({ open: false, user: null }); load(); }}
      />
      <PermissionsDrawer
        open={permDrawer.open}
        user={permDrawer.user}
        onClose={() => setPermDrawer({ open: false, user: null })}
        onSuccess={() => { setPermDrawer({ open: false, user: null }); load(); }}
      />
    </div>
  );
}