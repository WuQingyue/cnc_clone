// cypress/e2e/components/Login.cy.js

// import cart from '@/components/Cart/cart.vue';
// import CompanyNews from '@/components/Home/CompanyNews.vue';
// import CustomerReviews from '@/components/Home/CustomerReviews.vue';
// import HomeBanner from '@/components/Home/HomeBanner.vue';
// import LogoDisplay from '@/components/Home/LogoDisplay.vue';
// import MaterialSupport from '@/components/Home/MaterialSupport.vue';
// import OrderProcess from '@/components/Home/OrderProcess.vue';
// import OurProcessDisplay from '@/components/Home/OurProcessDisplay.vue';
// import ProcessDisplay from '@/components/Home/ProcessDisplay.vue';
// import MaterialsIntroduction from '@/components/NavHeader/MaterialsIntroduction.vue';
// import NavHeader from '@/components/NavHeader/NavHeader.vue';
// import cncOrder from '@/components/Order/cncOrder.vue';
// import PaymentDialog from '@/components/Order/PaymentDialog.vue';
// import UnifiedPaymentCenter from '@/components/Order/UnifiedPaymentCenter.vue';
// import AddressEditDialog from '@/components/PriceInquiry/AddressEditDialog.vue';
// import ContactEditDialog from '@/components/PriceInquiry/ContactEditDialog.vue';
// import DeliveryInfo from '@/components/PriceInquiry/DeliveryInfo.vue';
// import DeliveryMethod from '@/components/PriceInquiry/DeliveryMethod.vue';
// import ExpressInfo from '@/components/PriceInquiry/ExpressInfo.vue';
// import OrderInfo from '@/components/PriceInquiry/OrderInfo.vue';
// import TotalInfo from '@/components/PriceInquiry/TotalInfo.vue';
// import FileList from '@/components/quote/FileList.vue';
// import FileUploader from '@/components/quote/FileUploader.vue';
// import HistoryList from '@/components/quote/HistoryList.vue';
// import ParameterInfo from '@/components/quote/ParameterInfo.vue';
// import AmountDialog from '@/components/SignIn/AmountDialog.vue';
// import DataDashboard from '@/components/SignIn/DataDashboard.vue';
// import LogisticsInfo from '@/components/SignIn/LogisticsInfo.vue';
// import ModelInfoDialog from '@/components/SignIn/ModelInfoDialog.vue';
// import SignInOrderInfo from '@/components/SignIn/OrderInfo.vue';
// import ProgressDialog from '@/components/SignIn/ProgressDialog.vue';
// import ShippingDialog from '@/components/SignIn/ShippingDialog.vue';
// import ShippingProgressDialog from '@/components/SignIn/ShippingProgressDialog.vue';
// import UserInfo from '@/components/SignIn/UserInfo.vue';
// import Register from '@/components/SignUp/Register.vue';
// import Footer from '@/components/Footer.vue';
// import Header from '@/components/Header.vue';
// import SubmitOrder from '@/views/Order/SubmitOrder.vue';
// import NotFound from '@/views/NotFound.vue';
// import App from '@/App.vue';

// 导入 Login 组件
import Login from '@/components/SignIn/Login.vue';

