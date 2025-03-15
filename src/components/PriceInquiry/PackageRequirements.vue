<template>
    <div class="package-requirements">
        <el-tooltip
            effect="dark"
            content="包装要求说明"
            placement="top"
            :show-after="200"
        >
            <div class="info-icon" :class="{ active: isHovered }" @mouseenter="isHovered = true" @mouseleave="isHovered = false">
                <span class="info-dot">?</span>
            </div>
        </el-tooltip>
            
        <div class="options">
            <div
                class="option-item"
                :class="{ active: modelValue === 'jlc' }"
                @click="$emit('update:modelValue', 'jlc')"
            >
                嘉立创标识盒子
                <el-icon v-if="modelValue === 'jlc'" class="check-icon"><Check /></el-icon>
            </div>
            <div
                class="option-item"
                :class="{ active: modelValue === 'blank' }"
                @click="$emit('update:modelValue', 'blank')"
            >
                空白盒子
                <el-icon v-if="modelValue === 'blank'" class="check-icon"><Check /></el-icon>
            </div>
        </div>

    </div>
</template>

<script>
import { ref } from 'vue'
import { Check } from '@element-plus/icons-vue'

export default {
    name: 'PackageRequirements',
    components: {
        Check
    },
    props: {
        modelValue: {
            type: String,
            default: 'jlc'
        }
    },
    emits: ['update:modelValue'],
    setup() {
        const isHovered = ref(false)
        return { isHovered }
    }
}
</script>

<style scoped>
.package-requirements {
    display: flex;
    align-items: center;
    gap: 8px;
}

.options {
    display: flex;
    gap: 12px;
}

.option-item {
    padding: 12px 16px;
    border: 1px solid #DCDFE6;
    border-radius: 4px;
    cursor: pointer;
    position: relative;
    transition: all 0.3s;
    height: 40px;
    line-height: 40px;
    display: flex;
    align-items: center;
    background-color: white;
    color: #606266;
}

.option-item.active {
    border-color: #409EFF;
    color: #409EFF;
}

.check-icon {
    position: absolute;
    right: 4px;
    bottom: 4px;
    font-size: 12px;
    color: #409EFF;
}

.info-icon {
    display: flex;
    align-items: center;
    cursor: pointer;
    height: 20px;
}

.info-dot {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: #DCDFE6;
    transition: all 0.3s;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: bold;
}

.info-icon.active .info-dot {
    background-color: #409EFF;
}
</style>