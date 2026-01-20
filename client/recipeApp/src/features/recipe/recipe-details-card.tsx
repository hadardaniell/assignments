import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import LocalFireDepartmentRoundedIcon from "@mui/icons-material/LocalFireDepartmentRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import DeleteOutlineRounded from "@mui/icons-material/DeleteOutlineRounded";
import type { Difficulty, RecipeDTO } from "../../types/recipe.types";
import { useMemo, useState } from "react";
import { colors } from "../../assets/_colors";
import { recipesApi } from "../../data-access/recipe.api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth.context";
import { OkCancelDialog } from "../dialog-models/ok-cancel-dialog";

function difficultyLabel(d?: Difficulty) {
  if (!d) return "—";
  if (d === "easy") return "קל";
  if (d === "medium") return "בינוני";
  return "קשה";
}

function difficultyProgress(d?: Difficulty) {
  if (!d) return 0;
  if (d === "easy") return 33;
  if (d === "medium") return 66;
  return 100;
}

function totalMinutes(recipe: RecipeDTO) {
  const t = recipe.totalTimeMinutes ?? null;
  if (t !== null && t !== undefined) return t;

  const prep = recipe.prepTimeMinutes ?? 0;
  const cook = recipe.cookTimeMinutes ?? 0;
  const sum = prep + cook;
  return sum > 0 ? sum : null;
}

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}


function MatchPill({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Box
      sx={{
        px: 1.25,
        py: 0.75,
        borderRadius: 999,
        display: "flex",
        alignItems: "center",
        gap: 1
      }}
    >
      <Box sx={{ display: "grid", placeItems: "center", opacity: 0.9 }}>{icon}</Box>
      <Typography variant="caption" sx={{ color: "text.secondary" }}>
        {label}
      </Typography>
      <Typography sx={{ fontWeight: 800 }}>{value}</Typography>
    </Box>
  );
}

export function RecipeDetailsCard({
  recipe,
  shareText,
}: {
  recipe: RecipeDTO;
  shareText: string;
}) {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const { user } = useAuth();

  const canDelete = recipe.createdBy === user?._id;

  const minutes = useMemo(() => totalMinutes(recipe), [recipe]);

  async function deleteRecipeById(id: string) {
    try {
      await recipesApi.deleteRecipeById(id);
      navigate(-1);
    }
    catch (e) {
      console.error("Failed to delete recipe", e);
    }
  }

  return (
    <Card
      dir="rtl"
      elevation={0}
      sx={{
        borderRadius: 4,
        border: "1px solid rgba(94,48,35,0.10)",
        background: "rgba(255,255,255,0.82)",
        backdropFilter: "blur(10px)",
      }}
    >
      <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
        {/* Title + copy */}
        <Stack direction="row" spacing={1} alignItems="flex-start">
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" sx={{ mb: 0.5 }}>
              {recipe.title}
            </Typography>
            {recipe.description ? (
              <Typography color="text.secondary">{recipe.description}</Typography>
            ) : null}
          </Box>
          <Stack direction="row" spacing={1} alignItems="center">
            {recipe.status === "draft" && (
              <Chip
                variant="outlined"
                label={"טיוטה"}
                sx={{
                  fontWeight: 600,
                  borderColor: colors.BROWNKITCHEN.brownie,
                  color: colors.BROWNKITCHEN.brownie
                }}></Chip>
            )}
            <Tooltip title={copied ? "הועתק" : "העתק מתכון"}>
              <IconButton
                onClick={async () => {
                  const ok = await copyToClipboard(shareText);
                  setCopied(ok);
                  setTimeout(() => setCopied(false), 1200);
                }}
                sx={{
                  bgcolor: "rgba(255,255,255,0.70)",
                }}
              >
                <ContentCopyRoundedIcon />
              </IconButton>
            </Tooltip>
            {canDelete && (
              <Tooltip title={"מחיקת מתכון"}>
                <IconButton
                  onClick={async () => setOpenDialog(!openDialog)}
                  sx={{
                    bgcolor: "rgba(255,255,255,0.70)",
                  }}
                >
                  <DeleteOutlineRounded />
                </IconButton>
              </Tooltip>
            )}

            <OkCancelDialog
              open={openDialog}
              header="למחוק מתכון?"
              content="הפעולה לא ניתנת לשחזור."
              onClose={(result) => {
                setOpenDialog(false);
                if (result) {
                  deleteRecipeById(recipe.Id!)
                }
              }}
            />
          </Stack>
        </Stack>

        {/* MatchPills */}
        <Stack direction="row" spacing={1} sx={{ mt: 2 }} useFlexGap >
          {recipe.prepTimeMinutes !== null && recipe.prepTimeMinutes !== undefined ? (
            <MatchPill
              icon={<LocalFireDepartmentRoundedIcon fontSize="small" />}
              label="זמן הכנה"
              value={`${recipe.prepTimeMinutes ?? "—"} דק׳`}
            />
          ) : null}
          {recipe.cookTimeMinutes !== null && recipe.cookTimeMinutes !== undefined ? (
            <MatchPill
              icon={<AccessTimeRoundedIcon fontSize="small" />}
              label="זמן בישול"
              value={`${recipe.cookTimeMinutes ?? "—"} דק׳`}
            />
          ) : null}
          <MatchPill
            icon={<BoltRoundedIcon fontSize="small" />}
            label="קושי"
            value={difficultyLabel(recipe.difficulty)}
          />
          {minutes !== null ? (
            <MatchPill
              icon={<AccessTimeRoundedIcon fontSize="small" />}
              label="סה״כ"
              value={`${minutes} דק׳`}
            />
          ) : null}
        </Stack>

        {/* Divider + chips */}
        <Divider sx={{ my: 2, borderColor: "rgba(94,48,35,0.10)" }} />

        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
          {(recipe.categories ?? []).map((c) => (
            <Chip
              key={c}
              label={c}
              variant="outlined"
              sx={{
                bgcolor: colors.BROWNKITCHEN.olive,
                color: "white",
              }}
            />
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}
