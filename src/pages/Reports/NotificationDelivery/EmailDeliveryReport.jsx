import { useState } from "react";
import { Table, Input, Select, Button, DatePicker, Typography, Badge, message } from "antd";
import * as XLSX from "xlsx";
import styles from "./EmailDeliveryReport.module.scss";

const { Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const MOCK_EMAIL_REPORTS = [
  { id: 1, subject: "Two-factor verification code", type: "Send two-factor verification code", recipients: "yutolivo_pato@163.com", status: "Successful", sentTime: "1/6/2026 12:57:38", sendServer: "SMTP" },
  { id: 2, subject: "You've been added to MOS Platform", type: "Add a local user", recipients: "sdddsd@gmail.com", status: "Successful", sentTime: "1/6/2026 11:34:09", sendServer: "SMTP" },
  { id: 3, subject: "You've been added to MOS Platform", type: "Add a local user", recipients: "sdddsd@gmail.com", status: "Successful", sentTime: "1/6/2026 11:33:41", sendServer: "SMTP" },
  { id: 4, subject: "Password reset request", type: "Reset password", recipients: "alice@avepoint.com", status: "Failed", sentTime: "1/6/2026 10:12:00", sendServer: "SMTP" },
  { id: 5, subject: "Account activated", type: "Activate user", recipients: "bob@avepoint.com", status: "Successful", sentTime: "31/5/2026 16:45:00", sendServer: "SMTP" },
];

export default function EmailDeliveryReport() {
  const [subject, setSubject] = useState("");
  const [type, setType] = useState("All");
  const [recipient, setRecipient] = useState("");
  const [status, setStatus] = useState("All");
  const [filtered, setFiltered] = useState(null);

  const handleSearch = () => {
    let result = [...MOCK_EMAIL_REPORTS];
    if (subject) result = result.filter((r) => r.subject.toLowerCase().includes(subject.toLowerCase()));
    if (type !== "All") result = result.filter((r) => r.type === type);
    if (recipient) result = result.filter((r) => r.recipients.toLowerCase().includes(recipient.toLowerCase()));
    if (status !== "All") result = result.filter((r) => r.status === status);
    setFiltered(result);
  };

  const data = filtered ?? MOCK_EMAIL_REPORTS;

  const handleExport = () => {
    if (!data.length) { message.warning("No data"); return; }
    const rows = [
      ["MOS Platform - Email Delivery Report"],
      [`Exported: ${new Date().toLocaleString()}`],
      [],
      ["Subject", "Type", "Recipients", "Status", "Sent Time", "Send Server"],
      ...data.map((r) => [r.subject, r.type, r.recipients, r.status, r.sentTime, r.sendServer]),
    ];
    const ws = XLSX.utils.aoa_to_sheet(rows);
    ws["!cols"] = [36, 28, 24, 12, 18, 12].map((w) => ({ wch: w }));
    ws["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 5 } }, { s: { r: 1, c: 0 }, e: { r: 1, c: 5 } }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Email Delivery");
    XLSX.writeFile(wb, `email_delivery_report_${Date.now()}.xlsx`);
    message.success("Exported");
  };

  const columns = [
    { title: "Subject", dataIndex: "subject", key: "subject" },
    { title: "Type", dataIndex: "type", key: "type", render: (v) => <Text style={{ fontSize: 12 }}>{v}</Text> },
    { title: "Recipients", dataIndex: "recipients", key: "recipients", render: (v) => <Text style={{ fontSize: 12 }}>{v.length > 24 ? v.slice(0, 24) + "..." : v}</Text> },
    { title: "Status", dataIndex: "status", key: "status", render: (s) => <Badge status={s === "Successful" ? "success" : "error"} text={s} /> },
    { title: "Sent time", dataIndex: "sentTime", key: "sentTime", sorter: (a, b) => a.sentTime.localeCompare(b.sentTime) },
    { title: "Send server", dataIndex: "sendServer", key: "sendServer" },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.filterCard}>
        <div className={styles.filterRow}>
          <div className={styles.filterField}><Text className={styles.label}>From / To</Text><RangePicker showTime format="D/M/YYYY HH:mm" style={{ width: "100%" }} /></div>
          <div className={styles.filterField}><Text className={styles.label}>Subject</Text><Input placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} /></div>
        </div>
        <div className={styles.filterRow}>
          <div className={styles.filterField}><Text className={styles.label}>Type</Text><Select value={type} onChange={setType} style={{ width: "100%" }}><Option value="All">All</Option><Option value="Add a local user">Add a local user</Option><Option value="Send two-factor verification code">Send two-factor verification code</Option><Option value="Reset password">Reset password</Option><Option value="Activate user">Activate user</Option></Select></div>
          <div className={styles.filterField}><Text className={styles.label}>Recipient</Text><Input placeholder="Search by email address" value={recipient} onChange={(e) => setRecipient(e.target.value)} /></div>
          <div className={styles.filterField}><Text className={styles.label}>Status</Text><Select value={status} onChange={setStatus} style={{ width: "100%" }}><Option value="All">All</Option><Option value="Successful">Successful</Option><Option value="Failed">Failed</Option></Select></div>
        </div>
        <div className={styles.filterActions}>
          <Button onClick={handleExport}>Export</Button>
          <Button type="primary" onClick={handleSearch}>Search</Button>
        </div>
      </div>
      <div className={styles.tableCard}>
        <Table rowKey="id" columns={columns} dataSource={data} pagination={{ showTotal: (t) => `${t} records`, showSizeChanger: true }} scroll={{ x: 700 }} size="middle" />
      </div>
    </div>
  );
}
