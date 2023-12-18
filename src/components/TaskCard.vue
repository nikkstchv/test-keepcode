<template>
  <el-card class="task-card">
    <template #default>
      <div class="content">
        <span class="title">
          <div style="font-weight: bold">
            Пользователь: {{ task.userId }}
          </div>
          {{ task.title }}
        </span>
        <div class="controls">
          <el-tooltip :content="task.completed ? 'Начать заново' : 'Завершить'" effect="light" placement="top">
            <template #default>
              <el-button v-if="!task.completed" type="primary" plain @click="handleToggle" :icon="select" />
              <el-button v-else type="danger" plain @click="handleToggle" :icon="close" />
            </template>
          </el-tooltip>
          <el-tooltip content="Удалить" effect="light" placement="top">
            <template #default>
              <el-button type="danger" @click="handleDelete" :icon="del" />
            </template>
          </el-tooltip>
          <el-tooltip content="Редактировать" effect="light" placement="top">
            <template #default>
              <el-button type="info" plain @click="handleEdit" :icon="edit" />
            </template>
          </el-tooltip>
        </div>
      </div>
    </template>
  </el-card>
</template>

<script setup>
import { computed } from 'vue'
import { ElMessageBox } from "element-plus"
import { useTaskStore } from "../store/taskStore"
import { Select, CloseBold, Delete, Edit } from '@element-plus/icons-vue'

// props
const props = defineProps({
  task: {
    type: Object,
    required: true,
  },
})

const store = useTaskStore()

// computed
const close = computed(() => CloseBold)
const select = computed(() => Select)
const del = computed(() => Delete)
const edit = computed(() => Edit)

// methods
const handleToggle = () => {
  store.toggleTaskStatus(props.task.id)
}
const handleEdit = () => {
  store.editingTask = {...props.task}
}

const handleDelete = () => {
  ElMessageBox.confirm(
    'Удалить задачу?',
    '',
    {
      confirmButtonText: 'Удалить',
      cancelButtonText: 'Отмена'
    }
  ).then(() => {
    store.deleteTask(props.task.id)
  }).catch(() => {})
}
</script>
