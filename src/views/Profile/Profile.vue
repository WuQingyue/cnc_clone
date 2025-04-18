<template>
    <div class="user-dropdown" @mouseleave="hideDropdown">
        <div class="dropdown-trigger" @mouseenter="showDropdown">
            <slot name="trigger"></slot>
        </div>
        <div v-if="isDropdownVisible" class="dropdown-content">
            <!-- 第一部分：头像和昵称 -->
            <div class="profile-section" @click="navigateToProfile">
                <div class="left-part">
                    <el-avatar
                        :size="32"
                        :src="userStore.user.user.picture"
                    />
                    <div class="user-info">
                        <span class="user-name">{{ userStore.user.user.name }}</span>
                        <span class="personal-text">个人</span>
                    </div>
                </div>
                <div class="right-part">
                    <el-icon><ArrowRight /></el-icon>
                </div>
            </div>

            <!-- 第二部分：余额 -->
            <div class="balance-section">
                <div class="balance-left">
                    <strong>账户余额</strong>
                    <i :class="{'eye-icon': true, 'closed': !isBalanceVisible}" @click="toggleBalanceVisibility"></i>
                    <!-- <span v-if="isBalanceVisible">{{ user.balance }}</span> -->
                    
                </div>
                <div class="balance-right">
                    <span v-if="isBalanceVisible">123</span>
                    <span v-else>****</span>
                    <i class="icon" @click="navigateToBalance"><el-icon><ArrowRight /></el-icon></i>
                </div>
                
            </div>

            <!-- 第三部分：我的订单 -->
            <div class="orders-section">
                <strong>我的订单</strong>
                <div class="order-links">
                    <div v-for="(order, index) in orders" :key="index" class="order-link" @click="navigateToOrder(order.link)">
                        <img :src="order.icon" alt="order-icon" class="order-icon" />
                        <span class="order-text">{{ order.text }}</span>
                    </div>
                </div>
            </div>

            <!-- 第四部分：其他功能 -->
            <div class="feature-section">
                <strong>其他功能</strong>
                <div class="feature-links">
                    <div v-for="(feature, index) in features" :key="index" class="feature-link" @click="navigateToFeature(feature.link)">
                        <img :src="feature.icon" alt="feature-icon" class="feature-icon" />
                        <span class="feature-text">{{ feature.text }}</span>
                    </div>
                </div>
            </div>

            <!-- 第五部分：退出 -->
            <div class="logout-section" @click="logout">
                退出
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/store/user' // 引入用户状态管理store
import { storeToRefs } from 'pinia'
import { ArrowRight } from '@element-plus/icons-vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const isDropdownVisible = ref(false)
const isBalanceVisible = ref(false)

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const orders = [
    { text: 'CNC订单', link: '/cnc_order',icon: require('@/assets/images/CNC订单.png') },
    { text: '钣金订单', link: '/order2',icon: require('@/assets/images/钣金订单.png') },
    { text: '复模订单', link: '/order3',icon: require('@/assets/images/复模订单.png') }
]

const features = [
    { text: '优惠劵', link: '/feature1',icon: require('@/assets/images/优惠劵.png') },
    { text: '购物车', link: '/feature2',icon: require('@/assets/images/购物车.png') },
    { text: '申请发票', link: '/feature3',icon: require('@/assets/images/申请发票.png') },
    { text: '个人中心', link: '/feature4',icon: require('@/assets/images/个人中心.png') }
]

const showDropdown = () => {
    isDropdownVisible.value = true
}

const hideDropdown = () => {
    isDropdownVisible.value = false
}

const toggleBalanceVisibility = () => {
    isBalanceVisible.value = !isBalanceVisible.value
}

const navigateToProfile = () => {
    window.location.href = '/profile'
}

const navigateToBalance = () => {
    window.location.href = '/balance'
}

const navigateToOrder = (link) => {
    window.location.href = link
}

const navigateToFeature = (link) => {
    window.location.href = link
}
import service from '@/utils/request'
const logout = async () => {
    try {
        const response = await service.post(
            '/api/login/logout',
            {}, 
            {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
        if (response.data.success) {
            userStore.clearUser()
            localStorage.removeItem('userInfo')
            sessionStorage.removeItem('userInfo')
            delete axios.defaults.headers.common['Authorization']
            ElMessage.success('退出成功')
            window.location.href = '/login'
        } else {
            ElMessage.error(response.data.message || '退出失败，请重试')
        }
    } catch (error) {
        console.error('退出失败:', error.response?.data || error)
        ElMessage.error(error.response?.data?.detail || '退出失败，请重试')
    }
}
</script>

<style scope                                                                                                                                                             d>
.user-dropdown {
    position: relative;
}

.dropdown-trigger {
    cursor: pointer;
}

.dropdown-content {
    position: absolute;
    top: 100%;
    left: 0;
    background-color: white;
    border: 1px solid #ccc;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    width: 300px;
    z-index: 1000;
}

.profile-section,
.balance-section,
.logout-section {
    padding: 15px;
    border-bottom: 1px solid #eee;
    display: flex;
    align-items: center;
}

.profile-section {
    cursor: pointer;
    justify-content: space-between;
}

.left-part {
    display: flex;
    align-items: center;
}
.balance-left{
    display: flex;
    align-items: center;
}
.balance-right{
    display: flex;
    align-items: center;
}

.user-info {
    display: flex;
    flex-direction: column;
    margin-left: 10px;
}

.user-name {
    font-weight: bold;
}

.personal-text {
    font-size: 12px;
    color: #888;
}

.right-part {
    font-size: 18px;
    color: #888;
}

.balance-section {
    justify-content: space-between;
}

.eye-icon {
    margin-left: 10px;
    cursor: pointer;
    width: 16px; /* 调整图标宽度 */
    height: 16px; /* 调整图标高度 */
    display: inline-block; /* 确保图标可以正确应用宽高 */
}

.eye-icon.closed::before,
.eye-icon::before {
    content: '';
    display: inline-block;
    width: 100%; /* 继承父元素的宽度 */
    height: 100%; /* 继承父元素的高度 */
    background-size: contain; /* 确保图标缩放适应 */
    background-repeat: no-repeat;
}

.eye-icon.closed::before {
    background-image: url('@/assets/images/eye-close.png');
}

.eye-icon::before {
    background-image: url('@/assets/images/eye-open.png');
}

.logout-section {
    text-align: center;
    cursor: pointer;
    color: red;
    justify-content: center;
}
.feature-section,
.orders-section {
    flex-direction: column;
    align-items: flex-start;
    padding: 15px;
    border-bottom: 1px solid #eee;
}
.feature-links,
.order-links {
    display: flex;
    flex-direction: row; /* 水平排列 */
    width: 100%;
    margin-top: 10px;
}
.feature-link {
    display: flex;
    align-items: center; /* 图标和文字居中 */
    padding: 8px 9px; /* 增加间距 */
    cursor: pointer;
    flex-direction: column; /* 垂直排列 */
}
.order-link {
    display: flex;
    align-items: center; /* 图标和文字居中 */
    padding: 8px 16px; /* 增加间距 */
    cursor: pointer;
    flex-direction: column; /* 垂直排列 */
}

.order-link:hover {
    background-color: #f5f5f5; /* 悬停效果 */
}
.feature-icon,
.order-icon {
    width: 24px; /* 图标大小 */
    height: 24px;
    margin-right: 10px; /* 图标与文字的间距 */
}
.feature-text,
.order-text {
    font-size: 14px; /* 文字大小 */
    color: #333; /* 文字颜色 */
}

</style>