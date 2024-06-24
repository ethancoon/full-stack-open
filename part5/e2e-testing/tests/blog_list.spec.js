const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http:localhost:3003/api/testing/reset')
    await request.post('http:localhost:3003/api/users', {
        data: {
            name: 'playwright',
            username: 'playwright',
            password: 'playwright'
        }
    })

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

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByTestId('username').fill('playwright')
      await page.getByTestId('password').fill('playwright')
      await page.getByRole('button', { name: 'login' }).click()
        
      const infoDiv = await page.locator('.info')
      await expect(infoDiv).toHaveText('Successfully logged in as playwright')
    })

    test('fails with wrong credentials', async ({ page }) => {
        await page.getByTestId('username').fill('playwright')
        await page.getByTestId('password').fill('wrong')
        await page.getByRole('button', { name: 'login' }).click()

        const errorDiv = await page.locator('.error')
        await expect(errorDiv).toHaveText('Wrong credentials')
    })
  })

})