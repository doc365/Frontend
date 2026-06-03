import { Typography, Card, Row, Col } from "antd";
import {
  InfoCircleOutlined, SettingOutlined, SafetyOutlined, UserOutlined,
  BellOutlined, MailOutlined, MessageOutlined, DatabaseOutlined, SendOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import styles from "./Settings.module.scss";

const { Text } = Typography;

const SETTINGS_CARDS = [
  {
    group: "Administration",
    cards: [
      { key: "singpass", icon: <InfoCircleOutlined />, title: "Singpass & Corppass", desc: "Configure Singpass and Corppass authentication settings.", path: "/settings/singpass-corppass" },
      { key: "advanced", icon: <SettingOutlined />, title: "Advanced settings", desc: "Access advanced configuration options.", path: "/settings/advanced" },
      { key: "2fa", icon: <SafetyOutlined />, title: "Two-factor authentication", desc: "Manage two-factor authentication settings.", path: "/settings/two-factor" },
      { key: "account", icon: <UserOutlined />, title: "Account settings", desc: "Update your account information and preferences.", path: "/settings/account" },
      { key: "email-notif", icon: <MailOutlined />, title: "Email notification", desc: "Configure email notification preferences.", path: "/settings/email-notification" },
      { key: "sms-notif", icon: <MessageOutlined />, title: "SMS notification", desc: "Configure SMS notification preferences.", path: "/settings/sms-notification" },
    ],
  },
  {
    group: "Product integration",
    cards: [
      { key: "storage", icon: <DatabaseOutlined />, title: "Storage connection", desc: "Set up storage connection and credentials.", path: "/settings/storage" },
      { key: "smtp", icon: <SendOutlined />, title: "SMTP settings", desc: "Configure SMTP server for email delivery.", path: "/settings/smtp" },
    ],
  },
];

export default function Settings() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      {SETTINGS_CARDS.map((group) => (
        <div key={group.group} className={styles.group}>
          <Text strong className={styles.groupTitle}>{group.group}</Text>
          <Row gutter={[20, 20]}>
            {group.cards.map((card) => (
              <Col key={card.key} xs={24} sm={12} lg={8}>
                <Card className={styles.card} hoverable onClick={() => navigate(card.path)}>
                  <div className={styles.iconBox}>{card.icon}</div>
                  <Text strong className={styles.cardTitle}>{card.title}</Text>
                  <Text type="secondary" className={styles.cardDesc}>{card.desc}</Text>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      ))}
    </div>
  );
}
