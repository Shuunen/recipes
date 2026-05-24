import { HomeIcon, MoveLeftIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Divider } from "./divider";
import { Button } from "./ui/button";

type RecipeParams = {
  category: string;
  recipe: string;
};

type RecipeModule = {
  ReactComponent: React.ComponentType;
};

function ErrorMessage({ error }: { error?: string }) {
  return (
    <div className="flex h-full items-center justify-center" data-testid="error">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-800">Recette non trouvée</h2>
        <p className="text-gray-600">{error || "La recette demandée n'existe pas."}</p>
      </div>
    </div>
  );
}

// oxlint-disable-next-line react/no-multi-comp
function LoadingMessage() {
  return (
    <div className="animate-fade-in-delayed flex h-full items-center justify-center" data-testid="loading">
      <div className="text-lg">Chargement de la recette...</div>
    </div>
  );
}

/* v8 ignore next -- @preserve */
// oxlint-disable-next-line react/no-multi-comp, max-lines-per-function
export function RecipeViewer() {
  const { category, recipe } = useParams<RecipeParams>();
  // oxlint-disable-next-line react/hook-use-state
  const [RecipeComponent, setRecipeComponent] = useState<React.ComponentType | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;

    if (!category || !recipe) {
      setError("Paramètres manquants");
      setIsLoading(false);
    } else {
      setIsLoading(true);
      setError(undefined);
      setRecipeComponent(undefined);
      /* v8 ignore start */
      import(`../recipes/${category}/${recipe}.md`)
        // oxlint-disable-next-line promise/prefer-await-to-then
        .then((module: RecipeModule) => {
          if (!cancelled) {
            setRecipeComponent(() => module.ReactComponent);
            setIsLoading(false);
          }
          return undefined;
        })
        // oxlint-disable-next-line promise/prefer-await-to-then
        .catch(() => {
          if (!cancelled) {
            setError(`La recette "${recipe}" dans la catégorie "${category}" n'existe pas.`);
            setIsLoading(false);
          }
        });
      /* v8 ignore stop */
    }

    return () => {
      cancelled = true;
    };
  }, [category, recipe]);

  if (!category || !recipe || error) return <ErrorMessage error={error} />;

  if (isLoading) return <LoadingMessage />;

  /* v8 ignore next -- @preserve */
  if (!RecipeComponent) return <ErrorMessage error="Composant de recette non disponible" />;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center" data-testid="recipe">
      <Button asChild className="fixed bottom-4 z-10 flex rounded-xl border-2 border-orange-800" name="back-home" variant="outline">
        <Link to="/">
          <MoveLeftIcon />
          Retour à l&apos;accueil
          <HomeIcon />
        </Link>
      </Button>
      <div className="animate-fade-in card">
        <RecipeComponent />
        <Divider />
      </div>
    </div>
  );
}
