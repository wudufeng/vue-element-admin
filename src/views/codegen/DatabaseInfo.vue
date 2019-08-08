<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.condition.tenantId" placeholder="租户" style="width: 200px;" class="filter-item" clearable />
      <el-input v-model="listQuery.condition.dbName" placeholder="名称" style="width: 200px;" class="filter-item" clearable />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleDetail('create', {})">
        新增
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="租户" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.tenantId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数据源名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.dbName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="JdbcUrl" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.jdbcUrl }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户名" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="密码" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.password }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最后更新时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="240" align="center">
        <template slot-scope="{row}">
          <router-link :to="'/codegen/'+row.id">
            <el-button size="mini">查表</el-button>
          </router-link>
          <el-button size="mini" @click="handleDetail('update',row)">编辑</el-button>
          <el-button size="mini" @click="rowDel(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.size" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="databaseInfoForm" label-position="right" label-width="46%">
        <el-row>
          <el-col style="width:400px;"><el-form-item prop="tenantId" label="租户"><el-input v-model="databaseInfoForm.tenantId" :readonly="dialogStatus==='view'" clearable /></el-form-item></el-col>
          <el-col style="width:400px;"><el-form-item prop="dbName" label="数据源名称"><el-input v-model="databaseInfoForm.dbName" :readonly="dialogStatus==='view'" clearable /></el-form-item></el-col>
        </el-row>
        <el-row>
          <el-col style="width:400px;"><el-form-item prop="jdbcUrl" label="JdbcUrl"><el-input v-model="databaseInfoForm.jdbcUrl" :readonly="dialogStatus==='view'" clearable /></el-form-item></el-col>
          <el-col style="width:400px;"><el-form-item prop="userName" label="用户名"><el-input v-model="databaseInfoForm.userName" :readonly="dialogStatus==='view'" clearable /></el-form-item></el-col>
        </el-row>
        <el-row>
          <el-col style="width:400px;"><el-form-item prop="password" label="密码"><el-input v-model="databaseInfoForm.password" :readonly="dialogStatus==='view'" clearable /></el-form-item></el-col>
          <el-col style="width:400px;"><el-form-item prop="id" label="主键" hidden><el-input v-model="databaseInfoForm.id" :readonly="dialogStatus==='view'" clearable /></el-form-item></el-col>
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button v-if="dialogStatus!=='view'" v-loading="loading" style="margin-left: 10px;" type="primary" @click="submitForm">
          Submit
        </el-button>
        <el-button @click="dialogFormVisible = false">
          Close
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getDatabaseInfoList, addDatabaseInfo, updateDatabaseInfo, removeDatabaseInfo } from '@/api/codegen'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'

const defaultForm = {
}

export default {
  name: 'DatabaseInfo',
  components: {
    Pagination },
  directives: { waves },
  data() {
    return {
      databaseInfoForm: Object.assign({}, defaultForm),
      loading: false,
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        'current': 1,
        'size': 20,
        'condition': {},
        'extra': {},
        'queryBeginTime': null,
        'queryEndTime': null
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        view: '查看',
        update: '编辑',
        create: '新增'
      },
      rules: {
        tenantId: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
        dbName: [{ required: true, message: '请输入数据源名称', trigger: 'blur' }],
        jdbcUrl: [{ required: true, message: '请输入JdbcUrl', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }, { min: 1, max: 64, message: '长度在 1 到 64 个字符', trigger: 'blur' }],
        userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getDatabaseInfoList(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.current = 1
      this.getList()
    },
    handleDetail(type, data) {
      this.dialogStatus = type
      this.databaseInfoForm = Object.assign({}, data)
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      this.dialogFormVisible = true
    },
    submitForm() {
      console.log(this.databaseInfoForm)
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.loading = true
          if (this.dialogStatus === 'create') {
            addDatabaseInfo(this.databaseInfoForm).then(response => {
              this.$notify({
                title: '成功',
                message: '新增数据源信息成功',
                type: 'success'
              })
              this.list.unshift(this.databaseInfoForm)
              this.loading = false
              this.dialogFormVisible = false
            })
          } else {
            updateDatabaseInfo(this.databaseInfoForm).then(response => {
              this.$notify({
                title: '成功',
                message: '修改数据源信息成功',
                type: 'success'
              })
              this.loading = false
              this.dialogFormVisible = false
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    rowDel: function(row, index) {
      const _this = this
      this.$confirm('是否确认删除记录', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function() {
          return removeDatabaseInfo(row.id)
        })
        .then(data => {
          _this.$message({
            showClose: true,
            message: '删除成功',
            type: 'success'
          })
        })
    }
  }
}
</script>
