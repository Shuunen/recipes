import { Route, Routes } from "react-router-dom";
import { RecipeMenu } from "../components/recipe-menu";
import { RecipeViewer } from "../components/recipe-viewer";

export function App() {
  return (
    <div className="mx-auto prose flex min-h-screen max-w-4xl flex-col md:prose-lg" data-component="app">
      <Routes>
        <Route element={<RecipeMenu />} path="/" />
        <Route element={<RecipeViewer />} path="/recipes/:category/:recipe" />
      </Routes>
    </div>
  );
}
