import { useState } from "react";
import { Table, Input, Select, Button, DatePicker, Typography, Badge, Card, Alert, Tabs, message } from "antd";
import { CheckCircleFilled, CloseCircleFilled, MessageOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import styles from "./SmsDeliveryReport.module.scss";

const { Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

export default function SmsDeliveryReport() {
  const [filtered, setFiltered] = useState([]);

  const handleExport = () => {
    message.info("No SMS data to export");
  };

  const summaryCards = [
    { label: "Total", value: 0, icon: <MessageOutlined style={{ fontSize: 22, color: "#5a67d8" }} />, bg: "#eef0ff" },
    { label: "Successful", value: 0, icon: <CheckCircleFilled style={{ fontSize: 22, color: "#52c41a" }} />, bg: "#f6ffed" },
    { label: "Failed", value: 0, icon: <CloseCircleFilled style={{ fontSize: 22, color: "#ff4d4f" }} />, bg: "#fff2f0" },
  ];

  const columns = [
    { title: "Text message", dataIndex: "message", key: "message" },
    { title: "Product", dataIndex: "product", key: "product" },
    { title: "Category", dataIndex: "category", key: "category" },
    { title: "Recipient (phone number)", dataIndex: "recipient", key: "recipient", sorter: true },
    { title: "Status", dataIndex: "status", key: "status", render: (s) => s ? <Badge status={s === "Successful" ? "success" : "error"} text={s} /> : "—" },
    { title: "Sent time", dataIndex: "sentTime", key: "sentTime", sorter: true },
    { title: "Number of message parts", dataIndex: "parts", key: "parts" },
  ];

  return (
    <div className={styles.container}>
      <Alert
        type="info"
        showIcon
        message="Your tenant has enabled the SMS allow list, which is preventing SMS notifications from being sent to the users. For more information, navigate to Settings > Notification settings > SMS notification."
        style={{ marginBottom: 16 }}
      />

      <Tabs
        defaultActiveKey="total"
        items={[
          { key: "total", label: "Total sent" },
          { key: "monthly", label: "Monthly sent" },
        ]}
      />

      <div className={styles.summaryRow}>
        {summaryCards.map((card) => (
          <div key={card.label} className={styles.summaryCard} style={{ background: card.bg }}>
            {card.icon}
            <div>
              <Text type="secondary" style={{ fontSize: 13 }}>{card.label}</Text>
              <div style={{ fontSize: 24, fontWeight: 700 }}>{card.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.filterCard}>
        <div className={styles.filterRow}>
          <div className={styles.filterField}><Text className={styles.label}>From / To</Text><RangePicker showTime format="D/M/YYYY HH:mm" style={{ width: "100%" }} /></div>
          <div className={styles.filterField}><Text className={styles.label}>Text message</Text><Input placeholder="Text message" /></div>
        </div>
        <div className={styles.filterRow}>
          <div className={styles.filterField}><Text className={styles.label}>Product</Text><Select defaultValue="All" style={{ width: "100%" }}><Option value="All">All</Option></Select></div>
          <div className={styles.filterField}><Text className={styles.label}>Recipient</Text><Input placeholder="Search by phone number" /></div>
          <div className={styles.filterField}><Text className={styles.label}>Status</Text><Select defaultValue="All" style={{ width: "100%" }}><Option value="All">All</Option><Option value="Successful">Successful</Option><Option value="Failed">Failed</Option></Select></div>
        </div>
        <div className={styles.filterActions}>
          <Button onClick={handleExport}>Export</Button>
          <Button type="primary">Search</Button>
        </div>
      </div>

      <div className={styles.tableCard}>
        <Table rowKey="id" columns={columns} dataSource={[]} locale={{ emptyText: "No items to show in this view." }} pagination={false} scroll={{ x: 800 }} size="middle" />
      </div>
    </div>
  );
}
