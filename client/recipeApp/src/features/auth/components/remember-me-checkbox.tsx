import { FormControlLabel, Checkbox, Typography } from "@mui/material";

type Props = {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
};

export function RememberMeCheckbox({
    checked,
    onChange,
    label = "זכור אותי",
}: Props) {
    return (
        <FormControlLabel
            control={
                <Checkbox
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                />
            }
            sx={{ fontSize: 12 }}
            label={
                <Typography fontSize={13}>
                    {label}
                </Typography>
            }
        />
    );
}