import { useState, useEffect } from "react";
import { Drawer, Button, Space, Typography, Divider, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { UserSearchSelect } from "../../../components/shared/UserSearchSelect";

const { Text, Title } = Typography;

export default function EditUsersDrawer({ open, role, onClose, onSave }) {
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    if (role) setSelectedUsers(role.assignedUsers || []);
  }, [role]);

  const handleSave = () => {
    if (!role) return;
    onSave(role.id, selectedUsers);
    message.success(`Users updated for ${role.name}`);
  };

  return (
    <Drawer
      title="Edit users"
      open={open}
      onClose={onClose}
      placement="right"
      size={500}
      footer={
        <Space style={{ float: "right" }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" onClick={handleSave}>Save</Button>
        </Space>
      }
    >
      {role && (
        <>
          <Title level={5} style={{ marginBottom: 6 }}>{role.name}</Title>
          <Text type="secondary" style={{ fontSize: 13, lineHeight: 1.6, display: "block" }}>{role.description}</Text>
          <Divider />
          <Text strong style={{ display: "block", marginBottom: 8 }}>
            <PlusOutlined style={{ marginRight: 6 }} />Assigned users ({selectedUsers.length})
          </Text>
          <UserSearchSelect
            selected={selectedUsers}
            onChange={setSelectedUsers}
            placeholder="Search by name, user ID or email..."
          />
        </>
      )}
    </Drawer>
  );
}
