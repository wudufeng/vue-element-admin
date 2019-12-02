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
    />
  </div>
</template>

<script>
import { getList, add, update, remove } from '@/api/crud'

export default {
  name: 'CustomerBlacklist',
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
        viewBtn: false,
        delBtn: false,
        index: true,
        headerAlign: 'center',
        align: 'center',
        labelWidth: '42%',
        dialogType: 'drawer',
        indexLabel: '序号',
        column: [
          { label: '主键', prop: 'id', addDisplay: false, addDisabled: true, editDisabled: true, hide: true, rules: [{ required: true, message: '主键不能为空', trigger: 'blur' }] },
          { label: '平台code', prop: 'platformCode', search: true, editDisabled: true, rules: [{ required: true, message: '平台code不能为空', trigger: 'blur' }] },
          { label: '识别类型', prop: 'typeName', search: true, editDisabled: true, rules: [{ required: true, message: '识别类型不能为空', trigger: 'blur' }], type: 'select', dicData: [{ value: 'ID', label: '用户ID' }, { value: 'EMAIL', label: '用户邮箱' }, { value: 'NAME', label: '用户名称' }, { value: 'PHONE', label: '收件号码' }, { value: 'ADDR', label: '收件地址' }] },
          { label: '识别内容', prop: 'content', rules: [{ required: true, message: '识别内容不能为空', trigger: 'blur' }] },
          { label: '备注', prop: 'note', rules: [{ required: true, message: '备注不能为空', trigger: 'blur' }] },
          { label: '状态', prop: 'status', rules: [{ required: true, message: '状态不能为空', trigger: 'blur' }], type: 'select', dicData: [{ value: 1, label: '有效' }, { value: 2, label: '无效' }] },
          { label: '创建时间', prop: 'createTime', addDisplay: false, editDisplay: false },
          { label: '修改时间', prop: 'updateTime', addDisplay: false, editDisplay: false }
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
    handleSearch(params) {
      this.page.currentPage = 1
      this.query.condition = params
      this.handleGetList()
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
          return remove(_this.routerVal, scope.id)
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
