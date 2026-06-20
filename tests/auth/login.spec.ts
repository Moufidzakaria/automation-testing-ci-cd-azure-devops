import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

// Définition d'identifiants dédiés à Automation Exercise pour éviter les conflits de fixtures
const TEST_USER = {
  email: 'zakaria.test.automation@example.com',
  password: 'SecurePassword123'
};

test.describe('Authentification - Automation Exercise', () => {

  test.beforeEach(async ({ request }) => {
    // Data Seeding : Création systématique du compte dédié avant le test UI
    await request.post('https://automationexercise.com/api/createAccount', {
      form: {
          name: 'Zakaria Moufid',
          email: TEST_USER.email,
          password: TEST_USER.password,
          title: 'Mr',
          birth_date: '20',
          birth_month: '06',
          birth_year: '1995',
          firstname: 'Zakaria',
          lastname: 'Moufid',
          company: 'Freelance',
          address1: 'Casablanca, Morocco',
          country: 'Morocco',
          zipcode: '20000',
          state: 'Casablanca-Settat',
          city: 'Casablanca',
          mobile_number: '+212600000000'
      }
    });
  });

  test('Login Success', async ({ page }, testInfo) => {
    // Interception des scripts publicitaires intrusifs pour stabiliser le test
    await page.route('**/*', (route) => {
      const url = route.request().url();
      if (/google|doubleclick|flashtalking|adnxs/.test(url)) {
        return route.abort();
      }
      return route.continue();
    });

    const loginPage = new LoginPage(page);

    await loginPage.goto();
    
    // Connexion avec les identifiants garantis d'exister sur cette plateforme
    await loginPage.login(
      TEST_USER.email,
      TEST_USER.password
    );

    // Capture d'écran de l'état connecté
    await page.screenshot({ 
      path: `test-results/screenshots/login-success-${testInfo.project.name}.png`, 
      fullPage: true 
    });

    // Validation du statut connecté
    await expect(page.getByText(/Logged in as/i)).toBeVisible();
  });
});