import { useState, useEffect } from "react";
import { Drawer, Button, Space, Typography, Divider, Select, Tag, message } from "antd";
import { MOCK_USERS } from "../../../mock/data";

const { Text, Title } = Typography;

export default function AssignUsersDrawer({ open, role, onClose, onSave }) {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (role) {
      setSelectedUsers(role.assignedUsers || []);
    }
  }, [role]);

  const filteredOptions = MOCK_USERS
    .filter((u) => {
      const q = search.toLowerCase();
      return (
        u.email.toLowerCase().includes(q) ||
        u.name.toLowerCase().includes(q) ||
        u.userId.toLowerCase().includes(q)
      );
    })
    .map((u) => ({
      value: u.id,
      label: `${u.name} — ${u.email}`,
      user: u,
    }));

  const handleSelect = (value, option) => {
    if (!selectedUsers.find((u) => u.id === value)) {
      setSelectedUsers((prev) => [...prev, option.user]);
    }
    setSearch("");
  };

  const handleRemove = (userId) => {
    setSelectedUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  const handleSave = () => {
    if (!role) return;
    onSave(role.id, selectedUsers);
    message.success(`Users assigned to ${role.name}`);
  };

  return (
    <Drawer
      title="Assign users"
      open={open}
      onClose={onClose}
      placement="right"
      size={480}
      footer={
        <Space style={{ float: "right" }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" onClick={handleSave}>Save</Button>
        </Space>
      }
    >
      {role && (
        <>
          {/* Role info */}
          <Title level={5} style={{ marginBottom: 6 }}>{role.name}</Title>
          <Text type="secondary" style={{ fontSize: 13, lineHeight: 1.6, display: "block" }}>
            {role.description}
          </Text>

          <Divider />

          {/* User search input */}
          <Text strong style={{ display: "block", marginBottom: 10 }}>Users</Text>
          <Select
            showSearch
            style={{ width: "100%" }}
            placeholder="Search by name or email..."
            filterOption={false}
            options={filteredOptions}
            onSearch={(val) => setSearch(val)}
            onSelect={handleSelect}
            searchValue={search}
            value={null}
            notFoundContent={search ? "No users found" : "Start typing to search"}
          />

          {/* Selected users */}
          {selectedUsers.length > 0 && (
            <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
              {selectedUsers.map((u) => (
                <div
                  key={u.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 12px",
                    borderRadius: 6,
                    background: "#f5f6fa",
                    border: "1px solid #e5e7eb",
                  }}
                >
                  <div>
                    <Text strong style={{ fontSize: 13 }}>{u.name}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 12 }}>{u.email}</Text>
                  </div>
                  <Button
                    type="text"
                    size="small"
                    danger
                    onClick={() => handleRemove(u.id)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </Drawer>
  );
}
