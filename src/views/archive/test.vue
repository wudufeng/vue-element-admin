
<template>
  <div class="app-container">
    <avue-form v-model="form" :option="option" @submit="handleSubmit" />

  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        text: ''
      },
      option: {
        column: [{
          label: '字典',
          prop: 'text',
          dicUrl: '/test',
          dicMethod: 'get',
          dicQuery: {
            a: 1
          },
          span: 24,
          type: 'select'
        }]
      }
    }
  },
  methods: {
    handleSubmit(form) {
      this.$message.success(JSON.stringify(this.form))
    }
  }
}
</script>
