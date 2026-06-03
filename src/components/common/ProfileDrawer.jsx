import { useState } from "react";
import { Drawer, Avatar, Typography, Button, Space, Divider, Form, Input, Select, message } from "antd";
import { GlobalOutlined } from "@ant-design/icons";
import { useAuth } from "../../context/AuthContext";
import styles from "./ProfileDrawer.module.scss";

const { Text, Title } = Typography;
const { Option } = Select;

function InfoRow({ label, value }) {
  return (
    <div className={styles.infoRow}>
      <Text className={styles.infoLabel}>{label}</Text>
      <Text className={styles.infoValue}>{value || <span className={styles.empty}>—</span>}</Text>
    </div>
  );
}

export default function ProfileDrawer({ open, onClose }) {
  const { user, logout } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const [form] = Form.useForm();
  const [resetForm] = Form.useForm();

  const handleEdit = () => {
    form.setFieldsValue({
      fullName: user?.fullName,
      sex: user?.sex,
      phone: user?.phone,
      staffId: user?.staffId,
    });
    setEditMode(true);
  };

  const handleSave = async () => {
    try {
      await form.validateFields();
      // TODO: call API to update profile
      message.success("Profile updated successfully");
      setEditMode(false);
    } catch {}
  };

  const handleResetPassword = async () => {
    try {
      await resetForm.validateFields();
      // TODO: call API to reset password
      message.success("Password reset successfully");
      setResetMode(false);
      resetForm.resetFields();
    } catch {}
  };

  const initials = user?.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <Drawer
      title="My profile"
      open={open}
      onClose={() => { onClose(); setEditMode(false); setResetMode(false); }}
      width={520}
      closeIcon="×"
      styles={{ header: { borderBottom: "1px solid #f0f0f0" } }}
      footer={
        !editMode && !resetMode ? (
          <Space style={{ float: "right" }}>
            <Button onClick={onClose}>Close</Button>
            <Button onClick={handleEdit}>Edit</Button>
            <Button type="primary" onClick={() => setResetMode(true)}>Reset password</Button>
          </Space>
        ) : editMode ? (
          <Space style={{ float: "right" }}>
            <Button onClick={() => setEditMode(false)}>Cancel</Button>
            <Button type="primary" onClick={handleSave}>Save</Button>
          </Space>
        ) : (
          <Space style={{ float: "right" }}>
            <Button onClick={() => { setResetMode(false); resetForm.resetFields(); }}>Cancel</Button>
            <Button type="primary" onClick={handleResetPassword}>Confirm Reset</Button>
          </Space>
        )
      }
    >
      {/* Avatar + Name */}
      <div className={styles.avatarSection}>
        <Avatar size={64} className={styles.avatar}>{initials}</Avatar>
        <Title level={5} className={styles.displayName}>{user?.name}</Title>
        <div className={styles.region}>
          <GlobalOutlined style={{ fontSize: 12, marginRight: 4 }} />
          <Text type="secondary" style={{ fontSize: 13 }}>Southeast Asia (Singapore)</Text>
        </div>
      </div>

      <Divider />

      {/* View Mode */}
      {!editMode && !resetMode && (
        <div className={styles.infoTable}>
          <InfoRow label="Display name" value={user?.name} />
          <InfoRow label="User ID" value={user?.userId} />
          <InfoRow label="Email address" value={user?.email} />
          <InfoRow label="Staff & Student ID" value={user?.staffId} />
          <InfoRow label="Sex" value={user?.sex} />
          <InfoRow label="Mobile phone" value={user?.phone} />
        </div>
      )}

      {/* Edit Mode */}
      {editMode && (
        <Form form={form} layout="vertical">
          <Form.Item name="fullName" label="Full Name" rules={[{ required: true, message: "Required" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="staffId" label="Staff & Student ID">
            <Input />
          </Form.Item>
          <Form.Item name="sex" label="Sex">
            <Select>
              <Option value="Male">Male</Option>
              <Option value="Female">Female</Option>
            </Select>
          </Form.Item>
          <Form.Item name="phone" label="Mobile phone">
            <Input />
          </Form.Item>
        </Form>
      )}

      {/* Reset Password Mode */}
      {resetMode && (
        <Form form={resetForm} layout="vertical">
          <Form.Item name="currentPassword" label="Current Password" rules={[{ required: true, message: "Required" }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="newPassword"
            label="New Password"
            rules={[
              { required: true, message: "Required" },
              { min: 8, message: "Min 8 characters" },
              { pattern: /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/, message: "Must include uppercase, number, and symbol" },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="Confirm New Password"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Required" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) return Promise.resolve();
                  return Promise.reject(new Error("Passwords do not match"));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      )}
    </Drawer>
  );
}
