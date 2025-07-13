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
// import Footer from '@/components/Footer.vue';
// import Header from '@/components/Header.vue';
// import SubmitOrder from '@/views/Order/SubmitOrder.vue';
// import NotFound from '@/views/NotFound.vue';
// import App from '@/App.vue';

// components.cy.js

// 导入需要的模块
import { createPinia } from 'pinia';
import { mount } from 'cypress/vue';
import 'cypress-axe';
import Login from '@/components/SignIn/Login.vue';

// 注册 mount 命令 (保持不变)
Cypress.Commands.add('mount', mount, { overwrite: true });

// describe 描述一个测试套件
describe('登录组件 (Login Component)', () => {

  // --- 1. 外观测试 ---
  context('外观 (渲染)', () => {
    it('应正确显示所有必要的元素', () => {
      // 在这里挂载组件，因为它需要 Pinia，我们在这里提供它
      cy.mount(Login, {
        global: {
          plugins: [createPinia()],
        },
      });

      // 断言部分保持不变
      cy.get('.logo').should('be.visible');
      cy.contains('h1', 'Sign In').should('be.visible');
      cy.get('label').contains('Email').should('be.visible');
      cy.get('input[type="email"]').should('be.visible');
      cy.get('label').contains('Password').should('be.visible');
      cy.get('input[type="password"]').should('be.visible');
      cy.get('.login-btn').contains('Sign In').should('be.visible');
      cy.get('.google-btn').contains('Continue with Google').should('be.visible');
      cy.get('.signup-link').contains('Sign up').should('be.visible');
    });
  });

  // --- 2. 行为测试 ---
  context('行为 (交互与验证)', () => {
    // 这个 beforeEach 会在下面的每一个 "it" 测试前运行
    beforeEach(() => {
      // 因为本组的所有测试都需要一个已挂载的组件，所以我们在这里统一挂载并提供 Pinia
      cy.mount(Login, {
        global: {
          plugins: [createPinia()],
        },
      });
    });

    // 以下所有测试用例都无需再关心挂载问题，直接进行交互和断言
    it('应允许在邮箱和密码输入框中输入内容', () => {
      cy.get('input[type="email"]').type('test@example.com').should('have.value', 'test@example.com');
      cy.get('input[type="password"]').type('password123').should('have.value', 'password123');
    });

    it('应对未填写的字段显示校验错误信息', () => {
      cy.get('.login-btn').click();
      cy.contains('Please enter your email').should('be.visible');
      cy.contains('Please enter your password').should('be.visible');
    });

    it('应对无效的邮箱地址显示校验错误信息', () => {
      cy.get('input[type="email"]').type('not-an-email');
      cy.get('input[type="password"]').type('password123');
      cy.get('.login-btn').click();
      cy.contains('Please enter a valid email').should('be.visible');
    });

    it('应对过短的密码显示校验错误信息', () => {
      cy.get('input[type="email"]').type('test@example.com');
      cy.get('input[type="password"]').type('123');
      cy.get('.login-btn').click();
      cy.contains('Password must be 8-32 characters').should('be.visible');
    });

    it('应能处理邮箱登录成功的情况', () => {
      cy.intercept('POST', '/api/login/email/login', { statusCode: 200, body: { message: 'Login successful' } }).as('emailLogin');
      cy.intercept('GET', '/api/login/check_login', { statusCode: 200, body: { id: 1, name: 'Test User', email: 'test@example.com' } }).as('checkLogin');

      cy.get('input[type="email"]').type('test@example.com');
      cy.get('input[type="password"]').type('a-valid-password');
      cy.get('.login-btn').click();

      cy.wait('@emailLogin');
      cy.wait('@checkLogin');
      cy.get('.el-message--success').should('contain', '登录成功！');
    });

    it('应能处理邮箱登录失败的情况', () => {
      cy.intercept('POST', '/api/login/email/login', { statusCode: 401, body: { detail: 'Invalid credentials' } }).as('emailLogin');
      cy.get('input[type="email"]').type('wrong@example.com');
      cy.get('input[type="password"]').type('wrong-password');
      cy.get('.login-btn').click();

      cy.wait('@emailLogin');
      cy.get('.el-message--error').should('contain', 'Invalid credentials');
      cy.get('.login-btn').should('not.have.class', 'is-loading');
    });

    it('点击 Google 登录按钮时应重定向到 Google 授权 URL', () => {
      const googleAuthUrl = 'https://accounts.google.com/o/oauth2/v2/auth?client_id=...';
      cy.intercept('GET', '/api/login/login', { success: true, auth_url: googleAuthUrl }).as('getGoogleUrl');

      cy.window().then((win) => {
        cy.stub(win.location, 'href').as('windowRedirect');
      });

      cy.get('.google-btn').click();
      cy.wait('@getGoogleUrl');
      cy.get('@windowRedirect').should('be.calledWith', googleAuthUrl);
    });
  });

  context('导航测试', () => {
    it('点击 “注册” 链接应导航至注册页面', () => {
      const pushSpy = cy.spy().as('routerPush');

      // 这个测试除了 Pinia，还需要一个特殊的路由模拟 ($router)
      // 所以我们在这里单独挂载，并提供所有需要的依赖
      cy.mount(Login, {
        global: {
          plugins: [createPinia()], // 提供 Pinia
          mocks: {
            $router: { // 提供路由模拟
              push: pushSpy,
            },
          },
        },
      });

      cy.get('.signup-link').contains('Sign up').click();
      cy.get('@routerPush').should('have.been.calledWith', '/signup');
    });
  });


  // --- 3. 可访问性测试 ---
  context('可访问性 (A11y)', () => {
    it('应通过自动化的可访问性检查', () => {
      // 这个测试也需要一个能正常渲染的组件，所以也要提供 Pinia
      cy.mount(Login, {
        global: {
          plugins: [createPinia()],
        },
      });

      cy.injectAxe();
      cy.checkA11y();
    });
  });
});

