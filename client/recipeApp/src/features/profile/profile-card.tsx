import { Avatar, Box, Button, Card, CardContent, Divider, IconButton, Typography } from "@mui/material";
import { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import type { User } from "../auth/auth.types";
import { colors } from "../../assets/_colors";

type ProfileCardProps = {
    user: User,
    recipeCount: number
};

const recipeCount = 12;
export function ProfileCard({ user, recipeCount }: ProfileCardProps) {
    const [isEditing, setIsEditing] = useState(false);

    const onEdit = () => setIsEditing(true);
    return (
        <Card sx={{ borderRadius: 3, mb: 3, boxShadow: "none", border: "1px solid #e0e0e0" }}>
            <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar
                    src={user.avatarUrl ?? undefined}
                    sx={{ width: 72, height: 72, fontSize: 28, color: colors.BROWNKITCHEN.cream, backgroundColor: colors.BROWNKITCHEN.coffee }}
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
                            <b style={{
                                "background": colors.BROWNKITCHEN.cream,
                                "color": colors.BROWNKITCHEN.caramel,
                                "padding": "0.1em 0.5em",
                                "borderRadius": "20px",
                                "fontSize": "15px"
                            }}>{recipeCount}</b> מתכונים
                        </Typography>
                    </Box>
                </Box>

                {/* Edit icon */}
                <IconButton onClick={onEdit} aria-label="edit-profile">
                    <EditIcon sx={{ color: colors.BROWNKITCHEN.olive }} />
                </IconButton>
            </CardContent>

            {/* Optional small divider line */}
            <Divider />
            <CardContent sx={{ pt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                    כאן יהיה בעתיד טקסט קצר/סטטוסים/כל דבר שתרצי.
                </Typography>

                {isEditing && (
                    <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                        {/* כרגע placeholder. בהמשך נעשה Modal מסודר עם שינוי שם/תמונה */}
                        <Button variant="contained" onClick={() => setIsEditing(false)}>
                            שמירה
                        </Button>
                        <Button variant="text" onClick={() => setIsEditing(false)}>
                            ביטול
                        </Button>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
}