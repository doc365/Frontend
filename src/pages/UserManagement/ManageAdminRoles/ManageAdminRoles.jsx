import { useState } from "react";
import { Typography, Button, Checkbox, Breadcrumb, Avatar, Tooltip, Space } from "antd";
import { ArrowLeftOutlined, EditOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { ADMIN_ROLES } from "../../../mock/data";
import EditUsersDrawer from "./EditUsersDrawer";
import styles from "./ManageAdminRoles.module.scss";

const { Title, Text } = Typography;

const AVATAR_COLORS = ["#f56a00","#7265e6","#ffbf00","#00a2ae","#e6162d","#0050b3","#389e0d","#531dab","#c41d7f","#08979c"];

function getColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function UserAvatarList({ users }) {
  if (!users.length) return <Text type="secondary" style={{ fontSize: 13 }}>No users assigned</Text>;
  return (
    <div className={styles.avatarRow}>
      {users.map((u) => (
        <Tooltip key={u.id} title={u.name}>
          <div className={styles.avatarItem}>
            <Avatar
              size={36}
              style={{ backgroundColor: getColor(u.name), fontSize: 14, fontWeight: 600, flexShrink: 0 }}
            >
              {u.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
            </Avatar>
            <Text style={{ fontSize: 13 }}>{u.name}</Text>
          </div>
        </Tooltip>
      ))}
    </div>
  );
}

export default function ManageAdminRoles() {
  const navigate = useNavigate();
  const [roles, setRoles] = useState(ADMIN_ROLES);
  const [selectedRoleIds, setSelectedRoleIds] = useState([]);
  const [drawerState, setDrawerState] = useState({ open: false, role: null });

  const toggleSelect = (roleId) => {
    setSelectedRoleIds((prev) =>
      prev.includes(roleId) ? prev.filter((id) => id !== roleId) : [...prev, roleId]
    );
  };

  const handleSave = (roleId, users) => {
    setRoles((prev) => prev.map((r) => r.id === roleId ? { ...r, assignedUsers: users } : r));
    setDrawerState({ open: false, role: null });
  };

  const activeRole = drawerState.role ? roles.find((r) => r.id === drawerState.role.id) : null;

  return (
    <div className={styles.container}>
      <Breadcrumb
        className={styles.breadcrumb}
        items={[
          { title: <span className={styles.breadcrumbLink} onClick={() => navigate("/users")}>Account management</span> },
          { title: "Manage admin roles" },
        ]}
      />

      <div className={styles.header}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => navigate("/users")} className={styles.backBtn} />
          <Title level={4} style={{ margin: 0 }}>Manage admin roles</Title>
        </div>
        <Button
          type="primary"
          icon={<EditOutlined />}
          disabled={selectedRoleIds.length === 0}
          onClick={() => {
            const role = roles.find((r) => r.id === selectedRoleIds[0]);
            setDrawerState({ open: true, role });
          }}
        >
          Edit users
        </Button>
      </div>

      <div className={styles.tableWrapper}>
        <div className={styles.tableHeader}>
          <Text strong style={{ flex: "0 0 340px" }}>Role</Text>
          <Text strong>Users</Text>
        </div>

        {roles.map((role) => {
          const isChecked = selectedRoleIds.includes(role.id);
          return (
            <div
              key={role.id}
              className={`${styles.roleRow} ${isChecked ? styles.roleRowSelected : ""}`}
              onClick={() => toggleSelect(role.id)}
            >
              <Checkbox
                checked={isChecked}
                onChange={() => toggleSelect(role.id)}
                onClick={(e) => e.stopPropagation()}
                className={styles.checkbox}
              />
              <div className={styles.roleInfo}>
                <Text strong className={styles.roleName}>{role.name}</Text>
                <Text type="secondary" className={styles.roleDesc}>{role.description}</Text>
              </div>
              <div className={styles.usersCol}>
                <UserAvatarList users={role.assignedUsers} />
              </div>
            </div>
          );
        })}
      </div>

      <EditUsersDrawer
        open={drawerState.open}
        role={activeRole}
        onClose={() => setDrawerState({ open: false, role: null })}
        onSave={handleSave}
      />
    </div>
  );
}
