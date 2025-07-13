describe('Login Page E2E Test', () => {
    beforeEach(() => {
      // 在每个测试前，拦截 API 请求并提供 mock 数据
      // 这能让测试独立于后端服务，更加稳定快速
      cy.intercept('POST', '/api/login/email/login', {
        statusCode: 200,
        body: { message: 'Login successful' },
      }).as('emailLogin')
  
      cy.intercept('GET', '/api/login/check_login', {
        statusCode: 200,
        body: { id: '123', name: 'Cypress User', email: 'test@cypress.io' },
      }).as('checkLogin')
  
      // 访问登录页面
      cy.visit('/login') // 假设你的登录页路由是 /login
    })
  
    it('displays an error for invalid credentials', () => {
      // 拦截一个失败的登录请求
      cy.intercept('POST', '/api/login/email/login', {
        statusCode: 401,
        body: { detail: '无效的凭证' },
      }).as('failedLogin')
  
      cy.get('input[type="email"]').type('wrong@email.com')
      cy.get('input[type="password"]').type('wrongpassword')
      cy.get('.login-btn').click()
  
      // 断言看到了错误消息
      cy.get('.el-message--error').should('be.visible').and('contain', '无效的凭证')
    })
  
    it('successfully logs in a user and redirects to the homepage', () => {
      // 1. 找到 email 输入框，输入文本
      cy.get('input[type="email"]').type('test@cypress.io')
  
      // 2. 找到 password 输入框，输入文本
      cy.get('input[type="password"]').type('password123')
  
      // 3. 找到登录按钮并点击
      cy.get('.login-btn').click()
  
      // 4. 等待登录 API 和检查登录 API 调用完成
      cy.wait('@emailLogin')
      cy.wait('@checkLogin')
  
      // 5. 验证是否已重定向到主页
      cy.url().should('include', '/') // 验证 URL 是否变为网站根目录
      cy.contains('h1', 'Welcome Cypress User').should('be.visible') // 假设主页有一个欢迎标题
    })
  
    it('redirects to the registration page when "Sign up" is clicked', () => {
      cy.get('.signup-link a').click()
      cy.url().should('include', '/register')
    })
  })