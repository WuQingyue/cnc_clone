<template>
  <div class="login-container">
    <div class="login-box">
      <!-- Logo -->
      <img src="@/assets/images/logo.png" alt="JLC Logo" class="logo">
      
      <!-- Title -->
      <h1 class="title">Sign In</h1>
      
      <!-- Form -->
      <el-form 
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="top"
      >
        <!-- Email Field -->
        <el-form-item label="Email" prop="email">
          <el-input 
            v-model="form.email" 
            type="email"
            placeholder="Enter your email"
          />
        </el-form-item>

        <!-- Password Field -->
        <el-form-item label="Password" prop="password">
          <el-input 
            v-model="form.password" 
            type="password"
            show-password
            placeholder="Enter your password"
          />
        </el-form-item>

        <!-- Login Button -->
        <el-button 
          type="primary" 
          class="login-btn"
          :loading="loading"
          @click="handleEmailLogin"
        >
          Sign In
        </el-button>
      </el-form>

      <!-- Divider -->
      <div class="divider">
        <span>OR</span>
      </div>

      <!-- Google Login -->
      <el-button
        class="google-btn"
        @click="handleGoogleLogin"
      >
        <img src="@/assets/images/google-logo.svg" alt="Google" class="google-icon">
        Continue with Google
      </el-button>

      <!-- Sign Up Link -->
      <div class="signup-link">
        Don't have an account? 
        <router-link to="/register">Sign up</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import { ElMessage } from 'element-plus'
import axios from 'axios'

const router = useRouter()
const userStore = useUserStore()
const formRef = ref(null)
const loading = ref(false)
import service from '@/utils/request'
// 表单数据
const form = reactive({
  email: '',
  password: ''
})

// 表单验证规则
const rules = {
  email: [
    { required: true, message: 'Please enter your email', trigger: 'blur' },
    { type: 'email', message: 'Please enter a valid email', trigger: 'blur' }
  ],
  password: [
    { required: true, message: 'Please enter your password', trigger: 'blur' },
    { min: 8, max: 32, message: 'Password must be 8-32 characters', trigger: 'blur' }
  ]
}

// 邮箱登录
const handleEmailLogin = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    loading.value = true

    // // 检查是否是管理员账号
    // if (form.email === 'admin@tongtron.com') {
    //   // 在新标签页打开管理员界面
    //   console.log('管理员账号登录',form)
    //   // userStore.setUser(userData)
    //   return
    // }

    // 普通用户登录逻辑
    const response = await service.post(
      '/api/login/email/login',
      {
        email: form.email.trim(),
        password: form.password
      },
      { withCredentials: true }
    )

    if (response.status == 200) {
      ElMessage.success('登录成功！')
      const uesr_Info = await service.get(
      '/api/login/check_login',
      { withCredentials: true }
    )
      console.log('uesr_Info',uesr_Info)
      if(uesr_Info.status == 200){
        // 保存用户信息到 store
        userStore.setUser(uesr_Info.data)
        router.push('/')
      }
    }
  } catch (error) {
    console.error('登录失败:', error)
    ElMessage.error(error.response?.data?.detail || '登录失败，请重试')
  } finally {
    loading.value = false
  }
}

// Google 登录
const handleGoogleLogin = async () => {
  try {
    const response = await axios.get(
      'http://localhost:8000/api/login/login',
      { withCredentials: true }
    )
    
    if (response.data.success && response.data.auth_url) {
      // 直接在前端进行重定向
      window.location.href = response.data.auth_url
    } else {
      ElMessage.error('获取 Google 登录链接失败')
    }
  } catch (error) {
    console.error('Google 登录失败:', error)
    ElMessage.error('Google 登录失败，请重试')
  }
}

</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f7fa;
}

.login-box {
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

.login-btn {
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

.signup-link {
  text-align: center;
  color: #606266;
}

.signup-link a {
  color: #409eff;
  text-decoration: none;
}

.signup-link a:hover {
  text-decoration: underline;
}

/* 添加输入框样式 */
:deep(.el-input__wrapper) {
  border-radius: 4px;
}

:deep(.el-form-item__label) {
  font-weight: 500;
}
</style>