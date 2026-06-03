import { useParams } from "react-router-dom";
import { Typography, Tag, Table, Statistic, Row, Col, Empty, Divider, Badge, Button, Tooltip } from "antd";
import {
  UserOutlined, TeamOutlined,
  CheckCircleOutlined, StopOutlined,
  StarFilled, StarOutlined,
} from "@ant-design/icons";
import { MOCK_PROJECTS, MOCK_USERS, MOCK_PRODUCTS, MOCK_SUBSCRIPTIONS } from "../../mock/data";
import { useProducts } from "../../hooks/useProducts";
import styles from "./AppDetail.module.scss";

const { Title, Text } = Typography;

const SLUG_MAP = { lms: 1, tms: 2, examena: 3, vitae: 4, curricula: 5 };

const CARD_GRADIENTS = {
  1: "linear-gradient(135deg, #e8f4fd 0%, #b8d9f5 100%)",
  2: "linear-gradient(135deg, #e8f5e9 0%, #b5d5b8 100%)",
  3: "linear-gradient(135deg, #f3e8fd 0%, #d0b5f5 100%)",
  4: "linear-gradient(135deg, #fff3e0 0%, #f5d09a 100%)",
  5: "linear-gradient(135deg, #e0f7fa 0%, #9fd8df 100%)",
};

const CARD_ICONS = { 1: "📚", 2: "🎯", 3: "📝", 4: "🎓", 5: "📋" };

