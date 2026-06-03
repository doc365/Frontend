import { Tabs, Empty, Tag, Typography, Tooltip } from "antd";
import { StarFilled, StarOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../../hooks/useProducts";
import styles from "./Home.module.scss";

const { Text } = Typography;

const CARD_GRADIENTS = {
  1: "linear-gradient(135deg, #e8f4fd 0%, #b8d9f5 100%)",
  2: "linear-gradient(135deg, #e8f5e9 0%, #b5d5b8 100%)",
  3: "linear-gradient(135deg, #f3e8fd 0%, #d0b5f5 100%)",
  4: "linear-gradient(135deg, #fff3e0 0%, #f5d09a 100%)",
  5: "linear-gradient(135deg, #e0f7fa 0%, #9fd8df 100%)",
};

const CARD_ICONS = { 1: "📚", 2: "🎯", 3: "📝", 4: "🎓", 5: "📋" };

function ProjectCard({ project, isFavorite, onToggleFavorite }) {
  const navigate = useNavigate();

  return (
    <div className={styles.card} onClick={() => navigate(project.url)}>
      <div className={styles.cardImage} style={{ background: CARD_GRADIENTS[project.id] || "#f0f0f0" }}>
        <span className={styles.cardImageIcon}>{CARD_ICONS[project.id] || "📦"}</span>
        {/* Star button — top-right of the image area */}
        <Tooltip title={isFavorite ? "Remove from favorites" : "Add to favorites"}>
          <button
            className={styles.starBtn}
            onClick={(e) => { e.stopPropagation(); onToggleFavorite(project.id); }}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            {isFavorite
              ? <StarFilled style={{ color: "#faad14", fontSize: 16 }} />
              : <StarOutlined style={{ color: "#aaa", fontSize: 16 }} />
            }
          </button>
        </Tooltip>
      </div>
      <div className={styles.cardBody}>
        <Text strong className={styles.cardName}>{project.name}</Text>
        <Text type="secondary" className={styles.cardDesc}>{project.description}</Text>
        <Tag color="blue" className={styles.cardTag}>{project.category}</Tag>
      </div>
    </div>
  );
}

function FavoriteCard({ project }) {
  const navigate = useNavigate();
  return (
    <div className={styles.favoriteCard} onClick={() => navigate(project.url)}>
      <div
        className={styles.favoriteCardImage}
        style={{ background: CARD_GRADIENTS[project.id] || "#f0f0f0" }}
      >
        <span className={styles.favoriteCardIcon}>{CARD_ICONS[project.id] || "📦"}</span>
      </div>
      <div className={styles.favoriteCardBody}>
        <Text strong className={styles.favoriteCardName}>{project.name}</Text>
        <Tag color="blue" className={styles.cardTag}>{project.category}</Tag>
      </div>
    </div>
  );
}

export default function Home() {
  const { projects, favorites, toggleFavorite } = useProducts();
  const myApps = projects.filter((p) => p.subscribed);
  const appStore = projects.filter((p) => !p.subscribed);
  const favoriteProjects = projects.filter((p) => favorites.includes(p.id));

  return (
    <div className={styles.container}>
      {/* Favorites strip */}
      {favoriteProjects.length > 0 && (
        <div className={styles.favoritesSection}>
          <div className={styles.favoritesSectionHeader}>
            <StarFilled style={{ color: "#faad14", fontSize: 15 }} />
            <Text strong style={{ fontSize: 14 }}>Favorites</Text>
          </div>
          <div className={styles.favoritesGrid}>
            {favoriteProjects.map((p) => (
              <FavoriteCard key={p.id} project={p} />
            ))}
          </div>
        </div>
      )}

      <Tabs
        defaultActiveKey="my-apps"
        className={styles.tabs}
        items={[
          {
            key: "my-apps",
            label: `My apps (${myApps.length})`,
            children: (
              <div className={styles.tabContent}>
                {myApps.length === 0 ? (
                  <Empty description="No subscribed apps" className={styles.empty} />
                ) : (
                  <div className={styles.grid}>
                    {myApps.map((p) => (
                      <ProjectCard
                        key={p.id}
                        project={p}
                        isFavorite={favorites.includes(p.id)}
                        onToggleFavorite={toggleFavorite}
                      />
                    ))}
                  </div>
                )}
              </div>
            ),
          },
          {
            key: "app-store",
            label: `App store (${appStore.length})`,
            children: (
              <div className={styles.tabContent}>
                {appStore.length === 0 ? (
                  <Empty description="No additional apps available" className={styles.empty} />
                ) : (
                  <div className={styles.grid}>
                    {appStore.map((p) => (
                      <ProjectCard
                        key={p.id}
                        project={p}
                        isFavorite={favorites.includes(p.id)}
                        onToggleFavorite={toggleFavorite}
                      />
                    ))}
                  </div>
                )}
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}