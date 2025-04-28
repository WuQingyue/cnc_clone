<template>
  <el-dialog
    v-model="dialogVisible"
    width="800px"
    :close-on-click-modal="false"
    :lock-scroll="false"
    destroy-on-close
  >
    <div class="dialog-header">选择下单/技术联系人</div>
    <el-divider />
    
    <div class="contact-list-header">
      <div class="saved-contact-info">
        已保存联系人方式 (最多保存 {{ savedContacts.length }}/50 个有效联系人)
      </div>
      <el-button type="primary" @click="showAddForm">
        <el-icon><Plus /></el-icon>
        新增订单联系人
      </el-button>
    </div>

    <!-- 联系人列表 -->
    <el-table :data="savedContacts" style="width: 100%">
      <el-table-column prop="orderName" label="下单联系人" />
      <el-table-column prop="orderPhone" label="联系电话" />
      <el-table-column prop="techName" label="技术联系人" />
      <el-table-column prop="techPhone" label="联系电话" />
      <el-table-column label="操作" width="320">
        <template #default="scope">
          <!-- 使用/已用按钮 -->
          <el-button
            :type="scope.row.isUsing ? 'danger' : 'primary'"
            :disabled="scope.row.isUsing"
            @click="useContact(scope.row)"
          >
            {{ scope.row.isUsing ? '已用' : '使用' }}
          </el-button>

          <!-- 默认联系人 -->
          <template v-if="scope.row.isDefault">
            <span class="default-tag">默认联系人</span>
          </template>
          <template v-else>
            <el-button
              type="text"
              @click="setDefaultContact(scope.row)"
            >
              设为默认
            </el-button>
          </template>

          <!-- 修改和删除按钮 -->
          <el-button type="text" @click="editContact(scope.row)">修改</el-button>
          <el-button type="text" @click="deleteContact(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增/编辑联系人表单 -->
    <div v-if="showForm" class="contact-form">
      <el-form :model="contactForm" label-width="100px" :rules="rules" ref="contactFormRef">
        <el-form-item label="下单联系人" prop="orderName">
          <el-input v-model="contactForm.orderName" placeholder="请输入下单联系人姓名" />
        </el-form-item>
        
        <el-form-item label="联系电话" prop="orderPhone">
          <el-input v-model="contactForm.orderPhone" placeholder="请输入下单联系人电话" />
        </el-form-item>
        
        <el-form-item label="技术联系人" prop="techName">
          <el-input v-model="contactForm.techName" placeholder="请输入技术联系人姓名" />
        </el-form-item>
        
        <el-form-item label="联系电话" prop="techPhone">
          <el-input v-model="contactForm.techPhone" placeholder="请输入技术联系人电话" />
        </el-form-item>
      </el-form>

      <div class="form-buttons">
        <el-button type="primary" @click="saveContact">保存</el-button>
        <el-button @click="cancelEdit">取消</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { ref, watch,onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import service from '@/utils/request'
export default {
  name: 'ContactEditDialog',
  components: {
    Plus
  },
  props: {
    visible: Boolean,
    selectedContact: {
      type: Object,
      default: null
    }
  },
  emits: ['update:visible', 'save-contact', 'use-contact'],
  setup(props, { emit }) {

    watch(() => props.selectedContact, (newVal) => {
        console.log('收到selectedContact变化:', newVal)
        if (newVal) {
          // 更宽松的比较方式
          const foundContacts = savedContacts.value.find(cont => cont.contact_id === newVal.contact_id )
          
          if (foundContacts) {
            console.log('找到匹配联系人:', foundContacts)
            useContact(foundContacts)
          } else {
            console.log('未找到匹配联系人')
          }
        }
      }, { immediate: true, deep: true })  // 添加deep:true深度监听

    const dialogVisible = ref(false)
    const showForm = ref(false)
    const savedContacts = ref([])
    const contactFormRef = ref(null)

    const contactForm = ref({
      orderName: '',
      orderPhone: '',
      techName: '',
      techPhone: ''
    })

    const rules = {
      orderName: [{ required: true, message: '请输入下单联系人姓名', trigger: 'blur' }],
      orderPhone: [{ required: true, message: '请输入下单联系人电话', trigger: 'blur' }],
      techName: [{ required: true, message: '请输入技术联系人姓名', trigger: 'blur' }],
      techPhone: [{ required: true, message: '请输入技术联系人电话', trigger: 'blur' }]
    }

    watch(() => props.visible, (val) => {
      dialogVisible.value = val
    })

    watch(() => dialogVisible.value, (val) => {
      emit('update:visible', val)
    })

    const showAddForm = () => {
      if (savedContacts.value.length >= 50) {
        ElMessage.warning('最多只能保存50个有效联系人')
        return
      }
      showForm.value = true
      contactForm.value = {
        orderName: '',
        orderPhone: '',
        techName: '',
        techPhone: ''
      }
    }

    const useContact = (contact) => {
      savedContacts.value.forEach(item => {
        item.isUsing = item === contact
      })
      emit('use-contact', contact)
    }

    const setDefaultContact = async (contact) => {
      console.log('setDefaultContact',contact)
      savedContacts.value.forEach(item => {
        item.isDefault = item === contact
      })
      const response = await service.post(
      '/api/contact/set_default_contact',
      {
        contact_id: contact.contact_id
      },
      { withCredentials: true }
    )
    console.log('更新默认联系人response',response)
    }

    const saveContact = async () => {
      if (!contactFormRef.value) return

      await contactFormRef.value.validate(async (valid) => {
        if (valid) {
          // 保存到本地列表
            const contact = { 
              ...contactForm.value,
              isDefault: savedContacts.value.length === 0,
              isUsing: savedContacts.value.length === 0
            }
          // 构造后端需要的参数
          const payload = {
            order_contact: contactForm.value.orderName,
            order_contact_phone: contactForm.value.orderPhone,
            tech_contact: contactForm.value.techName,
            tech_contact_phone: contactForm.value.techPhone
          }
          try {
            const response = await service.post('/api/contact/add_contact', payload, { withCredentials: true })
            if (response.status === 200) {
              ElMessage.success('联系人保存成功')
              // 4. 本地保存（不影响后端）
              savedContacts.value.push(contact)
              showForm.value = false
              emit('save-contact', contact)
              if (contact.isUsing) {
              emit('use-contact', contact)
            }
            } else {
              ElMessage.error('联系人保存失败')
            }
          } catch (e) {
            ElMessage.error('联系人保存失败')
          }
        }
      })
    }

    const cancelEdit = () => {
      showForm.value = false
    }

    const editContact = (contact) => {
      contactForm.value = { ...contact }
      showForm.value = true
    }

    const deleteContact = (contact) => {
      const index = savedContacts.value.indexOf(contact)
      if (index > -1) {
        savedContacts.value.splice(index, 1)
      }
    }
    const fetchContacts = async () => {
      try {
        const response = await service.get('/api/contact/get_user_contacts', { withCredentials: true })
        if (response.status === 200 && Array.isArray(response.data)) {
          savedContacts.value = response.data.map(addr => ({
            contact_id: addr.id,
            orderName: addr.order_contact,
            orderPhone: addr.order_contact_phone,
            techName: addr.tech_contact,
            techPhone: addr.tech_contact_phone,
            isDefault: addr.is_default,
            isUsing: addr.is_active,
          }))
          console.log('savedContacts',savedContacts.value)
        } else if (response.status === 200 && Array.isArray(response.data.data)) {
          // 如果后端返回 { data: [...] }
          savedContacts.value = response.data.data
        }
      } catch (error) {
        ElMessage.error('获取联系人列表失败')
        console.error('获取联系人失败:', error)
      }
    }

    onMounted(() => {
      fetchContacts()
    })

    return {
      dialogVisible,
      showForm,
      contactForm,
      contactFormRef,
      savedContacts,
      rules,
      showAddForm,
      saveContact,
      cancelEdit,
      editContact,
      deleteContact,
      useContact,
      setDefaultContact
    }
  }
}
</script>

<style scoped>
.dialog-header {
  font-size: 18px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 20px;
}

.contact-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0;
}

.saved-contact-info {
  color: #606266;
}

.contact-form {
  margin-top: 20px;
}

.form-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
}

:deep(.el-form-item__content) {
  width: 100%;
}

:deep(.el-dialog__body) {
  max-height: 80vh;
  overflow-y: auto;
}

:deep(.el-button--text) {
  color: #303133;
}

:deep(.el-button--text:hover) {
  color: #409EFF;
}

.default-tag {
  display: inline-block;
  padding: 4px 8px;
  background-color: #ecf5ff;
  color: #409EFF;
  border-radius: 4px;
  font-size: 12px;
  margin: 0 8px;
}

:deep(.el-table .cell) {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>