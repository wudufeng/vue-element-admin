<template>
  <div class="components-container">
    <div class="editor-container">
      <json-editor ref="jsonEditor" v-model="value" />
    </div>
  </div>
</template>

<script>
import JsonEditor from '@/components/JsonEditor'
import { getProductPayload } from '@/api/product'

export default {
  name: 'ProductPayload',
  components: { JsonEditor },
  data() {
    return {
      value: 'Loading ...',
      listQuery: {
        platformCode: '',
        productId: ''
      }
    }
  },
  created() {
    this.listQuery.productId = this.$route.params && this.$route.params.productId
    this.listQuery.platformCode = this.$route.params && this.$route.params.platform
    this.getDetail()
  },
  methods: {
    getDetail() {
      getProductPayload(this.listQuery).then(response => {
        this.value = response.body.substring(0, 1) === '<' ? response.body : JSON.parse(response.body)
      })
    }
  }
}
</script>

<style scoped>
.editor-container{
  position: relative;
  height: 100%;
}
</style>

