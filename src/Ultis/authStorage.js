export const getToken = () =>
  localStorage.getItem("token");

export const getUser = () =>
  JSON.parse(
    localStorage.getItem("user") || "{}"
  );

export const getProducts = () =>
  JSON.parse(
    localStorage.getItem("products") || "[]"
  );

export const isMicrosoftUser = () =>
  getUser()?.signinMethod === "Microsoft" ||
  getUser()?.signinMethod === 1;