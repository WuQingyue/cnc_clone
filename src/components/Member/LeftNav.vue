<template>
  <div class="left-nav">
    <!-- 第一部分：用户信息 -->
    <div class="user-info">
      <img src="@/assets/images/home.png" alt="用户头像" class="user-avatar" />
      <div class="user-details">
        <span class="nickname">{{ userStore.user.user.name }}</span>
        <div class="status">
          <span class="blue-text">未设置归属</span>
          <button class="gray-button">注册客户</button>
        </div>
      </div>
    </div>

    <!-- 第二部分：专属客服 -->
    <div class="exclusive-service-button" @click="contactService">
      <img src="@/assets/images/客服.png" alt="客服图标" class="service-icon" />
      <span>专属客服</span>
    </div>

    <!-- 第三部分：导航栏 -->
    <div class="nav-section">
      <div
        v-for="(item, index) in navItems"
        :key="index"
        :class="['nav-item', { active: activeNav === item.name }]"
        @click="setActiveNav(item.name)"
      >
        <img :src="item.icon" class="nav-icon" />
        <span>{{ item.text }}</span>
      </div>
    </div>

    <!-- 第四部分：搜索框 -->
    <div class="search">
      <form @submit.prevent="handleSearch">
        <input
          v-model="searchQuery"
          placeholder="请输入..."
          name="keyword"
          type="text"
        />
        <button type="submit"></button>
      </form>
    </div>

    <!-- 第五部分：三级导航栏 -->
    <div v-if="activeNav === 'allMenu'" class="content-section">
      <el-collapse v-model="activeNames">
        <el-collapse-item
          v-for="(category, index) in categories"
          :key="index"
          :name="index.toString()"
          class="item"
        >
          <template #title>
            <el-icon><i :class="category.icon"></i></el-icon>
            <span>{{ category.text }}</span>
          </template>
          <el-collapse v-model="category.activeSubNames">
            <el-collapse-item
              v-for="(subItem, subIndex) in category.subItems"
              :key="subIndex"
              :name="subIndex.toString()"
            >
              <template #title>
                <el-icon><i :class="subItem.icon"></i></el-icon>
                <span>{{ subItem.text }}</span>
              </template>
              <div
                v-for="(subSubItem, subSubIndex) in subItem.subSubItems"
                :key="subSubIndex"
                class="sub-sub-item"
              >
                <el-icon><i :class="subSubItem.icon"></i></el-icon>
                <span>{{ subSubItem.text }}</span>
              </div>
            </el-collapse-item>
          </el-collapse>
        </el-collapse-item>
      </el-collapse>
    </div>
    <div v-else class="content-section">
      <span>收藏夹</span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/store/user'

const userStore = useUserStore()
const navItems = ref([
  { name: 'allMenu', text: '全部菜单', icon: require('@/assets/images/全部菜单.png') },
  { name: 'favorites', text: '收藏夹', icon: require('@/assets/images/全部菜单.png') }
])

