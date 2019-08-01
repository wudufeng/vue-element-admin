<template>
  <div class="createSequenceDefinition-container">
    <el-form ref="sequenceDefinitionForm" :model="sequenceDefinitionForm" :rules="rules" label-width="46%" class="form-container">
      <div class="createSequenceDefinition-main-container">
        <el-row>
          <el-col>
            <div class="sequenceDefinitionInfo-container">
              <el-row>
                <el-col :span="4">
                  <el-form-item label="租户编码" prop="tenantId">
                    <el-input v-model="sequenceDefinitionForm.tenantId" />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item label="序列名称" prop="seqName">
                    <el-input v-model="sequenceDefinitionForm.seqName" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="4">
                  <el-form-item label="最小值" prop="minValue">
                    <el-input v-model="sequenceDefinitionForm.minValue" />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item label="最大值" prop="maxValue">
                    <el-input v-model="sequenceDefinitionForm.maxValue" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="4">
                  <el-form-item label="增长缓冲区" prop="increase">
                    <el-input v-model="sequenceDefinitionForm.increase" />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item label="字符长度" prop="charLength">
                    <el-input v-model="sequenceDefinitionForm.charLength" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="4">
                  <el-form-item label="序列前缀" prop="prefix">
                    <el-input v-model="sequenceDefinitionForm.prefix" />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item label="日期格式" prop="appendDateFormat">
                    <el-input v-model="sequenceDefinitionForm.appendDateFormat" placeholder="yyMMdd" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="4">
                  <el-form-item label="是否循环" prop="cycle">
                    <el-select v-model="sequenceDefinitionForm.cycle" placeholder="Please select" default-first-option>
                      <el-option label="是" value="true" />
                      <el-option label="否" value="false" />
                    </el-select>
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
import { addSequenceDefinition, getSequenceDefinitionDetail, updateSequenceDefinition } from '@/api/sequence'

const defaultForm = {
}

export default {
  name: 'CreateSequence',
  components: { },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      sequenceDefinitionForm: Object.assign({}, defaultForm),
      loading: false,
      seqId: null,
      rules: {
        tenantId: [{ required: true, message: '请输入租户编码!', trigger: 'blur' }],
        seqName: [{ required: true, message: '请输入序列名称!', trigger: 'blur' }],
        minValue: [{ required: true, message: '请输入最小值!', trigger: 'blur' }],
        maxValue: [{ required: true, message: '请输入最大值!', trigger: 'blur' }],
        increase: [{ required: true, message: '请输入增长缓冲区!', trigger: 'blur' }],
        cycle: [{ required: true, message: '请选择是否允许循环!', trigger: 'blur' }],
        charLength: [{ required: true, message: '请输入字符长度!', trigger: 'blur' }]
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
      this.seqId = id
    } else {
      this.sequenceDefinitionForm = Object.assign({}, defaultForm)
    }

    this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    fetchData(id) {
      getSequenceDefinitionDetail(id).then(response => {
        this.sequenceDefinitionForm = response.data
        this.setTagsViewTitle()
        this.setPageTitle()
      }).catch(err => {
        console.log(err)
      })
    },
    setTagsViewTitle() {
      const title = '修改序列'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.sequenceDefinitionForm.id}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    setPageTitle() {
      const title = '修改序列'
      document.title = `${title} - ${this.postForm.id}`
    },
    submitForm() {
      this.$refs.sequenceDefinitionForm.validate(valid => {
        if (valid) {
          this.loading = true
          if (!this.isEdit) {
            addSequenceDefinition(this.sequenceDefinitionForm).then(response => {
              this.$notify({
                title: '成功',
                message: 'Add SequenceDefinition Success',
                type: 'success'
              })
              this.loading = false
            })
          } else {
            updateSequenceDefinition(this.seqId, this.sequenceDefinitionForm).then(response => {
              this.$notify({
                title: '成功',
                message: 'Update SequenceDefinition Success',
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

.createSequenceDefinition-container {
  position: relative;

  .createSequenceDefinition-main-container {
    padding: 40px 45px 20px 50px;

    .sequenceDefinitionInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;
    }
  }
}
</style>
