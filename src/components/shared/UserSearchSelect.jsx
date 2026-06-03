import { useState } from "react";
import { Select, Avatar, Typography, Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { MOCK_USERS } from "../../mock/data";

const { Text } = Typography;

const AVATAR_COLORS = ["#f56a00","#7265e6","#ffbf00","#00a2ae","#e6162d","#0050b3","#389e0d","#531dab","#c41d7f","#08979c"];

export function getAvatarColor(name = "") {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export function getInitials(name = "") {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

export function UserSearchSelect({ selected = [], onChange, placeholder = "Search by name, email or user ID...", excludeIds = [] }) {
  const [search, setSearch] = useState("");

  const allExcluded = [...selected.map((u) => u.id), ...excludeIds];

  const options = MOCK_USERS
    .filter((u) => {
      if (allExcluded.includes(u.id)) return false;
      if (!search) return true;
      const q = search.toLowerCase();
      return u.email.toLowerCase().includes(q) || u.name.toLowerCase().includes(q) || u.userId.toLowerCase().includes(q);
    })
    .map((u) => ({ value: u.id, label: `${u.name} — ${u.email}`, user: u }));

  const handleSelect = (value, option) => {
    onChange([...selected, option.user]);
    setSearch("");
  };

  const handleRemove = (userId) => {
    onChange(selected.filter((u) => u.id !== userId));
  };

  return (
    <div>
      <Select
        showSearch
        style={{ width: "100%" }}
        placeholder={placeholder}
        filterOption={false}
        options={options}
        onSearch={setSearch}
        onSelect={handleSelect}
        searchValue={search}
        value={null}
        notFoundContent={search ? "No users found" : "Start typing to search"}
      />

      {selected.length > 0 && (
        <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
          {selected.map((u) => (
            <div
              key={u.id}
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", borderRadius: 6, background: "#f5f6fa", border: "1px solid #e5e7eb" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Avatar size={32} style={{ backgroundColor: getAvatarColor(u.name), fontSize: 12, fontWeight: 600, flexShrink: 0 }}>
                  {getInitials(u.name)}
                </Avatar>
                <div>
                  <Text strong style={{ fontSize: 13 }}>{u.name}</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: 12 }}>{u.email}</Text>
                </div>
              </div>
              <Button type="text" size="small" danger icon={<DeleteOutlined />} onClick={() => handleRemove(u.id)}>
                Remove
              </Button>
            </div>
          ))}
        </div>
      )}

      {selected.length > 0 && (
        <Text type="secondary" style={{ fontSize: 12, display: "block", marginTop: 8, textAlign: "right" }}>
          {selected.length} user(s) selected
        </Text>
      )}
    </div>
  );
}