const categories = ref([
  {
    text: '电子产业',
    icon: 'el-icon-folder',
    activeSubNames: [],
    subItems: [
      {
        text: 'SMT订单',
        icon: require('@/assets/images/SMT订单.png'),
        subSubItems: [
          { text: '进入SMT首页', icon: 'el-icon-document' },
          { text: 'SMT元器件', icon: 'el-icon-document' },
          { text: '邮寄元器件', icon: 'el-icon-document' },
          { text: '邮寄元器件', icon: 'el-icon-document' },
          { text: 'SMT下单', icon: 'el-icon-document' },
          { text: 'SMT订单列表', icon: 'el-icon-document' },
          { text: 'SMT更多服务', icon: 'el-icon-document' }
        ]
      },
      {
        text: 'PCB/FPC订单',
        icon: 'el-icon-document',
        subSubItems: [
          { text: '计价/下单', icon: 'el-icon-document' },
          { text: 'PCB/FPC订单', icon: 'el-icon-document' },
          { text: '评价晒单', icon: 'el-icon-document' },
          { text: '板材检测', icon: 'el-icon-document' },
          { text: '我的文件夹', icon: 'el-icon-document' },
          { text: '二维码管理', icon: 'el-icon-document' },
          { text: '参观工厂报名', icon: 'el-icon-document' },
          { text: '沙龙活动报名', icon: 'el-icon-document' }
        ]
      },
      {
        text: '激光/纳米钢网',
        icon: 'el-icon-document',
        subSubItems: [
          { text: '钢网下单', icon: 'el-icon-document' },
          { text: '钢网订单', icon: 'el-icon-document' },
          { text: '全部薄片来图定制', icon: 'el-icon-document' },
          { text: '金属薄片定制下单', icon: 'el-icon-document' },
          { text: '治具订单', icon: 'el-icon-document' }
        ]
      },
      {
        text: '发热片',
        icon: 'el-icon-document',
        subSubItems: [
          { text: '免费下载工程文件', icon: 'el-icon-document' },
          { text: '发热片下单', icon: 'el-icon-document' },
          { text: '订单列表', icon: 'el-icon-document' }
        ]
      },
      {
        text: 'Layout服务',
        icon: 'el-icon-document',
        subSubItems: [
          { text: '计价/下单', icon: 'el-icon-document' },
          { text: '订单列表', icon: 'el-icon-document' }
        ]
      },
      {
        text: '纸盒包装定制',
        icon: 'el-icon-document',
        subSubItems: [
          { text: '进入纸盒首页', icon: 'el-icon-document' },
          { text: '计价/下单', icon: 'el-icon-document' },
          { text: '订单列表', icon: 'el-icon-document' }
        ]
      }
    ]
  },
  {
    text: '机械产业',
    icon: 'el-icon-folder',
    activeSubNames: [],
    subItems: [
      {
        text: '机械/电器零部件',
        icon: 'el-icon-document',
        subSubItems: [
          { text: '进入零部件商城', icon: 'el-icon-document' },
          { text: '新课福利', icon: 'el-icon-document' },
          { text: '购物车下单', icon: 'el-icon-document' },
          { text: '零部件选型手册', icon: 'el-icon-document' },
          { text: '报价单列表', icon: 'el-icon-document' },
          { text: '订单列表', icon: 'el-icon-document' },
          { text: '售后单列表', icon: 'el-icon-document' },
          { text: '补款列表', icon: 'el-icon-document' },
          { text: '我的礼包', icon: 'el-icon-document' },
          { text: '消息通知', icon: 'el-icon-document' },
          { text: '通知设置', icon: 'el-icon-document' }
        ]
      },
      {
        text: '3D打印',
        icon: 'el-icon-document',
        subSubItems: [
          { text: '进入3D打印', icon: 'el-icon-document' },
          { text: '3D订单', icon: 'el-icon-document' },
          { text: '订单少数处理', icon: 'el-icon-document' },
          { text: '退款记录', icon: 'el-icon-document' },
          { text: '补款记录', icon: 'el-icon-document' },
          { text: '品质投诉', icon: 'el-icon-document' },
          { text: '晒单评价', icon: 'el-icon-document' }
        ]
      },
      {
        text: 'CNC加工',
        icon: 'el-icon-document',
        subSubItems: [
          { text: '进入CNC', icon: 'el-icon-document' },
          { text: 'CNC订单', icon: 'el-icon-document' },
          { text: '退款记录', icon: 'el-icon-document' },
          { text: '补款记录', icon: 'el-icon-document' },
          { text: '品质投诉', icon: 'el-icon-document' },
          { text: '晒单评价', icon: 'el-icon-document' }
        ]
      },
      {
        text: '钣金加工',
        icon: 'el-icon-document',
        subSubItems: [
          { text: '进入钣金', icon: 'el-icon-document' },
          { text: '钣金订单', icon: 'el-icon-document' },
          { text: '退款记录', icon: 'el-icon-document' },
          { text: '补款记录', icon: 'el-icon-document' },
          { text: '晒单评价', icon: 'el-icon-document' }
        ]
      },
      {
        text: '手板复模',
        icon: 'el-icon-document',
        subSubItems: [
          { text: '进入手板复模', icon: 'el-icon-document' },
          { text: '手板复模订单', icon: 'el-icon-document' },
          { text: '补款记录', icon: 'el-icon-document' },
          { text: '退款记录', icon: 'el-icon-document' },
          { text: '晒单评价', icon: 'el-icon-document' }
        ]
      },
      {
        text: '铝合金壳体',
        icon: 'el-icon-document',
        subSubItems: [
          { text: '壳体首页', icon: 'el-icon-document' },
          { text: '壳体公模列表', icon: 'el-icon-document' },
          { text: '我的设计稿', icon: 'el-icon-document' },
          { text: '订单列表', icon: 'el-icon-document' }
        ]
      }
    ]
  },
  {
    text: '工业软件',
    icon: 'el-icon-folder',
    activeSubNames: [],
    subItems: [
      {
        text: '嘉立创EDA',
        icon: 'el-icon-document',
        subSubItems: [
          { text: '进入首页', icon: 'el-icon-document' }
        ]
      },
      {
        text: '嘉立创CAM',
        icon: 'el-icon-document',
        subSubItems: [
          { text: '了解CAM工具', icon: 'el-icon-document' }
        ]
      },
      {
        text: '嘉立创DFM',
        icon: 'el-icon-document',
        subSubItems: [
          { text: '了解DFM工具', icon: 'el-icon-document' }
        ]
      },
      {
        text: '嘉立创ECAD',
        icon: 'el-icon-document',
        subSubItems: [
          { text: '进入首页', icon: 'el-icon-document' }
        ]
      },
      {
        text: 'Forface 3D',
        icon: 'el-icon-document',
        subSubItems: [
          { text: '进入首页', icon: 'el-icon-document' }
        ]
      },
      {
        text: '3D预览器',
        icon: 'el-icon-document',
        subSubItems: [
          { text: '进入首页', icon: 'el-icon-document' }
        ]
      },
      {
        text: '下单助手',
        icon: 'el-icon-document',
        subSubItems: [
          { text: '点击下载', icon: 'el-icon-document' }
        ]
      },
      {
        text: '嘉立创开放平台',
        icon: 'el-icon-document',
        subSubItems: [
          { text: '进入首页', icon: 'el-icon-document' }
        ]
      }
    ]
  },
  {
    text: '用户中心',
    icon: 'el-icon-folder',
    activeSubNames: [],
    subItems: [
      {
        text: '账号管理',
        icon: 'el-icon-document',
        subSubItems: [
          { text: '账号预览', icon: 'el-icon-document' },
          { text: '成员账号管理', icon: 'el-icon-document' },
          { text: '日志查询', icon: 'el-icon-document' }
        ]
      },
      {
        text: '文件管理中心',
        icon: 'el-icon-document',
        subSubItems: [
          { text: '我的文件夹', icon: 'el-icon-document' },
          { text: '回收站', icon: 'el-icon-document' }
        ]
      },
      {
        text: '金豆兑换',
        icon: 'el-icon-document',
        subSubItems: [
          { text: '金豆兑换实物', icon: 'el-icon-document' }
        ]
      },
      {
        text: '客户资料',
        icon: 'el-icon-document',
        subSubItems: [
          { text: '账号信息', icon: 'el-icon-document' },
          { text: '短信通知开关', icon: 'el-icon-document' },
          { text: '安全中心', icon: 'el-icon-document' },
          { text: '地址管理', icon: 'el-icon-document' }
        ]
      },
      {
        text: '预付款账户',
        icon: 'el-icon-document',
        subSubItems: [
          { text: '预付款余额', icon: 'el-icon-document' },
          { text: '线下转入', icon: 'el-icon-document' },
          { text: '转入记录', icon: 'el-icon-document' },
          { text: '转出申请', icon: 'el-icon-document' },
          { text: '补款记录', icon: 'el-icon-document' },
          { text: '申请转出', icon: 'el-icon-document' }
        ]
      },
      {
        text: '优惠劵中心',
        icon: 'el-icon-document',
        subSubItems: [
          { text: '我的优惠券', icon: 'el-icon-document' },
          { text: '免费券领取', icon: 'el-icon-document' }
        ]
      },
      {
        text: '开票中心',
        icon: 'el-icon-document',
        subSubItems: [
          { text: '通知开票', icon: 'el-icon-document' },
          { text: '补开发票', icon: 'el-icon-document' },
          { text: '开票资料', icon: 'el-icon-document' }
        ]
      },
      {
        text: '售后服务',
        icon: 'el-icon-document',
        subSubItems: [
          { text: '品质投诉', icon: 'el-icon-document' },
          { text: '表扬/投诉人员', icon: 'el-icon-document' },
          { text: '缺数处理', icon: 'el-icon-document' }
        ]
      },
      {
        text: '支付中心',
        icon: 'el-icon-document',
        subSubItems: [
          { text: '授信支付记录', icon: 'el-icon-document' },
          { text: '支付对账单', icon: 'el-icon-document' }
        ]
      },
      {
        text: '更多服务',
        icon: 'el-icon-document',
        subSubItems: [
          { text: '嘉立创题库', icon: 'el-icon-document' },
          { text: '资料下载', icon: 'el-icon-document' },
          { text: '文件下载记录', icon: 'el-icon-document' },
          { text: '回到桌面', icon: 'el-icon-document' },
          { text: '退出登录', icon: 'el-icon-document' }
        ]
      }
    ]
  }
])

