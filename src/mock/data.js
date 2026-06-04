// ── Projects (shown on Home page) ─────────────────────
export const MOCK_PROJECTS = [
  {
    id: 1,
    name: "Learning Management System",
    shortName: "LMS",
    description: "Deliver and manage online learning content for staff and students.",
    category: "Education",
    color: "#0f6cbd",
    subscribed: true,
    url: "/app/lms",
    stats: { users: 312, activeToday: 47, courses: 28, completionRate: "74%" },
  },
  {
    id: 2,
    name: "Training Management System",
    shortName: "TMS",
    description: "Plan, schedule and track all training programs across the organisation.",
    category: "Training",
    color: "#389e0d",
    subscribed: true,
    url: "/app/tms",
    stats: { users: 198, activeToday: 22, sessions: 14, completionRate: "61%" },
  },
  {
    id: 3,
    name: "Examena",
    shortName: "EXM",
    description: "Online examination platform with AI-powered proctoring.",
    category: "Assessment",
    color: "#722ed1",
    subscribed: false,
    url: "/app/examena",
    stats: { users: 0, activeToday: 0, exams: 0, completionRate: "—" },
  },
  {
    id: 4,
    name: "Vitae",
    shortName: "VIT",
    description: "Career portfolio and e-resume builder for students and alumni.",
    category: "Career",
    color: "#d46b08",
    subscribed: false,
    url: "/app/vitae",
    stats: { users: 0, activeToday: 0, portfolios: 0, completionRate: "—" },
  },
  {
    id: 5,
    name: "Curricula for Training",
    shortName: "CFT",
    description: "Build and manage structured training curricula and learning paths.",
    category: "Training",
    color: "#08979c",
    subscribed: false,
    url: "/app/curricula",
    stats: { users: 0, activeToday: 0, curricula: 0, completionRate: "—" },
  },
];

// ── Subscriptions ─────────────────────────────────────
export const MOCK_SUBSCRIPTIONS = [
  {
    id: 1,
    name: "Curricula for Training",
    status: "Working",
    statusColor: "#389e0d",
    expiryDate: "8/4/2030",
    subscriptionType: "Enterprise Pro",
    subscriptionAgreement: "AGR-2024-CFT-001",
    fields: [
      { label: "User seats for staff", value: "Unlimited" },
      { label: "User seats in use for staff (active/inactive)", value: "22 / 3" },
      { label: "User seats for students", value: "Unlimited" },
      { label: "User seats in use for students (active/inactive)", value: "31 / 5" },
      { label: "Storage capacity", value: "5 GB" },
      { label: "Used MaivenPoint storage", value: "76.92 MB" },
      { label: "Subscription expiration date", value: "8/4/2030" },
      { label: "Subscription status", value: "Working" },
    ],
  },
  {
    id: 2,
    name: "Examena",
    status: "Working",
    statusColor: "#389e0d",
    expiryDate: "15/6/2026",
    subscriptionType: "Trial",
    subscriptionAgreement: "AGR-2024-EXM-002",
    fields: [
      { label: "User seats for staff", value: "10" },
      { label: "User seats in use for staff (active/inactive)", value: "0 / 0" },
      { label: "User seats for candidates", value: "15" },
      { label: "User seats in use for candidates (active/inactive)", value: "0 / 0" },
      { label: "Examination capacity", value: "60" },
      { label: "Examinations used", value: "0" },
      { label: "Generative AI services", value: "Enabled" },
      { label: "Total AI tokens", value: "100,000,000 / month" },
      { label: "Used AI tokens", value: "0" },
      { label: "Subscription expiration date", value: "15/6/2026" },
      { label: "Subscription status", value: "Working" },
    ],
  },
  {
    id: 3,
    name: "Vitae",
    status: "Working",
    statusColor: "#389e0d",
    expiryDate: "8/4/2030",
    subscriptionType: "Enterprise Pro",
    subscriptionAgreement: "AGR-2024-VIT-003",
    fields: [
      { label: "User seats for staff", value: "Unlimited" },
      { label: "User seats in use for staff (active/inactive)", value: "24 / 2" },
      { label: "User seats for students", value: "Unlimited" },
      { label: "User seats in use for students (active/inactive)", value: "38 / 4" },
      { label: "Training places", value: "Unlimited" },
      { label: "Training places in use", value: "62" },
      { label: "Storage capacity", value: "5 GB" },
      { label: "Used MaivenPoint storage", value: "68.1 MB" },
      { label: "Google Analytics 4", value: "Enabled" },
      { label: "Curricula integration", value: "Enabled" },
      { label: "Additional system features", value: "Enabled" },
      { label: "Subscription expiration date", value: "8/4/2030" },
      { label: "Subscription status", value: "Working" },
    ],
  },
];

