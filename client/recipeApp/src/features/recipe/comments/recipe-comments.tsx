import {
    Alert,
    Button,
    CircularProgress,
    Divider,
    IconButton,
    Paper,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import { useEffect, useMemo, useState } from "react";
import { CommentItem } from "./comment-item";
import type { CommentDTO } from "../../../types/comments.types";
import { commentsApi } from "../../../data-access/comments.api";

function getId(c: CommentDTO) {
    return commentsApi.getCommentId(c);
}

export function RecipeComments({
    recipeId,
    currentUserId,
}: {
    recipeId: string;
    currentUserId: string;
}) {
    const [items, setItems] = useState<CommentDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [newText, setNewText] = useState("");
    const [posting, setPosting] = useState(false);

    // editing state in parent
    const [editId, setEditId] = useState<string | null>(null);
    const [editText, setEditText] = useState("");
    const [savingEdit, setSavingEdit] = useState(false);

    const canPost = useMemo(() => newText.trim().length > 0 && !posting, [newText, posting]);

    async function load() {
        setLoading(true);
        setError(null);
        try {
            const res = await commentsApi.getCommentsByRecipe(recipeId);
            setItems(res);
        } catch (e: any) {
            setError(e?.response?.data?.message || e?.message || "שגיאה בטעינת תגובות");
            setItems([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [recipeId]);

    async function onCreate() {
        const content = newText.trim();
        if (!content) return;

        setPosting(true);
        try {
            const res = await commentsApi.createComment({ recipeId, content, createdBy: currentUserId });
            setItems((prev) => [res, ...prev]);
            setNewText("");
        } catch (e: any) {
            setError(e?.response?.data?.message || e?.message || "שגיאה ביצירת תגובה");
        } finally {
            setPosting(false);
        }
    }

    function startEdit(c: CommentDTO) {
        const id = getId(c);
        setEditId(id);
        setEditText(c.content ?? "");
    }

    function cancelEdit() {
        setEditId(null);
        setEditText("");
    }

    async function saveEdit(commentId: string) {
        const content = editText.trim();
        if (!content) return;

        setSavingEdit(true);
        try {
            const res = await commentsApi.updateComment(commentId, { content });
            setItems((prev) => prev.map((c) => (getId(c) === commentId ? res : c)));
            cancelEdit();
        } catch (e: any) {
            setError(e?.response?.data?.message || e?.message || "שגיאה בעדכון תגובה");
        } finally {
            setSavingEdit(false);
        }
    }

    async function remove(commentId: string) {
        const ok = window.confirm("למחוק את התגובה?");
        if (!ok) return;

        try {
            await commentsApi.deleteComment(commentId);
            setItems((prev) => prev.filter((c) => getId(c) !== commentId));
        } catch (e: any) {
            setError(e?.response?.data?.message || e?.message || "שגיאה במחיקת תגובה");
        }
    }

    return (
        <Paper
            dir="rtl"
            elevation={0}
            sx={{
                p: { xs: 2, md: 3 },
                borderRadius: 4,
                border: "1px solid rgba(94,48,35,0.10)",
                bgcolor: "rgba(255,255,255,0.78)",
                backdropFilter: "blur(10px)",
            }}
        >
            <Stack direction="row" alignItems="center" justifyContent="space-between" dir="rtl">
                <Typography variant="h6">תגובות</Typography>
                <Button size="small" onClick={load} disabled={loading}>
                    רענון
                </Button>
            </Stack>

            <Divider sx={{ my: 2, borderColor: "rgba(94,48,35,0.10)" }} />

            {error ? (
                <Alert severity="error" sx={{ mb: 2, borderRadius: 3 }}>
                    {error}
                </Alert>
            ) : null}

            {/* Add comment */}
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mb: 2,
                display: "flex",
                alignItems: "center",
             }} dir="rtl">
                <TextField
                    fullWidth
                    placeholder="הוספת תגובה…"
                    value={newText}
                    onChange={(e) => setNewText(e.target.value)}
                    multiline
                    minRows={2}
                />
                <IconButton
                    dir="rtl"
                    onClick={onCreate}
                    disabled={!canPost || posting}
                    color="primary"
                    sx={{ rotate: "180deg", 
                        width: 40, height: 40, 
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: "center" }}
                >
                    {posting ? <CircularProgress size={18} /> : <SendRoundedIcon />}
                </IconButton>
            </Stack>

            {/* List */}
            {loading ? (
                <Typography color="text.secondary">טוען תגובות…</Typography>
            ) : items?.length === 0 ? (
                <Typography color="text.secondary">אין תגובות עדיין</Typography>
            ) : (
                <Stack spacing={1.25} dir="rtl">
                    {items?.map((c) => {
                        const id = getId(c);
                        const isEditing = editId === id;

                        return (
                            <CommentItem
                                key={id}
                                comment={c}
                                commentId={id}
                                currentUserId={currentUserId}
                                isEditing={isEditing}
                                editText={isEditing ? editText : ""}
                                saving={savingEdit && isEditing}
                                onStartEdit={() => startEdit(c)}
                                onCancelEdit={cancelEdit}
                                onChangeEditText={setEditText}
                                onSaveEdit={() => saveEdit(id)}
                                onDelete={() => remove(id)}
                            />
                        );
                    })}
                </Stack>
            )}
        </Paper>
    );
}
