import { createContext, useContext, useState, useCallback } from "react";

const NotificationContext = createContext(null);

const SEED_NOTIFICATIONS = [
  { id: "seed1", type: "info", title: "User deactivated", message: "Eva Martinez deactivated user Carol White", time: new Date(Date.now() - 1000*60*30), read: false, actor: "Eva Martinez" },
  { id: "seed2", type: "success", title: "User added", message: "Bob Smith added new user Frank Chen", time: new Date(Date.now() - 1000*60*60*2), read: false, actor: "Bob Smith" },
  { id: "seed3", type: "info", title: "Permissions updated", message: "Eva Martinez updated permissions for Grace Kim", time: new Date(Date.now() - 1000*60*60*5), read: true, actor: "Eva Martinez" },
];

const SEED_ACTIVITIES = [
  { id: "a1", displayName: "Eva Martinez", userId: "eva.m", staffId: "S005", ip: "192.168.1.10", time: new Date(Date.now() - 1000*60*30), category: "Account", action: "Deactivate user or group", object: "carol.w" },
  { id: "a2", displayName: "Bob Smith", userId: "bob.s", staffId: "S002", ip: "192.168.1.22", time: new Date(Date.now() - 1000*60*60*2), category: "Account", action: "Add a local user", object: "frank.c" },
  { id: "a3", displayName: "Eva Martinez", userId: "eva.m", staffId: "S005", ip: "192.168.1.10", time: new Date(Date.now() - 1000*60*60*5), category: "Account", action: "Edit user or group", object: "grace.k" },
  { id: "a4", displayName: "Alice Johnson", userId: "alice.j", staffId: "S001", ip: "10.0.0.1", time: new Date(Date.now() - 1000*60*60*8), category: "Account", action: "Sign in", object: "MOS Platform" },
  { id: "a5", displayName: "Henry Brown", userId: "henry.b", staffId: "S008", ip: "10.0.0.5", time: new Date(Date.now() - 1000*60*60*12), category: "Account", action: "Sign out", object: "MOS Platform" },
];

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(SEED_NOTIFICATIONS);
  const [activityLog, setActivityLog] = useState(SEED_ACTIVITIES);

  const addNotification = useCallback(({ type = "info", title, message, actor = "You" }) => {
    const notif = { id: `notif_${Date.now()}`, type, title, message, time: new Date(), read: false, actor };
    setNotifications((prev) => [notif, ...prev]);

    // Also add to activity log
    const actionMap = {
      "User added": "Add a local user",
      "User updated": "Edit user or group",
      "User(s) deleted": "Delete user or group",
      "User(s) deactivated": "Deactivate user or group",
      "User(s) activated": "Activate user or group",
      "Permissions updated": "Edit permissions",
      "App registered": "Register app",
      "App updated": "Edit app registration",
      "App deleted": "Delete app",
      "Secret regenerated": "Regenerate app secret",
    };
    const activity = {
      id: `act_${Date.now()}`,
      displayName: actor === "You" ? "Alice Johnson" : actor,
      userId: actor === "You" ? "alice.j" : actor.toLowerCase().replace(" ", "."),
      staffId: "—",
      ip: `192.168.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`,
      time: new Date(),
      category: "Account",
      action: actionMap[title] || title,
      object: message.split(": ").pop() || message,
    };
    setActivityLog((prev) => [activity, ...prev]);
  }, []);

  const markAllRead = useCallback(() => setNotifications((prev) => prev.map((n) => ({ ...n, read: true }))), []);
  const markRead = useCallback((id) => setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n)), []);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider value={{ notifications, activityLog, addNotification, markAllRead, markRead, unreadCount }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationContext);
}
