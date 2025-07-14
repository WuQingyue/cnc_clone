// cypress/e2e/login.cy.js

describe('Login Page E2E Test', () => {
    beforeEach(() => {
      // 访问登录页面
      cy.visit('/login');
    });
  
    it('displays an error for invalid credentials', () => {
      cy.get('input[type="email"]').type('invalid@example.com');
      cy.get('input[type="password"]').type('wrongpassword');
      cy.get('.login-btn').click();
  
      // 拦截登录请求，确保失败响应已收到
      cy.intercept('POST', '/api/login/email/login').as('emailLoginFailed');
      cy.wait('@emailLoginFailed');
  
      // 断言 Element Plus 错误消息框的可见性和内容
      // ElMessage 错误消息通常会有一个 .el-message--error 类
      cy.get('.el-message--error')
        .should('be.visible')
        .and('contain', '登录失败，请重试'); // 确保与您的后端实际返回的错误消息匹配
  
      // 确保用户仍然在登录页面
      cy.url().should('include', '/login');
    });
  
    it('successfully logs in a user and redirects to the homepage', () => {
      const email = 'test@example.com';
      const password = 'password123';
  
      // 拦截登录和检查登录的 API 请求
      cy.intercept('POST', '/api/login/email/login').as('emailLogin');
      cy.intercept('GET', '/api/login/check_login').as('checkLogin');
  
      // 输入凭据并点击登录按钮
      cy.get('input[type="email"]').type(email);
      cy.get('input[type="password"]').type(password);
      cy.get('.login-btn').click();
  
      // 等待登录请求完成并成功
      cy.wait('@emailLogin').its('response.statusCode').should('eq', 200);
      // 等待检查登录状态的请求完成并成功，这通常发生在登录成功后，用于获取用户信息
      cy.wait('@checkLogin').its('response.statusCode').should('eq', 200);
  
      // *** 核心修改：断言 ElMessage.success 弹窗 ***
      // ElMessage 成功消息通常会有一个 .el-message--success 类
      cy.get('.el-message--success')
        .should('be.visible') // 确保消息是可见的
        .and('contain', '登录成功！'); // 断言消息内容是 '登录成功！'
  
      // 可以选择在断言消息后，等待消息自动消失（ElMessage 默认3秒后消失）
      // cy.get('.el-message--success', { timeout: 4000 }).should('not.exist');
  
  
      // 断言 URL 已更改到主页
      cy.url().should('eq', Cypress.config().baseUrl + '/'); // 假设主页路径就是根路径 '/'
  
      // 断言首页上可见的特定内容，例如 LogoDisplay 组件中的标题
      // 根据您提供的 Home.vue 和 LogoDisplay.vue，首页的 <h1> 标签内容是“奢侈品金属件定制”
      cy.get('h1.showcase-title').should('be.visible').and('contain', '奢侈品金属件定制');
  
      // 如果还有其他指示用户登录成功的元素，也可以在此处添加断言，例如：
      // cy.get('.user-display-name').should('contain', 'Cypress User');
      // cy.get('[data-cy="logout-button"]').should('be.visible');
    });
  
    it('redirects to the registration page when "Sign up" is clicked', () => {
      // 点击“Sign up”链接
      // 根据您的 Login.vue 代码，router-link 外部没有特定的 class，但它在 .signup-link 内部
      cy.get('.signup-link a').click();
  
      // 断言 URL 已更改到注册页面
      cy.url().should('include', '/register');
  
      // 断言注册页面包含预期的文本，例如标题
      cy.contains('Sign Up').should('be.visible'); // 假设注册页面有一个 'Sign Up' 标题
    });
  });