import { defineStore } from "pinia";
import { setTasksToLocalStorage } from "../utils/localStorage";

export const useTaskStore = defineStore('tasks', {
  state: () => ({
    tasks: [],
    editingTask: null,
  }),
  getters: {
    getUsers: (state) => new Set(state.tasks.map((el) => el.userId)),
    getTasks: (state) => state.tasks.slice().reverse()
  },
  actions: {
    findCurrTaskIndex(id) {
      return this.tasks.findIndex((el) => el.id === id)
    },
    toggleTaskStatus(id) {
      const i = this.findCurrTaskIndex(id)
      this.tasks[i].completed = !this.tasks[i].completed
      setTasksToLocalStorage(this.tasks)
    },
    deleteTask(id) {
      const i = this.findCurrTaskIndex(id)
      this.tasks.splice(i, 1)
      setTasksToLocalStorage(this.tasks)
    },
    saveTask(data) {
      const i = this.findCurrTaskIndex(data.id)
      this.tasks[i] = data
      setTasksToLocalStorage(this.tasks)
    },
    createTask(data) {
      this.tasks.push({
        userId: data.userId,
        id: this.tasks[this.tasks.length - 1].id + 1,
        title: data.title,
        completed: data.completed
      })
      setTasksToLocalStorage(this.tasks)
    },
  }
})
