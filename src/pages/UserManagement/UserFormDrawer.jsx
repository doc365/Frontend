import { useEffect } from "react";
import { Drawer, Form, Input, Select, Button, Space, message, Radio } from "antd";
import { useUsers } from "../../hooks/useUsers";

const { Option } = Select;

function generatePassword() {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$";
  return Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

export default function UserFormDrawer({ open, user, onClose, onSuccess }) {
  const [form] = Form.useForm();
  const { addUser, updateUser, loading } = useUsers();
  const isEdit = !!user;

  useEffect(() => {
    if (open) {
      if (user) {
        form.setFieldsValue(user);
      } else {
        form.resetFields();
        form.setFieldsValue({ password: generatePassword(), signInMethod: "Local user", role: "Tenant User" });
      }
    }
  }, [open, user, form]);

  const onFinish = async (values) => {
    try {
      if (isEdit) {
        await updateUser(user.id, values);
        message.success("User updated successfully");
      } else {
        await addUser(values);
        message.success("User created successfully");
      }
      onSuccess();
    } catch {
      message.error("Something went wrong");
    }
  };

  return (
    <Drawer
      title={isEdit ? "Edit User" : "Add New User"}
      open={open}
      onClose={onClose}
      width={480}
      footer={
        <Space style={{ float: "right" }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" loading={loading} onClick={() => form.submit()}>
            {isEdit ? "Save Changes" : "Create User"}
          </Button>
        </Space>
      }
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item name="signInMethod" label="Sign-in Method" rules={[{ required: true }]}>
          <Radio.Group>
            <Radio value="Local user">Local user</Radio>
            <Radio value="Singpass user">Singpass user</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item name="role" label="Role" rules={[{ required: true }]}>
          <Radio.Group>
            <Radio value="Tenant User">Tenant user</Radio>
            <Radio value="Administrator">Tenant administrator</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item name="userId" label="User ID" rules={[{ required: true, message: "User ID is required" }, { min: 3 }]}>
          <Input placeholder="e.g. john.doe" disabled={isEdit} />
        </Form.Item>

        <Form.Item name="email" label="Email address" rules={[{ required: true, message: "Email is required" }, { type: "email" }]}>
          <Input placeholder="user@avepoint.com" disabled={isEdit} />
        </Form.Item>

        <Form.Item name="name" label="Display Name" rules={[{ required: true, message: "Display name is required" }]}>
          <Input placeholder="John Doe" />
        </Form.Item>

        <Form.Item name="staffId" label="Staff & Student ID">
          <Input placeholder="Optional" />
        </Form.Item>

        <Form.Item name="sex" label="Sex">
          <Radio.Group>
            <Radio value="Male">Male</Radio>
            <Radio value="Female">Female</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item name="phone" label="Mobile Phone">
          <Input placeholder="+65 9123 4567" />
        </Form.Item>

        {!isEdit && (
          <Form.Item name="password" label="Initial Password" rules={[{ required: true }, { min: 8 }]}>
            <Input.Password
              addonAfter={
                <Button size="small" type="link" onClick={() => form.setFieldValue("password", generatePassword())}>
                  Generate
                </Button>
              }
            />
          </Form.Item>
        )}

        {isEdit && (
          <Form.Item name="status" label="Status" rules={[{ required: true }]}>
            <Select>
              <Option value="Active">Active</Option>
              <Option value="Inactive">Inactive</Option>
            </Select>
          </Form.Item>
        )}
      </Form>
    </Drawer>
  );
}
