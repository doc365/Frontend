import { Layout, Menu, Typography } from "antd";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { FileTextOutlined, MailOutlined, MessageOutlined } from "@ant-design/icons";
import styles from "./ReportsLayout.module.scss";

const { Sider, Content } = Layout;
const { Text } = Typography;

const NAV_ITEMS = [
  { key: "/reports/user-activity", icon: <FileTextOutlined />, label: "User activity report" },
  {
    key: "notification-delivery",
    icon: <MailOutlined />,
    label: "Notification delivery report",
    children: [
      { key: "/reports/notification-delivery/email", icon: <MailOutlined />, label: "Email delivery report" },
      { key: "/reports/notification-delivery/sms", icon: <MessageOutlined />, label: "SMS delivery report" },
    ],
  },
];

export default function ReportsLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Layout className={styles.layout}>
      <Sider width={240} className={styles.sider}>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          defaultOpenKeys={["notification-delivery"]}
          items={NAV_ITEMS}
          onClick={({ key }) => { if (!key.includes("notification-delivery") || key.includes("/")) navigate(key); }}
          className={styles.menu}
        />
      </Sider>
      <Content className={styles.content}><Outlet /></Content>
    </Layout>
  );
}
