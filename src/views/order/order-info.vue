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
  name: 'OrderInfo',
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
        delBtn: true,
        index: true,
        headerAlign: 'center',
        align: 'center',
        labelWidth: '42%',
        dialogType: 'drawer',
        indexLabel: '序号',
        column: [
          { label: '订单ID', prop: 'id', addDisplay: false, addDisabled: true, editDisabled: true, hide: true, rules: [{ required: true, message: '订单ID不能为空', trigger: 'blur' }] },
          { label: '内部平台编码', prop: 'platformCode', rules: [{ required: true, message: '内部平台编码不能为空', trigger: 'blur' }] },
          { label: '账号ID', prop: 'accountId', rules: [{ required: true, message: '账号ID不能为空', trigger: 'blur' }] },
          { label: '平台订单编号', prop: 'platformOrderId', rules: [{ required: true, message: '平台订单编号不能为空', trigger: 'blur' }] },
          { label: '平台订单状态', prop: 'platformOrderStatus', rules: [{ required: true, message: '平台订单状态不能为空', trigger: 'blur' }] },
          { label: '支付状态', prop: 'paymentStatus', rules: [{ required: true, message: '状态不能为空', trigger: 'blur' }], type: 'select', dicData: [{ value: '1', label: '在线' }, { value: '2', label: '下线' }, { value: '3', label: '已删除' }] },
          { label: '退款状态', prop: 'refundStatus', rules: [{ required: true, message: '退款状态:0-无,1-部分退款,2-已退款不能为空', trigger: 'blur' }], type: 'select', dicData: [{ value: '0', label: '无' }, { value: '1', label: '部分退款' }, { value: '2', label: '已退款' }] },
          { label: '发货状态', prop: 'shipStatus', rules: [{ required: true, message: '发货状态:0-未发货,1-部分出货,2-已出货不能为空', trigger: 'blur' }], type: 'select', dicData: [{ value: '0', label: '未发货' }, { value: '1', label: '部分出货' }, { value: '2', label: '已出货' }] },
          { label: '平台订单支付时间', prop: 'platformOrderPaymentTime', rules: [{ required: true, message: '平台订单支付时间不能为空', trigger: 'blur' }] },
          { label: '平台订单创建时间', prop: 'platformOrderCreateTime', rules: [{ required: true, message: '平台订单创建时间不能为空', trigger: 'blur' }] },
          { label: '平台订单修改时间', prop: 'platformOrderUpdateTime', rules: [{ required: true, message: '平台订单修改时间不能为空', trigger: 'blur' }] },
          { label: '创建时间', prop: 'createTime', rules: [{ required: true, message: '创建时间不能为空', trigger: 'blur' }] },
          { label: '修改时间', prop: 'updateTime', rules: [{ required: true, message: '修改时间不能为空', trigger: 'blur' }] }
        ]
      }
    }
  },
  created() {
    this.routerVal = this.$route.path
  },
  methods: {
    handleGetList() {
      this.query.current = this.page.currentPage
      this.query.size = this.page.pageSize
      getList(this.routerVal, this.query).then(res => {
        this.datas = res.body.data
        this.page.total = res.body.totalRecord
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
