// cypress/e2e/components/Login.cy.js

import cart from '@/components/Cart/cart.vue';
import CompanyNews from '@/components/Home/CompanyNews.vue';
import CustomerReviews from '@/components/Home/CustomerReviews.vue';
import HomeBanner from '@/components/Home/HomeBanner.vue';
import LogoDisplay from '@/components/Home/LogoDisplay.vue';
import MaterialSupport from '@/components/Home/MaterialSupport.vue';
import OrderProcess from '@/components/Home/OrderProcess.vue';
import OurProcessDisplay from '@/components/Home/OurProcessDisplay.vue';
import ProcessDisplay from '@/components/Home/ProcessDisplay.vue';
import MaterialsIntroduction from '@/components/NavHeader/MaterialsIntroduction.vue';
import NavHeader from '@/components/NavHeader/NavHeader.vue';
import cncOrder from '@/components/Order/cncOrder.vue';
import PaymentDialog from '@/components/Order/PaymentDialog.vue';
import UnifiedPaymentCenter from '@/components/Order/UnifiedPaymentCenter.vue';
import AddressEditDialog from '@/components/PriceInquiry/AddressEditDialog.vue';
import ContactEditDialog from '@/components/PriceInquiry/ContactEditDialog.vue';
import DeliveryInfo from '@/components/PriceInquiry/DeliveryInfo.vue';
import DeliveryMethod from '@/components/PriceInquiry/DeliveryMethod.vue';
import ExpressInfo from '@/components/PriceInquiry/ExpressInfo.vue';
import OrderInfo from '@/components/PriceInquiry/OrderInfo.vue';
import TotalInfo from '@/components/PriceInquiry/TotalInfo.vue';
import FileList from '@/components/quote/FileList.vue';
import FileUploader from '@/components/quote/FileUploader.vue';
import HistoryList from '@/components/quote/HistoryList.vue';
import ParameterInfo from '@/components/quote/ParameterInfo.vue';
import AmountDialog from '@/components/SignIn/AmountDialog.vue';
import DataDashboard from '@/components/SignIn/DataDashboard.vue';
import Login from '@/components/SignIn/Login.vue';
import LogisticsInfo from '@/components/SignIn/LogisticsInfo.vue';
import ModelInfoDialog from '@/components/SignIn/ModelInfoDialog.vue';
import SignInOrderInfo from '@/components/SignIn/OrderInfo.vue';
import ProgressDialog from '@/components/SignIn/ProgressDialog.vue';
import ShippingDialog from '@/components/SignIn/ShippingDialog.vue';
import ShippingProgressDialog from '@/components/SignIn/ShippingProgressDialog.vue';
import UserInfo from '@/components/SignIn/UserInfo.vue';
import Register from '@/components/SignUp/Register.vue';
import Footer from '@/components/Footer.vue';
import Header from '@/components/Header.vue';
import SubmitOrder from '@/views/Order/SubmitOrder.vue';
import NotFound from '@/views/NotFound.vue';
import App from '@/App.vue';


