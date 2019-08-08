<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.condition.tenantId" placeholder="租户编码" style="width: 200px;" class="filter-item" clearable />
      <el-input v-model="listQuery.condition.name" placeholder="租户名称" style="width: 200px;" class="filter-item" clearable />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleDetail('add', {})">
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
      <el-table-column label="租户编码" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.tenantId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="租户名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="租期开始时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.beginTime.split(' ')[0] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="租期结束时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.endTime.split(' ')[0] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="60px">
        <template slot-scope="scope">
          <span>{{ statusMap[scope.row.status] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系人" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.contactUser }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系电话" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.contactPhone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系邮箱" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.contactEmail }}</span>
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
      <el-table-column label="操作" align="center" width="240">
        <template slot-scope="{row}">
          <el-button size="mini" @click="handleDetail('view',row)">查看</el-button>
          <el-button size="mini" @click="handleDetail('update',row)">编辑</el-button>
          <el-button size="mini" @click="remove(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.size" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="tenantForm" label-position="right" label-width="46%">
        <el-row>
          <el-col style="width:400px;"><el-form-item prop="tenantId" label="租户编码"><el-input v-model="tenantForm.tenantId" :disabled="dialogStatus==='view'" clearable /></el-form-item></el-col>
          <el-col style="width:400px;"><el-form-item prop="name" label="租户名称"><el-input v-model="tenantForm.name" :disabled="dialogStatus==='view'" clearable /></el-form-item></el-col>
        </el-row>
        <el-row>
          <el-col style="width:400px;"><el-form-item prop="beginTime" label="租期开始时间">
            <el-date-picker v-model="tenantForm.beginTime" :disabled="dialogStatus==='view'" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="开始时间" clearable />
          </el-form-item></el-col>
          <el-col style="width:400px;"><el-form-item prop="endTime" label="租期结束时间">
            <el-date-picker v-model="tenantForm.endTime" :disabled="dialogStatus==='view'" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="开始时间" clearable />
          </el-form-item></el-col>
        </el-row>
        <el-row>
          <el-col style="width:400px;"><el-form-item prop="status" label="状态">
            <el-select v-model="tenantForm.status" :disabled="dialogStatus==='view'">
              <el-option v-for="(value, key) of statusMap" :key="key" :label="value" :value="key" />
            </el-select>
          </el-form-item></el-col>
          <el-col style="width:400px;"><el-form-item prop="contactUser" label="联系人"><el-input v-model="tenantForm.contactUser" :disabled="dialogStatus==='view'" clearable /></el-form-item></el-col>
        </el-row>
        <el-row>
          <el-col style="width:400px;"><el-form-item prop="contactPhone" label="联系电话"><el-input v-model="tenantForm.contactPhone" :disabled="dialogStatus==='view'" clearable /></el-form-item></el-col>
          <el-col style="width:400px;"><el-form-item prop="contactEmail" label="联系邮箱"><el-input v-model="tenantForm.contactEmail" :disabled="dialogStatus==='view'" clearable /></el-form-item></el-col>
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
import { getTenantList, addTenant, updateTenant, removeTenant } from '@/api/upms'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'

const defaultForm = {
}

export default {
  name: 'Tenant',
  components: {
    Pagination },
  directives: { waves },
  data() {
    return {
      tenantForm: Object.assign({}, defaultForm),
      loading: false,
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: false,
      listQuery: {
        'current': 1,
        'size': 20,
        'condition': {},
        'extra': {}
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        view: '查看',
        update: '编辑',
        add: '新增'
      },
      statusMap: {
        1: '正常',
        2: '冻结',
        3: '注销'
      },
      rules: {
        tenantId: [{ required: true, message: '请输入租户编码', trigger: 'blur' }],
        name: [{ required: true, message: '请输入租户名称', trigger: 'blur' }],
        beginTime: [{ required: true, message: '请输入租期开始时间', trigger: 'blur' }],
        endTime: [{ required: true, message: '请输入租期结束时间', trigger: 'blur' }],
        status: [{ required: true, message: '请输入状态：1正常 2冻结 3注销', trigger: 'blur' }],
        contactUser: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
        contactPhone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
        contactEmail: [{ required: true, message: '请输入联系邮箱', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getTenantList(this.listQuery).then(response => {
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
      this.tenantForm = Object.assign({}, data)
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      this.dialogFormVisible = true
    },
    submitForm() {
      console.log(this.tenantForm)
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.loading = true
          if (this.dialogStatus === 'add') {
            addTenant(this.tenantForm).then(response => {
              this.$notify({
                title: '成功',
                message: '新增租户信息成功',
                type: 'success'
              })
              this.list.unshift(this.tenantForm)
              this.loading = false
              this.dialogFormVisible = false
              this.getList()
            })
          } else {
            updateTenant(this.tenantForm).then(response => {
              this.$notify({
                title: '成功',
                message: '修改租户信息成功',
                type: 'success'
              })
              this.loading = false
              this.dialogFormVisible = false
              this.getList()
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    remove(row, index) {
      const _this = this
      this.$confirm('是否确认删除记录', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function() {
          return removeTenant(row.tenantId)
        })
        .then(data => {
          _this.$message({
            showClose: true,
            message: '删除成功',
            type: 'success'
          })
          this.getList()
        })
    }
  }
}
</script>
