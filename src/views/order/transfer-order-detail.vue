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
import platformList from '../../api/platform'
export default {
  name: 'TransferOrderDetail',
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
          { label: '平台', prop: 'platformCode', search: true, type: 'select', dicData: platformList },
          { label: '订单号', prop: 'orderNo', search: true, type: 'select', dicData: platformList },
          { label: '交易号', prop: 'transactionNo', search: true, rules: [{ required: true, message: '交易号不能为空', trigger: 'blur' }] },
          { label: '站点', prop: 'site', hide: true, rules: [{ required: true, message: '站点不能为空', trigger: 'blur' }] },
          { label: '产品标题', prop: 'title', hide: true, rules: [{ required: true, message: '产品标题不能为空', trigger: 'blur' }] },
          { label: '平台商品编码', prop: 'itemId', rules: [{ required: true, message: 'itemId不能为空', trigger: 'blur' }] },
          { label: '产品类型', prop: 'itemType', hide: true, rules: [{ required: true, message: '产品类型:0-默认,1-转接头不能为空', trigger: 'blur' }], type: 'select', dicData: [{ value: 0, label: '默认' }, { value: 1, label: '转接头' }] },
          { label: '在线sku', prop: 'onlineSku', search: true, rules: [{ required: true, message: '在线sku不能为空', trigger: 'blur' }] },
          { label: '状态', prop: 'status', rules: [{ required: true, message: '状态:0-正常,1-异常不能为空', trigger: 'blur' }], type: 'select', dicData: [{ value: 0, label: '正常' }, { value: 1, label: '异常' }] },
          { label: '原sku', prop: 'oriSku', search: true, rules: [{ required: true, message: '原sku不能为空', trigger: 'blur' }] },
          { label: '原数量', prop: 'oriQuantity', rules: [{ required: true, message: '原数量不能为空', trigger: 'blur' }] },
          { label: '拆解后的sku', prop: 'sku', rules: [{ required: true, message: '拆解后的sku不能为空', trigger: 'blur' }] },
          { label: '拆解后的数量', prop: 'quantity', hide: true, rules: [{ required: true, message: '拆解后的数量不能为空', trigger: 'blur' }] },
          { label: '买家优惠券(平摊后)', prop: 'buyerCoupon', hide: true, rules: [{ required: true, message: '买家优惠券(平摊后)不能为空', trigger: 'blur' }] },
          { label: '平台优惠券(平摊后)', prop: 'platformCoupon', hide: true, rules: [{ required: true, message: '平台优惠券(平摊后)不能为空', trigger: 'blur' }] },
          { label: '交易手续费(平摊后)', prop: 'transactionFee', hide: true, rules: [{ required: true, message: '交易手续费(平摊后)不能为空', trigger: 'blur' }] },
          { label: '平台佣金(平摊后)/成交费', prop: 'commissionFee', hide: true, rules: [{ required: true, message: '平台佣金(平摊后)/成交费不能为空', trigger: 'blur' }] },
          { label: '保险费(平摊后)', prop: 'insuranceFee', hide: true, rules: [{ required: true, message: '保险费(平摊后)不能为空', trigger: 'blur' }] },
          { label: '税费', prop: 'taxFee', hide: true, rules: [{ required: true, message: '税费不能为空', trigger: 'blur' }] },
          { label: '运费(平摊后)', prop: 'shipFee', hide: true, rules: [{ required: true, message: '运费(平摊后)不能为空', trigger: 'blur' }] },
          { label: '售价', prop: 'salePrice', rules: [{ required: true, message: '售价不能为空', trigger: 'blur' }] },
          { label: '原始的sku实际售价', prop: 'originalSalePrice', rules: [{ required: true, message: '原始的sku实际售价不能为空', trigger: 'blur' }] },
          { label: '总价(售价*数量)', prop: 'totalPrice', rules: [{ required: true, message: '总价(售价*数量)不能为空', trigger: 'blur' }] },
          { label: '买家实际支付金额(平摊后)', prop: 'actualPaymentPrice', hide: true, rules: [{ required: true, message: '买家实际支付金额(平摊后)不能为空', trigger: 'blur' }] },
          { label: '发货仓库', prop: 'warehouseId', hide: true },
          { label: '待处理状态', prop: 'pendingStatus', type: 'select', hide: true, dicData: [{ value: '0', label: '默认' }, { value: '2', label: '客服待处理' }] },
          { label: '明细sku总销售价格', prop: 'itemSalePrice', rules: [{ required: true, message: '明细sku总销售价格不能为空', trigger: 'blur' }] },
          { label: '明细sku平摊后总售价', prop: 'itemSalePriceAllot', rules: [{ required: true, message: '明细sku平摊后总售价不能为空', trigger: 'blur' }] },
          { label: '平摊后的单价', prop: 'unitSalePriceAllot', hide: true, rules: [{ required: true, message: '平摊后的单价不能为空', trigger: 'blur' }] },
          { label: '平摊后手续费', prop: 'feeAmtAllot', hide: true, rules: [{ required: true, message: '平摊后手续费不能为空', trigger: 'blur' }] },
          { label: '原始仓库id', prop: 'originalWarehouseId', rules: [{ required: true, message: '原始仓库id不能为空', trigger: 'blur' }] },
          { label: '标识该转接头、gift、赠品的sku来源', prop: 'flagPublic', hide: true, rules: [{ required: true, message: '标识该转接头、gift、赠品的sku来源不能为空', trigger: 'blur' }] },
          { label: 'item礼盒包装费用', prop: 'itemGiftWrapPrice', hide: true, rules: [{ required: true, message: 'item礼盒包装费用不能为空', trigger: 'blur' }] },
          { label: '分摊后的平台补贴', prop: 'platformCouponPriceAllot', hide: true, rules: [{ required: true, message: '分摊后的平台补贴不能为空', trigger: 'blur' }] },
          { label: '申报价值', prop: 'declareValue', hide: true, rules: [{ required: true, message: '申报价值不能为空', trigger: 'blur' }] },
          { label: '申报价值对应币种', prop: 'declareCurrency', hide: true, rules: [{ required: true, message: '申报价值对应币种不能为空', trigger: 'blur' }] },
          { label: '第三方服务费用,如FBA费用-销售费用', prop: 'serviceFeeAllot', hide: true, rules: [{ required: true, message: '第三方服务费用,如FBA费用-销售费用不能为空', trigger: 'blur' }] },
          { label: '创建时间', prop: 'createTime', rules: [{ required: true, message: '创建时间不能为空', trigger: 'blur' }] },
          { label: '修改时间', prop: 'updateTime', hide: true, rules: [{ required: true, message: '修改时间不能为空', trigger: 'blur' }] }
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
