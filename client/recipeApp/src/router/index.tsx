import { createBrowserRouter, Navigate } from "react-router-dom";
// import { AppLayout } from "../layouts/AppLayout";
// import { RequireAuth } from "./RequireAuth";

import { LoginComponent } from "../features/auth/components/login";
import { RegisterComponent } from "../features/auth/components/register";
import { AuthPage } from "../features/auth/components/auth-conatiner";
import { RequireAuth } from "./require-auth";
import { AppLayout } from "../layouts/app-layout";
import { ProfilePage } from "../features/profile/profile-page";
import { CreateRecipePage } from "../features/create-recipe/create-recipe-page";
import RecipePage from "../features/recipe/recipe-container";
import SearchPage from "../features/search/search-page";
import { EditRecipePage } from "../features/create-recipe/update-recipe-pae";

// import { HomePage } from "../pages/HomePage";
// import { FeedPage } from "../pages/FeedPage";
// import { ProfilePage } from "../pages/ProfilePage";
// import { CreateRecipePage } from "../pages/CreateRecipePage";

export const router = createBrowserRouter([
{
    path: "/auth",
    element: <AuthPage />,
    children: [
      { index: true, element: <Navigate to="login" replace /> }, 
      { index: true, element: <Navigate to="register" replace /> },
      { path: "login", element: <LoginComponent /> },
      { path: "register", element: <RegisterComponent /> },
    ],
  },
  {
    element: <RequireAuth />,
    children: [
      {
        path: "/",
        element: <AppLayout />,
        children: [
          // { index: true, element: <SearchPage /> },
          { path: "search", element: <SearchPage /> },
          { path: "AI", element: <SearchPage /> },
          { path: "profile", element: <ProfilePage /> },
          { path: "recipes/new", element: <CreateRecipePage /> },
          { path: "recipes/:id/edit", element: <EditRecipePage /> },
          { path: "recipe/:id", element: <RecipePage /> }
        ],
      },
    ],
  },
]);
