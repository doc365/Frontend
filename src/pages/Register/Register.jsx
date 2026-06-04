import { useState } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Typography,
  Divider,
  Alert,
  message,
  Radio,
} from "antd";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { apiFetch, USE_MOCK } from "../../api/config";
import styles from "./Register.module.scss";

const { Title, Text } = Typography;
const { Option } = Select;

const PHONE_PREFIXES = [
  "+1",
  "+44",
  "+60",
  "+61",
  "+62",
  "+63",
  "+65",
  "+66",
  "+84",
  "+86",
  "+91",
];

// Same key as useWhitelist hook — reads from the same localStorage
const MOCK_WHITELIST_KEY = "mos_whitelist_mock";

function getMockWhitelist() {
  try {
    const stored = localStorage.getItem(MOCK_WHITELIST_KEY);
    return stored ? JSON.parse(stored) : { isEnabled: false, emails: [] };
  } catch {
    return { isEnabled: false, emails: [] };
  }
}

function generateCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

async function checkEmailWhitelist(email) {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 400));
    const { isEnabled, emails } = getMockWhitelist();
    if (!isEnabled) return true; // whitelist off → everyone allowed
    return emails.map((e) => e.toLowerCase()).includes(email.toLowerCase());
  }
  try {
    // GET /api/emailwhitelist returns { isEnabled, emails }
    const data = await apiFetch("/v1EmailWhitelist");
    if (!data.isEnabled) return true; // whitelist disabled → everyone allowed
    return data.emails
      .map((e) => e.toLowerCase())
      .includes(email.toLowerCase());
  } catch {
    // If endpoint not yet implemented (404/500), fall back to allowing registration
    return true;
  }
}

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [whitelistChecking, setWhitelistChecking] = useState(false);
  const [error, setError] = useState(null);
  const [verifyMethod, setVerifyMethod] = useState("email");
  const [codeSent, setCodeSent] = useState(false);
  const [sentCode, setSentCode] = useState(null);
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form] = Form.useForm();

  const handleSendCode = async () => {
    try {
      // Validate the relevant contact field first
      if (verifyMethod === "email") {
        await form.validateFields(["email"]);
      } else {
        await form.validateFields(["phone"]);
      }
    } catch {
      return; // validation failed, antd shows inline errors
    }

    const email = form.getFieldValue("email");

    setWhitelistChecking(true);
    setError(null);

    try {
      const allowed = await checkEmailWhitelist(email);

      if (!allowed) {
        setError(
          `The email address "${email}" is not permitted to register. ` +
            "Please contact your administrator to request access.",
        );
        return;
      }

      // Allowed — generate and "send" code
      const code = generateCode();
      setSentCode(code);
      setCodeSent(true);

      if (verifyMethod === "email") {
        message.success(
          `Verification code sent to your email! Your code is: ${code}`,
          8,
        );
      } else {
        message.success(
          `Verification code sent to your phone! Your code is: ${code}`,
          8,
        );
      }
    } catch (err) {
      setError("Failed to verify email eligibility. Please try again.");
    } finally {
      setWhitelistChecking(false);
    }
  };

  const onFinish = async (values) => {
    // Must have sent and entered a code
    if (!sentCode) {
      setError("Please request and enter a verification code first.");
      return;
    }

    if (values.verificationCode !== sentCode) {
      setError("Invalid verification code. Please check and try again.");
      return;
    }

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
          <Text type="secondary" className={styles.brandSub}>
            AvePoint MOS Platform
          </Text>
        </div>

        <div className={styles.headingBlock}>
          <Text className={styles.welcome}>Welcome to MOS</Text>
          <Title level={3} className={styles.title}>
            Register as a User
          </Title>
          <Text type="secondary" className={styles.subtitle}>
            To register you need to fill in the following information.
          </Text>
        </div>

        <div className={styles.formCard}>
          <Text className={styles.required}>Denotes a required field</Text>
          <Text strong className={styles.sectionLabel}>
            Provide your information
          </Text>

          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              closable
              className={styles.alert}
              onClose={() => setError(null)}
            />
          )}

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            requiredMark={false}
          >
            <div className={styles.row}>
              <Form.Item
                name="userId"
                label={
                  <span>
                    User ID <span className={styles.star}>*</span>
                  </span>
                }
                rules={[{ required: true, message: "Required" }, { min: 3 }]}
                className={styles.halfField}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="email"
                label={
                  <span>
                    Email address <span className={styles.star}>*</span>
                  </span>
                }
                rules={[
                  { required: true, message: "Required" },
                  { type: "email", message: "Valid email required" },
                ]}
                className={styles.halfField}
              >
                <Input />
              </Form.Item>
            </div>

            <div className={styles.row}>
              <Form.Item
                name="fullName"
                label={
                  <span>
                    Full Name <span className={styles.star}>*</span>
                  </span>
                }
                rules={[
                  { required: true, message: "Required" },
                  { min: 2, message: "Name must be at least 2 characters" },
                ]}
                className={styles.halfField}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="tenantId"
                label={
                  <span>
                    Tenant <span className={styles.star}>*</span>
                  </span>
                }
                rules={[{ required: true, message: "Required" }]}
                className={styles.halfField}
              >
                <Select placeholder="Select a tenant">
                  <Option value="00000000-0000-0000-0000-000000000001">
                    Tenant A
                  </Option>
                  <Option value="00000000-0000-0000-0000-000000000002">
                    Tenant B
                  </Option>
                </Select>
              </Form.Item>
            </div>

            <div className={styles.row}>
              <Form.Item
                name="password"
                label={
                  <span>
                    Password <span className={styles.star}>*</span>
                  </span>
                }
                rules={[
                  { required: true },
                  { min: 8 },
                  {
                    pattern: /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/,
                    message: "Must include uppercase, number, symbol",
                  },
                ]}
                className={styles.halfField}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                name="confirmPassword"
                label={
                  <span>
                    Confirm password <span className={styles.star}>*</span>
                  </span>
                }
                dependencies={["password"]}
                rules={[
                  { required: true },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value)
                        return Promise.resolve();
                      return Promise.reject(
                        new Error("Passwords do not match"),
                      );
                    },
                  }),
                ]}
                className={styles.halfField}
              >
                <Input.Password />
              </Form.Item>
            </div>

            {/* Phone */}
            <Form.Item
              name="phone"
              label={
                <span>
                  Phone number <span className={styles.star}>*</span>
                </span>
              }
              rules={[{ required: true, message: "Required" }]}
            >
              <Input
                addonBefore={
                  <Form.Item name="phonePrefix" noStyle initialValue="+65">
                    <Select style={{ width: 80 }}>
                      {PHONE_PREFIXES.map((p) => (
                        <Option key={p} value={p}>
                          {p}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                }
                placeholder="Phone number"
              />
            </Form.Item>

            {/* Verification section */}
            <Form.Item
              label={
                <span>
                  Security verification <span className={styles.star}>*</span>
                </span>
              }
            >
              <div className={styles.verifyMethodRow}>
                <Text type="secondary" style={{ fontSize: 13, marginRight: 8 }}>
                  Send code via:
                </Text>
                <Radio.Group
                  value={verifyMethod}
                  onChange={(e) => {
                    setVerifyMethod(e.target.value);
                    setCodeSent(false);
                    setSentCode(null);
                    setError(null);
                  }}
                  size="small"
                >
                  <Radio.Button value="email">Email</Radio.Button>
                  <Radio.Button value="phone">Phone</Radio.Button>
                </Radio.Group>
              </div>

              <div className={styles.verifyRow} style={{ marginTop: 8 }}>
                <Form.Item
                  name="verificationCode"
                  noStyle
                  rules={[
                    {
                      required: true,
                      message: "Verification code is required",
                    },
                  ]}
                >
                  <Input
                    placeholder={`Code sent to your ${verifyMethod}`}
                    style={{ flex: 1 }}
                    maxLength={6}
                  />
                </Form.Item>
                <Button
                  type="primary"
                  className={styles.verifyBtn}
                  onClick={handleSendCode}
                  loading={whitelistChecking}
                >
                  {codeSent ? "Resend code" : "Get verification code"}
                </Button>
              </div>

              {codeSent && !error && (
                <Text
                  type="success"
                  style={{ fontSize: 12, marginTop: 4, display: "block" }}
                >
                  ✓ Code sent to your {verifyMethod}.
                </Text>
              )}
            </Form.Item>

            <Form.Item style={{ marginBottom: 0, textAlign: "center" }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className={styles.submitBtn}
                disabled={!codeSent}
              >
                Submit
              </Button>
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
