<template>
  <div class="app-container">
    <avue-crud
      ref="crud"
      v-model="data"
      :option="option"
      :data="datas"
      :table-loading="loading"
      :page="page"
      @search-change="handleSearch"
      @row-save="handleAdd"
      @row-update="handleUpdate"
      @row-del="handleDel"
      @refresh-change="handleGetList"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <template slot="menu" slot-scope="scope">
        <el-button v-if="scope.row.executionStatus === 1" icon="el-icon-refresh" class="el-button el-button--text el-button--small" @click="retry(scope.row)">执行</el-button>
        <el-button v-if="scope.row.executionStatus === 4 " icon="el-icon-refresh" class="el-button el-button--text el-button--small" @click="retry(scope.row)">重试</el-button>
        <el-button v-if="scope.row.executionStatus === 4 " icon="el-icon-refresh" class="el-button el-button--text el-button--small" @click="ignore(scope.row)">忽略</el-button>
      </template>
    </avue-crud>
  </div>
</template>

<script>
import { getList, get, add, update, remove } from '@/api/crud'
import platformList from '../../api/platform'
export default {
  name: 'OrderPullLog',
  components: { },
  props: {
  },
  data() {
    return {
      routerVal: '',
      data: {},
      loading: false,
      query: {
        current: 1,
        size: 100,
        condition: { }
      },
      page: {
        total: 0,
        currentPage: 1,
        pageSize: 100
      },
      datas: [],
      option: {
        border: true,
        searchResetBtn: false,
        viewBtn: true,
        delBtn: false,
        addBtn: false,
        editBtn: false,
        index: true,
        headerAlign: 'center',
        align: 'center',
        menuWidth: 140,
        labelWidth: '42%',
        dialogType: 'drawer',
        indexLabel: '序号',
        column: [
          { label: '执行编号', prop: 'executionId', search: true, addDisplay: false, addDisabled: true, editDisabled: true, hide: true, rules: [{ required: true, message: '执行编号不能为空', trigger: 'blur' }] },
          { label: '平台编码', prop: 'platformCode', type: 'select', search: true, dicData: platformList },
          { label: '账号ID', prop: 'accountId', width: 80, search: true, rules: [{ required: true, message: '账号ID不能为空', trigger: 'blur' }] },
          { label: '拉取起始时间', prop: 'queryBeginTime', type: 'datetime', valueFormat: 'yyyyMMddHHmmss', rules: [{ required: true, message: '处理起始时间不能为空', trigger: 'blur' }] },
          { label: '拉取结束时间', prop: 'queryEndTime', type: 'datetime', search: true, valueFormat: 'yyyyMMddHHmmss', searchRange: true, searchSpan: 12 },
          { label: '执行状态', prop: 'executionStatus', search: true, type: 'select', dicData: [{ value: 1, label: '待处理' }, { value: 2, label: '处理中' }, { value: 3, label: '处理成功' }, { value: 4, label: '处理失败' }, { value: 5, label: '忽略' }] },
          { label: '处理数据数量', prop: 'dataRecord', width: 80, search: true },
          { label: '重试次数', prop: 'retryCount', width: 80, rules: [{ required: true, message: '重试次数不能为空', trigger: 'blur' }] },
          { label: '响应消息', prop: 'message', rules: [{ required: true, message: '响应消息不能为空', trigger: 'blur' }] },
          { label: '创建时间', prop: 'createTime', addDisplay: false, addDisabled: true, editDisabled: true, rules: [{ required: true, message: '创建时间不能为空', trigger: 'blur' }] },
          { label: '修改时间', prop: 'updateTime', addDisplay: false, addDisabled: true, editDisabled: true, rules: [{ required: true, message: '修改时间不能为空', trigger: 'blur' }] },
          { label: '请求参数', prop: 'extraJSON', hide: true, type: 'textarea' }
        ]
      }
    }
  },
  created() {
    this.routerVal = this.$route.path
  },
  methods: {
    handleGetList() {
      this.loading = true
      this.query.current = this.page.currentPage
      this.query.size = this.page.pageSize
      getList(this.routerVal, this.query).then(res => {
        this.datas = res.body.data
        this.page.total = res.body.totalRecord
        this.loading = false
      })
    },
    handleSearch(params, done) {
      if (params.queryEndTime != null && params.queryEndTime.length === 2) {
        this.query.queryBeginTime = params.queryEndTime[0]
        this.query.queryEndTime = params.queryEndTime[1]
        params.queryEndTime = null
      } else {
        this.query.queryBeginTime = null
        this.query.queryEndTime = null
      }
      this.page.currentPage = 1
      this.query.condition = params
      this.handleGetList()
      setTimeout(() => {
        done()
      }, 3000)
    },
    handleCurrentChange(currentPage) {
      this.page.currentPage = currentPage
      this.handleGetList()
    },
    handleSizeChange(pageSize) {
      this.page.pageSize = pageSize
      this.handleGetList()
    },
    handleAdd(row, done, loading) {
      this.data.id = ''
      add(this.routerVal, this.data).then(() => {
        this.loading = false
        this.$notify({
          title: 'Success',
          message: '新增成功!',
          type: 'success'
        })
        loading()
        setTimeout(() => {
          done()
        }, 3000)
      })
    },
    handleUpdate(row, index, done, loading) {
      update(this.routerVal, this.data).then(() => {
        this.loading = false
        this.$notify({
          title: 'Success',
          message: '更新成功!',
          type: 'success'
        })
        loading()
      })
    },
    handleDel(scope) {
      const _this = this
      this.$confirm('是否确认删除记录', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function() {
          return remove(_this.routerVal, scope.executionId)
        })
        .then(data => {
          _this.$message({
            showClose: true,
            message: '删除成功',
            type: 'success'
          })
          this.getList()
        })
    },
    retry(row) {
      get('/sale/app/order/pull/retry/' + row.executionId).then(() => {
        this.$notify({
          title: 'Success',
          message: '处理成功!',
          type: 'success'
        })
      })
    },
    ignore(row) {
      const p = { executionId: row.executionId, platformCode: row.platformCode }
      update(this.routerVal + '/ignore', p).then(response => {
        this.$notify({
          title: '成功',
          message: '处理成功!',
          type: 'success',
          duration: 2000
        })
        row.executionStatus = 5
      })
    }
  }
}
</script>
