import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

export type IRole = "creator" | "reviewer" | "publisher" | null;

interface AuthState {
  token: string | null;
  role: IRole;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: localStorage.getItem("token") || null,
  role: null,
  loading: false,
  error: null,
};

const fakeLoginApi = async (username: string, password: string) => {
  return new Promise<{ token: string; role: string }>((resolve, reject) => {
    setTimeout(() => {
      if (password === "pass") {
        const roles: Record<string, string> = {
          creator: "creator",
          reviewer: "reviewer",
          publisher: "publisher",
        };
        if (roles[username]) {
          resolve({
            token: `fake-token-${username}`,
            role: roles[username],
          });
        } else {
          reject("Invalid username");
        }
      } else {
        reject("Invalid password");
      }
    }, 1000);
  });
};

const fakeGetRoleApi = async (token: string) => {
  return new Promise<string>((resolve, reject) => {
    setTimeout(() => {
      if (token.includes("creator")) resolve("creator");
      else if (token.includes("reviewer")) resolve("reviewer");
      else if (token.includes("publisher")) resolve("publisher");
      else reject("Invalid token");
    }, 1000);
  });
};

export const login = createAsyncThunk(
  "auth/login",
  async (
    { username, password }: { username: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await fakeLoginApi(username, password);
      localStorage.setItem("token", response.token);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getRole = createAsyncThunk(
  "auth/getRole",
  async (token: string, { rejectWithValue }) => {
    try {
      const role = await fakeGetRoleApi(token);
      return role;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.role = null;
      localStorage.removeItem("token");
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.role = action.payload.role as IRole;
        state.loading = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(getRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRole.fulfilled, (state, action) => {
        state.role = action.payload as IRole;
        state.loading = false;
      })
      .addCase(getRole.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export const { logout, setError, setLoading } = authSlice.actions;
export default authSlice.reducer;
