import { Typography, Switch, Checkbox, Button, Card, Divider, message } from "antd";
import { usePersistedState } from "../../../hooks/usePersistedState";
import styles from "./TwoFactor.module.scss";

const { Title, Text } = Typography;

export default function TwoFactor() {
  const [enabled, setEnabled] = usePersistedState("2fa_enabled", true);
  const [emailEnabled, setEmailEnabled] = usePersistedState("2fa_email", true);
  const [smsEnabled, setSmsEnabled] = usePersistedState("2fa_sms", true);

  const handleSave = () => message.success("Two-factor authentication settings saved");

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <div className={styles.cardHeader}>
          <div>
            <Title level={5} style={{ margin: 0 }}>Two-factor authentication</Title>
            <Text type="secondary" style={{ fontSize: 13, lineHeight: 1.7, display: "block", marginTop: 6, maxWidth: 860 }}>
              Two-factor authentication (2FA) is an identity and access management security method that requires two forms of identification to access resources and data. We use a one-time code to verify the identity in addition to the user credentials. You have the option to receive the verification code via email, text message, or both. If you select both, your tenant users can choose their preferred method for receiving the verification code.
            </Text>
          </div>
          <Switch checked={enabled} onChange={setEnabled} />
        </div>

        {enabled && (
          <>
            <Divider />
            <div className={styles.methodList}>
              <div className={styles.methodItem}>
                <Checkbox checked={emailEnabled} onChange={(e) => setEmailEnabled(e.target.checked)}>
                  <Text strong>Email</Text>
                </Checkbox>
                <Text type="secondary" style={{ fontSize: 13, display: "block", marginLeft: 24, marginTop: 2, fontStyle: "italic" }}>
                  Sent an email to user's email address.
                </Text>
              </div>
              <div className={styles.methodItem}>
                <Checkbox checked={smsEnabled} onChange={(e) => setSmsEnabled(e.target.checked)}>
                  <Text strong>SMS</Text>
                </Checkbox>
                <Text type="secondary" style={{ fontSize: 13, display: "block", marginLeft: 24, marginTop: 2, fontStyle: "italic" }}>
                  Sent a text message to user's mobile phone.
                </Text>
              </div>
            </div>
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
