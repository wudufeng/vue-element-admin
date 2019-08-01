<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.condition.tenantId" placeholder="租户" style="width: 200px;" class="filter-item" clearable />
      <el-date-picker v-model="listQuery.queryBeginTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="开始时间" clearable />
      <el-date-picker v-model="listQuery.queryEndTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="结束时间" clearable />
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
      style="width: 100%"
    >
      <el-table-column label="主键" width="120px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="租户编码" width="120px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.tenantId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数据源名称" width="120px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.dbName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="JdbcUrl" width="120px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.jdbcUrl }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户名" width="120px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="密码" width="120px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.password }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="160px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最后更新时间" width="160px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="240" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleDetail('view',row)">查看</el-button>
          <el-button type="info" size="mini" @click="handleDetail('update',row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="rowDel(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.size" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="databaseInfoForm" label-position="right" label-width="46%">
        <el-row>
          <el-col style="width:400px;"><el-form-item prop="id" label="主键"><el-input v-model="databaseInfoForm.id" :readonly="dialogStatus==='view'" clearable /></el-form-item></el-col>
          <el-col style="width:400px;"><el-form-item prop="tenantId" label="租户编码"><el-input v-model="databaseInfoForm.tenantId" :readonly="dialogStatus==='view'" clearable /></el-form-item></el-col>
        </el-row>
        <el-row>
          <el-col style="width:400px;"><el-form-item prop="dbName" label="数据源名称"><el-input v-model="databaseInfoForm.dbName" :readonly="dialogStatus==='view'" clearable /></el-form-item></el-col>
          <el-col style="width:400px;"><el-form-item prop="jdbcUrl" label="JdbcUrl"><el-input v-model="databaseInfoForm.jdbcUrl" :readonly="dialogStatus==='view'" clearable /></el-form-item></el-col>
        </el-row>
        <el-row>
          <el-col style="width:400px;"><el-form-item prop="userName" label="用户名"><el-input v-model="databaseInfoForm.userName" :readonly="dialogStatus==='view'" clearable /></el-form-item></el-col>
          <el-col style="width:400px;"><el-form-item prop="password" label="密码"><el-input v-model="databaseInfoForm.password" :readonly="dialogStatus==='view'" clearable /></el-form-item></el-col>
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
import { getDatabaseInfoList, addDatabaseInfo, getDatabaseInfoDetail, updateDatabaseInfo, removeDatabaseInfo } from '@/api/codegen'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'

const defaultForm = {
}

export default {
  name: 'DatabaseInfoList',
  components: {
    Pagination },
  directives: { waves },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === undefined || value === '') {
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
        id: [{ validator: validateRequire }],
        tenantId: [{ validator: validateRequire }],
        dbName: [{ validator: validateRequire }],
        jdbcUrl: [{ validator: validateRequire }],
        userName: [{ validator: validateRequire }],
        password: [{ validator: validateRequire }]
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
          const params = {
            id: row.id
          }
          return removeDatabaseInfo(params)
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