// ── Users ─────────────────────────────────────────────
export const MOCK_USERS = [
  { id: 1,  userId: "alice.j",    name: "Alice Johnson",  fullName: "Alice Johnson Tan",    email: "alice@avepoint.com",      signInMethod: "Local user",    role: "Administrator", status: "Active",   createdAt: "2024-01-15", lastLogin: "2025-05-28 09:14", sex: "Female", phone: "+65 91234567", staffId: "S001", productAssignments: [{ productId: 1, roles: ["Admin"] }, { productId: 2, roles: ["Staff", "Trainer"] }] },
  { id: 2,  userId: "bob.s",      name: "Bob Smith",      fullName: "Bob Smith Lim",        email: "bob@avepoint.com",        signInMethod: "Local user",    role: "Tenant User",   status: "Active",   createdAt: "2024-02-10", lastLogin: "2025-05-27 14:32", sex: "Male",   phone: "+65 98765432", staffId: "S002", productAssignments: [{ productId: 1, roles: ["Viewer"] }, { productId: 2, roles: ["Student"] }] },
  { id: 3,  userId: "carol.w",    name: "Carol White",    fullName: "Carol White Ng",       email: "carol@avepoint.com",      signInMethod: "Singpass user", role: "Tenant User",   status: "Inactive", createdAt: "2024-02-20", lastLogin: "2024-04-10 11:00", sex: "Female", phone: "+65 87654321", staffId: "S003", productAssignments: [{ productId: 1, roles: ["Viewer"] }, { productId: 2, roles: ["Student"] }] },
  { id: 4,  userId: "david.l",    name: "David Lee",      fullName: "David Lee Koh",        email: "david@company.sg",        signInMethod: "Local user",    role: "Tenant User",   status: "Active",   createdAt: "2024-03-05", lastLogin: "2025-05-26 08:45", sex: "Male",   phone: "+65 91112222", staffId: "S004", productAssignments: [{ productId: 2, roles: ["Staff"] }, { productId: 3, roles: ["Admin"] }] },
  { id: 5,  userId: "eva.m",      name: "Eva Martinez",   fullName: "Eva Martinez Wong",    email: "eva@corp.com",            signInMethod: "Local user",    role: "Administrator", status: "Active",   createdAt: "2024-03-12", lastLogin: "2025-05-28 10:30", sex: "Female", phone: "+65 93334444", staffId: "S005", productAssignments: [{ productId: 1, roles: ["Admin"] }, { productId: 3, roles: ["Admin"] }] },
  { id: 6,  userId: "frank.c",    name: "Frank Chen",     fullName: "Frank Chen Tan",       email: "frank@enterprise.io",     signInMethod: "Local user",    role: "Tenant User",   status: "Active",   createdAt: "2024-04-01", lastLogin: "2025-05-25 15:20", sex: "Male",   phone: "+65 95556666", staffId: "S006", productAssignments: [{ productId: 2, roles: ["Student"] }] },
  { id: 7,  userId: "grace.k",    name: "Grace Kim",      fullName: "Grace Kim Lim",        email: "grace@avepoint.com",      signInMethod: "Singpass user", role: "Tenant User",   status: "Active",   createdAt: "2024-04-15", lastLogin: "2025-05-24 12:00", sex: "Female", phone: "+65 97778888", staffId: "S007", productAssignments: [{ productId: 1, roles: ["Viewer"] }, { productId: 2, roles: ["Trainer"] }] },
  { id: 8,  userId: "henry.t",    name: "Henry Tan",      fullName: "Henry Tan Ng",         email: "henry@company.sg",        signInMethod: "Local user",    role: "Tenant User",   status: "Inactive", createdAt: "2024-05-01", lastLogin: "2024-12-01 09:00", sex: "Male",   phone: "+65 98889999", staffId: "S008", productAssignments: [{ productId: 3, roles: ["Viewer"] }] },
  { id: 9,  userId: "iris.w",     name: "Iris Wang",      fullName: "Iris Wang Chen",       email: "iris@mail.com",           signInMethod: "Local user",    role: "Tenant User",   status: "Active",   createdAt: "2024-05-10", lastLogin: "2025-05-27 16:45", sex: "Female", phone: "+65 90001111", staffId: "S009", productAssignments: [{ productId: 1, roles: ["Student"] }, { productId: 2, roles: ["Student"] }] },
  { id: 10, userId: "jack.r",     name: "Jack Robinson",  fullName: "Jack Robinson Koh",    email: "jack@corp.com",           signInMethod: "Local user",    role: "Tenant User",   status: "Active",   createdAt: "2024-06-01", lastLogin: "2025-05-26 11:30", sex: "Male",   phone: "+65 91223344", staffId: "S010", productAssignments: [{ productId: 2, roles: ["Staff"] }] },
  { id: 11, userId: "karen.l",    name: "Karen Liu",      fullName: "Karen Liu Tan",        email: "karen@enterprise.io",     signInMethod: "Singpass user", role: "Tenant User",   status: "Active",   createdAt: "2024-06-15", lastLogin: "2025-05-28 08:00", sex: "Female", phone: "+65 93445566", staffId: "S011", productAssignments: [{ productId: 1, roles: ["Trainer"] }, { productId: 3, roles: ["Viewer"] }] },
  { id: 12, userId: "leo.n",      name: "Leo Ng",         fullName: "Leo Ng Lim",           email: "leo@avepoint.com",        signInMethod: "Local user",    role: "Tenant User",   status: "Active",   createdAt: "2024-07-01", lastLogin: "2025-05-25 14:00", sex: "Male",   phone: "+65 95667788", staffId: "S012", productAssignments: [{ productId: 2, roles: ["Student"] }, { productId: 3, roles: ["Admin"] }] },
  { id: 13, userId: "mia.c",      name: "Mia Chen",       fullName: "Mia Chen Wong",        email: "mia@company.sg",          signInMethod: "Local user",    role: "Tenant User",   status: "Inactive", createdAt: "2024-07-10", lastLogin: "2025-01-15 10:00", sex: "Female", phone: "+65 97889900", staffId: "S013", productAssignments: [{ productId: 1, roles: ["Student"] }] },
  { id: 14, userId: "nathan.o",   name: "Nathan Ong",     fullName: "Nathan Ong Tan",       email: "nathan@corp.com",         signInMethod: "Local user",    role: "Tenant User",   status: "Active",   createdAt: "2024-08-01", lastLogin: "2025-05-27 09:15", sex: "Male",   phone: "+65 90112233", staffId: "S014", productAssignments: [{ productId: 2, roles: ["Staff"] }, { productId: 1, roles: ["Viewer"] }] },
  { id: 15, userId: "olivia.p",   name: "Olivia Park",    fullName: "Olivia Park Kim",      email: "olivia@mail.com",         signInMethod: "Singpass user", role: "Tenant User",   status: "Active",   createdAt: "2024-08-15", lastLogin: "2025-05-26 13:20", sex: "Female", phone: "+65 92233445", staffId: "S015", productAssignments: [{ productId: 3, roles: ["Viewer"] }, { productId: 2, roles: ["Trainer"] }] },
  { id: 16, userId: "paul.t",     name: "Paul Teo",       fullName: "Paul Teo Lim",         email: "paul@avepoint.com",       signInMethod: "Local user",    role: "Tenant User",   status: "Active",   createdAt: "2024-09-01", lastLogin: "2025-05-28 07:30", sex: "Male",   phone: "+65 94455667", staffId: "S016", productAssignments: [{ productId: 1, roles: ["Admin"] }] },
  { id: 17, userId: "quinn.h",    name: "Quinn Ho",       fullName: "Quinn Ho Ng",          email: "quinn@enterprise.io",     signInMethod: "Local user",    role: "Tenant User",   status: "Inactive", createdAt: "2024-09-10", lastLogin: "2024-11-20 14:00", sex: "Male",   phone: "+65 96677889", staffId: "S017", productAssignments: [{ productId: 2, roles: ["Student"] }] },
  { id: 18, userId: "rachel.y",   name: "Rachel Yap",     fullName: "Rachel Yap Tan",       email: "rachel@company.sg",       signInMethod: "Singpass user", role: "Tenant User",   status: "Active",   createdAt: "2024-10-01", lastLogin: "2025-05-27 10:45", sex: "Female", phone: "+65 98899001", staffId: "S018", productAssignments: [{ productId: 1, roles: ["Student"] }, { productId: 3, roles: ["Viewer"] }] },
  { id: 19, userId: "sam.c",      name: "Sam Chua",       fullName: "Sam Chua Koh",         email: "sam@corp.com",            signInMethod: "Local user",    role: "Tenant User",   status: "Active",   createdAt: "2024-10-15", lastLogin: "2025-05-26 16:00", sex: "Male",   phone: "+65 90123456", staffId: "S019", productAssignments: [{ productId: 2, roles: ["Trainer"] }] },
  { id: 20, userId: "tina.w",     name: "Tina Wong",      fullName: "Tina Wong Lim",        email: "tina@mail.com",           signInMethod: "Local user",    role: "Tenant User",   status: "Active",   createdAt: "2024-11-01", lastLogin: "2025-05-25 11:00", sex: "Female", phone: "+65 92345678", staffId: "S020", productAssignments: [{ productId: 1, roles: ["Viewer"] }, { productId: 2, roles: ["Student"] }] },
  { id: 21, userId: "uma.b",      name: "Uma Balan",      fullName: "Uma Balan Tan",        email: "uma@avepoint.com",        signInMethod: "Singpass user", role: "Tenant User",   status: "Active",   createdAt: "2024-11-10", lastLogin: "2025-05-24 14:30", sex: "Female", phone: "+65 93456789", staffId: "S021", productAssignments: [{ productId: 3, roles: ["Admin"] }] },
  { id: 22, userId: "victor.l",   name: "Victor Lim",     fullName: "Victor Lim Ng",        email: "victor@enterprise.io",   signInMethod: "Local user",    role: "Tenant User",   status: "Active",   createdAt: "2024-12-01", lastLogin: "2025-05-23 09:00", sex: "Male",   phone: "+65 94567890", staffId: "S022", productAssignments: [{ productId: 2, roles: ["Staff"] }] },
  { id: 23, userId: "wendy.c",    name: "Wendy Chan",     fullName: "Wendy Chan Wong",      email: "wendy@company.sg",        signInMethod: "Local user",    role: "Tenant User",   status: "Inactive", createdAt: "2024-12-10", lastLogin: "2025-02-14 10:00", sex: "Female", phone: "+65 95678901", staffId: "S023", productAssignments: [{ productId: 1, roles: ["Student"] }] },
  { id: 24, userId: "xander.f",   name: "Xander Foo",     fullName: "Xander Foo Tan",       email: "xander@corp.com",         signInMethod: "Local user",    role: "Tenant User",   status: "Active",   createdAt: "2025-01-05", lastLogin: "2025-05-28 08:15", sex: "Male",   phone: "+65 96789012", staffId: "S024", productAssignments: [{ productId: 2, roles: ["Trainer"] }, { productId: 3, roles: ["Viewer"] }] },
  { id: 25, userId: "yara.s",     name: "Yara Soh",       fullName: "Yara Soh Lim",         email: "yara@mail.com",           signInMethod: "Singpass user", role: "Tenant User",   status: "Active",   createdAt: "2025-01-15", lastLogin: "2025-05-27 15:00", sex: "Female", phone: "+65 97890123", staffId: "S025", productAssignments: [{ productId: 1, roles: ["Admin"] }] },
  { id: 26, userId: "zach.t",     name: "Zach Tan",       fullName: "Zach Tan Ng",          email: "zach@avepoint.com",       signInMethod: "Local user",    role: "Tenant User",   status: "Active",   createdAt: "2025-02-01", lastLogin: "2025-05-26 12:30", sex: "Male",   phone: "+65 98901234", staffId: "S026", productAssignments: [{ productId: 3, roles: ["Admin"] }, { productId: 2, roles: ["Staff"] }] },
  { id: 27, userId: "aaron.w",    name: "Aaron Wong",     fullName: "Aaron Wong Koh",       email: "aaron@enterprise.io",    signInMethod: "Local user",    role: "Tenant User",   status: "Active",   createdAt: "2025-02-10", lastLogin: "2025-05-25 10:00", sex: "Male",   phone: "+65 90012345", staffId: "S027", productAssignments: [{ productId: 1, roles: ["Viewer"] }] },
  { id: 28, userId: "beth.c",     name: "Beth Chua",      fullName: "Beth Chua Tan",        email: "beth@company.sg",         signInMethod: "Singpass user", role: "Tenant User",   status: "Inactive", createdAt: "2025-02-20", lastLogin: "2025-03-10 11:00", sex: "Female", phone: "+65 91123456", staffId: "S028", productAssignments: [{ productId: 2, roles: ["Student"] }] },
  { id: 29, userId: "carl.n",     name: "Carl Ng",        fullName: "Carl Ng Lim",          email: "carl@corp.com",           signInMethod: "Local user",    role: "Tenant User",   status: "Active",   createdAt: "2025-03-01", lastLogin: "2025-05-28 09:45", sex: "Male",   phone: "+65 92234567", staffId: "S029", productAssignments: [{ productId: 1, roles: ["Trainer"] }, { productId: 3, roles: ["Admin"] }] },
  { id: 30, userId: "diana.h",    name: "Diana Ho",       fullName: "Diana Ho Tan",         email: "diana@mail.com",          signInMethod: "Local user",    role: "Administrator", status: "Active",   createdAt: "2025-03-10", lastLogin: "2025-05-27 08:00", sex: "Female", phone: "+65 93345678", staffId: "S030", productAssignments: [{ productId: 1, roles: ["Admin"] }, { productId: 2, roles: ["Admin"] }] },
];

