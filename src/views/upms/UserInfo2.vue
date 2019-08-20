<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.condition.tenantId" placeholder="租户" style="width: 200px;" class="filter-item" clearable />
      <el-date-picker v-model="listQuery.queryBeginTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" placeholder="开始时间" clearable />
      <el-date-picker v-model="listQuery.queryEndTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" placeholder="结束时间" clearable />
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
      <el-table-column label="用户名" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="昵称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.realname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.sex }}</span>
        </template>
      </el-table-column>
      <el-table-column label="头像url" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.headImgUrl }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号码" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Email" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所在国家" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.country }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所在省份" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.province }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所在城市" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.city }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.status }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改时间" align="center">
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
      <el-form ref="dataForm" :rules="rules" :model="userInfoForm" label-position="right" label-width="46%">
        <el-row>
          <el-col style="width:400px;"><el-form-item prop="userId" label="主键ID"><el-input v-model="userInfoForm.userId" :disabled="dialogStatus==='view'" clearable /></el-form-item></el-col>
          <el-col style="width:400px;"><el-form-item prop="username" label="用户名"><el-input v-model="userInfoForm.username" :disabled="dialogStatus==='view'" clearable /></el-form-item></el-col>
        </el-row>
        <el-row>
          <el-col style="width:400px;"><el-form-item prop="password" label="登录密码"><el-input v-model="userInfoForm.password" :disabled="dialogStatus==='view'" clearable /></el-form-item></el-col>
          <el-col style="width:400px;"><el-form-item prop="nickname" label="昵称"><el-input v-model="userInfoForm.nickname" :disabled="dialogStatus==='view'" clearable /></el-form-item></el-col>
        </el-row>
        <el-row>
          <el-col style="width:400px;"><el-form-item prop="realname" label="姓名"><el-input v-model="userInfoForm.realname" :disabled="dialogStatus==='view'" clearable /></el-form-item></el-col>
          <el-col style="width:400px;"><el-form-item prop="sex" label="性别"><el-input v-model="userInfoForm.sex" :disabled="dialogStatus==='view'" clearable /></el-form-item></el-col>
        </el-row>
        <el-row>
          <el-col style="width:400px;"><el-form-item prop="headImgUrl" label="头像url"><el-input v-model="userInfoForm.headImgUrl" :disabled="dialogStatus==='view'" clearable /></el-form-item></el-col>
          <el-col style="width:400px;"><el-form-item prop="phone" label="手机号码"><el-input v-model="userInfoForm.phone" :disabled="dialogStatus==='view'" clearable /></el-form-item></el-col>
        </el-row>
        <el-row>
          <el-col style="width:400px;"><el-form-item prop="email" label="Email"><el-input v-model="userInfoForm.email" :disabled="dialogStatus==='view'" clearable /></el-form-item></el-col>
          <el-col style="width:400px;"><el-form-item prop="country" label="所在国家"><el-input v-model="userInfoForm.country" :disabled="dialogStatus==='view'" clearable /></el-form-item></el-col>
        </el-row>
        <el-row>
          <el-col style="width:400px;"><el-form-item prop="province" label="所在省份"><el-input v-model="userInfoForm.province" :disabled="dialogStatus==='view'" clearable /></el-form-item></el-col>
          <el-col style="width:400px;"><el-form-item prop="city" label="所在城市"><el-input v-model="userInfoForm.city" :disabled="dialogStatus==='view'" clearable /></el-form-item></el-col>
        </el-row>
        <el-row>
          <el-col style="width:400px;"><el-form-item prop="address" label="住址"><el-input v-model="userInfoForm.address" :disabled="dialogStatus==='view'" clearable /></el-form-item></el-col>
          <el-col style="width:400px;"><el-form-item prop="signature" label="个性签名"><el-input v-model="userInfoForm.signature" :disabled="dialogStatus==='view'" clearable /></el-form-item></el-col>
        </el-row>
        <el-row>
          <el-col style="width:400px;"><el-form-item prop="status" label="状态"><el-input v-model="userInfoForm.status" :disabled="dialogStatus==='view'" clearable /></el-form-item></el-col>
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
import { getUserInfoList, addUserInfo, getUserInfoDetail, updateUserInfo, removeUserInfo } from '@/api/upms'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'

const defaultForm = {
}

export default {
  name: 'UserInfo2',
  components: {
    Pagination },
  directives: { waves },
  data() {
    return {
      userInfoForm: Object.assign({}, defaultForm),
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
      rules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getUserInfoList(this.listQuery).then(response => {
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
      this.userInfoForm = Object.assign({}, data)
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      this.dialogFormVisible = true
    },
    fetchData(row) {
      getUserInfoDetail(row.user_id).then(response => {
        this.userInfoForm = response.data
      }).catch(err => {
        console.log(err)
      })
    },
    submitForm() {
      console.log(this.userInfoForm)
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.loading = true
          if (this.dialogStatus === 'add') {
            addUserInfo(this.userInfoForm).then(response => {
              this.$notify({
                title: '成功',
                message: '新增用户信息成功',
                type: 'success'
              })
              this.list.unshift(this.userInfoForm)
              this.loading = false
              this.dialogFormVisible = false
              this.getList()
            })
          } else {
            updateUserInfo(this.userInfoForm).then(response => {
              this.$notify({
                title: '成功',
                message: '修改用户信息成功',
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
          return removeUserInfo(row.user_id)
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
