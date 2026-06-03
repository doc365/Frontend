import { Typography, Card, Row, Col } from "antd";
import { FileTextOutlined, MailOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import styles from "./Reports.module.scss";

const { Title, Text } = Typography;

const REPORT_CARDS = [
  { key: "user-activity", icon: <FileTextOutlined />, title: "User activity report", desc: "View the user activities in MOS platform.", path: "/reports/user-activity" },
  { key: "notification-delivery", icon: <MailOutlined />, title: "Notification delivery report", desc: "Oversee all the notifications sent by the system and keep track of the delivery statuses.", path: "/reports/notification-delivery/email" },
];

export default function Reports() {
  const navigate = useNavigate();
  return (
    <div className={styles.container}>
      <Row gutter={[20, 20]}>
        {REPORT_CARDS.map((card) => (
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
  );
}
