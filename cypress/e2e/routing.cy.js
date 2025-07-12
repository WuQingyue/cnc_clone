// cypress/e2e/routing.cy.js

describe('Frontend Routing Test for cnc.tongtron.com', () => {
  // 定义网站的基础 URL
  const baseUrl = 'https://cnc.tongtron.com';

  // 定义所有需要测试的静态路由
  // 动态路由 (如 /material/:materialId) 和 404 路由需要单独测试
  const routes = [
    '/',
    '/news',
    '/about',
    '/contact',
    '/service-guidance',
    '/quote',
    '/sales-promotion',
    '/materials',
    '/user-evaluation',
    '/technical-column',
    '/forum',
    '/register',
    '/login',
    '/cart',
    '/admin',
    '/members',
    '/guidance',
    '/price-inquiry',
    '/submitOrderSuccess',
    '/cnc_order',
    '/cnc_paid_order',
    '/unified-payment'
  ];

  // 遍历路由数组，为每个路由创建一个测试用例
  routes.forEach((route) => {
    it(`should successfully load the page for route: ${route}`, () => {
      // 访问完整的 URL
      cy.visit(`${baseUrl}${route}`);

      // 通用断言：检查页面是否崩溃，body是否可见
      cy.get('body').should('be.visible');

      // 增强断言：检查页面标题是否被正确设置
      // 注意：这要求你的Vue Router配置中为每个路由都设置了meta.title
      cy.title().should('not.be.empty').and('include', 'SmartCNC');
    });
  });

  // 单独测试 404 页面
  it('should show a 404 page for a non-existent route', () => {
      // 访问一个不存在的页面，并禁止Cypress因404状态码而失败
      cy.visit(`${baseUrl}/this-page-does-not-exist-for-sure`, { failOnStatusCode: false });
      
      // 断言页面上包含 "页面未找到" 的文本，或者检查404页面的特定组件/元素
      cy.contains('页面未找到').should('be.visible');
  });

});