describe.skip('Login Component', () => {
  // --- 1. Appearance Tests --- 
  context('Appearance (Rendering)', () => {
    it('should display all required elements correctly', () => {
      // Mount the component before each test
      cy.mount(Login);

      // Use data-cy attributes for robust selectors. I'll add them as comments.
      // <img ... data-cy="login-logo">
      cy.get('.logo').should('be.visible');

      // <h1 ... data-cy="login-title">
      cy.contains('h1', 'Sign In').should('be.visible');

      // <el-form-item ... data-cy="login-email-field">
      cy.get('label').contains('Email').should('be.visible');
      cy.get('input[type="email"]').should('be.visible');

      // <el-form-item ... data-cy="login-password-field">
      cy.get('label').contains('Password').should('be.visible');
      cy.get('input[type="password"]').should('be.visible');

      // <el-button ... data-cy="login-submit-btn">
      cy.get('.login-btn').contains('Sign In').should('be.visible');

      // <el-button ... data-cy="login-google-btn">
      cy.get('.google-btn').contains('Continue with Google').should('be.visible');

      // <div ... data-cy="login-signup-link">
      cy.get('.signup-link').contains('Sign up').should('be.visible');
    });
  });

  // --- 2. Behavior Tests --- 
  context('Behavior (Interaction & Validation)', () => {
    beforeEach(() => {
      // Mount the component before each test
      cy.mount(Login);
    });

    it('should allow typing into email and password fields', () => {
      cy.get('input[type="email"]').type('test@example.com').should('have.value', 'test@example.com');
      cy.get('input[type="password"]').type('password123').should('have.value', 'password123');
    });

    it('should show validation errors for empty fields', () => {
      cy.get('.login-btn').click();
      cy.contains('Please enter your email').should('be.visible');
      cy.contains('Please enter your password').should('be.visible');
    });

    it('should show validation error for an invalid email', () => {
      cy.get('input[type="email"]').type('not-an-email');
      cy.get('input[type="password"]').type('password123');
      cy.get('.login-btn').click();
      cy.contains('Please enter a valid email').should('be.visible');
    });

    it('should show validation error for a short password', () => {
      cy.get('input[type="email"]').type('test@example.com');
      cy.get('input[type="password"]').type('123');
      cy.get('.login-btn').click();
      cy.contains('Password must be 8-32 characters').should('be.visible');
    });

    it('should handle successful email login', () => {
      // Intercept the network requests to mock the backend response
      cy.intercept('POST', '/api/login/email/login', { statusCode: 200, body: { message: 'Login successful' } }).as('emailLogin');
      cy.intercept('GET', '/api/login/check_login', { statusCode: 200, body: { id: 1, name: 'Test User', email: 'test@example.com' } }).as('checkLogin');

      // Fill the form
      cy.get('input[type="email"]').type('test@example.com');
      cy.get('input[type="password"]').type('a-valid-password');

      // Click login
      cy.get('.login-btn').click();

      // Assertions
      cy.wait('@emailLogin'); // Wait for the login request to be made
      cy.wait('@checkLogin'); // Wait for the user info request
      cy.get('.el-message--success').should('contain', '登录成功！');
      // You can also assert that the router was called to push a new route
    });

    it('should handle failed email login', () => {
      // Intercept and mock a failed response (e.g., 401 Unauthorized)
      cy.intercept('POST', '/api/login/email/login', { statusCode: 401, body: { detail: 'Invalid credentials' } }).as('emailLogin');

      cy.get('input[type="email"]').type('wrong@example.com');
      cy.get('input[type="password"]').type('wrong-password');
      cy.get('.login-btn').click();

      cy.wait('@emailLogin');
      cy.get('.el-message--error').should('contain', 'Invalid credentials');
      cy.get('.login-btn').should('not.have.class', 'is-loading'); // Check loading state is reset
    });

    it('should redirect to Google auth URL on Google login click', () => {
      const googleAuthUrl = 'https://accounts.google.com/o/oauth2/v2/auth?client_id=...';
      cy.intercept('GET', '/api/login/login', { success: true, auth_url: googleAuthUrl }).as('getGoogleUrl');

      // We need to stub window.location.href to check the redirection
      cy.window().then((win) => {
        cy.stub(win.location, 'href').as('windowRedirect');
      });

      cy.get('.google-btn').click();

      cy.wait('@getGoogleUrl');
      cy.get('@windowRedirect').should('be.calledWith', googleAuthUrl);
    });
  });

  // --- 3. Accessibility Tests --- 
  context('Accessibility (A11y)', () => {
    it('should pass automated accessibility checks', () => {
      cy.mount(Login);
      cy.injectAxe(); // From the cypress-axe plugin
      cy.checkA11y(); // Checks the entire component for a11y violations
    });
  });
});
