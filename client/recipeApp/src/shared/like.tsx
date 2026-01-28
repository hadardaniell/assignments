import { useState } from 'react';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import type { LikeDTO } from '../types/like.types';
import { likesApi } from '../data-access/likes.api';
import { colors } from '../assets/_colors';

type LikeProps = {
  recipeId: string;
  userId: string;
  isUserLike: boolean;
};

async function like(params: LikeDTO) {
  try {
    await likesApi.recipeLike(params);
  } catch (err) {
    console.error('like failed', err);
  }
}

async function unlike(params: LikeDTO) {
  try {
    await likesApi.recipeUnlike(params);
  } catch (err) {
    console.error('unlike failed', err);
  }
}

export function LikeComponent({ userId, recipeId, isUserLike }: LikeProps) {
  const [liked, setLiked] = useState(isUserLike);

  const dto: LikeDTO = {
    userId,
    recipeId,
  };

  const onToggleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (liked) {
      await unlike(dto);
      setLiked(false);
    } else {
      await like(dto);
      setLiked(true);
    }
  };

  return (
    <span onClick={onToggleLike} style={{ cursor: 'pointer', height: 24 }}>
      {liked ? (
        <FavoriteIcon sx={{ color: colors.COLORFUL.crimson_red}} />
      ) : (
        <FavoriteBorderIcon />
      )}
    </span>
  );
}
