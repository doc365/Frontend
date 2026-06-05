import { useState } from "react";
import {
  Drawer, Avatar, Typography, Button,
  Space, Divider, Form, Input, message,
} from "antd";
import { GlobalOutlined } from "@ant-design/icons";
import { useAuth } from "../../context/AuthContext";
import { useUsers } from "../../hooks/useUsers";
import styles from "./ProfileDrawer.module.scss";

const { Text, Title } = Typography;

// ── Mappers ───────────────────────────────────────────────────────────────────
const ROLE_MAP = {
  0: { label: "Administrator", color: "purple" },
  1: { label: "Tenant User",   color: "blue"   },
};

const STATUS_MAP = {
  0: { label: "Active",   color: "success" },
  1: { label: "Inactive", color: "error"   },
};

const SIGNIN_METHOD_MAP = {
  0: { label: "Local",     color: "default" },
  1: { label: "Google",    color: "red"     },
  2: { label: "Microsoft", color: "blue"    },
};

// ── InfoRow ───────────────────────────────────────────────────────────────────
function InfoRow({ label, value }) {
  return (
    <div className={styles.infoRow}>
      <Text className={styles.infoLabel}>{label}</Text>
      <span className={styles.infoValue}>
        {value ?? <span className={styles.empty}>—</span>}
      </span>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function ProfileDrawer({ open, onClose }) {
  const { user, setUser } = useAuth();
  const { updateUser } = useUsers();
  const [editMode, setEditMode] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();
  const [resetForm] = Form.useForm();

  const role         = ROLE_MAP[user?.role]              ?? { label: "tenant user", color: "default" };
  const status       = STATUS_MAP[user?.status]          ?? { label: "Unknown", color: "default" };
  const signinMethod = SIGNIN_METHOD_MAP[user?.signInMethod] ?? { label: "Unknown", color: "default" };

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const handleEdit = () => {
    form.setFieldsValue({
      name:     user?.name,
      username: user?.userName,
      email:    user?.email,
      phone:    user?.phone,
    });
    setEditMode(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);

      const updated = await updateUser(user?.id, {
        name:       values.name,
        userId:     values.username,
        phone:      values.phone ?? "",
        role:       role.label,
        productIds: [],
      });
      console.log("UPDATED RESPONSE", updated);
      const raw = updated?.data ?? updated;

      const newUserData = {
        id:           raw.id           ?? user?.id,
        name:         raw.name         ?? values.name,
        userName:     raw.userName     ?? values.username,
        email:        raw.email        ?? user?.email,
        phone:        raw.phone        ?? values.phone ?? "",
        status:       raw.status       ?? user?.status,
        role:         raw.role         ?? user?.role,
        signInMethod: raw.signinMethod ?? user?.signInMethod,
      };

      localStorage.setItem("mos_user", JSON.stringify(newUserData));
      setUser(newUserData);

      message.success("Profile updated successfully");
      setEditMode(false);
    } catch (err) {
      if (err?.errorFields) return;
      message.error("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
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

  const handleClose = () => {
    onClose();
    setEditMode(false);
    setResetMode(false);
    form.resetFields();
    resetForm.resetFields();
  };

  const initials = user?.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <Drawer
      title="My profile"
      open={open}
      onClose={handleClose}
      width={520}
      closeIcon="×"
      styles={{ header: { borderBottom: "1px solid #f0f0f0" } }}
      footer={
        !editMode && !resetMode ? (
          <Space style={{ float: "right" }}>
            <Button onClick={handleClose}>Close</Button>
            <Button onClick={handleEdit}>Edit</Button>
            <Button type="primary" onClick={() => setResetMode(true)}>
              Reset password
            </Button>
          </Space>
        ) : editMode ? (
          <Space style={{ float: "right" }}>
            <Button onClick={() => setEditMode(false)} disabled={saving}>
              Cancel
            </Button>
            <Button type="primary" onClick={handleSave} loading={saving}>
              Save
            </Button>
          </Space>
        ) : (
          <Space style={{ float: "right" }}>
            <Button
              onClick={() => { setResetMode(false); resetForm.resetFields(); }}
            >
              Cancel
            </Button>
            <Button type="primary" onClick={handleResetPassword}>
              Confirm Reset
            </Button>
          </Space>
        )
      }
    >
      {/* ── Avatar + Name ── */}
      <div className={styles.avatarSection}>
        <Avatar size={64} className={styles.avatar}>{initials}</Avatar>
        <Title level={5} className={styles.displayName}>{user?.name}</Title>
        <div className={styles.region}>
          <GlobalOutlined style={{ fontSize: 12, marginRight: 4 }} />
          <Text type="secondary" style={{ fontSize: 13 }}>
            Southeast Asia (Singapore)
          </Text>
        </div>
      </div>

      <Divider />

      {/* ── View Mode ── */}
      {!editMode && !resetMode && (
        <div className={styles.infoTable}>
          <InfoRow label="Name"           value={user?.name} />
          <InfoRow label="Username"       value={user?.userName} />
          <InfoRow label="Email address"  value={user?.email} />
          <InfoRow label="Mobile phone"   value={user?.phone} />
          <InfoRow label="Role"           value={role.label} />
          <InfoRow label="Status"         value={status.label} />
          <InfoRow label="Sign-in method" value={signinMethod.label} />
        </div>
      )}

      {/* ── Edit Mode ── */}
      {editMode && (
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Required" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: "Required" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email address"
            rules={[
              { required: true, message: "Required" },
              { type: "email", message: "Invalid email" },
            ]}
          >
            <Input disabled />
          </Form.Item>

          <Form.Item name="phone" label="Mobile phone">
            <Input />
          </Form.Item>

          <Form.Item label="Role">
            <Text>{role.label}</Text>
          </Form.Item>

          <Form.Item label="Status">
            <Text>{status.label}</Text>
          </Form.Item>

          <Form.Item label="Sign-in method">
            <Text>{signinMethod.label}</Text>
          </Form.Item>
        </Form>
      )}

      {/* ── Reset Password Mode ── */}
      {resetMode && (
        <Form form={resetForm} layout="vertical">
          <Form.Item
            name="currentPassword"
            label="Current Password"
            rules={[{ required: true, message: "Required" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label="New Password"
            rules={[
              { required: true, message: "Required" },
              { min: 8, message: "Min 8 characters" },
              {
                pattern: /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/,
                message: "Must include uppercase, number, and symbol",
              },
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
                  if (!value || getFieldValue("newPassword") === value)
                    return Promise.resolve();
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