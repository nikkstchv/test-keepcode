<template>
  <el-dialog :model-value="show" :title="store.editingTask ? 'Изменить задачу' : 'Добавить задачу'" width="80%" :before-close="handleClose">
    <el-form label-position="top">
      <el-form-item label="ID пользователя">
        <el-select v-model="userId" style="width: 100%;" placeholder="ID пользователя">
          <el-option v-for="user in store.getUsers" :value="user"/>
        </el-select>
      </el-form-item>
      <el-form-item label="Заголовок">
        <el-input placeholder="Заголовок" v-model="title"/>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="completed">
          Выполнена
        </el-checkbox>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="default" @click="handleClose">
        Отмена
      </el-button>
      <el-button type="primary" :disabled="title.length === 0 || !userId" @click="handleConfirm">
        Подтвердить
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useTaskStore } from "../store/taskStore"

defineProps({
  show: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['toggle'])

const store = useTaskStore()

const userId = ref(1)
const title = ref('')
const completed = ref(false)

// methods
const handleConfirm = () => {
  if (store.editingTask !== null) {
    store.saveTask({
      id: store.editingTask.id,
      userId: userId.value,
      title: title.value,
      completed: completed.value
    })
  } else {
    store.createTask({
      userId: userId.value,
      title: title.value,
      completed: completed.value
    })
  }
  clearForm()
  emit('toggle')
}

const handleClose = () => {
  clearForm()
  emit('toggle')
}

const clearForm = () => {
  if (store.editingTask !== null) store.editingTask = null
  title.value = ''
  userId.value = ''
  completed.value = false
}

// watch
watch(
  () => store.editingTask,
  (newValue) => {
    if (newValue !== null) {
      title.value = newValue.title
      userId.value = newValue.userId
      completed.value = newValue.completed
      emit('toggle')
    }
  }
)
</script>

