import {
  Avatar,
  Box,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import type { CommentDTO } from "../../../types/comments.types";

function fmtDate(iso?: string) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleString("he-IL");
  } catch {
    return "";
  }
}

export function CommentItem({
  comment,
  commentId,
  currentUserId,
  isEditing,
  editText,
  saving,
  onStartEdit,
  onCancelEdit,
  onChangeEditText,
  onSaveEdit,
  onDelete,
}: {
  comment: CommentDTO;
  commentId: string;
  currentUserId: string;

  // editing state is managed by parent
  isEditing: boolean;
  editText: string;
  saving: boolean;

  onStartEdit: () => void;
  onCancelEdit: () => void;
  onChangeEditText: (value: string) => void;
  onSaveEdit: () => void;
  onDelete: () => void;
}) {
  const isMine = comment.createdBy === currentUserId;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 3,
        border: "1px solid rgba(94,48,35,0.10)",
        bgcolor: "rgba(243,233,220,0.45)",
      }}
    >
      <Stack direction="row" spacing={1.25} alignItems="flex-start" dir="rtl">
        <Avatar sx={{ width: 34, height: 34 }}>
          {(comment.createdBy ?? "?").slice(0, 1).toUpperCase()}
        </Avatar>

        <Box sx={{ flex: 1 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography sx={{ fontWeight: 800 }}>
              {isMine ? "את" : "משתמש"}{" "}
              <Typography component="span" variant="caption" color="text.secondary">
                • {fmtDate(comment.createdAt)}
              </Typography>
            </Typography>

            {isMine ? (
              <Stack direction="row" spacing={0.5}>
                {!isEditing ? (
                  <>
                    <IconButton size="small" onClick={onStartEdit}>
                      <EditRoundedIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={onDelete}>
                      <DeleteOutlineRoundedIcon fontSize="small" />
                    </IconButton>
                  </>
                ) : (
                  <>
                    <IconButton size="small" onClick={onSaveEdit} disabled={saving}>
                      <SaveRoundedIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={onCancelEdit} disabled={saving}>
                      <CloseRoundedIcon fontSize="small" />
                    </IconButton>
                  </>
                )}
              </Stack>
            ) : null}
          </Stack>

          {!isEditing ? (
            <Typography sx={{ mt: 0.75, whiteSpace: "pre-wrap" }}>{comment.content}</Typography>
          ) : (
            <TextField
              value={editText}
              onChange={(e) => onChangeEditText(e.target.value)}
              fullWidth
              multiline
              minRows={2}
              sx={{ mt: 1 }}
            />
          )}
        </Box>
      </Stack>
    </Paper>
  );
}
