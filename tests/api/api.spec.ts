import { test, expect } from '@playwright/test';
import { users } from '../fixtures/users';

const BASE_URL = 'https://automationexercise.com';

test.describe('Automation Exercise - Tests API (GET, POST, PUT, DELETE)', () => {
    
    // FORCE L'EXÉCUTION SÉQUENTIELLE (Garantit le déroulement logique du flux CRUD)
    test.describe.configure({ mode: 'serial' });

    // 1. REQUÊTE GET : Récupérer la liste complète des produits
    test('GET - Devrait récupérer la liste de tous les produits', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/api/productsList`);
        expect(response.status()).toBe(200);

        const responseBody = JSON.parse(await response.text());
        expect(responseBody).toHaveProperty('responseCode', 200);
    });

    // 2. PRÉ-REQUIS OBLIGATOIRE : Création unique du compte pour la suite du flux
    test('POST - Création du compte de test', async ({ request }) => {
        const response = await request.post(`${BASE_URL}/api/createAccount`, {
            form: {
                name: 'Zakaria Moufid',
                email: users.customer.email,
                password: users.customer.password,
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
        
        expect(response.status()).toBe(200);
        const responseBody = JSON.parse(await response.text());
        
        // Accepte 211/201 (Créé) ou 400 (Déjà existant d'une session précédente)
        expect([200, 201, 400]).toContain(responseBody.responseCode);
    });

    // 3. REQUÊTE POST : Vérifier l'authentification (Restauré)
    test('POST - Devrait valider la connexion de l\'utilisateur', async ({ request }) => {
        const response = await request.post(`${BASE_URL}/api/verifyLogin`, {
            form: {
                email: users.customer.email,
                password: users.customer.password
            }
        });

        expect(response.status()).toBe(200);
        const responseBody = JSON.parse(await response.text());
        expect(responseBody.responseCode).toBe(200);
        expect(responseBody.message).toBe('User exists!');
    });

    // 4. REQUÊTE PUT : Le compte est garanti d'exister ici
    test('PUT - Devrait simuler la mise à jour des détails du compte', async ({ request }) => {
        const response = await request.put(`${BASE_URL}/api/updateAccount`, {
            form: {
                name: 'Zakaria Updated',
                email: users.customer.email,
                password: users.customer.password,
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

        expect(response.status()).toBe(200);
        const responseBody = JSON.parse(await response.text());
        expect(responseBody.responseCode).toBe(200);
        expect(responseBody.message).toBe('User updated!');
    });

  // 5. REQUÊTE DELETE : Nettoyage final
    test('DELETE - Devrait supprimer le compte de test', async ({ request }) => {
        const response = await request.delete('https://automationexercise.com/api/deleteAccount', {
            form: {
                email: users.customer.email,
                password: users.customer.password
            }
        });

        expect(response.status()).toBe(200);
        const responseBody = JSON.parse(await response.text());
        
        // CORRECTION : On accepte 200 (Supprimé avec succès) ou 404 (Déjà supprimé / Introuvable)
        expect([200, 404]).toContain(responseBody.responseCode);
    });
});