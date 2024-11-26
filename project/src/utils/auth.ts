import { decode } from "jsonwebtoken"; 

// utils/auth.ts
export const getUserInfo = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const payload = decode(token);
    return payload as {id:number, email: string, name: string, level:string};
  } catch (err) {
    console.error("Invalid token");
    return null;
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  window.location.href = "/auth/signin";
};

