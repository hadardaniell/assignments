import * as React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Stack,
    Avatar,
    Typography,
    CircularProgress,
} from "@mui/material";
import type { SafeUser } from "../../types/user.types";
import { usersApi } from "../../data-access/user.api";
import { useAuth } from "../../context/auth.context";

type UpdateProfileDialogProps = {
    open: boolean;
    user: SafeUser | null;
    onCancel: () => void;
    onUpdated: (updated: SafeUser) => void; // מחזיר לאבא את המשתמש המעודכן
};

type UpdateUserDTO = {
    name: string;
    avatarUrl?: string | null;
};

export function UpdateProfileDialog({
    open,
    user,
    onCancel,
    onUpdated,
}: UpdateProfileDialogProps) {
    const [form, setForm] = React.useState<UpdateUserDTO>({
        name: "",
        avatarUrl: "",
    });

    const [saving, setSaving] = React.useState(false);
    const [error, setError] = React.useState<string>("");

    const [avatarFile, setAvatarFile] = React.useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = React.useState<string | null>(null);

    const { user: authUser, setUser } = useAuth();

    // כשפותחים/משתנה user — נטען נתונים לטופס
    React.useEffect(() => {
        if (!open || !user) return;
        setError("");
        setForm({
            name: user.name ?? "",
            avatarUrl: user.avatarUrl ?? "",
        });
        setAvatarFile(null);
        setAvatarPreview(user.avatarUrl ? `http://localhost:3000${user.avatarUrl}` : null);
    }, [open, user]);

    const canSave = React.useMemo(() => {
        if (!user) return false;
        if (saving) return false;

        const nextName = form.name.trim();
        const nextAvatar = (form.avatarUrl ?? "").trim();

        const prevName = (user.name ?? "").trim();
        const prevAvatar = (user.avatarUrl ?? "").trim();

        const hasChanges =
            nextName !== prevName ||
            nextAvatar !== prevAvatar ||
            !!avatarFile;

        return nextName.length > 0 && hasChanges;
    }, [form.name, form.avatarUrl, avatarFile, saving, user]);

    const handleUpdate = async () => {
        if (!user) return;

        const payload: Partial<UpdateUserDTO> = {};

        const nextName = form.name.trim();
        const prevName = (user.name ?? "").trim();
        if (nextName !== prevName) {
            payload.name = nextName;
        }

        const nextAvatar = (form.avatarUrl ?? "").trim();
        const prevAvatar = (user.avatarUrl ?? "").trim();
        if (nextAvatar !== prevAvatar) {
            payload.avatarUrl = nextAvatar ? nextAvatar : null;
        }

        if (Object.keys(payload).length === 0 && !avatarFile) return;

        setSaving(true);
        setError("");

        try {
            if (avatarFile) {
                const res = await usersApi.uploadUserAvatar(user._id, avatarFile); // { url }
                setUser(authUser ? { ...authUser, avatarUrl: res.url } : null);
                payload.avatarUrl = res.url;
            }

            const updated = await usersApi.updateUser(user._id, payload);
            if (updated) {
                onUpdated(updated);
            }
        } catch (e: any) {
            setError(e?.message ?? "עדכון נכשל, נסו שוב");
        } finally {
            setSaving(false);
        }
    };


    return (
        <Dialog
            open={open}
            onClose={() => !saving && onCancel()}
            PaperProps={{ sx: { minWidth: 420 } }}
            dir="rtl"
        >
            <DialogTitle sx={{ fontWeight: 900 }}>
                עדכון פרופיל
            </DialogTitle>

            <DialogContent sx={{ pt: 1 }}>
                {!user ? (
                    <Typography color="text.secondary">אין משתמש לטעינה</Typography>
                ) : (
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Avatar
                                src={(avatarPreview ?? form.avatarUrl) || undefined}
                                alt={form.name}
                                sx={{ width: 56, height: 56 }}
                            />
                            <Stack>
                                <Typography fontWeight={800}>{user.email}</Typography>
                            </Stack>
                        </Stack>

                        <TextField
                            label="שם"
                            value={form.name}
                            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                            required
                            fullWidth
                            disabled={saving}
                        />

                        <TextField
                            type="file"
                            fullWidth
                            inputProps={{ accept: "image/*" }}
                            disabled={saving}
                            onChange={(e) => {
                                const f = e.target.files?.[0] ?? null;
                                setAvatarFile(f);

                                if (f) {
                                    const preview = URL.createObjectURL(f);
                                    setAvatarPreview(preview);
                                } else {
                                    setAvatarPreview(null);
                                }
                            }}
                        />

                        {error ? (
                            <Typography color="error" variant="body2">
                                {error}
                            </Typography>
                        ) : null}
                    </Stack>
                )}
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button variant="outlined" onClick={onCancel} disabled={saving}>
                    ביטול
                </Button>
                <Button variant="contained" onClick={handleUpdate} disabled={!canSave || !user}>
                    {saving ? <CircularProgress size={18} /> : "עדכון"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