const activeNames = ref([])
const activeNav = ref('allMenu')
const searchQuery = ref('') // 搜索框的绑定值

const setActiveNav = (name) => {
  activeNav.value = name
}

const contactService = () => {
  console.log('联系专属客服')
}

const handleSearch = () => {
  console.log('搜索关键词:', searchQuery.value)
}
</script>

<style scoped>
.left-nav {
  width: 250px;
  background-color: #f5f5f5;
  padding: 10px;
}

.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  flex-direction: row;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.nickname {
  font-weight: bold;
}

.status {
  display: flex;
  align-items: center;
}

.blue-text {
  color: #409eff;
  margin-right: 10px;
}

.gray-button {
  background-color: #ccc;
  border: none;
  padding: 5px 10px;
  color: white;
  cursor: pointer;
}

.exclusive-service-button {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #409eff;
  color: white;
  padding: 10px 15px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
  margin-bottom: 20px;
}

.exclusive-service-button:hover {
  background-color: #66b1ff;
  transform: translateY(-2px);
}

.service-icon {
  width: 20px;
  height: 20px;
  margin-right: 8px;
}

.nav-section {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
}

.nav-item {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 10px;
  transition: background-color 0.3s;
  width: 50%;
  justify-content: center;
  background-color: #ccc;
  color: #333;
}

.nav-item.active {
  background-color: #409eff;
  color: white;
}

.nav-icon {
  width: 16px;
  height: 16px;
  margin-right: 8px;
}

.search {
  padding: 10px 0;
  margin-bottom: 20px;
}

.search form {
  position: relative;
  width: 100%;
  margin: 0 auto;
}

.search input,
.search button {
  border: none;
  outline: none;
}

.search input {
  width: 100%;
  height: 42px;
  padding-left: 13px;
  border: 2px solid #409eff;
  border-radius: 19px;
  background: transparent;
}

.search button {
  height: 42px;
  width: 60px;
  cursor: pointer;
  position: absolute;
  background: #409eff;
  border-radius: 0 19px 19px 0;
  right: 0;
}

.search button:hover {
  background-color: #409eff;
}

.search button:before {
  content: '搜索';
  font-size: 13px;
  color: #f9f0da;
}

.content-section {
  margin-top: 20px;
}

.sub-item {
  display: flex;
  align-items: center;
  margin-left: 20px;
  margin-bottom: 5px;
}

.sub-sub-item {
  display: flex;
  align-items: center;
  margin-left: 40px;
  margin-bottom: 5px;
}

.item {
  background-color: #f5a623;
}
</style>