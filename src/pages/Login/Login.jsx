import { useState } from "react";
import { Form, Input, Button, Alert, Typography, Divider } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styles from "./Login.module.scss";

const { Title, Text } = Typography;

function generateCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export default function Login() {
  const [step, setStep] = useState("login"); // "login" | "verify"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pendingUser, setPendingUser] = useState(null);
  const [sentCode, setSentCode] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onLoginFinish = async ({ email, password }) => {
    setLoading(true);
    setError(null);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      // Generate and "send" code
      const code = generateCode();
      setSentCode(code);
      setPendingUser({ email });
      setStep("verify");

      // Mock: show code in toast
      import("antd").then(({ message }) => {
        message.success(`Verification code sent! Your code is: ${code}`, 8);
      });
    } else {
      setError(result.message);
    }
  };

  const onVerifyFinish = ({ code }) => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      if (code === sentCode) {
        navigate("/");
      } else {
        setLoading(false);
        setError("Invalid verification code. Please try again.");
      }
    }, 500);
  };

  const resendCode = () => {
    const code = generateCode();
    setSentCode(code);
    import("antd").then(({ message }) => {
      message.success(`New code sent! Your code is: ${code}`, 8);
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.brand}>
          <div className={styles.brandLogo}>MOS</div>
          <Title level={4} className={styles.brandName}>AvePoint MOS Platform</Title>
          <Text className={styles.brandSub}>Management & Operations Suite</Text>
        </div>

        <Divider />

        {error && (
          <Alert message={error} type="error" showIcon closable className={styles.alert} onClose={() => setError(null)} />
        )}

        {/* ── Step 1: Login ── */}
        {step === "login" && (
          <Form layout="vertical" onFinish={onLoginFinish} size="large" requiredMark={false}>
            <Form.Item name="email" label="Email" rules={[{ required: true, message: "Email is required" }, { type: "email", message: "Enter a valid email" }]}>
              <Input prefix={<UserOutlined />} placeholder="you@avepoint.com" />
            </Form.Item>
            <Form.Item name="password" label="Password" rules={[{ required: true, message: "Password is required" }]}>
              <Input.Password prefix={<LockOutlined />} placeholder="Password" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block className={styles.submitBtn}>
                Sign In
              </Button>
            </Form.Item>
          </Form>
        )}

        {/* ── Step 2: 2FA ── */}
        {step === "verify" && (
          <>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <Title level={5} style={{ margin: 0 }}>Two-factor verification</Title>
              <Text type="secondary" style={{ fontSize: 13 }}>
                A verification code has been sent to <strong>{pendingUser?.email}</strong>.
                Enter the code below to continue.
              </Text>
            </div>

            <Form layout="vertical" onFinish={onVerifyFinish} size="large" requiredMark={false}>
              <Form.Item
                name="code"
                label="Verification code"
                rules={[{ required: true, message: "Code is required" }, { len: 6, message: "Code must be 6 digits" }]}
              >
                <Input
                  placeholder="6-digit code"
                  maxLength={6}
                  style={{ letterSpacing: 8, fontSize: 20, textAlign: "center" }}
                />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} block className={styles.submitBtn}>
                  Verify
                </Button>
              </Form.Item>
            </Form>

            <div style={{ textAlign: "center", marginTop: 8 }}>
              <Text type="secondary" style={{ fontSize: 13 }}>Didn't receive the code? </Text>
              <Button type="link" size="small" style={{ padding: 0 }} onClick={resendCode}>Resend</Button>
            </div>
            <div style={{ textAlign: "center", marginTop: 8 }}>
              <Button type="link" size="small" onClick={() => { setStep("login"); setError(null); }}>
                ← Back to sign in
              </Button>
            </div>
          </>
        )}

        {step === "login" && (
          <>
            <div className={styles.oauthSection}>
              <Divider plain><Text type="secondary" style={{ fontSize: 12 }}>or continue with</Text></Divider>
              <div className={styles.oauthButtons}>
                <Button block disabled className={styles.oauthBtn}>Microsoft 365</Button>
                <Button block disabled className={styles.oauthBtn}>Google</Button>
              </div>
              <Text type="secondary" style={{ fontSize: 11, display: "block", textAlign: "center", marginTop: 8 }}>
                OAuth integration coming soon
              </Text>
            </div>
            <div className={styles.hint}>
              <Text type="secondary" style={{ fontSize: 12 }}>Demo: admin@avepoint.com / Admin123!</Text>
            </div>
            <div className={styles.registerLink}>
              <Text type="secondary">Don't have an account? </Text>
              <Link to="/register">Register here</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}