import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { users } from '../fixtures/users';

test('Ajouter des produits au panier avec succès', async ({ page }) => {
  // 1. Bloquer les publicités Google pour éviter les crashs de rendu
  await page.route('**/*', (route) => {
    const url = route.request().url();
    if (/google|doubleclick|flashtalking|adnxs/.test(url)) {
      return route.abort();
    }
    return route.continue();
  });

  const loginPage = new LoginPage(page);

  // 2. Connexion
  await loginPage.goto();
  await loginPage.login(
    users.customer.email,
    users.customer.password
  );

  await page.goto('/');

  // 3. Ajouter le premier produit (Blue Top)
 
  await page.locator('.single-products').first().getByText('Add to cart').first().click();
  await page.getByRole('button', { name: 'Continue Shopping' }).click();

  // 4. Ajouter le deuxième produit (Men Tshirt)

  await page.locator('.single-products').nth(1).getByText('Add to cart').first().click();
  await page.getByRole('button', { name: 'Continue Shopping' }).click();

  // 5. Navigation et vérification du panier
  await page.getByRole('link', { name: 'Cart' }).first().click();

  await expect(page).toHaveURL(/\/view_cart/);
  await expect(page.locator('#cart_info_table tbody tr')).not.toHaveCount(0);
});