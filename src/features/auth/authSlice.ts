import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

export type Permission =
  | "CREATE"
  | "VIEW"
  | "EDIT"
  | "DELETE"
  | "APPROVE"
  | "REJECT";

interface Permissions {
  resource: "WORKFLOW" | "PATIENT";
  action: Permission[];
}

interface Role {
  role_id: number;
  role_name: "CREATOR" | "REVIEWER" | "PUBLISHER" | "ADMIN" | null;
  permissions: Permissions[];
}

interface RoleApiResponse {
  success: boolean;
  message: string;
  status_code: number;
  data: {
    user_id: number;
    roles: Role[];
  };
}

interface AuthResponse {
  success: boolean;
  message: string;
  status_code: number;
  data: {
    tokens: {
      AccessToken: string;
      ExpiresIn: number;
      IdToken: string;
      RefreshToken: string;
      TokenType: string;
    };
    roles: Role[];
  };
}

interface AuthState {
  token: string | null;
  roles: Role[] | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: localStorage.getItem("token") || null,
  roles: null,
  loading: false,
  error: null,
};

const fakeLoginApi = async (username: string, password: string) => {
  return new Promise<AuthResponse>((resolve, reject) => {
    setTimeout(() => {
      if (username && password)
        resolve({
          success: true,
          message: "Login successful",
          status_code: 200,
          data: {
            tokens: {
              AccessToken:
                "eyJraWQiOiJLMXlXcGlLQlkwWndzTU5DSExmRXBiNmYwM2ZMUTRzNlRITkx4THdvTEFBPSIsImFsZyI6IlJTMjU2In0.eyJ0ZW5hbnRfaWQiOiJ0ZW5hbnRfNjgzMzU1ZDYtNjQ3Yi00Yzc5LWJhYTItYzIyYjY2NDU0NThmIiwic3ViIjoiNzE1YmU1YTAtNzBhMS03MGUyLTRmM2YtOWE4OTRmODFkNjU3IiwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMi5hbWF6b25hd3MuY29tXC91cy1lYXN0LTJfRTV4Ym0yUXV2IiwiY2xpZW50X2lkIjoiM2YxajY0YzY4NnUzZGI0bGlkY2Q2bXQ2cWwiLCJvcmlnaW5fanRpIjoiN2M5MTY0MTgtNGVlMS00NjE0LTk4ZWMtNWU2YjNmNThkZTk2IiwiZXZlbnRfaWQiOiIxMmExZjNkOS03ODI2LTRlNDYtYjBjMS05ZDk5MTY5ZGNmNGUiLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6ImF3cy5jb2duaXRvLnNpZ25pbi51c2VyLmFkbWluIiwiYXV0aF90aW1lIjoxNzM4MjMyNDI4LCJleHAiOjE3MzgyMzYwMjgsImlhdCI6MTczODIzMjQyOCwiZW1haWwiOiJzYWhpbHNAemltZXRyaWNzLmNvbSIsImp0aSI6ImNiM2FlZjc1LWEyMTEtNGZlZC1iMGI2LTVlZWEyMDFhMGRkMSIsInVzZXJuYW1lIjoiNzE1YmU1YTAtNzBhMS03MGUyLTRmM2YtOWE4OTRmODFkNjU3In0.XhHmMZ-XurzlLRhPmQAlL9_2zSvhIT68hk_aJ_fFLn12sqTJQTapZrsc8fn3_eKMpjmWjeUCM9sypbipPxlDXj7jf8w_vn_2VbwXJ9WgVT8tPqim5E02UP86Tm6l3CiuQB3YFEr4nO8WpozpdhY8tQp45RIQGrZE36DxVCbVySZ8tHVIPZ53t6CDKEArKTGAB_Pdv2ymtQ81hNUOK7Yg7DlOy2OW-ncZRM_LCHFNt7UJWQNgSQXUXaOhn-fhbVq4vm5a-W_uQdJxBuTl2spUxutU7xDoVRoXj4GlDyITIfIjjpVpYTbuUer_Q-pHuo_qHLpiGIak16HjLRfVV4-FmA",
              ExpiresIn: 3600,
              IdToken:
                "eyJraWQiOiJcLyt3K2hIbVc2U1wvSTJYVE5nZjJpTUFCVXNOZU5Jc1MyVHBQVThnOTgyNXM9IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiI3MTViZTVhMC03MGExLTcwZTItNGYzZi05YTg5NGY4MWQ2NTciLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMi5hbWF6b25hd3MuY29tXC91cy1lYXN0LTJfRTV4Ym0yUXV2IiwiY29nbml0bzp1c2VybmFtZSI6IjcxNWJlNWEwLTcwYTEtNzBlMi00ZjNmLTlhODk0ZjgxZDY1NyIsImN1c3RvbTp0ZW5hbnRfaWQiOiJ0ZW5hbnRfNjgzMzU1ZDYtNjQ3Yi00Yzc5LWJhYTItYzIyYjY2NDU0NThmIiwib3JpZ2luX2p0aSI6IjdjOTE2NDE4LTRlZTEtNDYxNC05OGVjLTVlNmIzZjU4ZGU5NiIsImF1ZCI6IjNmMWo2NGM2ODZ1M2RiNGxpZGNkNm10NnFsIiwiZXZlbnRfaWQiOiIxMmExZjNkOS03ODI2LTRlNDYtYjBjMS05ZDk5MTY5ZGNmNGUiLCJjdXN0b206dXNlcm5hbWUiOiJzYWhpbHMiLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTczODIzMjQyOCwiZXhwIjoxNzM4MjM2MDI4LCJpYXQiOjE3MzgyMzI0MjgsImp0aSI6Ijg4ZDRiNzIzLTg5NDAtNDdjMy04MjZmLTkyOTQzYzk0NTZiZSIsImVtYWlsIjoic2FoaWxzQHppbWV0cmljcy5jb20ifQ.ZmJflXP_5GQS1ub89N-CvyvmuqZyI1vYtt5VSYbGAr-YrG7glOaVFd8IBul2NJfs_jpf5IXE2pmt-NaoSGQEARWlu6Dcs06qg9O3xGbi8f6tccGXYEryn8xmiiKm4SH4m4JB5_orXpRHX6vn6pOgZQTO1ZcHCu8zbxH40Ygc23MfJCfJeThsalw-ppntMBA3jaKQJn908d_96oCVFMK0vUsPsnr_FdolkuYmm2zoTSF56ESUGAIQIjc4rKi_3Qj7KtLJiLcgzRUBdYnObzXY7qPS3TSOK_iTbaS1mkd6MfzGSuhxMIekQySoCKiLmn0kLAu9vSNw4zs0YaNbZvG-eg",
              RefreshToken:
                "eyJjdHkiOiJKV1QiLCJlbmMiOiJBMjU2R0NNIiwiYWxnIjoiUlNBLU9BRVAifQ.Zx8GQDa1UBPN3GyFYgEGlbGi6HTqwwCZ0wZ_BtlqQ1EVEkpcACXU5PB0-SlO6gG9wioFKwo3-BTVBTMlXnWezVAI8wMn-Dd2PTTYMJnmAzr8BeQW0LxgTqeddMskMVfQUxtLkxGET504Uiixmz7yDfq2dFqU7-_pfxe2LRGV1XwTGct_POzdKTLEield7dbEZ5D5KrtEbTFCa0bdXW6RkE9tKg1YUd40h4JJ6xSvwjQLuQ7IfSeEznPwnHXIdhoaXMxoRSpj9fT2gKe1EIKcsCLqy0OrNWUrZtYMyQXvIgFJFh1xIjOq-ltEl32GXmYUyoRiiLdMD8dg8VqXq0qnFQ.eLH064Yr5k9rzXDt.T7xWWeuj-CXzg26Wa8k8SLKVI2h9qijKwLuyq2kf8baVL_yGGUpOCibs3AqSzvSO440cN_tgZ2ovF4bHyRFOVS9cO3vePoLjUwAyZSHzcVM9WgnCIzsrgeMDLPg1RcxDsRwXtQU1PC0UVlZJxn7JWJ7RkldxCTaABvt_2jG1U7r6JcxRno5mooPYmdQ3QZalw3dNm0Nm4fC0DnYlL1aM-IegHir3lw-Md4Y9cq_ipB3jE8bpv335iwwpdFzTles0Qh1NMibmI5G65kL87_qmoUZ9sQuEbKcszUF2RM52p_RZ6K1YxG3bFf_9Rf5Yn96uUYZ1p2zB4WIsQUwUx1SPcp9WXg145CO5v6YPl3MN4jz7B8GZGCAgecKEbipx2nfej0b8bEHxPbYZEK0cW9oOB0ErDEJL9QEdda4ZX_0Sht7dJhNnz_Gt0ldZTqhPOdiYGyWqrriiR0EXpsP0OJsAkGIPXl69yqyotbjIR9QMNYMDq54mDS0fmRS72KPdlJz_Q6ObjtTa_WoBF5ZOF2iIZXC0E2c6O6d5DjZmHq2Foy85xjVioi_qzqxplU-nMJqY7ziJz3w_oy-Rnbd-xCacursPaUdt2GGMj-TyMzB85HT8Ru-87yIP5CJu4iXIQnV7XQleHXyxZmfl3mNdSdQfbylCnJLkeMLPC6FlUJCOxyDKMaCs5Fi2p2zxuqVDoLpE7yuqH88REJ1rGN2I7q9T4wWr8xBJlgWloXC5B1ZwWMEADnBLLoeorOCDQLuHaoKg0-pWk_Ck8_e7Zw1qy1oQNJkcz0Av9lBj5ZIjw9oTLBT4dsgl6W01ySIaAkws7dVZCQbwr2Hn5ponYU1h-4YvOKPwck3p6_17wWMkP0J1tbr6G83FIoZ_tjb8weW5v2hcPzmPN8qBp7xVoPyH4x0KlsfcMuLaQr-YyE5JXDeyVzLOCj1xlSbY-83rJK8k5jgPPA42lVoqbH1oexMUZpMh1Z9oeBoD0oSd9-3-5cVp6_RXEz6s3dT0z4JTToVwOJaAEviF7WqrMpApZiew8D6eHNHUZJuEPaDtUlBgjWPqzmZW7hS463rX9oFquhSqwh-19BCQ1MUdLak6ueEQyjNdA4Wh-_Ora2i1FdOEN9OWs9SIWYTk2EHFZUVBQs1PNTVlXxfFFGsBgzvD3ZgO5gNTjWtqJoarTZWxNr6LzRcAEARlnjoa4xVbVxjRWYIcSm6b5IcPcZ8z6Lndj8vgcY_p90onO1wxcygPi5x_W0xBTMdLgucdkpHJyTHnU8Y34YZD31JN35p4Q1a3hYtWiaHL7KbGvAWuLdDOtSgM2E5xlmfPf2LxtdC6N-Pckg.WptZDPV5eZgGGuPWtbfm5A",
              TokenType: "Bearer",
            },
            roles: [
              {
                role_id: 1,
                role_name: "CREATOR",
                permissions: [
                  {
                    resource: "WORKFLOW",
                    action: ["CREATE", "VIEW", "EDIT"],
                  },
                  {
                    resource: "PATIENT",
                    action: ["CREATE", "VIEW"],
                  },
                ],
              },
              {
                role_id: 2,
                role_name: "REVIEWER",
                permissions: [
                  {
                    resource: "WORKFLOW",
                    action: ["VIEW", "APPROVE", "REJECT"],
                  },
                ],
              },
              {
                role_id: 3,
                role_name: "ADMIN",
                permissions: [
                  {
                    resource: "WORKFLOW",
                    action: ["CREATE", "VIEW", "EDIT", "DELETE", "APPROVE"],
                  },
                ],
              },
            ],
          },
        });
      else reject("Invalid credentials.");
    }, 1000);
  });
};

