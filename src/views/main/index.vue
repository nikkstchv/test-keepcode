<template>
  <div class="main">
    <task-list />
  </div>
</template>

<script>
import TaskList from "../../components/TaskList.vue";
export default {
  name: 'Main',
  components: { TaskList }
}
</script>