// describe() 移除了 .skip，测试将正常运行
describe('Login Component', () => {

  // --- 1. Appearance Tests --- 
  context('Appearance (Rendering)', () => {
    it('should display all required elements correctly', () => {
      cy.log('🚀 === 开始测试: 登录组件外观渲染 === 🚀');
      cy.mount(Login);

      cy.log('--- 🧪 测试项: Logo 图片 ---');
      cy.log('ACTION: 查找 class 为 .logo 的元素');
      cy.log('ASSERTION: 元素应在页面上可见');
      cy.get('.logo').should('be.visible');
      cy.log('✅ PASS: Logo 图片渲染正常');

      cy.log('--- 🧪 测试项: 主标题 "Sign In" ---');
      cy.log('ACTION: 查找包含 "Sign In" 文本的 h1 标签');
      cy.log('ASSERTION: 元素应在页面上可见');
      cy.contains('h1', 'Sign In').should('be.visible');
      cy.log('✅ PASS: 主标题渲染正常');

      cy.log('--- 🧪 测试项: 邮箱输入区域 ---');
      cy.log('ACTION: 查找 "Email" 标签和 email 输入框');
      cy.log('ASSERTION: 标签和输入框都应在页面上可见');
      cy.get('label').contains('Email').should('be.visible');
      cy.get('input[type="email"]').should('be.visible');
      cy.log('✅ PASS: 邮箱输入区域渲染正常');

      cy.log('--- 🧪 测试项: 密码输入区域 ---');
      cy.log('ACTION: 查找 "Password" 标签和 password 输入框');
      cy.log('ASSERTION: 标签和输入框都应在页面上可见');
      cy.get('label').contains('Password').should('be.visible');
      cy.get('input[type="password"]').should('be.visible');
      cy.log('✅ PASS: 密码输入区域渲染正常');

      cy.log('--- 🧪 测试项: "Sign In" 登录按钮 ---');
      cy.log('ACTION: 查找包含 "Sign In" 文本的 .login-btn 按钮');
      cy.log('ASSERTION: 按钮应在页面上可见');
      cy.get('.login-btn').contains('Sign In').should('be.visible');
      cy.log('✅ PASS: "Sign In" 按钮渲染正常');

      cy.log('--- 🧪 测试项: "Continue with Google" 按钮 ---');
      cy.log('ACTION: 查找包含 "Continue with Google" 文本的 .google-btn 按钮');
      cy.log('ASSERTION: 按钮应在页面上可见');
      cy.get('.google-btn').contains('Continue with Google').should('be.visible');
      cy.log('✅ PASS: Google 登录按钮渲染正常');
      
      cy.log('--- 🧪 测试项: "Sign up" 注册链接 ---');
      cy.log('ACTION: 查找包含 "Sign up" 文本的 .signup-link 区域');
      cy.log('ASSERTION: 链接应在页面上可见');
      cy.get('.signup-link').contains('Sign up').should('be.visible');
      cy.log('✅ PASS: 注册链接渲染正常');
      
      cy.log('🏁 === 结束测试: 登录组件外观渲染 === 🏁');
    });
  });

  // --- 2. Behavior Tests --- 
  context('Behavior (Interaction & Validation)', () => {
    beforeEach(() => {
      cy.mount(Login);
    });

    it('should allow typing into email and password fields', () => {
      const testEmail = 'test@example.com';
      const testPassword = 'password123';
      cy.log('🚀 === 开始测试: 输入功能 === 🚀');
      
      cy.log(`--- 🧪 测试项: 邮箱输入 ---`);
      cy.log(`ACTION: 在 email 输入框中输入 "${testEmail}"`);
      cy.get('input[type="email"]').type(testEmail);
      cy.log(`ASSERTION: 输入框的值应为 "${testEmail}"`);
      cy.get('input[type="email"]').should('have.value', testEmail);
      cy.log('✅ PASS: 邮箱输入功能正常');

      cy.log(`--- 🧪 测试项: 密码输入 ---`);
      cy.log(`ACTION: 在 password 输入框中输入 "${testPassword}"`);
      cy.get('input[type="password"]').type(testPassword);
      cy.log(`ASSERTION: 输入框的值应为 "${testPassword}"`);
      cy.get('input[type="password"]').should('have.value', testPassword);
      cy.log('✅ PASS: 密码输入功能正常');

      cy.log('🏁 === 结束测试: 输入功能 === 🏁');
    });

    it('should show validation errors for empty fields', () => {
        cy.log('🚀 === 开始测试: 空字段校验 === 🚀');
        cy.log('ACTION: 点击 "Sign In" 按钮 (不填写任何内容)');
        cy.get('.login-btn').click();

        cy.log('--- 🧪 测试项: 邮箱空值校验 ---');
        cy.log('ASSERTION: 应显示错误信息 "Please enter your email"');
        cy.contains('Please enter your email').should('be.visible');
        cy.log('✅ PASS: 邮箱空值校验信息显示正常');

        cy.log('--- 🧪 测试项: 密码空值校验 ---');
        cy.log('ASSERTION: 应显示错误信息 "Please enter your password"');
        cy.contains('Please enter your password').should('be.visible');
        cy.log('✅ PASS: 密码空值校验信息显示正常');
        
        cy.log('🏁 === 结束测试: 空字段校验 === 🏁');
    });

    it('should show validation error for an invalid email', () => {
        cy.log('🚀 === 开始测试: 无效邮箱格式校验 === 🚀');
        cy.get('input[type="email"]').type('not-an-email');
        cy.get('input[type="password"]').type('password123');
        cy.log('ACTION: 点击 "Sign In" 按钮');
        cy.get('.login-btn').click();
        
        cy.log('ASSERTION: 应显示错误信息 "Please enter a valid email"');
        cy.contains('Please enter a valid email').should('be.visible');
        cy.log('✅ PASS: 无效邮箱格式校验信息显示正常');
        cy.log('🏁 === 结束测试: 无效邮箱格式校验 === 🏁');
    });

    it('should show validation error for a short password', () => {
        cy.log('🚀 === 开始测试: 密码过短校验 === 🚀');
        cy.get('input[type="email"]').type('test@example.com');
        cy.get('input[type="password"]').type('123');
        cy.log('ACTION: 点击 "Sign In" 按钮');
        cy.get('.login-btn').click();
        
        cy.log('ASSERTION: 应显示错误信息 "Password must be 8-32 characters"');
        cy.contains('Password must be 8-32 characters').should('be.visible');
        cy.log('✅ PASS: 密码过短校验信息显示正常');
        cy.log('🏁 === 结束测试: 密码过短校验 === 🏁');
    });

    it('should handle successful email login', () => {
      cy.log('🚀 === 开始测试: 邮箱登录成功场景 === 🚀');
      
      const userCredentials = { email: 'test@example.com', password: 'a-valid-password' };

      cy.log('--- 模拟后端API ---');
      cy.log('ACTION: 拦截 POST /api/login/email/login 请求');
      cy.intercept('POST', '/api/login/email/login', (req) => {
        cy.log('➡️ INTERCEPTED: API 请求 /api/login/email/login');
        // 将请求体打印到日志中
        cy.log('Request Body:', req.body);
        // 断言请求体是否正确
        expect(req.body).to.deep.equal(userCredentials);
        // 回复一个成功的响应
        req.reply({ statusCode: 200, body: { message: 'Login successful' } });
      }).as('emailLogin');

      cy.log('ACTION: 拦截 GET /api/login/check_login 请求');
      cy.intercept('GET', '/api/login/check_login', { statusCode: 200, body: { id: 1, name: 'Test User', email: 'test@example.com' } }).as('checkLogin');

      cy.log('--- 用户操作 ---');
      cy.log(`ACTION: 输入邮箱 "${userCredentials.email}"`);
      cy.get('input[type="email"]').type(userCredentials.email);
      cy.log(`ACTION: 输入密码`);
      cy.get('input[type="password"]').type(userCredentials.password);
      cy.log('ACTION: 点击 "Sign In" 按钮');
      cy.get('.login-btn').click();

      cy.log('--- 验证API调用和响应 ---');
      cy.log('ACTION: 等待 @emailLogin 拦截');
      cy.wait('@emailLogin').then((interception) => {
          cy.log('⬅️ RESPONSE: API 响应 /api/login/email/login');
          cy.log('Response Status:', interception.response.statusCode);
          cy.log('Response Body:', interception.response.body);
          assert.isNotNull(interception.response.body, 'API response should not be null');
      });

      cy.log('ACTION: 等待 @checkLogin 拦截');
       cy.wait('@checkLogin').then((interception) => {
          cy.log('⬅️ RESPONSE: API 响应 /api/login/check_login');
          cy.log('Response Status:', interception.response.statusCode);
          cy.log('Response Body:', interception.response.body);
          assert.isNotNull(interception.response.body, 'API response should not be null');
      });

      cy.log('--- 验证UI反馈 ---');
      cy.log('ASSERTION: 应显示成功消息 "登录成功！"');
      cy.get('.el-message--success').should('contain', '登录成功！');
      cy.log('✅ PASS: 登录成功消息显示正常');
      cy.log('🏁 === 结束测试: 邮箱登录成功场景 === 🏁');
    });

    it('should handle failed email login', () => {
      cy.log('🚀 === 开始测试: 邮箱登录失败场景 === 🚀');
      
      const userCredentials = { email: 'wrong@example.com', password: 'wrong-password' };
      const errorResponse = { detail: 'Invalid credentials' };

      cy.log('--- 模拟后端API ---');
      cy.log('ACTION: 拦截 POST /api/login/email/login 请求，并返回401错误');
      cy.intercept('POST', '/api/login/email/login', (req) => {
        cy.log('➡️ INTERCEPTED: API 请求 /api/login/email/login');
        cy.log('Request Body:', req.body);
        expect(req.body).to.deep.equal(userCredentials);
        req.reply({ statusCode: 401, body: errorResponse });
      }).as('emailLogin');

      cy.log('--- 用户操作 ---');
      cy.get('input[type="email"]').type(userCredentials.email);
      cy.get('input[type="password"]').type(userCredentials.password);
      cy.get('.login-btn').click();

      cy.log('--- 验证API调用和响应 ---');
      cy.log('ACTION: 等待 @emailLogin 拦截');
      cy.wait('@emailLogin').then((interception) => {
        cy.log('⬅️ RESPONSE: API 响应 /api/login/email/login');
        cy.log('Response Status:', interception.response.statusCode);
        cy.log('Response Body:', interception.response.body);
        expect(interception.response.statusCode).to.equal(401);
      });

      cy.log('--- 验证UI反馈 ---');
      cy.log(`ASSERTION: 应显示错误消息 "${errorResponse.detail}"`);
      cy.get('.el-message--error').should('contain', errorResponse.detail);
      cy.log('✅ PASS: 登录失败错误消息显示正常');

      cy.log('ASSERTION: 登录按钮的加载状态应被移除');
      cy.get('.login-btn').should('not.have.class', 'is-loading');
      cy.log('✅ PASS: 按钮加载状态已重置');
      cy.log('🏁 === 结束测试: 邮箱登录失败场景 === 🏁');
    });

    it('should redirect to Google auth URL on Google login click', () => {
      cy.log('🚀 === 开始测试: Google 登录跳转 === 🚀');
      const googleAuthUrl = 'https://accounts.google.com/o/oauth2/v2/auth?client_id=...';
      
      cy.log('--- 模拟后端API ---');
      cy.log('ACTION: 拦截 GET /api/login/login 请求，返回 Google 授权 URL');
      cy.intercept('GET', '/api/login/login', { success: true, auth_url: googleAuthUrl }).as('getGoogleUrl');

      cy.log('--- 模拟 Window 跳转 ---');
      cy.log('ACTION: 监听 window.location.href 的改变');
      cy.window().then((win) => {
        cy.stub(win.location, 'href').as('windowRedirect');
      });

      cy.log('--- 用户操作 ---');
      cy.log('ACTION: 点击 "Continue with Google" 按钮');
      cy.get('.google-btn').click();

      cy.log('--- 验证API调用和响应 ---');
       cy.wait('@getGoogleUrl').then((interception) => {
        cy.log('⬅️ RESPONSE: API 响应 /api/login/login');
        cy.log('Response Body:', interception.response.body);
        expect(interception.response.body.auth_url).to.equal(googleAuthUrl);
      });

      cy.log('--- 验证页面跳转 ---');
      cy.log(`ASSERTION: window.location.href 应被调用，参数为 "${googleAuthUrl}"`);
      cy.get('@windowRedirect').should('be.calledWith', googleAuthUrl);
      cy.log('✅ PASS: 页面已准备好跳转至 Google 授权页');
      cy.log('🏁 === 结束测试: Google 登录跳转 === 🏁');
    });
  });

  // --- 3. Accessibility Tests --- 
  context('Accessibility (A11y)', () => {
    it('should pass automated accessibility checks', () => {
      cy.log('🚀 === 开始测试: 可访问性 (A11y) === 🚀');
      cy.mount(Login);
      
      cy.log('ACTION: 注入 cypress-axe 工具');
      cy.injectAxe();
      
      cy.log('ACTION: 执行全页面可访问性扫描');
      cy.checkA11y(); // 此命令会在日志中详细列出任何违规项
      
      cy.log('✅ PASS: 可访问性检查通过');
      cy.log('🏁 === 结束测试: 可访问性 (A11y) === 🏁');
    });
  });
});
