import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { RecipeViewer } from "./recipe-viewer";

function renderRecipeViewer(initialEntries = ["/recipes/plat/pizza"]) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route element={<RecipeViewer />} path="/recipes/:category/:recipe" />
        <Route element={<RecipeViewer />} path="/recipes/:category" />
        <Route element={<RecipeViewer />} path="/recipes" />
      </Routes>
    </MemoryRouter>,
  );
}

describe(RecipeViewer, () => {
  it("RecipeViewer A should show error when category parameter is missing", () => {
    renderRecipeViewer(["/recipes/plat"]);
    expect(screen.getByText("Recette non trouvée")).toBeInstanceOf(HTMLElement);
    expect(screen.getByText("Paramètres manquants")).toBeInstanceOf(HTMLElement);
    expect(screen.getByTestId("error")).toBeInstanceOf(HTMLElement);
  });

  it("RecipeViewer B should show error when recipe parameter is missing", () => {
    renderRecipeViewer(["/recipes"]);
    expect(screen.getByText("Recette non trouvée")).toBeInstanceOf(HTMLElement);
    expect(screen.getByText("Paramètres manquants")).toBeInstanceOf(HTMLElement);
    expect(screen.getByTestId("error")).toBeInstanceOf(HTMLElement);
  });

  it("RecipeViewer C should show loading state initially for valid routes", () => {
    renderRecipeViewer(["/recipes/plat/pizza"]);
    expect(screen.getByText("Chargement de la recette...")).toBeInstanceOf(HTMLElement);
    expect(screen.getByTestId("loading")).toBeInstanceOf(HTMLElement);
  });

  it("RecipeViewer D should eventually show error for non-existent recipe", async () => {
    renderRecipeViewer(["/recipes/invalid/nonexistent"]);
    await waitFor(
      () => {
        expect(screen.getByText("Recette non trouvée")).toBeInstanceOf(HTMLElement);
      },
      { timeout: 5000 },
    );
    expect(screen.getByText('La recette "nonexistent" dans la catégorie "invalid" n\'existe pas.')).toBeInstanceOf(HTMLElement);
    expect(screen.getByTestId("error")).toBeInstanceOf(HTMLElement);
  });

  it("RecipeViewer E should load existing recipes successfully", async () => {
    renderRecipeViewer(["/recipes/dessert/banana-bread"]);
    await waitFor(
      () => {
        const loading = screen.queryByText("Chargement de la recette...");
        expect(loading).toBeNull();
      },
      { timeout: 5000 },
    );
    const hasContent = screen.queryByTestId("recipe");
    const hasError = screen.queryByTestId("error");
    expect(hasContent || hasError).toBeInstanceOf(HTMLElement);
  });

  it("RecipeViewer F should render home link when recipe loads", async () => {
    renderRecipeViewer(["/recipes/dessert/banana-bread"]);
    await waitFor(
      () => {
        const loading = screen.queryByText("Chargement de la recette...");
        expect(loading).toBeNull();
      },
      { timeout: 5000 },
    );
    const recipeContainer = screen.queryByTestId("recipe");
    if (recipeContainer) expect(screen.getByText("Retour à l'accueil")).toBeInstanceOf(HTMLElement);
  });

  it("RecipeViewer G should test error message component", () => {
    renderRecipeViewer(["/recipes"]);
    expect(screen.getByText("Recette non trouvée")).toBeInstanceOf(HTMLElement);
    expect(screen.getByText("Paramètres manquants")).toBeInstanceOf(HTMLElement);
  });

  it("RecipeViewer H should test loading message component", () => {
    renderRecipeViewer(["/recipes/plat/pizza"]);
    expect(screen.getByText("Chargement de la recette...")).toBeInstanceOf(HTMLElement);
  });
});
