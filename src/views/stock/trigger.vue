<!--触发调整库存-->
<template>
  <div class="trigger-container">
    <el-form ref="triggerForm" :model="triggerForm" :rules="rules" class="form-container">
      <div class="main-container">
        <el-row>
          <el-col :span="12">
            <el-form-item label="平台编码:" prop="platform" class="trigger-container-item">
              <PlatformCode v-model="triggerForm.platform" @change="getRuleConfigList" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="规则类型:" prop="ruleType">
              <el-select v-model="triggerForm.ruleType" placeholder="Please select" default-first-option class="filter-item">
                <el-option label="AUTO" value="AUTO" />
                <el-option label="MANUAL" value="MANUAL" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="执行规则:" class="postInfo-container-item" prop="ruleConfigId">
              <el-select v-model="triggerForm.ruleConfigId" clearable placeholder="Search rule">
                <el-option v-for="(item) in ruleConfigListOptions" :key="item.id" :label="item.id + '-' + item.description" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="账号:" class="postInfo-container-item" prop="accountId">
              <el-input v-model="triggerForm.accountId" clearable placeholder="请输入账号" style="width: 240px" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item v-show="batchUpdate" label="修改值:" class="postInfo-container-item" prop="updateStock">
              <el-input-number v-model="triggerForm.updateStock" controls-position="right" :min="0" :max="2000" value="0" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row align="center">
          <el-col :span="24">
            <el-form-item style="margin-bottom: 40px;" prop="sku">
              <MDinput v-model.trim="triggerForm.sku" name="name">
                SKU
              </MDinput>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row align="center">
          <el-col :span="24">
            <el-form-item v-show="batchUpdate" style="margin-bottom: 40px;" prop="sku">
              <MDinput v-model.trim="triggerForm.platformProductIds" name="platformProductIds">
                平台商品编码
              </MDinput>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row align="center">
          <el-col :span="24">
            <el-form-item v-show="batchUpdate" style="margin-bottom: 40px;" prop="sku">
              <MDinput v-model.trim="triggerForm.platformSkus" name="platformSkus">
                Seller Sku
              </MDinput>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3">
            <el-button style="margin-left: 10px;" type="primary" @click="triggerForm = {}">
              Reset
            </el-button>
          </el-col>
          <el-col :span="3">
            <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">
              Submit
            </el-button>
          </el-col>
          <el-col v-if="processResult !== ''" :span="3">
            <router-link :to="'operate-logs/'+triggerForm.platform+'/'+processResult">
              <el-button style="margin-left: 10px;" type="info">
                查看执行结果
              </el-button>
            </router-link>
          </el-col>
        </el-row>
      </div>
    </el-form>
  </div>
</template>

<script>
import MDinput from '@/components/MDinput'
import { fetchList, operateStock, batchUpdateStock } from '@/api/stock'
import PlatformCode from '@/components/PlatformCode'

export default {
  name: 'RuleConfigTrigger',
  components: { PlatformCode, MDinput },
  props: {
  },
  data() {
    return {
      triggerForm: { 'ruleConfigId': '' },
      loading: false,
      ruleConfigListOptions: [],
      rules: {
      },
      batchUpdate: false,
      processResult: '',
      tempRoute: {}
    }
  },
  watch: {
    'triggerForm.ruleConfigId': {
      handler(newVal, oldVal) {
        if (newVal === '0') {
          this.batchUpdate = true
        } else {
          this.batchUpdate = false
        }
      }
    }
  },
  methods: {
    getRuleConfigList() {
      if (this.triggerForm.platform === undefined) {
        return
      }
      const conditions = { 'condition': { 'platformCode': this.triggerForm.platform }}
      fetchList(conditions).then(response => {
        if (!response.body.data) return
        this.ruleConfigListOptions = response.body.data
        this.ruleConfigListOptions[this.ruleConfigListOptions.length] = { 'id': '0', 'description': '自定义调整规则' }
      })
    },
    submitForm() {
      if (this.loading === true) return
      this.$refs.triggerForm.validate(valid => {
        this.processResult = ''
        if (valid) {
          this.loading = true
          if (this.triggerForm.ruleConfigId === '0') {
            batchUpdateStock(this.triggerForm).then(response => {
              this.processResult = response.body
              this.$notify({
                title: '成功',
                message: '触发调整触发成功!',
                type: 'success',
                duration: 4000
              })
            })
          } else {
            operateStock(this.triggerForm).then(response => {
              this.processResult = response.body
              this.$notify({
                title: '成功',
                message: '触发调整触发成功!',
                type: 'success',
                duration: 4000
              })
            })
          }
          setTimeout(() => {
            this.loading = false
          }, 3000)
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