const fakeGetRoleApi = async (token: string) => {
  return new Promise<RoleApiResponse>((resolve, reject) => {
    setTimeout(() => {
      if (token)
        resolve({
          success: true,
          message: "Permissions retrieved successfully",
          status_code: 200,
          data: {
            user_id: 123,
            roles: [
              {
                role_id: 1,
                role_name: "CREATOR",
                permissions: [
                  {
                    resource: "WORKFLOW",
                    action: ["CREATE", "VIEW", "EDIT"],
                  },
                  {
                    resource: "PATIENT",
                    action: ["CREATE", "VIEW"],
                  },
                ],
              },
              {
                role_id: 2,
                role_name: "REVIEWER",
                permissions: [
                  {
                    resource: "WORKFLOW",
                    action: ["VIEW", "APPROVE", "REJECT"],
                  },
                ],
              },
              {
                role_id: 3,
                role_name: "ADMIN",
                permissions: [
                  {
                    resource: "WORKFLOW",
                    action: ["CREATE", "VIEW", "EDIT", "DELETE", "APPROVE"],
                  },
                ],
              },
            ],
          },
        });
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
      localStorage.setItem("token", response.data.tokens.AccessToken);
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
      return await fakeGetRoleApi(token);
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
      state.roles = null;
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
        state.token = action.payload.data.tokens.AccessToken;
        state.roles = action.payload.data.roles;
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
        state.roles = (action.payload.data.roles as Role[]) || null;
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
