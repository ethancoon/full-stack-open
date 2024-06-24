const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http:localhost:3003/api/testing/reset')
    await request.post('http:localhost:3003/api/users', {
        data: {
            name: 'playwright_name',
            username: 'playwright',
            password: 'playwright'
        }
    })

    await request.post('http:localhost:3003/api/users', {
      data: {
          name: 'test2_name',
          username: 'test2',
          password: 'test2'
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
      await expect(infoDiv).toHaveText('Successfully logged in as playwright_name')
    })

    test('fails with wrong credentials', async ({ page }) => {
        await page.getByTestId('username').fill('playwright')
        await page.getByTestId('password').fill('wrong')
        await page.getByRole('button', { name: 'login' }).click()

        const errorDiv = await page.locator('.error')
        await expect(errorDiv).toHaveText('Wrong credentials')
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
        await page.getByTestId('username').fill('playwright')
        await page.getByTestId('password').fill('playwright')
        await page.getByRole('button', { name: 'login' }).click()
    })

    test('A blog can be created', async ({ page }) => {
        await page.getByRole('button', { name: 'new blog' }).click()

        await page.getByTestId('title').fill('test blog')
        await page.getByTestId('author').fill('test author')
        await page.getByTestId('url').fill('test url')

        await page.getByRole('button', { name: 'create' }).click()

        const defaultViewDiv = await page.locator('.blogDefaultView')
        await expect(defaultViewDiv).toContainText('test blog test author')
    })

    test('A blog can be liked', async ({ page }) => {
      await page.getByRole('button', { name: 'new blog' }).click()

      await page.getByTestId('title').fill('test blog')
      await page.getByTestId('author').fill('test author')
      await page.getByTestId('url').fill('test url')

      await page.getByRole('button', { name: 'create' }).click()
    
      await page.getByRole('button', { name: 'view' }).click()

      const detailedViewDiv = await page.locator('.blogDetailedView')
      await expect(detailedViewDiv).toContainText('test blog test author')
      await expect(detailedViewDiv).toBeVisible()

      await page.getByRole('button', { name: 'like' }).click()

      await expect(detailedViewDiv).toContainText('likes 1')
    })

    test('A blog can be deleted', async ({ page }) => {
      await page.getByRole('button', { name: 'new blog' }).click()

      await page.getByTestId('title').fill('test blog')
      await page.getByTestId('author').fill('test author')
      await page.getByTestId('url').fill('test url')

      await page.getByRole('button', { name: 'create' }).click()

      const defaultViewDiv = await page.locator('.blogDefaultView')
      await expect(defaultViewDiv).toContainText('test blog test author')
    
      await page.getByRole('button', { name: 'view' }).click()
      
      page.on('dialog', async (dialog) => {
        await dialog.accept()
      })
      await page.getByRole('button', { name: 'remove' }).click()

      await expect(defaultViewDiv).not.toBeVisible()
    })

    // test('Only the user who created a blog can see the delete button', async ({ page }) => {
    //   await page.getByRole('button', { name: 'new blog' }).click()

    //   await page.getByTestId('title').fill('test blog')
    //   await page.getByTestId('author').fill('test author')
    //   await page.getByTestId('url').fill('test url')

    //   const defaultViewDiv = await page.locator('.blogDefaultView')
    //   await expect(defaultViewDiv).toContainText('test blog test author')

    //   await page.getByRole('button', { name: 'create' }).click()
    //   await page.getByRole('button', { name: 'view' }).click()
    //   page.on('dialog', async (dialog) => {
    //     await dialog.accept()
    //   })
    //   await page.getByRole('button', { name: 'remove' }).click()

    //   await expect(defaultViewDiv).not.toBeVisible()

    //   await page.getByRole('button', { name: 'logout' }).click()

    //   await page.getByTestId('username').fill('test2')
    //   await page.getByTestId('password').fill('test2')
    //   await page.getByRole('button', { name: 'login' }).click()

    //   await page.getByRole('button', { name: 'view' }).click()

    //   const detailedViewDiv = await page.locator('.blogDetailedView')
    //   await expect(detailedViewDiv).toContainText('test blog test author')
    //   await expect(detailedViewDiv).toBeVisible()

    //   await expect(detailedViewDiv).not.toContain('remove')
    // })

    test('blogs should be organized from most likes to least likes', async ({page,}) => {
      await page.getByRole('button', { name: 'new blog' }).click()

      await page.getByTestId('title').fill('a')
      await page.getByTestId('author').fill('test author')
      await page.getByTestId('url').fill('test url')

      await page.getByRole('button', { name: 'create' }).click()


      await page.getByRole('button', { name: 'new blog' }).click()

      await page.getByTestId('title').fill('b')
      await page.getByTestId('author').fill('test author')
      await page.getByTestId('url').fill('test url')

      await page.getByRole('button', { name: 'create' }).click()


      await page.getByRole('button', { name: 'new blog' }).click()

      await page.getByTestId('title').fill('c')
      await page.getByTestId('author').fill('test author')
      await page.getByTestId('url').fill('test url')

      await page.getByRole('button', { name: 'create' }).click()


      const blog1 = await page.locator('.blogDefaultView').first()
      const blog2 = await page.locator('.blogDefaultView').nth(1)
      const blog3 = await page.locator('.blogDefaultView').last()




      await blog1.getByRole('button', { name: 'view' }).click()
      await blog2.getByRole('button', { name: 'view' }).click()
      await blog3.getByRole('button', { name: 'view' }).click()

      await blog3.getByRole('button', { name: 'like' }).click()
      await blog3.getByRole('button', { name: 'like' }).click()
      await blog2.getByRole('button', { name: 'like' }).click()

      expect(blog3).toContainText('likes 2')
      expect(blog2).toContainText('likes 1')
      expect(blog1).toContainText('likes 0')

      expect(page.locator('.blog').first()).toContainText('c')
      expect(page.locator('.blog').nth(1)).toContainText('b')
      expect(page.locator('.blog').last()).toContainText('a')
    })


  })

})