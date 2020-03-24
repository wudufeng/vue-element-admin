<template>
  <div class="app-container">
    <avue-form ref="triggerForm" v-model="triggerForm" :option="option" @submit="submitForm">
      <template slot="platformCode">
        <PlatformCode v-model="triggerForm.platformCode" />
      </template>
    </avue-form>
  </div>
</template>

<script>

import { add } from '@/api/crud'
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
      routerVal: '',
      option: {
        labelWidth: '240',
        labelPosition: 'right',
        column: [
          { label: '平台编码', prop: 'platformCode', formslot: true, rules: [{ required: true, message: '内部平台编码不能为空', trigger: 'blur' }] },
          { label: '账号ID', prop: 'accountId', placeholder: '留空表示所有账号', valueDefault: '', dataType: 'number' },
          { label: '开始时间', prop: 'queryBeginTime', type: 'datetime', valueFormat: 'yyyyMMddHHmmss', rules: [{ required: true, message: '处理起始时间不能为空', trigger: 'blur' }] },
          { label: '结束时间', prop: 'queryEndTime', type: 'datetime', valueFormat: 'yyyyMMddHHmmss', rules: [{ required: true, message: '处理结束时间不能为空', trigger: 'blur' }] },
          { label: '分隔任务周期', prop: 'productSplitDate', type: 'select', valueDefault: '1440', dicData: [{ value: '60', label: '一小时' }, { value: '360', label: '六小时' }, { value: '720', label: '12小时' }, { value: '1440', label: '1天' }, { value: '21600', label: '15天' }, { value: '43200', label: '30天' }, { value: '', label: '系统默认' }, { value: '1', label: '1分钟' }, { value: '5', label: '5分钟' }, { value: '30', label: '30分钟' }] },
          { label: '额外请求参数', prop: 'extraJSON', type: 'text', span: 24 }
        ]
      }
    }
  },
  watch: {
    'triggerForm.platformCode': {
      handler(newVal, oldVal) {
        if (newVal === 'ALI') {
          this.triggerForm.extraJSON = '[{"productStatus":"onSelling","dateType":"CreateTime"},{"productStatus":"onSelling"},{"productStatus":"offline"},{"productStatus":"service_delete"}]'
        } else if (newVal === 'rakuten') {
          this.triggerForm.extraJSON = '[{"searchKey":"【"},{"searchKey":"☆"},{"searchKey":"★"},{"searchKey":"ー"}]'
        } else if (newVal === 'LAZADA') {
          this.triggerForm.extraJSON = '[{"filter":"live","dateType":"CreateTime"},{"filter":"all","dateType":"UpdateTime"},{"filter":"deleted"}]'
        } else if (newVal === 'EB') {
          this.triggerForm.extraJSON = '[{"method":"GetSellerEvents"},{"method":"GetSellerList","dateType":"EndTime","addDay":0}]'
        } else {
          this.triggerForm.extraJSON = ''
        }
      }
    }
  },
  created() {
    this.routerVal = this.$route.path
  },
  methods: {
    submitForm(form, done) {
      console.log(this.$refs['triggerForm'])
      this.$refs['triggerForm'].validate(valid => {
        if (valid) {
          // this.triggerForm.extraJSON = this.triggerForm.extraJSON.replace(/"/g, '%22').replace(/{/g, '%7b').replace(/}/g, '%7d').replace(/\[/g, '%5B').replace(/\]/g, '%5C')
          add(this.routerVal + 'List', this.triggerForm).then(response => {
            this.processResult = response.body
            this.$notify({
              title: '成功',
              message: '商品拉取处理中!',
              type: 'success',
              duration: 4000
            })
          })
        } else {
          return false
        }
      })
      done()
    }
  }
}
</script>
