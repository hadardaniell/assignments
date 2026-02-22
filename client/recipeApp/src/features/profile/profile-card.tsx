import { Avatar, Box, Card, CardContent, IconButton, Typography } from "@mui/material";
import { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import type { User } from "../../types/auth.types";
import { colors } from "../../assets/_colors";
import { UpdateProfileDialog } from "../dialog-models/update-profile-dialog";
import { getConfig } from "../../services";

type ProfileCardProps = {
  user: User;
  recipeCount: number;
  onUserUpdated?: (updated: User) => void;
};

export function ProfileCard({ user, recipeCount, onUserUpdated }: ProfileCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { serverFields } = getConfig();

  return (
    <>
      <Card sx={{ borderRadius: 3, mb: 3, boxShadow: "none", border: "1px solid #e0e0e0" }}>
        <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar
          src={`${serverFields}${user.avatarUrl}`}
          sx={{
            width: 72,
            height: 72,
            fontSize: 28,
            color: colors.BROWNKITCHEN.cream,
            backgroundColor: colors.BROWNKITCHEN.coffee,
          }}
          >
          {user.name?.[0] ?? "U"}
        </Avatar>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="h5" sx={{ fontWeight: 800 }} noWrap>
            {user.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {user.email}
          </Typography>

          <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
            <Typography variant="body2">
              <b
                style={{
                  background: colors.BROWNKITCHEN.cream,
                  color: colors.BROWNKITCHEN.caramel,
                  padding: "0.1em 0.5em",
                  borderRadius: "20px",
                  fontSize: "15px",
                }}
              >
                {recipeCount}
              </b>{" "}
              מתכונים
            </Typography>
          </Box>
        </Box>

        <IconButton onClick={() => setIsEditing(true)} aria-label="edit-profile">
          <EditIcon sx={{ color: colors.BROWNKITCHEN.olive }} />
        </IconButton>
      </CardContent>
    </Card >

      <UpdateProfileDialog
        open={isEditing}
        user={user}
        onCancel={() => setIsEditing(false)}
        onUpdated={(updated) => {
          onUserUpdated?.(updated as any);
          setIsEditing(false);
        }}
      />
    </>
  );
}
