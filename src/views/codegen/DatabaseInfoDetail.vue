<template>
  <div class="createDatabaseInfo-container">
    <el-form ref="databaseInfoForm" :model="databaseInfoForm" :rules="rules" class="form-container">
      <div class="createDatabaseInfo-main-container">
        <el-row>
          <el-col>
            <div class="databaseInfoInfo-container">
              <el-row>
                <el-col :span="6">
                  <el-form-item prop="field.propertyName" label="主键">
                    <el-input v-model="databaseInfoForm.id" />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item prop="field.propertyName" label="租户编码">
                    <el-input v-model="databaseInfoForm.tenantId" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6">
                  <el-form-item prop="field.propertyName" label="数据源名称">
                    <el-input v-model="databaseInfoForm.dbName" />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item prop="field.propertyName" label="JdbcUrl">
                    <el-input v-model="databaseInfoForm.jdbcUrl" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6">
                  <el-form-item prop="field.propertyName" label="用户名">
                    <el-input v-model="databaseInfoForm.userName" />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item prop="field.propertyName" label="密码">
                    <el-input v-model="databaseInfoForm.password" />
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
        <el-form-item style="margin-bottom: 30px;">
          <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">
            Submit
          </el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import { addDatabaseInfo, getDatabaseInfoDetail, updateDatabaseInfo } from '@/api/codegen'

const defaultForm = {
}

export default {
  name: 'DatabaseInfoDetail',
  components: { },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        this.$message({
          message: rule.field + '为必传项',
          type: 'error'
        })
        callback(new Error(rule.field + '为必传项'))
      } else {
        callback()
      }
    }
    return {
      databaseInfoForm: Object.assign({}, defaultForm),
      loading: false,
      rules: {
        id: [{ validator: validateRequire }],
        tenantId: [{ validator: validateRequire }],
        dbName: [{ validator: validateRequire }],
        jdbcUrl: [{ validator: validateRequire }],
        userName: [{ validator: validateRequire }],
        password: [{ validator: validateRequire }]
      },
      tempRoute: {}
    }
  },
  computed: {
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    } else {
      this.databaseInfoForm = Object.assign({}, defaultForm)
    }

    this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    fetchData(id) {
      const params = {
        id: id
      }
      getDatabaseInfoDetail(params).then(response => {
        this.databaseInfoForm = response.data
        this.setTagsViewTitle()
        this.setPageTitle()
      }).catch(err => {
        console.log(err)
      })
    },
    setTagsViewTitle() {
      const title = 'Edit DatabaseInfo'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.databaseInfoForm.id}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    setPageTitle() {
      const title = 'Edit DatabaseInfo'
      document.title = `${title} - ${this.postForm.id}`
    },
    submitForm() {
      console.log(this.databaseInfoForm)
      this.$refs.databaseInfoForm.validate(valid => {
        if (valid) {
          this.loading = true
          if (!this.isEdit) {
            addDatabaseInfo(this.databaseInfoForm).then(response => {
              this.$notify({
                title: '成功',
                message: 'Add DatabaseInfo Success',
                type: 'success'
              })
              this.loading = false
            })
          } else {
            updateDatabaseInfo(this.databaseInfoForm).then(response => {
              this.$notify({
                title: '成功',
                message: 'Update DatabaseInfo Success',
                type: 'success'
              })
              this.loading = false
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.createDatabaseInfo-container {
  position: relative;

  .createDatabaseInfo-main-container {
    padding: 40px 45px 20px 50px;

    .databaseInfoInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;
    }
  }
}
</style>
