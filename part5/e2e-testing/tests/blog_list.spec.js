const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    const locator = await page.getByText('Log in to application')
    await expect(locator).toBeVisible()

    const textboxes = await page.getByRole('textbox').all()
    
    const username = textboxes[0]
    await expect(username).toBeVisible()

    const password = textboxes[1]
    await expect(password).toBeVisible()
  })
})