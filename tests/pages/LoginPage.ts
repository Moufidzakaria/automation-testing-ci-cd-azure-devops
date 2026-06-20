import { Page } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('https://automationexercise.com/login');
  }

  async login(email: string, password: string) {
    // Utilisation des sélecteurs sémantiques recommandés par Playwright
    await this.page.getByTestId('login-email').fill(email);
    await this.page.getByTestId('login-password').fill(password);
    await this.page.getByTestId('login-button').click();
  }
}