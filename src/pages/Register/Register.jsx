import { useState } from "react";
import { Form, Input, Button, Select, Typography, Divider, Alert, message, Radio } from "antd";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styles from "./Register.module.scss";

const { Title, Text } = Typography;
const { Option } = Select;

const PHONE_PREFIXES = ["+1","+44","+60","+61","+62","+63","+65","+66","+84","+86","+91"];

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [verifyMethod, setVerifyMethod] = useState("email"); // "email" | "phone"
  const [codeSent, setCodeSent] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form] = Form.useForm();

  const handleSendCode = async () => {
    try {
      if (verifyMethod === "email") {
        await form.validateFields(["email"]);
        message.success("Verification code sent to your email!");
      } else {
        await form.validateFields(["phone"]);
        message.success("Verification code sent to your phone!");
      }
      setCodeSent(true);
    } catch {}
  };

  const onFinish = async (values) => {
    setLoading(true);
    setError(null);
    try {
      const result = await register(values);
      if (result.success) {
        message.success("Account created! Please sign in.");
        navigate("/login");
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.brand}>
          <div className={styles.brandLogo}>MOS</div>
          <Text type="secondary" className={styles.brandSub}>AvePoint MOS Platform</Text>
        </div>

        <div className={styles.headingBlock}>
          <Text className={styles.welcome}>Welcome to MOS</Text>
          <Title level={3} className={styles.title}>Register as a User</Title>
          <Text type="secondary" className={styles.subtitle}>
            To register you need to fill in the following information.
          </Text>
        </div>

        <div className={styles.formCard}>
          <Text className={styles.required}>Denotes a required field</Text>
          <Text strong className={styles.sectionLabel}>Provide your information</Text>

          {error && <Alert message={error} type="error" showIcon closable className={styles.alert} onClose={() => setError(null)} />}

          <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false}>
            <div className={styles.row}>
              <Form.Item name="userId" label={<span>User ID <span className={styles.star}>*</span></span>} rules={[{ required: true, message: "Required" }, { min: 3 }]} className={styles.halfField}>
                <Input />
              </Form.Item>
              <Form.Item name="email" label={<span>Email address <span className={styles.star}>*</span></span>} rules={[{ required: true, message: "Required" }, { type: "email", message: "Valid email required" }]} className={styles.halfField}>
                <Input />
              </Form.Item>
            </div>

            <Form.Item name="fullName" label={<span>Full Name as per NRIC/FIN/Passport <span className={styles.star}>*</span></span>} rules={[{ required: true }, { min: 2 }]}>
              <Input />
            </Form.Item>

            <div className={styles.row}>
              <Form.Item name="password" label={<span>Password <span className={styles.star}>*</span></span>} rules={[{ required: true }, { min: 8 }, { pattern: /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/, message: "Must include uppercase, number, symbol" }]} className={styles.halfField}>
                <Input.Password />
              </Form.Item>
              <Form.Item name="confirmPassword" label={<span>Confirm password <span className={styles.star}>*</span></span>} dependencies={["password"]} rules={[{ required: true }, ({ getFieldValue }) => ({ validator(_, value) { if (!value || getFieldValue("password") === value) return Promise.resolve(); return Promise.reject(new Error("Passwords do not match")); } })]} className={styles.halfField}>
                <Input.Password />
              </Form.Item>
            </div>

            {/* Phone */}
            <Form.Item name="phone" label={<span>Phone number <span className={styles.star}>*</span></span>} rules={[{ required: true, message: "Required" }]}>
              <Input addonBefore={<Form.Item name="phonePrefix" noStyle initialValue="+65"><Select style={{ width: 80 }}>{PHONE_PREFIXES.map((p) => <Option key={p} value={p}>{p}</Option>)}</Select></Form.Item>} placeholder="Phone number" />
            </Form.Item>

            {/* Verification method toggle */}
            <Form.Item label={<span>Security verification <span className={styles.star}>*</span></span>}>
              <div className={styles.verifyMethodRow}>
                <Text type="secondary" style={{ fontSize: 13, marginRight: 8 }}>Send code via:</Text>
                <Radio.Group value={verifyMethod} onChange={(e) => { setVerifyMethod(e.target.value); setCodeSent(false); }} size="small">
                  <Radio.Button value="email">Email</Radio.Button>
                  <Radio.Button value="phone">Phone</Radio.Button>
                </Radio.Group>
              </div>
              <div className={styles.verifyRow} style={{ marginTop: 8 }}>
                <Form.Item name="verificationCode" noStyle rules={[{ required: true, message: "Verification code is required" }]}>
                  <Input placeholder={`Code sent to your ${verifyMethod}`} style={{ flex: 1 }} />
                </Form.Item>
                <Button type="primary" className={styles.verifyBtn} onClick={handleSendCode}>
                  Get verification code
                </Button>
              </div>
              {codeSent && (
                <Text type="success" style={{ fontSize: 12, marginTop: 4, display: "block" }}>
                  ✓ Code sent to your {verifyMethod}. Didn't receive it? <Button type="link" size="small" style={{ padding: 0, height: "auto" }} onClick={handleSendCode}>Resend</Button>
                </Text>
              )}
            </Form.Item>

            <Form.Item style={{ marginBottom: 0, textAlign: "center" }}>
              <Button type="primary" htmlType="submit" loading={loading} className={styles.submitBtn}>Submit</Button>
            </Form.Item>
          </Form>
        </div>

        <div className={styles.loginLink}>
          <Text type="secondary">Already have an account? </Text>
          <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
