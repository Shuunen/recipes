import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { RecipeMenu } from './recipe-menu'

function renderRecipeMenu() {
  return render(
    <BrowserRouter>
      <RecipeMenu />
    </BrowserRouter>,
  )
}

describe(RecipeMenu, () => {
  it('RecipeMenu A should render component successfully', () => {
    renderRecipeMenu()
    const hasLoading = screen.queryByText('Chargement des recettes...')
    const hasRecipes = screen.queryByText('Desserts 🍰')
    expect(hasLoading ?? hasRecipes).toBeInstanceOf(HTMLElement)
  })

  it('RecipeMenu B should render recipes after loading', async () => {
    renderRecipeMenu()
    await waitFor(
      () => {
        expect(screen.queryByText('Chargement des recettes...')).toBeNull()
      },
      { timeout: 5000 },
    )
    const categories = ['Apéritifs 🍹', 'Desserts 🍰', 'Plats 🍕', 'Boissons 🥤']
    for (const category of categories) expect(screen.getByText(category)).toBeInstanceOf(HTMLElement)
  })

  it('RecipeMenu C should render recipe links', async () => {
    renderRecipeMenu()
    await waitFor(
      () => {
        expect(screen.queryByText('Chargement des recettes...')).toBeNull()
      },
      { timeout: 5000 },
    )
    const expectedRecipes = ['cafe', 'chips', 'banana-bread']
    for (const recipe of expectedRecipes) expect(screen.getByText(recipe)).toBeInstanceOf(HTMLElement)
  })

  it('RecipeMenu D should have proper structure', async () => {
    renderRecipeMenu()
    await waitFor(
      () => {
        expect(screen.queryByText('Chargement des recettes...')).toBeNull()
      },
      { timeout: 5000 },
    )
    const allLinks = screen.getAllByRole('link')
    expect(allLinks.length).toBeGreaterThan(1)
  })
})
