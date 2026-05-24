import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { RecipeMenu } from "../components/recipe-menu";
import { RecipeViewer } from "../components/recipe-viewer";

export function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.key]);

  return (
    <div className="mx-auto prose flex min-h-screen max-w-4xl flex-col md:prose-lg" data-component="app">
      <div key={location.key} className="animate-fade-in flex grow flex-col">
        <Routes location={location}>
          <Route element={<RecipeMenu />} path="/" />
          <Route element={<RecipeViewer />} path="/recipes/:category/:recipe" />
        </Routes>
      </div>
    </div>
  );
}
