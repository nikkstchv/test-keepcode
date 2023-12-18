<template>
  <el-tabs v-model="activeTab" type="border-card" class="task-list-container" addable @tab-add="showDialog = true">
    <el-select v-model="currentUser" clearable placeholder="ID пользователя" style="width: 100%; margin-bottom: 15px">
      <el-option v-for="user in getUsers" :value="user" />
    </el-select>
    <el-tab-pane v-loading="isLoading" name="all">
      <template #label>
        <el-badge :value="allTasks.length" type="info">
          Все
        </el-badge>
      </template>
      <template v-if="allTasks.length > 0">
        <el-scrollbar>
          <task-card v-for="task in pagedAllTasksData" :key="task.id" :task="task" />
          <el-pagination
          layout="prev, pager, next"
          :total="allTasks.length"
          @current-change="setAllTasksPage" />
        </el-scrollbar>
      </template>
      <el-card v-else>
        Нет задач
      </el-card>
    </el-tab-pane>
    <el-tab-pane v-loading="isLoading" name="completed">
      <template #label>
        <el-badge :value="completedTasks.length" type="primary">
          Выполнено
        </el-badge>
      </template>
      <template v-if="completedTasks.length > 0">
        <el-scrollbar>
          <task-card v-for="task in pagedCompletedTasks" :key="task.id" :task="task" />
          <el-pagination
            layout="prev, pager, next"
            :total="completedTasks.length"
            @current-change="setCompletedTasksPage" />
        </el-scrollbar>
      </template>
      <el-card v-else>
        Нет задач
      </el-card>
    </el-tab-pane>
    <el-tab-pane v-loading="isLoading" name="incompleted">
      <template #label>
        <el-badge :value="incompletedTasks.length">
          Не выполнено
        </el-badge>
      </template>
      <template v-if="incompletedTasks.length > 0">
        <el-scrollbar>
          <task-card v-for="task in pagedIncompletedTasks" :key="task.id" :task="task" />
          <el-pagination
            layout="prev, pager, next"
            :total="completedTasks.length"
            @current-change="setIncompletedTasksPage" />
        </el-scrollbar>
      </template>
      <el-card v-else>
        Нет задач
      </el-card>
    </el-tab-pane>
  </el-tabs>
  <task-dialog :show="showDialog" @toggle="showDialog = !showDialog" />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from "pinia"
import { getTasks as initTasks } from "../utils/localStorage"
import { useTaskStore } from "../store/taskStore"
import TaskCard from "./TaskCard.vue"
import TaskDialog from "./TaskDialog.vue"

const { tasks, getTasks, getUsers } = storeToRefs(useTaskStore())

const activeTab = ref('all')
const isLoading = ref(true)
const showDialog = ref(false)
const currentUser = ref('')

const pageSize = ref(8)
const currAllTasksPage = ref(1)
const currCompletedPage = ref(1)
const currIncompletedPage = ref(1)

// computed
const allTasks = computed(() => {
  const tasks = getTasks.value
  if (currentUser.value.length !== 0) {
    const filteredTasks = tasks.filter((elem) => elem.userId === currentUser.value)
    return filteredTasks
  } else {
    return tasks
  }
})
const pagedAllTasksData = computed(() => {
  return allTasks.value.slice(
    pageSize.value * currAllTasksPage.value - pageSize.value,
    pageSize.value * currAllTasksPage.value
  );
})
const setAllTasksPage = (val) => {
  currAllTasksPage.value = val;
}

const incompletedTasks = computed(() => {
  return allTasks.value.filter(elem => elem.completed === false)
})
const pagedIncompletedTasks = computed(() => {
  return incompletedTasks.value.slice(
    pageSize.value * currIncompletedPage.value - pageSize.value,
    pageSize.value * currIncompletedPage.value
  );
})
const setIncompletedTasksPage = (val) => {
  currIncompletedPage.value = val;
}

const completedTasks = computed(() => {
  return allTasks.value.filter(elem => elem.completed === true)
})
const pagedCompletedTasks = computed(() => {
  return completedTasks.value.slice(
    pageSize.value * currCompletedPage.value - pageSize.value,
    pageSize.value * currCompletedPage.value
  );
})
const setCompletedTasksPage = (val) => {
  currCompletedPage.value = val;
}

onMounted(async () => {
  tasks.value = await initTasks()
  isLoading.value = false
})
</script>