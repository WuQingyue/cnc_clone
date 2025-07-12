// cypress/e2e/components/NavHeader.cy.js
import NavHeader from '../../src/components/NavHeader/NavHeader.vue';

describe('NavHeader Component', () => {
  it('should render correctly (Appearance)', () => {
    cy.mount(NavHeader);
    // 检查 logo 是否显示
    cy.get('.logo img').should('be.visible');
    // 检查导航菜单项是否显示
    cy.get('.nav-menu .menu-item').should('have.length.greaterThan', 0);
  });

  it('should handle navigation correctly (Behavior)', () => {
    cy.mount(NavHeader);
    // 点击在线报价链接
    cy.get('.nav-menu .menu-item a:contains("在线报价")').click();
    // 可以在这里添加更多的断言，例如检查路由是否正确跳转
  });

  it('should be accessible (Accessibility)', () => {
    cy.mount(NavHeader);
    // 使用 Cypress-axe 插件进行无障碍检查
    cy.injectAxe();
    cy.checkA11y();
  });
});