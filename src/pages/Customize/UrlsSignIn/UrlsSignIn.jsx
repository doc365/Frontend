import { useState } from "react";
import { Typography, Button, Checkbox, Switch, Collapse, Space, Divider, message, Steps } from "antd";
import { UndoOutlined } from "@ant-design/icons";
import styles from "./UrlsSignIn.module.scss";

const { Title, Text } = Typography;

const STEP_TITLES = ["1. Custom URLs", "2. Custom sign-in page"];

export default function UrlsSignIn() {
  const [step, setStep] = useState(1); // 1 = Custom URLs, 2 = Custom sign-in page

  // Sign-in page state
  const [showPoweredBy, setShowPoweredBy] = useState(true);
  const [bgFile, setBgFile] = useState("LogicalV4.png");
  const [customMessage, setCustomMessage] = useState(false);
  const [enableFooter, setEnableFooter] = useState(true);
  const [roleSelection, setRoleSelection] = useState(true);

  // Staff sign-in methods
  const [staffLocalUsers, setStaffLocalUsers] = useState(true);
  const [staffCorppass, setStaffCorppass] = useState(true);

  return (
    <div className={styles.container}>
      {/* Step progress bar */}
      <div className={styles.stepBar}>
        <div className={`${styles.stepItem} ${step === 1 ? styles.stepActive : styles.stepDone}`} onClick={() => setStep(1)}>
          1. Custom URLs
        </div>
        <div className={`${styles.stepItem} ${step === 2 ? styles.stepActive : ""}`} onClick={() => setStep(2)}>
          2. Custom sign-in page
        </div>
      </div>

      <div className={styles.mainContent}>
        {/* Left form */}
        <div className={styles.formPanel}>
          {step === 1 && (
            <div className={styles.placeholderSection}>
              <Title level={5}>Custom URLs</Title>
              <Text type="secondary">Configure custom URLs for your MOS tenant. This section is under construction.</Text>
            </div>
          )}

          {step === 2 && (
            <>
              {/* Logo */}
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <Text strong style={{ fontSize: 15 }}>Logo</Text>
                  <Button type="link" icon={<UndoOutlined />} onClick={() => setShowPoweredBy(true)}>Reset to default</Button>
                </div>
                <div className={styles.uploadRow}>
                  <Button type="primary" style={{ background: "#5a67d8", borderColor: "#5a67d8" }}>Upload</Button>
                  <Text type="secondary">Up to 50KB; Within 300*60px (PNG)</Text>
                </div>
                <Checkbox checked={showPoweredBy} onChange={(e) => setShowPoweredBy(e.target.checked)}>
                  Show the "Powered by MOS" logo
                </Checkbox>
              </div>

              <Divider />

              {/* Background */}
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <Text strong style={{ fontSize: 15 }}>Background</Text>
                  <Button type="link" icon={<UndoOutlined />} onClick={() => setBgFile(null)}>Reset to default</Button>
                </div>
                <div className={styles.uploadRow}>
                  <Button type="primary" style={{ background: "#5a67d8", borderColor: "#5a67d8" }}>Upload</Button>
                  <Text type="secondary">Up to 1MB; Image size: 1280*610px (JPG, JPEG, or PNG)</Text>
                </div>
                {bgFile && (
                  <div className={styles.fileRow}>
                    <span>📄 {bgFile}</span>
                    <Button type="text" danger size="small" onClick={() => setBgFile(null)}>🗑</Button>
                  </div>
                )}
              </div>

              <Divider />

              {/* Message */}
              <div className={styles.section}>
                <Text strong style={{ fontSize: 15, display: "block", marginBottom: 10 }}>Message</Text>
                <Checkbox checked={customMessage} onChange={(e) => setCustomMessage(e.target.checked)}>
                  Customize sign-in page's welcome message
                </Checkbox>
              </div>

              <Divider />

              {/* Footer */}
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <Text strong style={{ fontSize: 15 }}>Footer</Text>
                  <Button type="link" icon={<UndoOutlined />}>Reset to default</Button>
                </div>
                <Checkbox checked={enableFooter} onChange={(e) => setEnableFooter(e.target.checked)}>
                  Enable footer
                </Checkbox>
                {enableFooter && (
                  <div style={{ marginTop: 12 }}>
                    <Button type="primary" style={{ background: "#5a67d8", borderColor: "#5a67d8" }}>Edit footer content</Button>
                  </div>
                )}
              </div>

              <Divider />

              {/* Sign-in method */}
              <div className={styles.section}>
                <Text strong style={{ fontSize: 15, display: "block", marginBottom: 12 }}>Sign-in method</Text>
                <div className={styles.toggleRow}>
                  <Text>Enable the role selection for sign-in</Text>
                  <Switch checked={roleSelection} onChange={setRoleSelection} />
                </div>

                {roleSelection && (
                  <div style={{ marginTop: 16 }}>
                    <Collapse
                      items={[
                        {
                          key: "staff",
                          label: <Text strong>Staff sign-in page</Text>,
                          children: (
                            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                              <Checkbox checked={staffLocalUsers} onChange={(e) => setStaffLocalUsers(e.target.checked)}>Local users</Checkbox>
                              <Checkbox checked={staffCorppass} onChange={(e) => setStaffCorppass(e.target.checked)}>Corppass users</Checkbox>
                            </div>
                          ),
                        },
                        { key: "learner", label: <Text strong>Learner sign-in page</Text>, children: <Text type="secondary">Configure learner sign-in options.</Text> },
                        { key: "trainer", label: <Text strong>Trainer sign-in page</Text>, children: <Text type="secondary">Configure trainer sign-in options.</Text> },
                        { key: "company", label: <Text strong>Company sign-in page</Text>, children: <Text type="secondary">Configure company sign-in options.</Text> },
                      ]}
                    />
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Right preview */}
        {step === 2 && (
          <div className={styles.previewPanel}>
            <div className={styles.previewCard}>
              <div className={styles.previewHeader}>
                <Text strong>Preview product sign-in page</Text>
                <Button type="link" style={{ padding: 0 }}>Preview in web page</Button>
              </div>
              <div className={styles.previewBox}>
                <div className={styles.mockSignIn}>
                  <div className={styles.mockLogo}>Logo</div>
                  <Text strong style={{ fontSize: 14 }}>Sign in</Text>
                  <div className={styles.mockField}>User ID</div>
                  <div className={styles.mockField}>Password</div>
                  <div className={styles.mockBtn}>Sign in</div>
                </div>
              </div>
            </div>

            {roleSelection && (
              <div className={styles.previewCard} style={{ marginTop: 16 }}>
                <div className={styles.previewHeader}>
                  <Text strong>Preview Vitae sign-in page</Text>
                  <Button type="link" style={{ padding: 0 }}>Preview in web page</Button>
                </div>
                <div className={styles.previewBox}>
                  <div className={styles.mockSignIn}>
                    <div className={styles.mockLogo}>Logo</div>
                    <Text strong style={{ fontSize: 14 }}>Choose your role</Text>
                    <div className={styles.mockRoles}>
                      <div className={styles.mockRole}>👩‍🎓 Learner</div>
                      <div className={styles.mockRole}>🏢 Company</div>
                    </div>
                    <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                      <div className={styles.mockRoleBtn}>Staff</div>
                      <div className={styles.mockRoleBtn}>Trainer</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer actions */}
      <div className={styles.footerActions}>
        <Button onClick={() => message.info("Changes discarded")}>Cancel</Button>
        {step === 2 && <Button onClick={() => setStep(1)}>Back</Button>}
        <Button type="primary" disabled={step === 1} onClick={() => message.success("Settings saved")}>Save</Button>
      </div>
    </div>
  );
}
