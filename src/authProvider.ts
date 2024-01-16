import { Token } from "@mui/icons-material";
import { AuthBindings } from "@refinedev/core";
import { JwtPayload, jwtDecode } from "jwt-decode";
export const TOKEN_KEY = "access_token";

interface DecodedToken {
  username: string;
  user_id: string;
  scope: string;
  exp: number;
}

export const authProvider: AuthBindings = {
  login: async ({ username, password }) => {
    if (username && password) {
      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `username=${username}&password=${password}`,
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem(TOKEN_KEY, data.access_token);
        localStorage.setItem("currentUserScope", data.scope);

        const event = new Event("custom:scope-update");
        window.dispatchEvent(event);
        return { success: true };
      }
    }

    return {
      success: false,
      error: {
        name: "LoginError",
        message: "Invalid username or password",
      },
    };
  },
  logout: async () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem("currentUserScope");
    return {
      success: true,
      redirectTo: "/login",
    };
  },
  check: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      const decoded_token = jwtDecode(token) as DecodedToken;
      if (decoded_token && decoded_token.exp * 1000 > Date.now()) {
        return {
          authenticated: true,
        };
      }
    }
    return {
      authenticated: false,
      redirectTo: "/login",
    };
  },

  getPermissions: async () => {
    return localStorage.getItem("currentUserScope");
  },

  getIdentity: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      const decoded_token = jwtDecode(token) as DecodedToken;
      if (decoded_token) {
        return {
          id: decoded_token.user_id,
          name: decoded_token.username,
          role: decoded_token.scope,
          avatar: "https://i.pravatar.cc/300",
        };
      }
    }
    return null;
  },
  onError: async (error) => {
    console.error(error);
    return { error };
  },
};
