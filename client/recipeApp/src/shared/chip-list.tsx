import { Chip, Stack } from "@mui/material";
import { colors } from "../assets/_colors";

type ChipListProps = {
  categories: string[];
  selectedCategories: string[];
  onSelectCategory: (category: string, selected: boolean) => void;
};

export function ChipList({
  categories,
  selectedCategories,
  onSelectCategory,
}: ChipListProps) {
  return (
    <Stack direction="row" spacing={1} useFlexGap alignItems="center" flexWrap="wrap">
      {categories.map((c) => {
        const selected = selectedCategories.includes(c);

        return (
          <Chip
            key={c}
            label={c}
            clickable
            onClick={() => onSelectCategory(c, !selected)}
            variant={selected ? "filled" : "outlined"}
            sx={{
              borderColor: colors.BROWNKITCHEN.olive,
              ...(selected
                ? {
                    bgcolor: colors.BROWNKITCHEN.olive,
                    color: "white",
                  }
                : {
                    color: colors.BROWNKITCHEN.olive,
                  }),
            }}
          />
        );
      })}
    </Stack>
  );
}
