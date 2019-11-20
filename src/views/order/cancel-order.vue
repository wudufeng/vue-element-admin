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
        <el-button v-if="scope.row.cancelOmsOrderStatus===0 || scope.row.cancelOmsOrderStatus===2" icon="el-icon-message" class="el-button el-button--text el-button--small" @click="cancelOrder(scope.row)">取消</el-button>
      </template>
    </avue-crud>
  </div>
</template>

<script>
import { getList, get, add, update, remove } from '@/api/crud'

export default {
  name: 'TransferOrderCancel',
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
        addBtn: false,
        editBtn: false,
        delBtn: false,
        index: true,
        headerAlign: 'center',
        align: 'center',
        labelWidth: '42%',
        dialogType: 'drawer',
        indexLabel: '序号',
        column: [
          { label: '主键', prop: 'id', addDisplay: false, addDisabled: true, editDisabled: true, hide: true, rules: [{ required: true, message: '主键不能为空', trigger: 'blur' }] },
          { label: '平台代码', prop: 'platformCode', rules: [{ required: true, message: '平台代码不能为空', trigger: 'blur' }] },
          { label: '账号', prop: 'accountId', search: true, rules: [{ required: true, message: '账号不能为空', trigger: 'blur' }] },
          { label: '系统订单号', prop: 'orderNo', search: true, rules: [{ required: true, message: 'ueb订单号不能为空', trigger: 'blur' }] },
          { label: '平台订单号', prop: 'platformOrderId', search: true, rules: [{ required: true, message: '平台订单号不能为空', trigger: 'blur' }] },
          { label: '平台订单状态', prop: 'platformOrderStatus', rules: [{ required: true, message: '平台订单状态不能为空', trigger: 'blur' }] },
          { label: '是否部分取消', prop: 'isPartCancel', rules: [{ required: true, message: '是否部分取消:0-全部取消,1-部分取消不能为空', trigger: 'blur' }], type: 'select', dicData: [{ value: 0, label: '全部取消' }, { value: 1, label: '部分取消' }] },
          { label: '取消oms订单状态:', prop: 'cancelOmsOrderStatus', search: true, dataType: 'number', rules: [{ required: true, message: '取消oms订单状态:0-默认,1-取消成功,2-取消失败不能为空', trigger: 'blur' }], type: 'select', dicData: [{ value: 0, label: '默认' }, { value: 1, label: '取消成功' }, { value: 2, label: '取消失败' }] },
          { label: '取消oms订单时间', prop: 'cancelOmsOrderTime', rules: [{ required: true, message: '取消oms订单时间不能为空', trigger: 'blur' }] },
          { label: '取消oms订单请求', prop: 'cancelOmsOrderRequest', rules: [{ required: true, message: '取消oms订单请求不能为空', trigger: 'blur' }] },
          { label: '取消oms订单响应', prop: 'cancelOmsOrderResponse', rules: [{ required: true, message: '取消oms订单响应不能为空', trigger: 'blur' }] },
          { label: '同步退款状态', prop: 'syncOmsRefundStatus', rules: [{ required: true, message: '同步退款状态不能为空', trigger: 'blur' }] },
          { label: '同步退款时间', prop: 'syncOmsRefundTime', rules: [{ required: true, message: '同步退款时间不能为空', trigger: 'blur' }] },
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
    },
    cancelOrder(row) {
      const data = {
        platformCode: row.platformCode,
        orderNo: row.orderNo
      }
      get(this.routerVal + '/sync', data).then(() => {
        this.$notify({
          title: 'Success',
          message: '取消订单成功!',
          type: 'success'
        })
        this.handleGetList
      })
    }
  }
}
</script>
