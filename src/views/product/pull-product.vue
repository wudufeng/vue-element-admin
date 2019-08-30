<template>
  <div class="app-container">
    <el-row>
      <el-col :span="18">
        <avue-form ref="triggerForm" v-model="triggerForm" :option="option" @submit="submitForm">
          <template slot="platformCode">
            <PlatformCode v-model="triggerForm.platformCode" />
          </template>
        </avue-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { pullProduct } from '@/api/product'
import PlatformCode from '@/components/PlatformCode'

export default {
  name: 'PullProductTrigger',
  components: {
    PlatformCode },
  props: {
  },
  data() {
    return {
      triggerForm: {
      },
      loading: false,
      option: {
        labelWidth: '42%',
        labelPosition: 'right',
        column: [
          { label: '平台编码', prop: 'platformCode', formslot: true, rules: [{ required: true, message: '内部平台编码不能为空', trigger: 'blur' }] },
          { label: '账号ID', prop: 'accountId', placeholder: '留空表示所有账号' },
          { label: '刷新策略', prop: 'compareUseUpdateTime', type: 'radio', dicData: [{ value: true, label: '判断平台更新时间' }, { value: false, label: '对比字段' }] },
          { label: '商品状态', prop: 'status', type: 'select', dicData: [{ value: 1, label: '在线' }, { value: 2, label: '下线' }, { value: 3, label: '已删除）' }] },
          { label: '开始时间', prop: 'queryBeginTime', type: 'datetime', valueFormat: 'yyyyMMddHHmmss', rules: [{ required: true, message: '处理起始时间不能为空', trigger: 'blur' }] },
          { label: '结束时间', prop: 'queryEndTime', type: 'datetime', valueFormat: 'yyyyMMddHHmmss', rules: [{ required: true, message: '处理结束时间不能为空', trigger: 'blur' }] }
        ]
      }
    }
  },
  methods: {
    submitForm() {
      console.log(this.$refs['triggerForm'])
      this.$refs['triggerForm'].validate(valid => {
        if (valid) {
          this.loading = true
          pullProduct(this.triggerForm).then(response => {
            this.processResult = response.body
            this.$notify({
              title: '成功',
              message: '商品拉取处理中!',
              type: 'success',
              duration: 4000
            })
            this.loading = false
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>
