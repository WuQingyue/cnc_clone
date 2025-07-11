// cypress/e2e/routing.cy.js

describe('Frontend Routing Test for cnc.tongtron.com', () => {
    const baseUrl = 'https://cnc.tongtron.com';
    const routes = [
      '/',
      '/products',
      '/about',
      '/contact',
      '/login',
      // ... 在这里添加更多你的路由
    ];
  
    routes.forEach((route) => {
      it(`should successfully load the page for route: ${route}`, () => {
        cy.visit(`${baseUrl}${route}`);
        cy.get('body').should('be.visible');
      });
    });
  });