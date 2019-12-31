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
      @selection-change="selectionChange"
    >
      <template slot="menuLeft">
        <el-button type="primary" size="small" @click="retryAll">重试已选项</el-button>
      </template>
      <template slot="menu" slot-scope="scope">
        <el-button v-if="scope.row.status === 1 " icon="el-icon-refresh" class="el-button el-button--text el-button--small" @click="retry(scope.row)">重试</el-button>
        <el-button v-if="scope.row.status === 1 " icon="el-icon-refresh" class="el-button el-button--text el-button--small" @click="handleDel(scope.row)">忽略</el-button>
      </template>
    </avue-crud>
  </div>
</template>

<script>
import { getList, add, update, remove } from '@/api/crud'

export default {
  name: 'MessageRecoverer',
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
      selections: [],
      option: {
        border: true,
        searchResetBtn: false,
        viewBtn: true,
        editBtn: true,
        delBtn: false,
        index: true,
        headerAlign: 'center',
        align: 'center',
        labelWidth: '42%',
        dialogType: 'drawer',
        indexLabel: '序号',
        selection: true,
        column: [
          { label: '主键', prop: 'id', addDisplay: false, addDisabled: true, editDisabled: true, hide: true, rules: [{ required: true, message: '主键不能为空', trigger: 'blur' }] },
          { label: '应用名称', prop: 'applicationName', rules: [{ required: true, message: '应用名称不能为空', trigger: 'blur' }] },
          { label: '虚拟主机', prop: 'virtualHost', hide: true, rules: [{ required: true, message: '虚拟主机不能为空', trigger: 'blur' }] },
          { label: '交换机', prop: 'exchange', rules: [{ required: true, message: '交换机不能为空', trigger: 'blur' }] },
          { label: '路由名', prop: 'routingKey', rules: [{ required: true, message: '路由名不能为空', trigger: 'blur' }] },
          { label: '队列名称', prop: 'consumerQueue', search: true, rules: [{ required: true, message: '队列名称不能为空', trigger: 'blur' }] },
          { label: '消息编号', prop: 'messageId', hide: true, rules: [{ required: true, message: '消息编号不能为空', trigger: 'blur' }] },
          { label: '异常机器IP', prop: 'ip', rules: [{ required: true, message: '异常机器IP不能为空', trigger: 'blur' }] },
          { label: '消息内容', prop: 'messageBody', search: true, type: 'textarea', rules: [{ required: true, message: '消息编号不能为空', trigger: 'blur' }] },
          { label: '异常信息', prop: 'exception', search: true, type: 'textarea', hide: true, rules: [{ required: true, message: '异常信息不能为空', trigger: 'blur' }] },
          { label: 'TraceId', prop: 'traceId', hide: true, rules: [{ required: true, message: '跟踪号不能为空', trigger: 'blur' }] },
          { label: 'SpanId', prop: 'spanId', hide: true, rules: [{ required: true, message: '跟踪号不能为空', trigger: 'blur' }] },
          { label: '消息出错时间', prop: 'messageTime', rules: [{ required: true, message: '消息出错时间不能为空', trigger: 'blur' }] },
          { label: '处理次数', prop: 'retryCount', width: 60, rules: [{ required: true, message: '处理次数不能为空', trigger: 'blur' }] },
          { label: '处理状态', prop: 'status', search: true, width: 60, rules: [{ required: true, message: '状态:1-待处理,2-已处理,3-忽略不能为空', trigger: 'blur' }], type: 'select', dicData: [{ value: 1, label: '待处理' }, { value: 2, label: '已处理' }, { value: 3, label: '忽略' }, { value: 4, label: '处理中' }] },
          { label: '创建时间', prop: 'createTime', type: 'datetime', rules: [{ required: true, message: '创建时间不能为空', trigger: 'blur' }] },
          { label: '修改时间', prop: 'updateTime', type: 'datetime', rules: [{ required: true, message: '修改时间不能为空', trigger: 'blur' }], search: true, valueFormat: 'yyyyMMddHHmmss', searchRange: true, searchSpan: 12 }
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
      this.$confirm('是否确认忽略记录', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function() {
          return remove(_this.routerVal, scope.id)
        })
        .then(data => {
          _this.$message({
            showClose: true,
            message: '处理成功',
            type: 'success'
          })
          this.getList()
        })
    },
    retryAll() {
      for (const row in this.selections) {
        this.retry(this.selections[row])
      }
    },
    retry(row) {
      if (row.status !== 1) {
        return
      }
      update(this.routerVal + '/retry?id=' + row.id).then(() => {
        this.$notify({
          title: 'Success',
          message: '处理成功!',
          type: 'success'
        })
      })
    },
    selectionChange(list) {
      this.selections = list
    }
  }
}
</script>
