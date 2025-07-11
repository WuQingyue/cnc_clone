// cypress/e2e/routing.cy.js

describe('Frontend Routing Test for cnc.tongtron.com', () => {
  // 定义网站的基础 URL
  const baseUrl = 'https://cnc.tongtron.com';

  // 定义所有需要测试的路由
  const routes = [
    '/',
    '/products',
    '/about',
    '/contact',
    '/login',
    // ... 在这里添加更多你的路由
  ];

  // 遍历路由数组，为每个路由创建一个测试用例
  routes.forEach((route) => {
    it(`should successfully load the page for route: ${route}`, () => {
      // 访问完整的 URL
      cy.visit(`${baseUrl}${route}`);

      // 断言：检查页面是否包含一个关键元素，以确认页面加载成功
      // 例如，检查每个页面都有一个 <h1> 标签
      // 你可以根据每个页面的实际内容修改这个断言，让它更精确
      cy.get('body').should('be.visible'); // 一个通用的检查，确保 body 标签存在且可见
      // cy.get('h1').should('exist'); // 一个更具体的检查
    });
  });

  // 你也可以添加一个测试来确保一个不存在的页面会显示404
  it('should show a 404 page for a non-existent route', () => {
      // 访问一个不存在的页面，并禁止Cypress因404状态码而失败
      cy.visit(`${baseUrl}/this-page-does-not-exist`, { failOnStatusCode: false });
      
      // 断言页面上包含 "404" 或 "页面未找到" 的文本
      cy.contains('404|Not Found|页面未找到').should('be.visible');
  });
});