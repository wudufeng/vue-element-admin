<template>
  <div class="components-container">
    <div class="editor-container">
      <json-editor v-show="jsonShow" ref="jsonEditor" v-model="jsonValue" />
      <div v-show="xmlShow" v-html="xmlValue" />
    </div>
  </div>
</template>

<script>
import JsonEditor from '@/components/JsonEditor'
import vkbeautify from 'vkbeautify'
import formatXml from '@/utils/format-xml'
import { getProductPayload } from '@/api/product'

export default {
  name: 'ProductPayload',
  components: {
    JsonEditor },
  data() {
    return {
      jsonValue: 'Loading ...',
      xmlValue: 'Loading ...',
      jsonShow: false,
      xmlShow: false,
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
        if (response.body !== undefined && response.body.substring(0, 1) === '<') {
          // xml
          this.xmlValue = formatXml(vkbeautify.xml(response.body))
          // this.showXml(response.body)
          this.xmlShow = true
          this.jsonShow = false
        } else if (response.body !== undefined) {
          this.jsonValue = JSON.parse(response.body)
          this.xmlShow = false
          this.jsonShow = true
        }
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
.code-string{ color: #993300; }
.code-number{ color: #cc00cc; }
.code-boolean{ color: #000033; }
.code-key{ color: #003377; font-weight: bold; }
.code-null{ color: magenta; }
</style>

