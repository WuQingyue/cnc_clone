<template>
  <div class="signup-container">
    <div class="signup-box">
      <!-- Logo -->
      <img src="@/assets/images/logo.png" alt="JLC Logo" class="logo">
      
      <!-- Title -->
      <h1 class="title">Sign Up</h1>
      
      <!-- Form -->
      <el-form 
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="top"
      >
        <!-- Name Fields -->
        <div class="name-fields">
          <el-form-item label="First name" prop="firstName" class="name-item">
            <el-input v-model="form.firstName" />
          </el-form-item>
          
          <el-form-item label="Last name" prop="lastName" class="name-item">
            <el-input v-model="form.lastName" />
          </el-form-item>
        </div>

        <!-- Email Field -->
        <el-form-item label="Email" prop="email">
          <el-input v-model="form.email" type="email" />
        </el-form-item>

        <!-- Password Field -->
        <el-form-item label="Password" prop="password">
          <el-input 
            v-model="form.password" 
            type="password" 
            show-password
          />
        </el-form-item>

        <!-- Continue Button -->
        <el-button 
          type="primary" 
          class="continue-btn"
          @click="handleSubmit"
        >
          Continue
        </el-button>
      </el-form>

      <!-- Divider -->
      <div class="divider">
        <span>OR</span>
      </div>

      <!-- Google Sign Up -->
      <el-button
        class="google-btn"
        @click="handleGoogleSignUp"
      >
        <img src="@/assets/images/google-logo.svg" alt="Google" class="google-icon">
        Continue with Google
      </el-button>

      <!-- Sign In Link -->
      <div class="signin-link">
        Already have an account? 
        <router-link to="/login">Sign in</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import axios from 'axios'
const router = useRouter()
const formRef = ref(null)

// 表单数据
const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: ''
})

// 表单验证规则
const rules = {
  firstName: [
    { required: true, message: 'Please enter your first name', trigger: 'blur' }
  ],
  lastName: [
    { required: true, message: 'Please enter your last name', trigger: 'blur' }
  ],
  email: [
    { required: true, message: 'Please enter your email', trigger: 'blur' },
    { type: 'email', message: 'Please enter a valid email', trigger: 'blur' }
  ],
  password: [
    { required: true, message: 'Please enter your password', trigger: 'blur' },
    { min: 8, max: 32, message: 'Password must be 8-32 characters', trigger: 'blur' }
  ]
}
import service from '@/utils/request'
// 表单提交
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()

     // 调用注册接口
     const response = await service.post(
      '/api/login/register',
      {
        firstname: form.firstName.trim(),
        lastname: form.lastName.trim(),
        email: form.email.trim(),
        password: form.password
      },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      }
    )
    
    if (response.data) {
      ElMessage.success('注册成功！')
      router.push('/login')
    }
  } catch (error) {
    ElMessage.error('注册失败！')
  }
}

// Google 注册
const handleGoogleSignUp = () => {
  window.location.href = '/api/login/login'
}
</script>

<style scoped>
.signup-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f7fa;
}

.signup-box {
  width: 400px;
  padding: 40px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.logo {
  display: block;
  width: 120px;
  margin: 0 auto 20px;
}

.title {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 30px;
  color: #303133;
}

.name-fields {
  display: flex;
  gap: 20px;
}

.name-item {
  flex: 1;
}

.continue-btn {
  width: 100%;
  margin-top: 20px;
}

.divider {
  position: relative;
  text-align: center;
  margin: 20px 0;
}

.divider::before,
.divider::after {
  content: '';
  position: absolute;
  top: 50%;
  width: calc(50% - 30px);
  height: 1px;
  background-color: #dcdfe6;
}

.divider::before {
  left: 0;
}

.divider::after {
  right: 0;
}

.divider span {
  background-color: white;
  padding: 0 10px;
  color: #909399;
}

.google-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 20px;
}

.google-icon {
  width: 20px;
  height: 20px;
}

.signin-link {
  text-align: center;
  color: #606266;
}

.signin-link a {
  color: #409eff;
  text-decoration: none;
}

.signin-link a:hover {
  text-decoration: underline;
}
</style>