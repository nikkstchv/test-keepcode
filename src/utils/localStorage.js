import { getTodos } from "./api.js";

const TASKS_LOCAL_STORAGE_KEY = 'tasks'

export function getTasks() {
  return new Promise((resolve) => {
    const tasks = localStorage.getItem(TASKS_LOCAL_STORAGE_KEY)
    if (!tasks) {
      getTodos().then((response) => {
        localStorage.setItem(TASKS_LOCAL_STORAGE_KEY, JSON.stringify(response))
        resolve(response)
        })
      }
    else resolve(JSON.parse(tasks))
  })
}

export function setTasksToLocalStorage(data) {
  localStorage.setItem(TASKS_LOCAL_STORAGE_KEY, JSON.stringify(data))
}
