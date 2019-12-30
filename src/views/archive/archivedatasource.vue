<template>
  <div class="app-container">
    <avue-crud
      ref="crud"
      v-model="data"
      :option="option"
      :data="datas"
      :table-loading="loading"
      :page="page"
      @on-load="handleSearch"
      @search-change="handleSearch"
      @row-save="handleAdd"
      @row-update="handleUpdate"
      @row-del="handleDel"
      @refresh-change="handleGetList"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { getList, add, update, remove } from '@/api/crud'

export default {
  name: 'ArchiveDatasource',
  components: {},
  props: {},
  data() {
    return {
      routerVal: '',
      data: {},
      loading: false,
      query: {
        current: 1,
        size: 100,
        condition: {}
      },
      page: {
        total: 0,
        currentPage: 1,
        pageSize: 100
      },
      datas: [],
      option: {
        border: true,
        searchResetBtn: true,
        viewBtn: false,
        delBtn: true,
        index: true,
        headerAlign: 'center',
        align: 'center',
        labelWidth: '42%',
        dialogType: 'drawer',
        indexLabel: '序号',
        column: [
          {
            label: '',
            prop: 'id',
            addDisplay: false,
            editDisplay: false,
            addDisabled: true,
            editDisabled: true,
            hide: true,
            showColumn: false,
            rules: [{ required: true, message: '不能为空', trigger: 'blur' }]
          },
          {
            label: '数据源类型',
            prop: 'type',
            search: true,
            type: 'select',
            searchLabelWidth: 100,
            rules: [{ required: true, message: '数据源类型不能为空', trigger: 'blur' }],
            dicData: [{ label: '业务库', value: 1 }, { label: '归档库', value: 2 }]
          },
          {
            label: '自定义名',
            prop: 'name',
            search: true,
            rules: [{ required: true, message: '自定义名不能为空', trigger: 'blur' }]
          },
          {
            label: '数据库IP',
            prop: 'host',
            search: true,
            rules: [{ required: true, message: '数据库IP不能为空', trigger: 'blur' }]
          },
          { label: '数据库端口', prop: 'port', rules: [{ required: true, message: '数据库端口不能为空', trigger: 'blur' }] },
          { label: '数据库用户名', prop: 'username', rules: [{ required: true, message: '数据库用户名不能为空', trigger: 'blur' }] },
          {
            label: '数据库密码',
            prop: 'password',
            type: 'password',
            rules: [{ required: true, message: '数据库密码不能为空', trigger: 'blur' }]
          }
        ]
      }
    }
  },
  created() {
    this.routerVal = this.$route.path
  },
  methods: {
    handleGetList(params, done) {
      this.loading = true
      this.query.current = this.page.currentPage
      this.query.size = this.page.pageSize
      getList(this.routerVal, this.query).then(res => {
        this.datas = res.body.data
        this.page.total = res.body.totalRecord
        this.loading = false
        done ? done() : ''
      })
    },
    handleSearch(params, done) {
      this.page.currentPage = 1
      this.query.condition = params
      this.handleGetList(params, done)
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
        done()
        this.handleGetList()
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
        done()
        this.handleGetList()
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
          return remove(_this.routerVal, scope.id)
        })
        .then(data => {
          _this.$message({
            showClose: true,
            message: '删除成功',
            type: 'success'
          })
          this.handleGetList()
        })
    }
  }
}
</script>
