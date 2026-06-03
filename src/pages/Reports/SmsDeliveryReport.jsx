import { useState } from "react";
import { Typography, DatePicker, Select, Input, Button, Table, Tag, Card, Row, Col, Alert, Tabs } from "antd";
import { SearchOutlined, ExportOutlined, MessageOutlined, CheckCircleFilled, CloseCircleFilled } from "@ant-design/icons";
import dayjs from "dayjs";
import styles from "./Reports.module.scss";

const { Text } = Typography;
const { RangePicker } = DatePicker;

const STATUSES  = ["All", "Successful", "Failed", "Pending"];
const PRODUCTS  = ["All", "Learning Management System", "Training Management System", "Examena"];
const CATEGORIES = ["All", "2FA verification", "Password reset", "Subscription alert", "Announcement"];
const STATUS_DOT = { Successful: "#52c41a", Failed: "#ff4d4f", Pending: "#faad14" };

// Empty by default since SMS is disabled — matching the reference screenshot
const MOCK_SMS_LOG = [];

function fmtTime(iso) {
  const d = new Date(iso);
  return `${d.toLocaleDateString("en-GB")} ${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}:${String(d.getSeconds()).padStart(2,"0")}`;
}

function toCSV(rows) {
  const headers = ["Text message","Product","Category","Recipient (phone)","Status","Sent time","Message parts"];
  return [headers.join(","), ...rows.map((r) =>
    [`"${r.message}"`, r.product, r.category, r.recipient, r.status, fmtTime(r.sentTime), r.parts].join(",")
  )].join("\n");
}

