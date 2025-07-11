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
    <el-table :data="savedContacts" style="width: 100%" v-loading="loading">
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

          <!-- 删除按钮 -->
          <!-- <el-button type="text" @click="editContact(scope.row)">修改</el-button> -->
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
import { ref, watch, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
// ★★★ 修改点 1: 引入 ElMessageBox 用于确认弹窗 ★★★
import { ElMessage, ElMessageBox } from 'element-plus'
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
    const loading = ref(false);

    // 修复首次进入时“已用”状态不显示的问题
    watch(() => props.visible, (val) => {
      dialogVisible.value = val
      if (val) {
        fetchContacts();
      }
    });
    
    // 逻辑迁移到 fetchContacts 内部，以避免竞态条件
    // watch(() => props.selectedContact, (newVal) => { ... })

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
      savedContacts.value.forEach(item => {
        item.isDefault = item === contact
      })
      await service.post('/api/contact/set_default_contact', { contact_id: contact.contact_id }, { withCredentials: true })
    }

    const saveContact = async () => {
      if (!contactFormRef.value) return
      await contactFormRef.value.validate(async (valid) => {
        if (valid) {
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
              await fetchContacts(); 
              showForm.value = false;
              const newContact = savedContacts.value.find(c => c.orderName === payload.order_contact && c.orderPhone === payload.order_contact_phone);
              if (newContact) {
                  useContact(newContact);
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

    // ★★★ 修改点 2: 实现完整的删除联系人方法 ★★★
    const deleteContact = async (contactToDelete) => {
      try {
        // 弹出确认框
        await ElMessageBox.confirm(
          '此操作将永久删除该联系人, 是否继续?',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }
        );

        // 用户确认后，执行删除请求
        const response = await service.delete(
          `/api/contact/delete_contact/${contactToDelete.contact_id}`, 
          { withCredentials: true }
        );

        if (response.data.success) {
          ElMessage.success('删除成功');
          // 从本地数组中移除该联系人，以更新UI
          savedContacts.value = savedContacts.value.filter(
            (contact) => contact.contact_id !== contactToDelete.contact_id
          );
        } else {
          ElMessage.error(response.data.detail || '删除失败');
        }
      } catch (error) {
        // 处理取消操作和请求错误
        if (error === 'cancel') {
          ElMessage.info('已取消删除');
        } else {
          console.error('删除联系人失败:', error);
          ElMessage.error('删除联系人失败，请稍后重试');
        }
      }
    }

    const fetchContacts = async () => {
      loading.value = true;
      try {
        const response = await service.get('/api/contact/get_user_contacts', { withCredentials: true })
        if (response.data.success === true) {
          savedContacts.value = response.data.data.map(contact => ({
            contact_id: contact.id,
            orderName: contact.order_contact,
            orderPhone: contact.order_contact_phone,
            techName: contact.tech_contact,
            techPhone: contact.tech_contact_phone,
            isDefault: contact.is_default,
            isUsing: false, // 先全部设为 false
          }));

          // 在数据加载后，根据 prop 设置“已用”状态
          if (props.selectedContact) {
            const currentlyUsedContact = savedContacts.value.find(
              c => c.contact_id === props.selectedContact.contact_id
            );
            if (currentlyUsedContact) {
              currentlyUsedContact.isUsing = true;
            }
          }
        }
      } catch (error) {
        ElMessage.error('获取联系人列表失败')
        console.error('获取联系人失败:', error)
      } finally {
        loading.value = false;
      }
    }

    return {
      loading,
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
      deleteContact, // 确保返回了新的 deleteContact 方法
      useContact,
      setDefaultContact
    }
  }
}
</script>

<style scoped>
/* 样式保持不变 */
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