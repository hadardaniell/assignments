import { Button } from "@mui/material";
import { FcGoogle } from "react-icons/fc";
import { GoogleLogin } from "@react-oauth/google";
import type { AuthResponse } from "../../../types/auth.types";
import { authApi } from "../../../data-access/auth.api";

type Props = {
  onSuccess: (res: AuthResponse) => void;
  onError?: (msg: string) => void;
  disabled?: boolean;
};

export function GoogleLoginButton({ onSuccess, onError, disabled }: Props) {
  return (
    <GoogleLogin
      onSuccess={async (cred) => {
        try {
          const idToken = cred.credential;
          if (!idToken) throw new Error("Missing Google credential");

          const axiosRes = await authApi.googleLogin(idToken);
          onSuccess(axiosRes);
        } catch (e: any) {
          const msg =
            e?.response?.data?.message ||
            e?.message ||
            "התחברות עם Google נכשלה";
          onError?.(msg);
        }
      }}
      onError={() => onError?.("התחברות עם Google נכשלה")}
      useOneTap={false}
      render={(renderProps) => (
        <Button
          variant="outlined"
          fullWidth
          sx={{ height: 48 }}
          onClick={renderProps.onClick}
          disabled={disabled || renderProps.disabled}
        >
          התחברות בעזרת Google <FcGoogle size={20} style={{ marginRight: 8 }} />
        </Button>
      )}
    />
  );
}