import { useState } from "react";
import { Tabs, Card, Tag, Typography, Button, Drawer, Divider, Switch, Input, Space, message } from "antd";
import { EyeOutlined, TagFilled } from "@ant-design/icons";
import { MOCK_SUBSCRIPTIONS } from "../../mock/data";
import styles from "./Subscriptions.module.scss";

const { Title, Text } = Typography;

// ── Subscription Information Tab ──────────────────────
function SubscriptionInfoTab() {
  const [drawerSub, setDrawerSub] = useState(null);

  return (
    <div className={styles.infoTab}>
      <div className={styles.cardGrid}>
        {MOCK_SUBSCRIPTIONS.map((sub) => (
          <SubCard key={sub.id} sub={sub} onView={() => setDrawerSub(sub)} />
        ))}
      </div>

      <SubDetailDrawer
        sub={drawerSub}
        open={!!drawerSub}
        onClose={() => setDrawerSub(null)}
      />
    </div>
  );
}

function SubCard({ sub, onView }) {
  // Show only the first 5 fields as a preview
  const previewFields = sub.fields.slice(0, 5);

  return (
    <Card className={styles.subCard}>
      <div className={styles.subCardHeader}>
        <Text strong className={styles.subCardName}>{sub.name}</Text>
        <div className={styles.subCardStatus}>
          <TagFilled style={{ color: sub.statusColor, fontSize: 16 }} />
          <Text style={{ color: sub.statusColor, fontSize: 13, fontWeight: 500 }}>{sub.status}</Text>
        </div>
      </div>

      <div className={styles.subCardFields}>
        {previewFields.map((f) => (
          <div key={f.label} className={styles.subField}>
            <Text className={styles.subFieldLabel}>{f.label}</Text>
            <Text className={styles.subFieldValue}>{f.value}</Text>
          </div>
        ))}
      </div>

      <Divider style={{ margin: "14px 0" }} />

      <Button
        type="link"
        icon={<EyeOutlined />}
        onClick={onView}
        className={styles.viewBtn}
      >
        View subscription
      </Button>
    </Card>
  );
}

function SubDetailDrawer({ sub, open, onClose }) {
  if (!sub) return null;

  return (
    <Drawer
      title={sub.name}
      open={open}
      onClose={onClose}
      styles={{ wrapper: { width: 480 } }}
      footer={
        <div style={{ textAlign: "right" }}>
          <Button onClick={onClose}>Close</Button>
        </div>
      }
    >
      <div className={styles.drawerStatus}>
        <TagFilled style={{ color: sub.statusColor, fontSize: 18 }} />
        <Text style={{ color: sub.statusColor, fontWeight: 600, fontSize: 15 }}>{sub.status}</Text>
      </div>

      <div className={styles.drawerMeta}>
        <div className={styles.drawerMetaRow}>
          <Text type="secondary">Subscription type</Text>
          <Tag color="blue">{sub.subscriptionType}</Tag>
        </div>
        <div className={styles.drawerMetaRow}>
          <Text type="secondary">Subscription agreement</Text>
          <Button type="link" size="small" style={{ padding: 0 }}>View details</Button>
        </div>
      </div>

      <Divider />

      <div className={styles.drawerFields}>
        {sub.fields.map((f) => (
          <div key={f.label} className={styles.drawerField}>
            <Text className={styles.drawerFieldLabel}>{f.label}</Text>
            <Text className={styles.drawerFieldValue}>{f.value}</Text>
          </div>
        ))}
      </div>
    </Drawer>
  );
}

// ── Subscription Notification Tab ─────────────────────
function SubscriptionNotificationTab() {
  const [recipients, setRecipients] = useState({
    tenantOwners: true,
    serviceAdmins: false,
    customRecipients: true,
  });
  const [customEmails, setCustomEmails] = useState("c-william.le@avepoint.com");

  const toggle = (key) => setRecipients((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleSave = () => message.success("Subscription notification settings saved");
  const handleCancel = () => message.info("Changes discarded");

  return (
    <div className={styles.notifTab}>
      <Card className={styles.notifCard}>
        <Text strong style={{ fontSize: 15, display: "block", marginBottom: 4 }}>
          Who should receive subscription notifications?
        </Text>
        <Text type="secondary" style={{ fontSize: 13, display: "block", marginBottom: 20 }}>
          (Including the subscription expiration and out of policy notifications)
        </Text>

        <div className={styles.recipientList}>
          {[
            { key: "tenantOwners", label: "Tenant owners in MaivenPoint Online Services" },
            { key: "serviceAdmins", label: "Service admins in MaivenPoint Online Services" },
            { key: "customRecipients", label: "Custom recipients" },
          ].map((item) => (
            <div key={item.key} className={styles.recipientRow}>
              <Text>{item.label}</Text>
              <Switch
                checked={recipients[item.key]}
                onChange={() => toggle(item.key)}
              />
            </div>
          ))}
        </div>

        {recipients.customRecipients && (
          <div className={styles.emailSection}>
            <Text strong style={{ display: "block", marginBottom: 8 }}>
              Email addresses <span style={{ color: "#ff4d4f" }}>*</span>
            </Text>
            <Input.TextArea
              rows={4}
              value={customEmails}
              onChange={(e) => setCustomEmails(e.target.value)}
              style={{ marginBottom: 6 }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              Example: name1@example.com;name2@example.com
            </Text>
          </div>
        )}

        <Divider />

        <div style={{ textAlign: "right" }}>
          <Space>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button type="primary" onClick={handleSave}>Save</Button>
          </Space>
        </div>
      </Card>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────
export default function Subscriptions() {
  return (
    <div className={styles.container}>
      <Title level={4} style={{ marginBottom: 4 }}>Subscription management</Title>
      <Tabs
        defaultActiveKey="info"
        className={styles.tabs}
        items={[
          { key: "info", label: "Subscription information", children: <SubscriptionInfoTab /> },
          { key: "notification", label: "Subscription notification", children: <SubscriptionNotificationTab /> },
        ]}
      />
    </div>
  );
}
