<template>
  <div class="trigger-container">
    <el-form ref="triggerForm" :model="triggerForm" label-position="right" :rules="rules" class="form-container">
      <div class="main-container">
        <el-row>
          <el-col :span="10">
            <el-form-item label="平台编码:" prop="platformCode" class="trigger-container-item">
              <PlatformCode v-model="triggerForm.platformCode" />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="账号:" prop="accountId">
              <el-input v-model="triggerForm.accountId" style="width: 180px;" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="刷新策略:" prop="compareUseUpdateTime">
              <el-select v-model="triggerForm.compareUseUpdateTime">
                <el-option value="true" label="判断平台更新时间" />
                <el-option value="false" label="对比字段" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="商品状态:" prop="status">
              <el-select v-model="triggerForm.status" placeholder="请选择要获取的商品状态" clearable>
                <el-option value="1" label="在线" />
                <el-option value="2" label="下线" />
                <el-option value="3" label="已删除" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="开始时间:" prop="queryBeginTime">
              <el-date-picker v-model="triggerForm.queryBeginTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="结束时间:" prop="queryEndTime">
              <el-date-picker v-model="triggerForm.queryEndTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-button style="margin-left: 10px;" type="primary" @click="triggerForm = {}">
              Reset
            </el-button>
          </el-col>
          <el-col :span="10">
            <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">
              Submit
            </el-button>
          </el-col>
        </el-row>
      </div>
    </el-form>
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
      rules: {
        platformCode: [{ required: true, message: '请选择平台编码!', trigger: 'change' }],
        accountId: [{ required: true, message: '请输入账号!', trigger: 'blur' }, { min: 1, max: 6, message: '长度在 1 到 6 个字符', trigger: 'blur' }],
        queryBeginTime: [{ required: true, message: '请选择开始时间!', trigger: 'change' }],
        queryEndTime: [{ required: true, message: '请选择结束时间!', trigger: 'change' }]
      }
    }
  },
  methods: {
    submitForm() {
      this.$refs.triggerForm.validate(valid => {
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

<style lang="scss" scoped>

.trigger-container {
  position: relative;

  .main-container {
    padding: 40px 45px 20px 50px;

    .trigger-container {
      position: relative;
      margin-bottom: 10px;

      .trigger-container-item {
        float: left;
      }
    }
  }

}
</style>
