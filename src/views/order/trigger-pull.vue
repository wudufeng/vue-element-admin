<template>
  <div class="app-container">
    <el-row>
      <el-col :span="18">
        <avue-form v-model="data" :option="option" @submit="handleSubmit" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { add } from '@/api/crud'

export default {
  name: 'OrderPullTrigger',
  components: {},
  props: {
  },
  data() {
    return {
      routerVal: '',
      data: {},
      option: {
        label: '触发拉单任务',
        labelWidth: '238',
        labelPosition: 'right',
        column: [
          { label: '平台编码', prop: 'platformCode', type: 'select', rules: [{ required: true, message: '内部平台编码不能为空', trigger: 'blur' }], dicData: [{ label: 'SHOPEE', value: 'SHOPEE' }, { label: '乐天', value: 'rakuten' }, { label: 'FLIPKART', value: 'Flipkart' }] },
          { label: '账号ID', prop: 'accountId', rules: [{ required: true, message: '账号ID不能为空', trigger: 'blur' }] },
          { label: '开始时间', prop: 'queryBeginTime', type: 'datetime', valueFormat: 'yyyyMMddHHmmss' },
          { label: '结束时间', prop: 'queryEndTime', type: 'datetime', valueFormat: 'yyyyMMddHHmmss' },
          { label: '平台订单号', prop: 'platformOrderId' },
          { label: '额外请求参数', prop: 'extraJSON', type: 'text', span: 24 }
          // { label: '刷新策略', prop: 'compareUseUpdateTime', rules: [{ required: true, message: '刷新策略不能为空', trigger: 'blur' }], type: 'select', dicData: [{ value: true, label: '判断平台更新时间' }, { value: false, label: '对比字段' }] }
        ]
      }
    }
  },
  created() {
    this.routerVal = this.$route.path
  },
  methods: {
    handleSubmit(data, done) {
      var pullDetailURL = ''
      if (this.data.platformOrderId === '') {
        if (this.data.queryBeginTime === '') {
          this.$message.warning('开始时间不能为空!')
          done()
          return
        }
        if (this.data.queryEndTime === '') {
          this.$message.warning('结束时间不能为空!')
          done()
          return
        }
        pullDetailURL = '/list'
      } else {
        pullDetailURL = '/detail'
      }
      add(this.routerVal + pullDetailURL, this.data).then(() => {
        this.loading = false
        this.$notify({
          title: 'Success',
          message: '触发成功!',
          type: 'success'
        })
        setTimeout(() => {
          done()
        }, 3000)
      })
      done()
    }
  }
}
</script>
