import { useState } from "react";
import {
  Typography,
  Switch,
  Card,
  Button,
  Divider,
  Input,
  message,
  Spin,
  Alert,
} from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useWhitelist } from "../../../hooks/useWhitelist";
import styles from "./EmailNotification.module.scss";

const { Title, Text } = Typography;

export default function EmailNotification() {
  const {
    isEnabled,
    emails,
    loading,
    saving,
    error,
    updateSetting,
    addEmail,
    removeEmail,
  } = useWhitelist();

  const [inputValue, setInputValue] = useState("");
  const [inputError, setInputError] = useState("");

  // ── Toggle the whitelist on/off ─────────────────────
  const handleToggle = async (checked) => {
    try {
      await updateSetting(checked);
      message.success(checked ? "Allow list enabled" : "Allow list disabled");
    } catch {
      message.error("Failed to update setting");
    }
  };

  // ── Add email on button click or Enter ──────────────
  const handleAdd = async () => {
    const trimmed = inputValue.trim().toLowerCase();

    if (!trimmed) {
      setInputError("Please enter an email address");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setInputError("Please enter a valid email address");
      return;
    }
    if (emails.includes(trimmed)) {
      setInputError("This email is already in the allow list");
      return;
    }

    setInputError("");
    try {
      await addEmail(trimmed);
      setInputValue("");
      message.success(`${trimmed} added to allow list`);
    } catch {
      message.error("Failed to add email");
    }
  };

  const handleRemove = async (email) => {
    try {
      await removeEmail(email);
      message.success(`${email} removed from allow list`);
    } catch {
      message.error("Failed to remove email");
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div style={{ display: "flex", justifyContent: "center", padding: 48 }}>
          <Spin size="large" />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        {/* Header row with toggle */}
        <div className={styles.cardHeader}>
          <div style={{ flex: 1 }}>
            <Title level={5} style={{ margin: 0 }}>
              Enable email notification allow list
            </Title>
            <Text
              type="secondary"
              style={{ fontSize: 13, display: "block", marginTop: 4 }}
            >
              By default, email notifications can be sent to anyone. Enable this
              to restrict notifications to only email addresses in the allow
              list.
            </Text>
          </div>
          <Switch
            checked={isEnabled}
            onChange={handleToggle}
            loading={saving}
          />
        </div>

        {/* Allow list management — only shown when enabled */}
        {isEnabled && (
          <>
            <Divider />

            <Title level={5} style={{ marginBottom: 4 }}>
              Email allow list
            </Title>
            <Text
              type="secondary"
              style={{ fontSize: 13, display: "block", marginBottom: 16 }}
            >
              Only addresses in this list can receive email notifications.
              Changes apply immediately.
            </Text>

            {error && (
              <Alert
                type="error"
                message={error}
                showIcon
                closable
                style={{ marginBottom: 16 }}
              />
            )}

            {/* Add email input */}
            <div style={{ display: "flex", gap: 8, marginBottom: 4 }}>
              <div style={{ flex: 1 }}>
                <Input
                  placeholder="Enter email address to add..."
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    if (inputError) setInputError("");
                  }}
                  onPressEnter={handleAdd}
                  status={inputError ? "error" : ""}
                />
                {inputError && (
                  <Text
                    type="danger"
                    style={{ fontSize: 12, marginTop: 4, display: "block" }}
                  >
                    {inputError}
                  </Text>
                )}
              </div>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAdd}
                loading={saving}
              >
                Add
              </Button>
            </div>

            {/* Email list */}
            <div
              style={{
                marginTop: 16,
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              {emails.length === 0 ? (
                <Text
                  type="secondary"
                  style={{
                    fontSize: 13,
                    padding: "12px 0",
                    display: "block",
                  }}
                >
                  No email addresses added yet.
                </Text>
              ) : (
                emails.map((item) => (
                  <div
                    key={item.id}
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
                    <Text style={{ fontSize: 13 }}>{item.email}</Text>

                    <Button
                      type="text"
                      size="small"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleRemove(item)}
                      loading={saving}
                    >
                      Remove
                    </Button>
                  </div>
                ))
              )}
            </div>

            {emails.length > 0 && (
              <Text
                type="secondary"
                style={{ fontSize: 12, marginTop: 10, display: "block" }}
              >
                {emails.length} address{emails.length !== 1 ? "es" : ""} in
                allow list
              </Text>
            )}
          </>
        )}
      </Card>
    </div>
  );
}