// 导入注册组件
// import Register from '@/components/SignUp/Register.vue';
// describe('Register Component', () => {

//   // --- 1. 外观测试 (Appearance Tests) ---
//   context('Appearance (Rendering)', () => {
//     it('应该正确显示所有必需的元素', () => {
//       // 挂载组件
//       cy.mount(Register);

//       // 使用 data-cy 属性是更健壮的选择，这里我用类名或标签来演示
//       // 检查 Logo
//       cy.get('.logo').should('be.visible');

//       // 检查标题
//       cy.contains('h1', 'Sign Up').should('be.visible');

//       // 检查表单字段
//       cy.get('label').contains('First name').should('be.visible');
//       cy.get('input[type="text"]').eq(0).should('be.visible'); // 第一个文本输入框为 First name

//       cy.get('label').contains('Last name').should('be.visible');
//       cy.get('input[type="text"]').eq(1).should('be.visible'); // 第二个文本输入框为 Last name

//       cy.get('label').contains('Email').should('be.visible');
//       cy.get('input[type="email"]').should('be.visible');

//       cy.get('label').contains('Password').should('be.visible');
//       cy.get('input[type="password"]').should('be.visible');

//       // 检查按钮和链接
//       cy.get('.continue-btn').contains('Continue').should('be.visible');
//       cy.get('.google-btn').contains('Continue with Google').should('be.visible');
//       cy.get('.signin-link').contains('Sign in').should('be.visible');
//     });
//   });


//   // --- 2. 行为测试 (Behavior Tests) ---
//   context('Behavior (Interaction & Validation)', () => {
//     beforeEach(() => {
//       // 在每个测试前挂载组件
//       cy.mount(Register);
//     });

//     it('应该允许在所有输入框中输入内容', () => {
//       cy.get('label:contains("First name") + .el-form-item__content input').type('John').should('have.value', 'John');
//       cy.get('label:contains("Last name") + .el-form-item__content input').type('Doe').should('have.value', 'Doe');
//       cy.get('input[type="email"]').type('john.doe@example.com').should('have.value', 'john.doe@example.com');
//       cy.get('input[type="password"]').type('password123').should('have.value', 'password123');
//     });

//     it('应该对空字段显示验证错误', () => {
//       cy.get('.continue-btn').click();
//       cy.contains('Please enter your first name').should('be.visible');
//       cy.contains('Please enter your last name').should('be.visible');
//       cy.contains('Please enter your email').should('be.visible');
//       cy.contains('Please enter your password').should('be.visible');
//     });

