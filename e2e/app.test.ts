import { test, expect } from '@playwright/test'

test('page loads without uncaught errors', async ({ page }) => {
  const pageErrors: Error[] = []
  page.on('pageerror', err => pageErrors.push(err))
  await page.goto('/')
  expect(pageErrors).toHaveLength(0)
})

test('page title is correct', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle('Les recettes de Romain')
})

test('root element mounts and renders content', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('#root')).toBeAttached()
  await expect(page.locator('#root')).not.toBeEmpty()
})

test('recipe menu shows categories and links to recipes', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Les recettes de Romain !' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'chips' })).toBeVisible()
})

test('navigating to a recipe shows its content and survives a reload', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'chips' }).click()
  await expect(page).toHaveURL('/recipes/aperitif/chips')
  await expect(page.getByTestId('recipe')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Chips 🍠' })).toBeVisible()
  await page.reload()
  await expect(page.getByTestId('recipe')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Chips 🍠' })).toBeVisible()
})

test('back button on recipe page navigates to the home menu', async ({ page }) => {
  await page.goto('/recipes/aperitif/chips')
  await page.getByRole('link', { name: "Retour à l'accueil" }).click()
  await expect(page).toHaveURL('/')
  await expect(page.getByRole('heading', { name: 'Les recettes de Romain !' })).toBeVisible()
})

test('navigating to an unknown recipe shows a not-found message', async ({ page }) => {
  await page.goto('/recipes/aperitif/does-not-exist')
  await expect(page.getByTestId('error')).toBeVisible()
  await expect(page.getByTestId('error')).toContainText('does-not-exist')
})
