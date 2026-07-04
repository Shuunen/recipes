import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Divider } from './divider'
import { IconOwl } from './ui/icon-owl'

const RECIPE_PATH_REGEX = /\.\.\/recipes\/(?<category>[^/]+)\/(?<name>[^/]+)\.md$/

const categoryMap: Record<string, string> = {
  aperitif: 'Apéritifs 🍹',
  boisson: 'Boissons 🥤',
  dessert: 'Desserts 🍰',
  fromage: 'Fromages 🧀',
  hygiene: 'Hygiène 👕',
  maison: 'Maison 🏠',
  pain: 'Pains 🍞',
  plat: 'Plats 🍕',
}

type Recipe = {
  category: string
  name: string
}

function parseRecipesFromPaths(recipeModules: Record<string, () => Promise<unknown>>): Recipe[] {
  const recipes: Recipe[] = []
  for (const path of Object.keys(recipeModules)) {
    const match = RECIPE_PATH_REGEX.exec(path)
    if (!match) continue
    const { category, name } = match.groups ?? {}
    /* v8 ignore start */
    if (name === 'template') continue
    if (category === undefined || name === undefined) continue
    /* v8 ignore stop */
    recipes.push({ category, name })
  }
  return recipes
}

function groupRecipesByCategory(recipes: Recipe[]): Record<string, Recipe[]> {
  const grouped: Record<string, Recipe[]> = {}
  for (const recipe of recipes) {
    if (!grouped[recipe.category]) grouped[recipe.category] = []
    grouped[recipe.category]?.push(recipe)
  }
  for (const category of Object.keys(grouped)) grouped[category]?.sort((first, second) => first.name.localeCompare(second.name))
  return grouped
}

export function RecipeMenu() {
  /* v8 ignore next -- @preserve */
  // oxlint-disable-next-line react/hook-use-state
  const [groupedRecipes] = useState<Record<string, Recipe[]>>(() => groupRecipesByCategory(parseRecipesFromPaths(import.meta.glob('../recipes/**/*.md'))))

  const categories = Object.keys(groupedRecipes).toSorted()

  return (
    <div className="flex grow flex-col items-center justify-center py-24">
      <div className="card">
        <h1>
          Les recettes de
          <br />
          <span className="text-amber-100">Romain</span> !
        </h1>
        {categories.map(category => (
          <section className="w-full" key={category}>
            <h2>{categoryMap[category] ?? category}</h2>
            <ol className="grid pl-0! sm:grid-cols-2">
              {groupedRecipes[category]?.map((recipe, index) => (
                <li className="flex items-center" key={`${recipe.category}/${recipe.name}`}>
                  <span className="mr-2">{index + 1}.</span>
                  <NavLink to={`/recipes/${recipe.category}/${recipe.name}`}>{recipe.name}</NavLink>
                </li>
              ))}
            </ol>
          </section>
        ))}
        <Divider />
      </div>
      <span className="mb-8 block w-full text-center text-sm text-gray-500 italic text-shadow-md text-shadow-white">__unique-mark__</span>
      <IconOwl className="w-12 text-yellow-400" />
    </div>
  )
}