export default function AppDetail() {
  const { slug } = useParams();
  const { favorites, toggleFavorite } = useProducts();
  const projectId = SLUG_MAP[slug];
  const project = MOCK_PROJECTS.find((p) => p.id === projectId);

  if (!project) {
    return (
      <div className={styles.notFound}>
        <Empty description="App not found" />
      </div>
    );
  }

  const isFavorite = favorites.includes(projectId);

  const product = MOCK_PRODUCTS.find((p) => p.id === projectId);
  const subscription = MOCK_SUBSCRIPTIONS.find((s) =>
    s.name.toLowerCase().includes(project.shortName.toLowerCase()) ||
    project.name.toLowerCase().includes(s.name.toLowerCase().split(" ")[0])
  );

  const assignedUsers = product
    ? MOCK_USERS.filter((u) => u.productAssignments?.some((a) => a.productId === product.id))
    : [];
  const activeUsers = assignedUsers.filter((u) => u.status === "Active");
  const inactiveUsers = assignedUsers.filter((u) => u.status === "Inactive");

  const roleCounts = {};
  assignedUsers.forEach((u) => {
    const assignment = u.productAssignments?.find((a) => a.productId === product?.id);
    assignment?.roles?.forEach((r) => {
      roleCounts[r] = (roleCounts[r] || 0) + 1;
    });
  });

  const userColumns = [
    {
      title: "#", key: "index",
      render: (_, __, i) => <Text type="secondary" style={{ fontSize: 12 }}>{i + 1}</Text>,
      width: 48,
    },
    {
      title: "Name", dataIndex: "name", key: "name",
      render: (name, r) => (
        <div>
          <Text strong style={{ fontSize: 13 }}>{name}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 11 }}>{r.userId} · {r.email}</Text>
        </div>
      ),
    },
    {
      title: "Staff ID", dataIndex: "staffId", key: "staffId",
      render: (v) => <Text style={{ fontSize: 12 }}>{v || "—"}</Text>,
    },
    {
      title: "Roles", key: "roles",
      render: (_, r) => {
        const a = r.productAssignments?.find((x) => x.productId === product?.id);
        return a?.roles?.map((role) => <Tag key={role} color="blue" style={{ marginBottom: 2 }}>{role}</Tag>) ?? "—";
      },
    },
    {
      title: "Sign-in", dataIndex: "signInMethod", key: "signInMethod",
      render: (v) => <Text style={{ fontSize: 12 }}>{v}</Text>,
    },
    {
      title: "Status", dataIndex: "status", key: "status",
      render: (s) => (
        <Badge
          status={s === "Active" ? "success" : "default"}
          text={<Text style={{ fontSize: 12 }}>{s}</Text>}
        />
      ),
    },
    {
      title: "Last Login", dataIndex: "lastLogin", key: "lastLogin",
      render: (v) => <Text style={{ fontSize: 11, color: "#888" }}>{v || "—"}</Text>,
    },
  ];

  return (
    <div className={styles.page}>
      {/* Header banner */}
      <div className={styles.banner} style={{ background: CARD_GRADIENTS[project.id] }}>
        <div className={styles.bannerContent}>
          <div className={styles.bannerIcon}>{CARD_ICONS[project.id]}</div>
          <div style={{ flex: 1 }}>
            <Title level={2} style={{ margin: 0, color: "#1a1a2e" }}>{project.name}</Title>
            <Text style={{ color: "#555", fontSize: 15 }}>{project.description}</Text>
            <div style={{ marginTop: 8, display: "flex", gap: 8, flexWrap: "wrap" }}>
              <Tag color="blue">{project.category}</Tag>
              <Tag color={project.subscribed ? "green" : "default"}>
                {project.subscribed ? "Subscribed" : "Not subscribed"}
              </Tag>
              <Tag color="default">{project.shortName}</Tag>
            </div>
          </div>
          {/* Favorite button */}
          <Tooltip title={isFavorite ? "Remove from favorites" : "Add to favorites"}>
            <Button
              type="text"
              shape="circle"
              icon={
                isFavorite
                  ? <StarFilled style={{ fontSize: 22, color: "#faad14" }} />
                  : <StarOutlined style={{ fontSize: 22, color: "#aaa" }} />
              }
              onClick={() => toggleFavorite(projectId)}
              className={styles.favoriteBtn}
            />
          </Tooltip>
        </div>
      </div>

      <div className={styles.body}>

        {/* Stats row */}
        <section className={styles.section}>
          <Title level={5} className={styles.sectionTitle}>Overview</Title>
          <Row gutter={[16, 16]}>
            <Col xs={12} sm={6}>
              <div className={styles.statCard}>
                <UserOutlined className={styles.statIcon} style={{ color: "#0f6cbd" }} />
                <Statistic title="Total Users" value={assignedUsers.length} />
              </div>
            </Col>
            <Col xs={12} sm={6}>
              <div className={styles.statCard}>
                <CheckCircleOutlined className={styles.statIcon} style={{ color: "#389e0d" }} />
                <Statistic title="Active" value={activeUsers.length} valueStyle={{ color: "#389e0d" }} />
              </div>
            </Col>
            <Col xs={12} sm={6}>
              <div className={styles.statCard}>
                <StopOutlined className={styles.statIcon} style={{ color: "#999" }} />
                <Statistic title="Inactive" value={inactiveUsers.length} valueStyle={{ color: "#999" }} />
              </div>
            </Col>
            <Col xs={12} sm={6}>
              <div className={styles.statCard}>
                <TeamOutlined className={styles.statIcon} style={{ color: "#722ed1" }} />
                <Statistic title="Roles" value={product?.roles?.length ?? 0} />
              </div>
            </Col>
          </Row>
        </section>

        {/* Role breakdown */}
        {product && Object.keys(roleCounts).length > 0 && (
          <section className={styles.section}>
            <Title level={5} className={styles.sectionTitle}>Users by Role</Title>
            <div className={styles.roleGrid}>
              {product.roles.map((role) => (
                <div key={role} className={styles.roleCard}>
                  <Text strong style={{ fontSize: 22 }}>{roleCounts[role] ?? 0}</Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>{role}</Text>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Subscription info */}
        {subscription && (
          <section className={styles.section}>
            <Title level={5} className={styles.sectionTitle}>Subscription</Title>
            <div className={styles.subGrid}>
              <div className={styles.subBadge}>
                <Text strong style={{ color: subscription.statusColor, fontSize: 15 }}>● {subscription.status}</Text>
                <Tag color="blue" style={{ marginLeft: 8 }}>{subscription.subscriptionType}</Tag>
              </div>
              <div className={styles.subFields}>
                {subscription.fields.map((f) => (
                  <div key={f.label} className={styles.subField}>
                    <Text className={styles.subFieldLabel}>{f.label}</Text>
                    <Text className={styles.subFieldValue}>{f.value}</Text>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Full user table */}
        <section className={styles.section}>
          <Title level={5} className={styles.sectionTitle}>
            All Assigned Users
            <Text type="secondary" style={{ fontSize: 13, fontWeight: 400, marginLeft: 8 }}>
              ({assignedUsers.length} total)
            </Text>
          </Title>

          {assignedUsers.length === 0 ? (
            <Empty description="No users assigned to this app" />
          ) : (
            <Table
              rowKey="id"
              columns={userColumns}
              dataSource={assignedUsers}
              pagination={{ pageSize: 15, showTotal: (t, r) => `${r[0]}–${r[1]} of ${t} users` }}
              scroll={{ x: 780 }}
              size="small"
            />
          )}
        </section>

        <div className={styles.footer}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            MOS Platform · {project.name} · Data as of {new Date().toLocaleDateString()}
          </Text>
        </div>
      </div>
    </div>
  );
}