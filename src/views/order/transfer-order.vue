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
      @refresh-change="handleGetList"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      @cell-dblclick="handleCellDblclick"
    >
      <template slot="menu" slot-scope="scope">
        <el-button v-if="scope.row.syncOmsStatus===0 || scope.row.syncOmsStatus===2" icon="el-icon-message" class="el-button el-button--text el-button--small" @click="syncOrder(scope.row)">同步</el-button>
      </template>
    </avue-crud>
  </div>
</template>

<script>
import { getList, get } from '@/api/crud'

export default {
  name: 'TransferOrder',
  components: { },
  props: {
  },
  data() {
    return {
      routerVal: '',
      data: {},
      detailData: {},
      exceptionData: {},
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
        labelWidth: '42%',
        menuWidth: 125,
        dialogType: 'drawer',
        indexLabel: '序号',
        column: [
          { label: '主键', prop: 'id', addDisplay: false, addDisabled: true, editDisabled: true, hide: true },
          { label: '平台', prop: 'platformCode', search: true, type: 'select', dicData: [{ label: 'SHOPEE', value: 'SHOPEE' }, { label: 'RAKUTEN', value: 'rakuten' }, { label: 'FLIPKART', value: 'Flipkart' }, { label: 'JOYBUY', value: 'joybuy' }, { label: 'ML', value: 'mercadolibre' }] },
          { label: '账号', prop: 'accountId', search: true },
          { label: '系统订单号', prop: 'orderNo', search: true },
          { label: '平台订单号', prop: 'platformOrderId', search: true },
          { label: '买家id', prop: 'buyerId', hide: true },
          { label: '买家email', prop: 'buyerEmail', hide: true },
          { label: '订单状态', prop: 'orderStatus', type: 'select', dicData: [{ value: 0, label: '刚导入' }, { value: 4, label: '异常订单' }, { value: 9, label: '待取消' }] },
          { label: '平台订单状态', prop: 'platformOrderStatus' },
          { label: '付款方式', prop: 'paymentMethod', hide: true, rules: [{ required: true, message: '付款方式不能为空', trigger: 'blur' }] },
          { label: '付款类型', prop: 'paymentType', hide: true, rules: [{ required: true, message: '付款类型不能为空', trigger: 'blur' }] },
          { label: '付款状态', prop: 'paymentStatus', type: 'select', dicData: [{ value: 0, label: '未付款' }, { value: 1, label: '已付款' }] },
          { label: '退款状态', prop: 'refundStatus', hide: true, type: 'select', dicData: [{ value: 0, label: '默认' }, { value: 1, label: '部分退款' }, { value: 2, label: '已退款' }] },
          { label: '发货状态', prop: 'shipStatus', hide: true, type: 'select', dicData: [{ value: 0, label: '默认' }, { value: 1, label: '部分出货' }, { value: 2, label: '已出货' }] },
          { label: '物流代码', prop: 'shipCode', hide: true },
          { label: '货币类型', prop: 'currency', hide: true },
          { label: '买家优惠', prop: 'buyerCoupon', hide: true },
          { label: '平台优惠', prop: 'platformCoupon' },
          { label: '交易手续费', prop: 'transactionFee', hide: true },
          { label: '平台佣金/成交费', prop: 'commissionFee', rules: [{ required: true, message: '平台佣金/成交费不能为空', trigger: 'blur' }] },
          { label: '保险费', prop: 'insuranceFee', hide: true },
          { label: '税费', prop: 'taxFee', hide: true },
          { label: '运费', prop: 'shipFee', hide: true },
          { label: '商品总金额', prop: 'subTotalPrice', rules: [{ required: true, message: '商品总金额不能为空', trigger: 'blur' }] },
          { label: '订单总金额', prop: 'totalPrice', rules: [{ required: true, message: '订单总金额不能为空', trigger: 'blur' }] },
          { label: '买家实际支付金额', prop: 'actualPaymentPrice', rules: [{ required: true, message: '买家实际支付金额不能为空', trigger: 'blur' }] },
          { label: '包装费用', prop: 'totalGiftWrapPrice', hide: true },
          { label: '发货仓库', prop: 'warehouseId', hide: true },
          { label: '平台订单支付时间', prop: 'platformPaymentTime', hide: true },
          { label: '平台订单支付时间(转北京时间)', prop: 'platformPaymentTimePek', hide: true },
          { label: '平台订单创建时间', prop: 'platformCreateTime', hide: true },
          { label: '平台订单创建时间(转北京时间)', prop: 'platformCreateTimePek', hide: true },
          { label: '平台订单修改时间', prop: 'platformUpdateTime' },
          { label: '平台订单修改时间(转北京时间)', prop: 'platformUpdateTimePek', hide: true },
          { label: '是否锁定', prop: 'isLock', type: 'select', hide: true },
          { label: '是否海外物流', prop: 'isAss', type: 'select', hide: true, dicData: [{ value: 0, label: '本地发货' }, { value: 1, label: '海外发货' }] },
          { label: '同步oms状态', prop: 'syncOmsStatus', type: 'select', search: true, dicData: [{ value: 0, label: '未处理' }, { value: 1, label: '同步成功' }, { value: 2, label: '同步失败' }, { value: 9, label: '已取消' }] },
          { label: '同步oms时间', prop: 'syncOmsTime', hide: true },
          { label: '同步oms错误信息', prop: 'syncOmsError', hide: true },
          { label: '订单拉取时间', prop: 'orderPullTime', hide: true },
          { label: '物流方式', prop: 'logisticsType', hide: true },
          { label: '是否组合品订单', prop: 'isCombinationOrder', type: 'select', hide: true, dicData: [{ value: 1, label: '是' }, { value: 0, label: '否' }] },
          { label: '订单类型', prop: 'orderType', hide: true },
          { label: '创建时间', prop: 'createTime', rules: [{ required: true, message: '创建时间不能为空', trigger: 'blur' }] },
          { label: '修改时间', prop: 'updateTime', hide: true }
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
    syncOrder(row) {
      const data = {
        platformCode: row.platformCode,
        orderNo: row.orderNo
      }
      get(this.routerVal + '/sync', data).then(() => {
        this.$notify({
          title: 'Success',
          message: '同步订单成功!',
          type: 'success'
        })
        this.handleGetList
      })
    },
    handleCellDblclick(row, column, cell, event) {
      if (column.property === 'orderNo') {
        this.$router.push(this.routerVal + '/detail')
      } else if (column.property === 'orderStatus' && row.orderStatus === 4) {
        this.$router.push(this.routerVal + '/exception')
      }
    }
  }
}
</script>