export default function SmsDeliveryReport() {
  const [dateRange,  setDateRange]  = useState([dayjs().subtract(7,"day"), dayjs()]);
  const [product,    setProduct]    = useState("All");
  const [recipient,  setRecipient]  = useState("");
  const [status,     setStatus]     = useState("All");
  const [textSearch, setTextSearch] = useState("");
  const [results,    setResults]    = useState(MOCK_SMS_LOG);

  const total      = results.length;
  const successful = results.filter((r) => r.status === "Successful").length;
  const failed     = results.filter((r) => r.status === "Failed").length;

  const handleSearch = () => {
    const [from, to] = dateRange ?? [];
    setResults(MOCK_SMS_LOG.filter((r) => {
      const t = dayjs(r.sentTime);
      if (from && t.isBefore(from, "minute")) return false;
      if (to   && t.isAfter(to,   "minute")) return false;
      if (product !== "All" && r.product !== product) return false;
      if (status  !== "All" && r.status  !== status)  return false;
      if (recipient  && !r.recipient.includes(recipient))                         return false;
      if (textSearch && !r.message.toLowerCase().includes(textSearch.toLowerCase())) return false;
      return true;
    }));
  };

  const handleExport = () => {
    const blob = new Blob([toCSV(results)], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `SmsDeliveryReport_${dayjs().format("YYYYMMDD")}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const columns = [
    { title: "Text message",          dataIndex: "message",   key: "message",   render: (v) => <Text style={{ fontSize: 12 }}>{v}</Text> },
    { title: "Product",               dataIndex: "product",   key: "product",   render: (v) => <Tag color="blue">{v}</Tag> },
    { title: "Category",              dataIndex: "category",  key: "category",  render: (v) => <Text style={{ fontSize: 12 }}>{v}</Text> },
    {
      title: "Recipient (phone number)", dataIndex: "recipient", key: "recipient",
      sorter: (a,b) => a.recipient.localeCompare(b.recipient),
      render: (v) => <Text style={{ fontSize: 12, fontFamily: "monospace" }}>{v}</Text>,
    },
    {
      title: "Status", dataIndex: "status", key: "status",
      render: (v) => (
        <span style={{ display:"flex", alignItems:"center", gap: 6 }}>
          <span style={{ width:8, height:8, borderRadius:"50%", background: STATUS_DOT[v]||"#d9d9d9", display:"inline-block" }} />
          <Text style={{ fontSize: 12 }}>{v}</Text>
        </span>
      ),
    },
    { title: "Sent time", dataIndex: "sentTime", key: "sentTime", sorter: (a,b) => new Date(a.sentTime)-new Date(b.sentTime), defaultSortOrder: "descend", render: (v) => <Text style={{ fontSize: 12 }}>{fmtTime(v)}</Text> },
    { title: "Number of message parts", dataIndex: "parts", key: "parts", render: (v) => <Text style={{ fontSize: 12 }}>{v}</Text> },
  ];

  return (
    <div className={styles.reportPage}>
      {/* SMS allow list warning — matches reference screenshot */}
      <Alert
        type="info"
        showIcon
        message="Your tenant has enabled the SMS allow list, which is preventing SMS notifications from being sent to the users. For more information, navigate to Settings > Notification settings > SMS notification."
        style={{ marginBottom: 0 }}
      />

      {/* Summary tabs */}
      <div className={styles.filterPanel} style={{ paddingBottom: 0 }}>
        <Tabs
          defaultActiveKey="total"
          items={[
            {
              key: "total",
              label: "Total sent",
              children: (
                <Row gutter={16} style={{ paddingBottom: 16 }}>
                  <Col xs={24} sm={8}>
                    <div className={styles.smsStatCard}>
                      <div className={styles.smsStatIcon} style={{ background: "#e8f4fd" }}>
                        <MessageOutlined style={{ color: "#0f6cbd", fontSize: 20 }} />
                      </div>
                      <div><Text type="secondary" style={{ fontSize: 12 }}>Total</Text><br /><Text strong style={{ fontSize: 20 }}>{total}</Text></div>
                    </div>
                  </Col>
                  <Col xs={24} sm={8}>
                    <div className={styles.smsStatCard}>
                      <div className={styles.smsStatIcon} style={{ background: "#f6ffed" }}>
                        <CheckCircleFilled style={{ color: "#52c41a", fontSize: 20 }} />
                      </div>
                      <div><Text type="secondary" style={{ fontSize: 12 }}>Successful</Text><br /><Text strong style={{ fontSize: 20 }}>{successful}</Text></div>
                    </div>
                  </Col>
                  <Col xs={24} sm={8}>
                    <div className={styles.smsStatCard}>
                      <div className={styles.smsStatIcon} style={{ background: "#fff1f0" }}>
                        <CloseCircleFilled style={{ color: "#ff4d4f", fontSize: 20 }} />
                      </div>
                      <div><Text type="secondary" style={{ fontSize: 12 }}>Failed</Text><br /><Text strong style={{ fontSize: 20 }}>{failed}</Text></div>
                    </div>
                  </Col>
                </Row>
              ),
            },
            { key: "monthly", label: "Monthly sent", children: <div style={{ padding: "16px 0", color: "#888" }}>Monthly chart coming soon</div> },
          ]}
        />
      </div>

      {/* Filters */}
      <div className={styles.filterPanel}>
        <div className={styles.filterGrid}>
          <div className={styles.filterField}>
            <Text className={styles.filterLabel}>From / To</Text>
            <RangePicker showTime={{ format: "HH:mm" }} format="D/M/YYYY HH:mm" value={dateRange} onChange={setDateRange} style={{ width: "100%" }} />
          </div>
          <div className={styles.filterField}>
            <Text className={styles.filterLabel}>Text message</Text>
            <Input placeholder="Search text message..." value={textSearch} onChange={(e) => setTextSearch(e.target.value)} onPressEnter={handleSearch} />
          </div>
          <div className={styles.filterField}>
            <Text className={styles.filterLabel}>Product</Text>
            <Select value={product} onChange={setProduct} style={{ width: "100%" }} options={PRODUCTS.map((p) => ({ value: p, label: p }))} />
          </div>
          <div className={styles.filterField}>
            <Text className={styles.filterLabel}>Recipient</Text>
            <Input placeholder="Search by phone number..." value={recipient} onChange={(e) => setRecipient(e.target.value)} onPressEnter={handleSearch} />
          </div>
          <div className={styles.filterField}>
            <Text className={styles.filterLabel}>Status</Text>
            <Select value={status} onChange={setStatus} style={{ width: "100%" }} options={STATUSES.map((s) => ({ value: s, label: s }))} />
          </div>
        </div>
        <div className={styles.filterActions}>
          <Button icon={<ExportOutlined />} onClick={handleExport} disabled={!results.length}>Export</Button>
          <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>Search</Button>
        </div>
      </div>

      <Table rowKey="id" columns={columns} dataSource={results}
        pagination={{ pageSize: 10, showTotal: (t,r) => `${r[0]}–${r[1]} of ${t} records` }}
        scroll={{ x: 900 }} size="small" className={styles.table}
        locale={{ emptyText: "No SMS records found." }} />
    </div>
  );
}
