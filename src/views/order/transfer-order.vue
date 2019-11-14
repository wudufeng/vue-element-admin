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
          { label: '平台', prop: 'platformCode', search: true },
          { label: '账号', prop: 'accountId', search: true },
          { label: '系统订单号', prop: 'orderNo', search: true },
          { label: '平台订单号', prop: 'platformOrderId', search: true },
          { label: '买家id', prop: 'buyerId' },
          { label: '买家email', prop: 'buyerEmail' },
          { label: '订单状态', prop: 'orderStatus', type: 'select', dicData: [{ value: 0, label: '刚导入' }, { value: 4, label: '异常订单' }, { value: 9, label: '待取消' }] },
          { label: '平台订单状态', prop: 'platformOrderStatus' },
          { label: '付款方式', prop: 'paymentMethod', rules: [{ required: true, message: '付款方式不能为空', trigger: 'blur' }] },
          { label: '付款类型', prop: 'paymentType', rules: [{ required: true, message: '付款类型不能为空', trigger: 'blur' }] },
          { label: '付款状态', prop: 'paymentStatus', rules: [{ required: true, message: '付款状态:0-未付款,1-已付款)不能为空', trigger: 'blur' }], type: 'select', dicData: [{ value: 0, label: '未付款' }, { value: 1, label: '已付款' }] },
          { label: '退款状态', prop: 'refundStatus', rules: [{ required: true, message: '退款状态:0-默认,1-部分退款,2-已退款)不能为空', trigger: 'blur' }], type: 'select', dicData: [{ value: 0, label: '默认' }, { value: 1, label: '部分退款' }, { value: 2, label: '已退款' }] },
          { label: '发货状态', prop: 'shipStatus', rules: [{ required: true, message: '发货状态:0-默认,1-部分出货,2-已出货)不能为空', trigger: 'blur' }], type: 'select', dicData: [{ value: 0, label: '默认' }, { value: 1, label: '部分出货' }, { value: 2, label: '已出货' }] },
          { label: '物流代码', prop: 'shipCode', rules: [{ required: true, message: '物流代码不能为空', trigger: 'blur' }] },
          { label: '货币类型', prop: 'currency', rules: [{ required: true, message: '货币类型不能为空', trigger: 'blur' }] },
          { label: '买家优惠', prop: 'buyerCoupon', rules: [{ required: true, message: '买家优惠不能为空', trigger: 'blur' }] },
          { label: '平台优惠', prop: 'platformCoupon', rules: [{ required: true, message: '平台优惠不能为空', trigger: 'blur' }] },
          { label: '交易手续费', prop: 'transactionFee', rules: [{ required: true, message: '交易手续费不能为空', trigger: 'blur' }] },
          { label: '平台佣金/成交费', prop: 'commissionFee', rules: [{ required: true, message: '平台佣金/成交费不能为空', trigger: 'blur' }] },
          { label: '保险费', prop: 'insuranceFee', rules: [{ required: true, message: '保险费不能为空', trigger: 'blur' }] },
          { label: '税费', prop: 'taxFee', rules: [{ required: true, message: '税费不能为空', trigger: 'blur' }] },
          { label: '运费', prop: 'shipFee', rules: [{ required: true, message: '运费不能为空', trigger: 'blur' }] },
          { label: '商品总金额', prop: 'subTotalPrice', rules: [{ required: true, message: '商品总金额不能为空', trigger: 'blur' }] },
          { label: '订单总金额', prop: 'totalPrice', rules: [{ required: true, message: '订单总金额不能为空', trigger: 'blur' }] },
          { label: '买家实际支付金额', prop: 'actualPaymentPrice', rules: [{ required: true, message: '买家实际支付金额不能为空', trigger: 'blur' }] },
          { label: '包装费用', prop: 'totalGiftWrapPrice', rules: [{ required: true, message: '不能为空', trigger: 'blur' }] },
          { label: '发货仓库', prop: 'warehouseId', rules: [{ required: true, message: '发货仓库不能为空', trigger: 'blur' }] },
          { label: '平台订单支付时间', prop: 'platformPaymentTime' },
          { label: '平台订单支付时间(转北京时间)', prop: 'platformPaymentTimePek', hide: true },
          { label: '平台订单创建时间', prop: 'platformCreateTime' },
          { label: '平台订单创建时间(转北京时间)', prop: 'platformCreateTimePek', hide: true },
          { label: '平台订单修改时间', prop: 'platformUpdateTime' },
          { label: '平台订单修改时间(转北京时间)', prop: 'platformUpdateTimePek', hide: true },
          { label: '是否锁定', prop: 'isLock', type: 'select', dicData: [{ value: 0, label: '否' }, { value: 1, label: '是' }] },
          { label: '是否海外物流', prop: 'isAss', type: 'select', dicData: [{ value: 0, label: '本地发货' }, { value: 1, label: '海外发货' }] },
          { label: '同步oms状态', prop: 'syncOmsStatus', type: 'select', search: true, dicData: [{ value: 0, label: '未处理' }, { value: 1, label: '同步成功' }, { value: 2, label: '同步失败' }, { value: 2, label: '已取消' }] },
          { label: '同步oms时间', prop: 'syncOmsTime', rules: [{ required: true, message: '同步oms时间不能为空', trigger: 'blur' }] },
          { label: '同步oms错误信息', prop: 'syncOmsError', rules: [{ required: true, message: '同步oms错误信息不能为空', trigger: 'blur' }] },
          { label: '订单拉取时间', prop: 'orderPullTime', rules: [{ required: true, message: '订单拉取时间不能为空', trigger: 'blur' }] },
          { label: '物流方式', prop: 'logisticsType', rules: [{ required: true, message: '物流方式不能为空', trigger: 'blur' }] },
          { label: '是否组合品订单', prop: 'isCombinationOrder', type: 'select', dicData: [{ value: 1, label: '是' }, { value: 0, label: '否' }] },
          { label: '订单类型', prop: 'orderType', rules: [{ required: true, message: '订单类型,非限定值(如AE_COMMON、AE_GROUP_BUY)不能为空', trigger: 'blur' }] },
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
    }
  }
}
</script>
