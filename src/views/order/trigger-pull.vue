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
import { get } from '@/api/crud'

export default {
  name: 'OrderPullTrigger',
  components: {},
  props: {
  },
  data() {
    return {
      routerVal: '',
      data: {},
      datas: [],
      option: {
        label: '触发拉单任务',
        labelWidth: '38%',
        labelPosition: 'right',
        column: [
          { label: '内部平台编码', prop: 'platformCode', rules: [{ required: true, message: '内部平台编码不能为空', trigger: 'blur' }] },
          { label: '账号ID', prop: 'accountId', rules: [{ required: true, message: '账号ID不能为空', trigger: 'blur' }] },
          { label: '开始时间', prop: 'queryBeginTime', type: 'datetime', valueFormat: 'yyyyMMddHHmmss', rules: [{ required: true, message: '处理起始时间不能为空', trigger: 'blur' }] },
          { label: '结束时间', prop: 'queryEndTime', type: 'datetime', valueFormat: 'yyyyMMddHHmmss', rules: [{ required: true, message: '处理结束时间不能为空', trigger: 'blur' }] },
          { label: '刷新策略', prop: 'compareUseUpdateTime', rules: [{ required: true, message: '刷新策略不能为空', trigger: 'blur' }], type: 'select', dicData: [{ value: true, label: '判断平台更新时间' }, { value: false, label: '对比字段' }] }
        ]
      }
    }
  },
  created() {
    this.routerVal = this.$route.path
  },
  methods: {
    handleSubmit(data, done) {
      get(this.routerVal, this.data).then(() => {
        this.loading = false
        this.$notify({
          title: 'Success',
          message: '更新成功!',
          type: 'success'
        })
        setTimeout(() => {
          done()
        }, 3000)
      })
    }
  }
}
</script>
