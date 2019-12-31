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
  name: 'TransferOrderException',
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
        editBtn: false,
        addBtn: false,
        index: true,
        headerAlign: 'center',
        align: 'center',
        labelWidth: '42%',
        menuWidth: 125,
        dialogType: 'drawer',
        indexLabel: '序号',
        column: [
          { label: '主键', prop: 'id', addDisplay: false, addDisabled: true, editDisabled: true, hide: true, rules: [{ required: true, message: '主键不能为空', trigger: 'blur' }] },
          { label: '平台代码', prop: 'platformCode', search: true, type: 'select', dicData: [{ label: 'SHOPEE', value: 'SHOPEE' }, { label: 'RAKUTEN', value: 'rakuten' }, { label: 'FLIPKART', value: 'Flipkart' }, { label: 'JOYBUY', value: 'joybuy' }] },
          { label: '系统订单号', prop: 'orderNo', search: true, searchLabelWidth: 160, searchSpan: 12 },
          { label: '异常类型', prop: 'exceptionType', rules: [{ required: true, message: '异常类型:1-订单规则异常,2-订单利润亏损异常,3-订单sku异常,4-交易记录未知异常,5-匹配物流规则异常不能为空', trigger: 'blur' }], type: 'select', dicData: [{ value: 1, label: '订单规则异常' }, { value: 2, label: '订单利润亏损异常' }, { value: 3, label: '订单sku异常' }, { value: 4, label: '交易记录未知异常' }, { value: 5, label: '匹配物流规则异常' }] },
          { label: '异常原因', prop: 'exceptionReason', rules: [{ required: true, message: '异常原因不能为空', trigger: 'blur' }] }
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
