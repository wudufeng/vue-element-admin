<!--触发调整库存-->
<template>
  <div class="trigger-container">
    <el-form ref="triggerForm" :model="triggerForm" :rules="rules" class="form-container">
      <div class="main-container">
        <el-row>
          <el-col :span="10">
            <el-form-item label="平台编码:" prop="platform" class="trigger-container-item">
              <PlatformCode v-model="triggerForm.platform" @change="getRuleConfigList" />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="规则类型:" prop="ruleType">
              <el-select v-model="triggerForm.ruleType" placeholder="Please select" default-first-option class="filter-item">
                <el-option label="AUTO" value="AUTO" />
                <el-option label="MANUAL" value="MANUAL" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item label="执行规则:" class="postInfo-container-item" prop="ruleConfigId">
              <el-select v-model="triggerForm.ruleConfigId" clearable placeholder="Search rule">
                <el-option v-for="(item) in ruleConfigListOptions" :key="item.id" :label="item.id + '-' + item.description" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row align="center">
          <el-col :span="20">
            <el-form-item style="margin-bottom: 40px;" prop="sku">
              <MDinput v-model.trim="triggerForm.sku" :maxlength="80" name="name" required>
                SKU
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
            <router-link :to="'/stock/logs/'+triggerForm.platform+'/'+processResult">
              <el-button style="margin-left: 10px;" type="info">
                查看执行结果
              </el-button>
            </router-link>
          </el-col>
        </el-row>
      </div>
    </el-form>
    <avue-crud :option="option" :data="data" :page="page" />
  </div>
</template>

<script>
import MDinput from '@/components/MDinput'
import { fetchList, operateStock } from '@/api/stock'
import PlatformCode from '@/components/PlatformCode'

export default {
  name: 'RuleConfigTrigger',
  components: { PlatformCode, MDinput },
  props: {
  },
  data() {
    return {
      triggerForm: Object.assign({}),
      loading: false,
      ruleConfigListOptions: [],
      rules: {
        sku: [{ required: true, message: '请输入要处理的Sku!', trigger: 'blur' }]
      },
      processResult: '',
      tempRoute: {},
      page: {
        pageSize: 20,
        total: 400
      },
      option: {
        border: true,
        index: true,
        expandLevel: 3,
        headerAlign: 'center',
        align: 'center',
        tree: true,
        labelWidth: 100,
        column: [{
          width: 130,
          label: '姓名1',
          prop: 'name',
          search: {
            searchFilterable: true
          }
        }, {
          label: '性别1',
          prop: 'sex'
        }, {
          label: '自定义图标',
          prop: 'icon',
          type: 'icon-select',
          iconList: [{
            label: '基本图表',
            list: ['el-icon-time', 'el-icon-bell', 'el-icon-star-on']
          }]
        }, {
          label: '复杂表头',
          children: [{
            label: '信息',
            children: [{
              label: '年龄',
              prop: 'age'
            }, {
              label: '手机号',
              prop: 'phone',
              search: {
                searchFilterable: true
              }
            }]
          }, {
            label: '级别',
            prop: 'grade',
            type: 'select',
            dicData: [{
              label: '测试',
              value: 1
            }]
          }]
        }, {
          label: '测试',
          prop: 'test'
        }],
        group: [{
          label: '用户信息',
          prop: 'jbxx',
          icon: 'el-icon-edit-outline',
          column: [
            {
              label: '姓名',
              prop: 'name'
            },
            {
              label: '年龄',
              prop: 'age'
            }
          ]
        }, {
          label: '其他信息',
          prop: 'jbxxs',
          icon: 'el-icon-edit-outline',
          column: [
            {
              label: '级别',
              prop: 'grade',
              type: 'select',
              dicData: [{
                label: '测试',
                value: 1
              }]
            },
            {
              label: '手机信息',
              prop: 'phone'
            },
            {
              label: '自定义图标',
              prop: 'icon',
              type: 'icon-select',
              iconList: [{
                label: '基本图表',
                list: ['el-icon-time', 'el-icon-bell', 'el-icon-star-on']
              }]
            }
          ]
        }]
      },
      data: [{
        id: '1',
        name: '张三',
        age: 14,
        grade: 1,
        phone1: '17547400800',
        phone: '17547400800',
        icon: 'el-icon-time',
        test: 1,
        sex: '男',
        children: [{
          id: '2',
          name: '李四',
          age: 20,
          grade: 1,
          sex: '男',
          test: 1,
          phone1: '17547400800',
          phone: '17547400800',
          icon: 'el-icon-bell',
          children: [{
            id: '3',
            name: '王五',
            age: 10,
            grade: 1,
            test: 1,
            sex: '女',
            icon: 'el-icon-star-on',
            phone1: '17547400800',
            phone: '17547400800'
          }]
        }]
      }, {
        id: '4',
        name: '王五',
        age: 10,
        grade: 1,
        test: 1,
        sex: '女',
        icon: 'el-icon-star-on',
        phone1: '17547400800',
        phone: '17547400800'
      }]
    }
  },
  methods: {
    getRuleConfigList() {
      if (this.triggerForm.platform === undefined) {
        return
      }
      fetchList(this.triggerForm.platform).then(response => {
        if (!response.body.data) return
        this.ruleConfigListOptions = response.body.data
      })
    },
    submitForm() {
      this.$refs.triggerForm.validate(valid => {
        this.processResult = ''
        if (valid) {
          this.loading = true
          operateStock(this.triggerForm).then(response => {
            this.processResult = response.body
            this.$notify({
              title: '成功',
              message: '触发调整触发成功!',
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
