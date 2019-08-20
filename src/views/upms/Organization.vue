<template>
  <div class="app-container">
    <el-container>
      <el-header>
        <div class="filter-container">
          <el-input v-model="listQuery.tenantId" placeholder="租户编码" style="width: 200px;" class="filter-item" clearable />
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="getList">
            搜索
          </el-button>
        </div>
      </el-header>
      <el-container>
        <el-aside align="center" style="background-color: #ffffff">
          <el-button-group>
            <el-button type="info" size="small" icon="el-icon-plus" @click="handleAction('add')">新增</el-button>
            <el-button type="info" size="small" icon="el-icon-edit" @click="handleAction('update')">编辑</el-button>
            <el-button type="info" size="small" icon="el-icon-delete" @click="remove">删除</el-button>
          </el-button-group>
          <el-input
            v-model="filterText"
            placeholder="输入关键字进行过滤"
            clearable
          />
          <el-tree
            ref="tree"
            :data="treeData"
            node-key="code"
            :expand-on-click-node="false"
            highlight-current
            :props="defaultProps"
            default-expand-all
            :filter-node-method="filterNode"
            @node-click="fetchData"
          />
        </el-aside>

        <el-main>
          <el-form ref="dataForm" :rules="rules" :model="organizationForm" label-position="right" label-width="42%" style="width: 40%">
            <el-row>
              <el-col><el-form-item prop="tenantId" label="租户"><el-input v-model="organizationForm.tenantId" readonly :disabled="dialogStatus==='view'" /></el-form-item></el-col>
            </el-row>
            <el-row>
              <el-col>
                <el-form-item prop="parentName" label="上级机构">
                  <el-input v-model="organizationForm.parentName" readonly :disabled="dialogStatus==='view'" />
                </el-form-item>
                <el-form-item prop="parentCode" hidden>
                  <el-input v-model="organizationForm.parentCode" :disabled="dialogStatus==='view'" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col><el-form-item prop="name" label="机构名称"><el-input v-model="organizationForm.name" :disabled="dialogStatus==='view'" clearable /></el-form-item></el-col>
            </el-row>
            <el-row>
              <el-col><el-form-item prop="sort" label="排序"><el-input v-model="organizationForm.sort" :disabled="dialogStatus==='view'" clearable /></el-form-item></el-col>
            </el-row>
            <el-row>
              <el-col align="center">
                <el-button v-if="dialogStatus === 'add'" size="mini" icon="el-icon-plus" @click="add">保存</el-button>
                <el-button v-if="dialogStatus === 'update'" size="mini" icon="el-icon-edit" @click="update">更新</el-button>
              </el-col>
            </el-row>
          </el-form>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { getOrganizationTree, addOrganization, getOrganizationDetail, updateOrganization, removeOrganization } from '@/api/upms'

const defaultForm = {
  parentCode: '',
  parentName: '',
  name: '',
  sort: ''
}

export default {
  name: 'Organization',
  components: {},
  data() {
    return {
      filterText: '',
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      treeData: [],
      listQuery: {
        tenantId: ''
      },
      dialogStatus: 'view',
      organizationForm: Object.assign({}, defaultForm),
      loading: false,
      rules: {
        tenantId: [{ required: true, message: '请输入租户编码', trigger: 'blur' }],
        name: [{ required: true, message: '请输入机构名称', trigger: 'blur' }],
        sort: [{ required: true, message: '请输入排序', trigger: 'blur' }]
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    getList() {
      if (this.listQuery.tenantId === '') {
        this.$message({
          message: '请输入租户编码',
          type: 'error'
        })
        return
      }
      getOrganizationTree(this.listQuery).then(response => {
        this.organizationForm = Object.assign({}, defaultForm)
        this.treeData = response.data
        this.dialogStatus = 'view'
        this.$refs.tree.setCurrentNode(0)
      })
    },
    handleAction(type) {
      this.$nextTick(() => {
        this.$refs.dataForm.clearValidate()
      })
      const node = this.$refs.tree.getCurrentNode()
      this.organizationForm = Object.assign({}, defaultForm)
      if (node === undefined || node === null) {
        this.organizationForm.tenantId = this.listQuery.tenantId
      } else if (type === 'add') {
        this.organizationForm.tenantId = this.listQuery.tenantId
        this.organizationForm.parentCode = node.code
        this.organizationForm.parentName = node.name
      } else {
        getOrganizationDetail(node.id).then(response => {
          this.organizationForm = response.data
          if (this.organizationForm.parentCode !== '') {
            this.organizationForm.parentName = this.$refs.tree.getNode(this.organizationForm.parentCode).label
          }
        })
      }
      this.dialogStatus = type
    },
    fetchData(row) {
      getOrganizationDetail(row.id).then(response => {
        this.organizationForm = response.data
        this.dialogStatus = 'view'
        if (this.organizationForm.parentCode !== '') {
          this.organizationForm.parentName = this.$refs.tree.getNode(this.organizationForm.parentCode).label
        }
      })
    },
    add() {
      console.log(this.organizationForm)
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.organizationForm.id = ''
          addOrganization(this.organizationForm).then(response => {
            this.$notify({
              title: '成功',
              message: '新增组织架构成功',
              type: 'success'
            })
            this.loading = false
            this.getList()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    update() {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.loading = true
          updateOrganization(this.organizationForm).then(response => {
            this.$notify({
              title: '成功',
              message: '修改组织架构成功',
              type: 'success'
            })
            this.loading = false
            this.getList()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    remove() {
      const _this = this
      const node = _this.$refs.tree.getCurrentNode()
      if (node == null) {
        return
      }
      this.$confirm('是否确认删除记录', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function() {
          return removeOrganization((node.id))
        })
        .then(data => {
          _this.$message({
            showClose: true,
            message: '删除成功',
            type: 'success'
          })
          _this.$refs.tree.remove(node)
          _this.$refs.tree.setCurrentNode(0)
        })
    }
  }
}
</script>