// ── Auth ──────────────────────────────────────────────
export const MOCK_AUTH = {
  email: "admin@avepoint.com",
  password: "Admin123!",
  user: {
    id: 1, userId: "alice.j", name: "Alice Johnson", fullName: "Alice Johnson Tan",
    email: "admin@avepoint.com", role: "Administrator", signInMethod: "Local user",
    sex: "Female", phone: "+65 91234567", staffId: "S001", avatar: null,
  },
};

// ── Admin Roles ───────────────────────────────────────
export const ADMIN_ROLES = [
  { id: "service_admin",        name: "Service admin",         description: "Service admin has full control permissions to all the settings across the MOS platform interface and they also have the permissions of the tenant user admins and the service support admins.", assignedUsers: [] },
  { id: "tenant_user_admin",    name: "Tenant user admin",     description: "Tenant user admin can add and manage the tenant users using the applications of MOS platform.", assignedUsers: [] },
  { id: "service_support_admin",name: "Service support admin", description: "Service support admin can submit support requests for MOS platform and its products.", assignedUsers: [] },
];

// ── Announcements ─────────────────────────────────────
export const MOCK_ANNOUNCEMENTS = [
  { id: "ann1",  name: "User deactivated",   type: "Delete",  category: "User",    publishedTime: new Date(Date.now() - 1000 * 60 * 30).toISOString(),          details: "Eva Martinez deactivated user Carol White",          actor: "Eva Martinez" },
  { id: "ann2",  name: "User added",         type: "Add",     category: "User",    publishedTime: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),       details: "Bob Smith added new user Frank Chen",                 actor: "Bob Smith" },
  { id: "ann3",  name: "Permissions updated",type: "Update",  category: "User",    publishedTime: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),       details: "Eva Martinez updated permissions for Grace Kim",      actor: "Eva Martinez" },
  { id: "ann4",  name: "User updated",       type: "Update",  category: "User",    publishedTime: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),       details: "Alice Johnson updated profile for David Lee",         actor: "Alice Johnson" },
  { id: "ann5",  name: "User added",         type: "Add",     category: "User",    publishedTime: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),      details: "Diana Ho added new user Karen Liu",                   actor: "Diana Ho" },
  { id: "ann6",  name: "Role assigned",      type: "Update",  category: "Role",    publishedTime: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),      details: "Alice Johnson assigned Eva Martinez to Service admin", actor: "Alice Johnson" },
  { id: "ann7",  name: "User deleted",       type: "Delete",  category: "User",    publishedTime: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),      details: "Diana Ho deleted user Henry Tan",                     actor: "Diana Ho" },
  { id: "ann8",  name: "User activated",     type: "Update",  category: "User",    publishedTime: new Date(Date.now() - 1000 * 60 * 60 * 50).toISOString(),      details: "Bob Smith activated user Quinn Ho",                   actor: "Bob Smith" },
  { id: "ann9",  name: "Permissions updated",type: "Update",  category: "User",    publishedTime: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),      details: "Eva Martinez updated permissions for Nathan Ong",     actor: "Eva Martinez" },
  { id: "ann10", name: "User added",         type: "Add",     category: "User",    publishedTime: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),      details: "Alice Johnson added new user Xander Foo",             actor: "Alice Johnson" },
];

// Keep MOCK_PRODUCTS for backward compat (UserManagement/PermissionsDrawer)
export const MOCK_PRODUCTS = [
  { id: 1, name: "Learning Management System", description: "Deliver and manage online learning",   icon: "📚", category: "Education",   roles: ["Admin", "Viewer", "Student", "Staff", "Trainer"] },
  { id: 2, name: "Training Management System", description: "Plan, schedule and track training",    icon: "🎯", category: "Training",    roles: ["Admin", "Viewer", "Student", "Staff", "Trainer"] },
  { id: 3, name: "Examena",                    description: "Online examination platform",          icon: "📝", category: "Assessment",  roles: ["Admin", "Viewer"] },
];

export const MOCK_TENANTS = [
  {
    id: "11111111-1111-1111-1111-111111111111",
    name: "AvePoint Singapore",
    slug: "avepoint-sg",
  },
  {
    id: "22222222-2222-2222-2222-222222222222",
    name: "UEF",
    slug: "uef",
  },
  {
    id: "33333333-3333-3333-3333-333333333333",
    name: "Tekvizon",
    slug: "tekvizon",
  },
];