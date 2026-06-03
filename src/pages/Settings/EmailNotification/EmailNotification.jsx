import { Typography, Switch, Card, Button, Divider, message } from "antd";
import { usePersistedState } from "../../../hooks/usePersistedState";
import { UserSearchSelect } from "../../../components/shared/UserSearchSelect";
import styles from "./EmailNotification.module.scss";

const { Title, Text } = Typography;

export default function EmailNotification() {
  const [enabled, setEnabled] = usePersistedState("email_notif_enabled", true);
  const [allowList, setAllowList] = usePersistedState("email_notif_allowlist", []);

  const handleSave = () => message.success("Email notification settings saved");

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <div className={styles.cardHeader}>
          <div style={{ flex: 1 }}>
            <Title level={5} style={{ margin: 0 }}>Enable email notification allow list</Title>
            <Text type="secondary" style={{ fontSize: 13, display: "block", marginTop: 4 }}>
              By default, email notifications can be sent to anyone. Enable this to restrict notifications to only users in the allow list.
            </Text>
          </div>
          <Switch checked={enabled} onChange={setEnabled} />
        </div>

        {enabled && (
          <>
            <Divider />
            <Title level={5} style={{ marginBottom: 6 }}>Email notification allow list</Title>
            <Text type="secondary" style={{ fontSize: 13, display: "block", marginBottom: 12 }}>
              Add users whose email addresses can receive email notifications.
            </Text>
            <UserSearchSelect
              selected={allowList}
              onChange={setAllowList}
              placeholder="Search by name, email or user ID..."
            />
            <Divider />
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <Button onClick={() => message.info("Changes discarded")}>Cancel</Button>
              <Button type="primary" onClick={handleSave}>Save</Button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
