import { useEffect, useRef, useState } from "react";
import { Box, IconButton, Paper, TextField } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

type Props = {
  value?: string;
  loading?: boolean;
  placeholder?: string;
  onSubmit: (query: string) => void;
};

export function AiSearchBar({
  value = "",
  loading = false,
  placeholder = "חפשו מתכון… למשל: פסטה שמנת פטריות בלי גלוטן",
  onSubmit,
}: Props) {
  const [text, setText] = useState(value);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setText(value);
  }, [value]);

  const canSend = text.trim().length > 0 && !loading;

  function submit() {
    if (!canSend) return;
    onSubmit(text.trim());
    inputRef.current?.focus();
  }

  return (
    <Box dir="rtl"
    sx={{
        width: "100%",
        display: "flex"
    }}
    >
      <Paper
        elevation={8}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          px: 1.5,
          py: 1,
          borderRadius: 999,
          boxShadow: "none",
          border: "1px solid rgba(176, 172, 172, 0.23)",
          width: "100%",
        }}
      >
        <TextField
          inputRef={inputRef}
          fullWidth
          size="small"
          value={text}
          disabled={loading}
          placeholder={placeholder}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          sx={{
            "& fieldset": { 
                padding: "8.5px 14px",
                border: "none"
             }
          }}
        />

        <IconButton
          onClick={submit}
          disabled={!canSend}
          aria-label="send"
          sx={{ transform: "rotate(180deg)" }}
        >
          <SendIcon />
        </IconButton>
      </Paper>
    </Box>
  );
}