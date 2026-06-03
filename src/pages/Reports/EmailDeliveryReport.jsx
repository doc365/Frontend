import { useState } from "react";
import { Typography, DatePicker, Select, Input, Button, Table, Tag, Badge } from "antd";
import { SearchOutlined, ExportOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import styles from "./Reports.module.scss";

const { Text } = Typography;
const { RangePicker } = DatePicker;

const STATUSES = ["All", "Successful", "Failed", "Pending"];
const TYPES    = ["All", "Send two-factor verification code", "Add a local user", "Reset password", "Subscription expiration", "Announcement notification"];
const STATUS_DOT = { Successful: "#52c41a", Failed: "#ff4d4f", Pending: "#faad14" };

const MOCK_EMAIL_LOG = [
  { id:"e1",  subject:"Two-factor verification code",          type:"Send two-factor verification code", recipient:"yutolivo_pato@163.com",   status:"Successful", sentTime: new Date(Date.now()-1000*60*180).toISOString(),  sendServer:"SMTP" },
  { id:"e2",  subject:"You've been added to MaivenPoint Online Services", type:"Add a local user",       recipient:"sdddsd@gmail.com",        status:"Successful", sentTime: new Date(Date.now()-1000*60*210).toISOString(),  sendServer:"SMTP" },
  { id:"e3",  subject:"You've been added to MaivenPoint Online Services", type:"Add a local user",       recipient:"sdddsd@gmail.com",        status:"Successful", sentTime: new Date(Date.now()-1000*60*215).toISOString(),  sendServer:"SMTP" },
  { id:"e4",  subject:"You've been added to MaivenPoint Online Services", type:"Add a local user",       recipient:"sdddsd@gmail.com",        status:"Successful", sentTime: new Date(Date.now()-1000*60*220).toISOString(),  sendServer:"SMTP" },
  { id:"e5",  subject:"You've been added to MaivenPoint Online Services", type:"Add a local user",       recipient:"tommythach_tenant@163.com",status:"Successful", sentTime: new Date(Date.now()-1000*60*300).toISOString(),  sendServer:"SMTP" },
  { id:"e6",  subject:"Reset your MaivenPoint password",                  type:"Reset password",         recipient:"alice@avepoint.com",      status:"Successful", sentTime: new Date(Date.now()-1000*60*400).toISOString(),  sendServer:"SMTP" },
  { id:"e7",  subject:"Your subscription is expiring soon",               type:"Subscription expiration",recipient:"admin@avepoint.com",      status:"Successful", sentTime: new Date(Date.now()-1000*60*500).toISOString(),  sendServer:"SMTP" },
  { id:"e8",  subject:"Two-factor verification code",                     type:"Send two-factor verification code", recipient:"bob@avepoint.com", status:"Failed",  sentTime: new Date(Date.now()-1000*60*600).toISOString(),  sendServer:"SMTP" },
  { id:"e9",  subject:"New announcement: Service interruption",           type:"Announcement notification", recipient:"carol@avepoint.com",  status:"Pending",    sentTime: new Date(Date.now()-1000*60*700).toISOString(),  sendServer:"SMTP" },
  { id:"e10", subject:"You've been added to MaivenPoint Online Services", type:"Add a local user",       recipient:"grace@avepoint.com",      status:"Successful", sentTime: new Date(Date.now()-1000*60*800).toISOString(),  sendServer:"SMTP" },
];

function fmtTime(iso) {
  const d = new Date(iso);
  return `${d.toLocaleDateString("en-GB")} ${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}:${String(d.getSeconds()).padStart(2,"0")}`;
}

function toCSV(rows) {
  const headers = ["Subject","Type","Recipient","Status","Sent time","Send server"];
  return [headers.join(","), ...rows.map((r) =>
    [`"${r.subject}"`, r.type, r.recipient, r.status, fmtTime(r.sentTime), r.sendServer].join(",")
  )].join("\n");
}

export default function EmailDeliveryReport() {
  const [dateRange,  setDateRange]  = useState([dayjs().subtract(7,"day"), dayjs()]);
  const [type,       setType]       = useState("All");
  const [recipient,  setRecipient]  = useState("");
  const [status,     setStatus]     = useState("All");
  const [subject,    setSubject]    = useState("");
  const [results,    setResults]    = useState(MOCK_EMAIL_LOG);

  const handleSearch = () => {
    const [from, to] = dateRange ?? [];
    setResults(MOCK_EMAIL_LOG.filter((r) => {
      const t = dayjs(r.sentTime);
      if (from && t.isBefore(from, "minute")) return false;
      if (to   && t.isAfter(to,   "minute")) return false;
      if (type   !== "All" && r.type   !== type)   return false;
      if (status !== "All" && r.status !== status) return false;
      if (recipient && !r.recipient.toLowerCase().includes(recipient.toLowerCase())) return false;
      if (subject   && !r.subject.toLowerCase().includes(subject.toLowerCase()))     return false;
      return true;
    }));
  };

  const handleExport = () => {
    const blob = new Blob([toCSV(results)], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `EmailDeliveryReport_${dayjs().format("YYYYMMDD")}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const columns = [
    { title: "Subject",    dataIndex: "subject",    key: "subject",    render: (v) => <Text style={{ fontSize: 13 }}>{v}</Text> },
    { title: "Type",       dataIndex: "type",       key: "type",       render: (v) => <Text style={{ fontSize: 12 }}>{v}</Text> },
    {
      title: "Recipients", dataIndex: "recipient",  key: "recipient",
      render: (v) => <Text style={{ fontSize: 12 }}>{v.length > 20 ? v.slice(0,18)+"…" : v}</Text>,
    },
    {
      title: "Status", dataIndex: "status", key: "status",
      render: (v) => (
        <span style={{ display:"flex", alignItems:"center", gap: 6 }}>
          <span style={{ width:8, height:8, borderRadius:"50%", background: STATUS_DOT[v] || "#d9d9d9", display:"inline-block" }} />
          <Text style={{ fontSize: 12 }}>{v}</Text>
        </span>
      ),
    },
    { title: "Sent time",   dataIndex: "sentTime",   key: "sentTime",   sorter: (a,b) => new Date(a.sentTime)-new Date(b.sentTime), defaultSortOrder: "descend", render: (v) => <Text style={{ fontSize: 12 }}>{fmtTime(v)}</Text> },
    { title: "Send server", dataIndex: "sendServer", key: "sendServer", render: (v) => <Text style={{ fontSize: 12 }}>{v}</Text> },
  ];

  return (
    <div className={styles.reportPage}>
      <div className={styles.filterPanel}>
        <div className={styles.filterGrid}>
          <div className={styles.filterField}>
            <Text className={styles.filterLabel}>From / To</Text>
            <RangePicker showTime={{ format: "HH:mm" }} format="D/M/YYYY HH:mm" value={dateRange} onChange={setDateRange} style={{ width: "100%" }} />
          </div>
          <div className={styles.filterField}>
            <Text className={styles.filterLabel}>Subject</Text>
            <Input placeholder="Search subject..." value={subject} onChange={(e) => setSubject(e.target.value)} onPressEnter={handleSearch} />
          </div>
          <div className={styles.filterField}>
            <Text className={styles.filterLabel}>Type</Text>
            <Select value={type} onChange={setType} style={{ width: "100%" }} options={TYPES.map((t) => ({ value: t, label: t }))} />
          </div>
          <div className={styles.filterField}>
            <Text className={styles.filterLabel}>Recipient</Text>
            <Input placeholder="Search by email address..." value={recipient} onChange={(e) => setRecipient(e.target.value)} onPressEnter={handleSearch} />
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
        scroll={{ x: 800 }} size="small" className={styles.table} />
    </div>
  );
}
