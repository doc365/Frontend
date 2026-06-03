import { useEffect, useState } from "react";
import { Drawer, Button, Space, Typography, Alert, message, Divider, Checkbox } from "antd";
import { MOCK_PRODUCTS } from "../../mock/data";
import { useUsers } from "../../hooks/useUsers";

const { Text } = Typography;

export default function PermissionsDrawer({ open, user, onClose, onSuccess }) {
  // assignments: { [productId]: string[] of selected roles }
  const [assignments, setAssignments] = useState({});
  const { updateUser, loading } = useUsers();

  useEffect(() => {
    if (user) {
      const map = {};
      (user.productAssignments || []).forEach(({ productId, roles }) => {
        map[productId] = roles || [];
      });
      setAssignments(map);
    }
  }, [user]);

  const isAdmin = user?.role === "Administrator";

  const toggleProduct = (productId) => {
    setAssignments((prev) => {
      const next = { ...prev };
      if (next[productId]) {
        delete next[productId];
      } else {
        next[productId] = [];
      }
      return next;
    });
  };

  const toggleRole = (productId, role) => {
    setAssignments((prev) => {
      const current = prev[productId] || [];
      const next = current.includes(role)
        ? current.filter((r) => r !== role)
        : [...current, role];
      return { ...prev, [productId]: next };
    });
  };

  const handleSave = async () => {
    try {
      const productAssignments = Object.entries(assignments).map(([productId, roles]) => ({
        productId: Number(productId),
        roles,
      }));
      await updateUser(user.id, { productAssignments });
      message.success("Permissions updated");
      onSuccess();
    } catch {
      message.error("Failed to update permissions");
    }
  };

  const totalSelected = Object.keys(assignments).length;

  return (
    <Drawer
      title={
        <div>
          <div>Manage Permissions</div>
          <Text type="secondary" style={{ fontSize: 13, fontWeight: 400 }}>{user?.name}</Text>
        </div>
      }
      open={open}
      onClose={onClose}
      width={460}
      footer={
        <Space style={{ float: "right" }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" loading={loading} onClick={handleSave} disabled={isAdmin}>
            Save Permissions
          </Button>
        </Space>
      }
    >
      {isAdmin ? (
        <Alert type="info" message="Administrator accounts have full access to all products automatically." showIcon />
      ) : (
        <>
          <Text type="secondary">Select products and assign roles within each product:</Text>
          <Divider style={{ margin: "12px 0" }} />

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {MOCK_PRODUCTS.map((product) => {
              const isSelected = !!assignments[product.id];
              const selectedRoles = assignments[product.id] || [];

              return (
                <div
                  key={product.id}
                  style={{
                    borderRadius: 8,
                    border: `1.5px solid ${isSelected ? "#0f6cbd" : "#e5e7eb"}`,
                    background: isSelected ? "#e8f0fe" : "#fff",
                    overflow: "hidden",
                    transition: "all 0.2s",
                  }}
                >
                  {/* Product header row */}
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", cursor: "pointer" }}
                    onClick={() => toggleProduct(product.id)}
                  >
                    <Checkbox checked={isSelected} onChange={() => toggleProduct(product.id)} onClick={(e) => e.stopPropagation()} />
                    <span style={{ fontSize: 18 }}>{product.icon}</span>
                    <div style={{ flex: 1 }}>
                      <Text strong style={{ fontSize: 13 }}>{product.name}</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: 11 }}>{product.category}</Text>
                    </div>
                  </div>

                  {/* Sub-roles — only show when product is selected */}
                  {isSelected && (
                    <div style={{ padding: "6px 14px 12px 44px", borderTop: "1px solid #d1e3f8", background: "#dceeff" }}>
                      <Text type="secondary" style={{ fontSize: 11, display: "block", marginBottom: 6 }}>Roles:</Text>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                        {product.roles.map((role) => (
                          <Checkbox
                            key={role}
                            checked={selectedRoles.includes(role)}
                            onChange={() => toggleRole(product.id, role)}
                          >
                            <Text style={{ fontSize: 13 }}>{role}</Text>
                          </Checkbox>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <Divider style={{ margin: "12px 0" }} />
          <Text type="secondary" style={{ fontSize: 12 }}>
            {totalSelected} of {MOCK_PRODUCTS.length} products assigned
          </Text>
        </>
      )}
    </Drawer>
  );
}
