import { useState, useRef, useCallback } from "react";
import { Layout, Menu, Avatar, Dropdown, Button, Typography, Badge, Popover, List, Tag, Empty } from "antd";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import {
  HomeOutlined, TeamOutlined, UserOutlined, LogoutOutlined,
  MenuFoldOutlined, MenuUnfoldOutlined, StarOutlined,
  SettingOutlined, BarChartOutlined, BgColorsOutlined,
  BellOutlined, CheckOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";
import ProfileDrawer from "../common/ProfileDrawer";
import styles from "./AppLayout.module.scss";

const { Sider, Header, Content } = Layout;
const { Text } = Typography;

const NAV_ITEMS = [
  { key: "/home", label: "Home", icon: <HomeOutlined /> },
  { key: "/users", label: "Account", icon: <TeamOutlined /> },
  { key: "/subscriptions", label: "Subscriptions", icon: <StarOutlined /> },
  { key: "/settings", label: "Settings", icon: <SettingOutlined /> },
  { key: "/reports", label: "Reports", icon: <BarChartOutlined /> },
  { key: "/customize", label: "Customize", icon: <BgColorsOutlined /> },
];

const MIN_WIDTH = 60;
const MAX_WIDTH = 400;
const DEFAULT_WIDTH = 180;

function timeAgo(date) {
  const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function AppLayout() {
  const [siderWidth, setSiderWidth] = useState(DEFAULT_WIDTH);
  const [collapsed, setCollapsed] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const isResizing = useRef(false);
  const { user, logout } = useAuth();
  const { notifications, markAllRead, markRead, unreadCount } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();

  const startResize = useCallback((e) => {
    isResizing.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    const onMove = (moveEvent) => {
      if (!isResizing.current) return;
      const newWidth = moveEvent.clientX;
      if (newWidth < MIN_WIDTH) { setCollapsed(true); setSiderWidth(MIN_WIDTH); }
      else if (newWidth > MAX_WIDTH) { setSiderWidth(MAX_WIDTH); setCollapsed(false); }
      else { setSiderWidth(newWidth); setCollapsed(newWidth < 100); }
    };
    const onUp = () => {
      isResizing.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, []);

  const profileMenu = {
    items: [
      { key: "profile", icon: <UserOutlined />, label: "My Profile", onClick: () => setProfileOpen(true) },
      { type: "divider" },
      { key: "logout", icon: <LogoutOutlined />, label: "Sign Out", danger: true, onClick: () => { logout(); navigate("/login"); } },
    ],
  };

  const notifContent = (
    <div className={styles.notifPopover}>
      <div className={styles.notifPopoverHeader}>
        <Text strong>Notification center</Text>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Text
            className={styles.seeAll}
            onClick={() => { setNotifOpen(false); navigate("/announcements"); }}
          >
            See all
          </Text>
          <Button
            type="text"
            size="small"
            icon={<CheckOutlined />}
            onClick={markAllRead}
            style={{ fontSize: 12, color: "#888" }}
          >
          </Button>
          <Text
            className={styles.notifClose}
            onClick={() => setNotifOpen(false)}
          >
            ✕
          </Text>
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className={styles.notifEmpty}>No announcements to show.</div>
      ) : (
        <List
          className={styles.notifList}
          dataSource={notifications.slice(0, 8)}
          renderItem={(item) => (
            <List.Item
              className={`${styles.notifItem} ${!item.read ? styles.notifUnread : ""}`}
              onClick={() => markRead(item.id)}
            >
              <div className={styles.notifItemContent}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <Text strong style={{ fontSize: 13 }}>{item.title}</Text>
                  <Text type="secondary" style={{ fontSize: 11 }}>{timeAgo(item.time)}</Text>
                </div>
                <Text type="secondary" style={{ fontSize: 12 }}>{item.message}</Text>
              </div>
            </List.Item>
          )}
        />
      )}
    </div>
  );

  const effectiveWidth = collapsed ? 60 : siderWidth;

  return (
    <Layout className={styles.layout}>
      <Sider
        width={effectiveWidth}
        collapsed={collapsed}
        collapsedWidth={60}
        trigger={null}
        className={styles.sider}
        style={{ width: effectiveWidth, minWidth: effectiveWidth, maxWidth: effectiveWidth }}
      >
        <div className={styles.logo}>
          {!collapsed && <span className={styles.logoText}>MOS</span>}
          {collapsed && <span className={styles.logoIcon}>M</span>}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={NAV_ITEMS}
          onClick={({ key }) => navigate(key)}
          inlineCollapsed={collapsed}
          className={styles.menu}
        />
        <div className={styles.resizeHandle} onMouseDown={startResize} />
      </Sider>

      <Layout style={{ marginLeft: effectiveWidth, transition: "margin-left 0.1s" }}>
        <Header className={styles.header}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => { setCollapsed(!collapsed); if (collapsed) setSiderWidth(DEFAULT_WIDTH); }}
            className={styles.collapseBtn}
          />
          <div className={styles.headerRight}>
            <Popover
              content={notifContent}
              trigger="click"
              open={notifOpen}
              onOpenChange={setNotifOpen}
              placement="bottomRight"
              arrow={false}
              overlayClassName={styles.notifOverlay}
            >
              <Badge count={unreadCount} size="small" offset={[-2, 2]}>
                <Button type="text" icon={<BellOutlined style={{ fontSize: 18 }} />} className={styles.iconBtn} />
              </Badge>
            </Popover>

            <Dropdown menu={profileMenu} placement="bottomRight" arrow>
              <div className={styles.profile}>
                <Avatar size={34} icon={<UserOutlined />} className={styles.avatar} />
                {!collapsed && <Text className={styles.userName}>{user?.name}</Text>}
              </div>
            </Dropdown>
          </div>
        </Header>

        <Content className={styles.content}>
          <Outlet />
        </Content>
      </Layout>

      <ProfileDrawer open={profileOpen} onClose={() => setProfileOpen(false)} />
    </Layout>
  );
}
