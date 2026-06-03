import { Layout, Menu, Typography, Button } from "antd";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import {
  AppstoreOutlined,
  LinkOutlined,
  MailOutlined,
  BgColorsOutlined,
  LeftOutlined,
} from "@ant-design/icons";
import styles from "./Customize.module.scss";
import { useEffect } from "react";

const { Sider, Content } = Layout;
const { Text } = Typography;

const TENANT_ITEMS = [
  {
    key: "/customize/app-registration",
    icon: <AppstoreOutlined />,
    label: "App registration",
  },
  {
    key: "/customize/urls-signin",
    icon: <LinkOutlined />,
    label: "URLs and sign-in page",
  },
  {
    key: "/customize/email-templates",
    icon: <MailOutlined />,
    label: "Email templates",
  },
];

const PRODUCT_ITEMS = [
  {
    key: "/customize/logo-theme",
    icon: <BgColorsOutlined />,
    label: "Logo and theme",
  },
];

export default function Customize() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/customize") {
      navigate("/customize/app-registration", { replace: true });
    }
  }, [location.pathname, navigate]);

  return (
    <Layout className={styles.layout}>
      <Sider width={240} className={styles.sider}>
        <div className={styles.sidebarSection}>
          <Text className={styles.sectionLabel}>Tenant level</Text>
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            items={TENANT_ITEMS}
            onClick={({ key }) => navigate(key)}
            className={styles.menu}
          />
        </div>
        <div className={styles.sidebarSection}>
          <Text className={styles.sectionLabel}>Product level</Text>
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            items={PRODUCT_ITEMS}
            onClick={({ key }) => navigate(key)}
            className={styles.menu}
          />
        </div>
      </Sider>
      <Content className={styles.content}>
        <Outlet />
      </Content>
    </Layout>
  );
}