//     it('应该对无效的电子邮件显示验证错误', () => {
//       cy.get('label:contains("First name") + .el-form-item__content input').type('John');
//       cy.get('label:contains("Last name") + .el-form-item__content input').type('Doe');
//       cy.get('input[type="email"]').type('not-a-valid-email');
//       cy.get('input[type="password"]').type('password123');
//       cy.get('.continue-btn').click();
//       cy.contains('Please enter a valid email').should('be.visible');
//     });

//     it('应该对过短的密码显示验证错误', () => {
//       cy.get('label:contains("First name") + .el-form-item__content input').type('John');
//       cy.get('label:contains("Last name") + .el-form-item__content input').type('Doe');
//       cy.get('input[type="email"]').type('john.doe@example.com');
//       cy.get('input[type="password"]').type('123');
//       cy.get('.continue-btn').click();
//       cy.contains('Password must be 8-32 characters').should('be.visible');
//     });

//     it('应该成功处理注册并跳转', () => {
//       // 拦截注册 API 请求
//       cy.intercept('POST', '/api/login/register', {
//         statusCode: 200,
//         body: { data: { success: true } }
//       }).as('registerRequest');

//       // 填充表单
//       cy.get('label:contains("First name") + .el-form-item__content input').type('Test');
//       cy.get('label:contains("Last name") + .el-form-item__content input').type('User');
//       cy.get('input[type="email"]').type('test.user@example.com');
//       cy.get('input[type="password"]').type('a-secure-password');

//       // 点击继续按钮
//       cy.get('.continue-btn').click();

//       // 等待 API 请求完成
//       cy.wait('@registerRequest').then((interception) => {
//         // 断言请求体是否正确
//         expect(interception.request.body.email).to.equal('test.user@example.com');
//         expect(interception.request.body.firstname).to.equal('Test');
//       });

//       // 断言成功消息
//       cy.get('.el-message--success').should('contain', '注册成功！');

//       // 注意：由于组件内部使用了 vue-router 的 router.push，
//       // Cypress 组件测试默认不会执行真正的页面跳转，
//       // 但我们可以断言成功消息来确认注册逻辑已成功触发。
//     });
    
//     it('应该在注册失败时处理错误', () => {
//        // 拦截一个失败的注册请求 (例如，邮箱已存在)
//       cy.intercept('POST', '/api/login/register', {
//         statusCode: 409, // 409 Conflict 是一个合适的代码
//         body: { detail: 'Email already exists' }
//       }).as('registerFail');

//       // 填充表单
//       cy.get('label:contains("First name") + .el-form-item__content input').type('Existing');
//       cy.get('label:contains("Last name") + .el-form-item__content input').type('User');
//       cy.get('input[type="email"]').type('existing@example.com');
//       cy.get('input[type="password"]').type('any-password-will-do');

//       // 点击继续
//       cy.get('.continue-btn').click();
      
//       cy.wait('@registerFail');

//       // 在当前组件实现中，错误只打印到控制台，没有UI提示。
//       // 所以我们断言没有出现成功消息，且页面没有跳转。
//       cy.get('.el-message--success').should('not.exist');
//       cy.get('h1').contains('Sign Up').should('be.visible'); // 确认仍在注册页
//     });

//     it('点击谷歌注册时应该尝试页面跳转', () => {
//       // 监视 window.location.href 的变化
//       cy.window().then((win) => {
//         cy.stub(win.location, 'href').as('windowRedirect');
//       });

//       // 点击谷歌按钮
//       cy.get('.google-btn').click();

//       // 断言 window.location.href 是否被以正确的URL调用
//       cy.get('@windowRedirect').should('be.calledWith', '/api/login/login');
//     });
//   });


//   // --- 3. 可访问性测试 (Accessibility Tests) ---
//   context('Accessibility (A11y)', () => {
//     it('应该通过自动化的可访问性检查', () => {
//       // 挂载组件
//       cy.mount(Register);
//       // 注入 axe-core 库
//       cy.injectAxe();
//       // 在整个组件上运行可访问性检查
//       cy.checkA11y();
//     });
//   });
// });