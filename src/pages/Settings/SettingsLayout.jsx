import { Layout, Menu } from "antd";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { InfoCircleOutlined, SettingOutlined, SafetyOutlined, UserOutlined, BellOutlined, MailOutlined, MessageOutlined, DatabaseOutlined, SendOutlined } from "@ant-design/icons";
import Settings from "./Settings";
import styles from "./SettingsLayout.module.scss";

const { Sider, Content } = Layout;

const NAV_ITEMS = [
  {
    type: "group", label: "Administration",
    children: [
      { key: "/settings/singpass-corppass", icon: <InfoCircleOutlined />, label: "Singpass & Corppass" },
      { key: "/settings/advanced", icon: <SettingOutlined />, label: "Advanced settings" },
      { key: "/settings/two-factor", icon: <SafetyOutlined />, label: "Two-factor authentication" },
      { key: "/settings/account", icon: <UserOutlined />, label: "Account settings" },
      {
        key: "notification-settings", icon: <BellOutlined />, label: "Notification settings",
        children: [
          { key: "/settings/email-notification", icon: <MailOutlined />, label: "Email notification" },
          { key: "/settings/sms-notification", icon: <MessageOutlined />, label: "SMS notification" },
        ],
      },
    ],
  },
  {
    type: "group", label: "Product integration",
    children: [
      { key: "/settings/storage", icon: <DatabaseOutlined />, label: "Storage connection" },
      { key: "/settings/smtp", icon: <SendOutlined />, label: "SMTP settings" },
    ],
  },
];

export default function SettingsLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const isRootPath = location.pathname === "/settings";

  // If on root settings path, show grid
  if (isRootPath) {
    return <Settings />;
  }

  return (
    <Layout className={styles.layout}>
      <Sider width={240} className={styles.sider}>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          defaultOpenKeys={["notification-settings"]}
          items={NAV_ITEMS}
          onClick={({ key }) => { if (key.startsWith("/")) navigate(key); }}
          className={styles.menu}
        />
      </Sider>
      <Content className={styles.content}><Outlet /></Content>
    </Layout>
  );
}
