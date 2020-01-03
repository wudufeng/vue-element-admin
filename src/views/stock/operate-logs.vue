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
    />
  </div>
</template>

<script>
import { getList } from '@/api/crud'
import { fetchList } from '@/api/stock'

export default {
  name: 'OperateLogs',
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
        searchResetBtn: true,
        viewBtn: true,
        delBtn: false,
        addBtn: false,
        editBtn: false,
        index: true,
        menuWidth: 68,
        headerAlign: 'center',
        align: 'center',
        labelWidth: '42%',
        dialogType: 'drawer',
        indexLabel: '序号',
        column: [
          { label: '主键', prop: 'id', addDisplay: false, addDisabled: true, editDisabled: true, hide: true, rules: [{ required: true, message: '主键不能为空', trigger: 'blur' }] },
          { label: '平台', prop: 'platformCode', type: 'select', change: (val) => { this.getRuleConfig(val) }, search: { searchDefault: 'ALI' }, hide: true, rules: [{ required: true, message: '平台CODE不能为空', trigger: 'blur' }], dicData: [{ label: 'ALIEXPRESS', value: 'ALI' }, { label: 'AMAZON', value: 'AMAZON' }, { label: 'DARAZ', value: 'daraz' }, { label: 'EBAY', value: 'EB' }, { label: 'JOOM', value: 'JM' }, { label: 'WISH', value: 'KF' }, { label: 'LAZADA', value: 'LAZADA' }, { label: 'MYMALL', value: 'MY' }, { label: 'SHOPEE', value: 'SHOPEE' }, { label: 'MEESHO', value: 'Meesho' }, { label: 'RAKUTEN', value: 'rakuten' }] },
          { label: '站点ID', prop: 'siteId', hide: true, rules: [{ required: true, message: '站点ID不能为空', trigger: 'blur' }] },
          { label: '账号ID', prop: 'accountId', search: true, rules: [{ required: true, message: '账号ID不能为空', trigger: 'blur' }] },
          { label: '内部listing ID', prop: 'productId', hide: true, rules: [{ required: true, message: '内部listing ID不能为空', trigger: 'blur' }] },
          { label: '平台商品编码', prop: 'platformProductId', search: true, rules: [{ required: true, message: '平台listing ID不能为空', trigger: 'blur' }] },
          { label: '多属性产品表主键', prop: 'itemId', hide: true, rules: [{ required: true, message: '多属性产品表主键不能为空', trigger: 'blur' }] },
          { label: '平台多属性产品id', prop: 'platformItemId', hide: true, rules: [{ required: true, message: '平台多属性产品id不能为空', trigger: 'blur' }] },
          { label: 'sku', prop: 'sku', search: true, rules: [{ required: true, message: '系统sku不能为空', trigger: 'blur' }] },
          { label: '平台销售sku', prop: 'platformSku', hide: true, rules: [{ required: true, message: '平台销售sku不能为空', trigger: 'blur' }] },
          { label: '当时库存', prop: 'stock', width: 80, rules: [{ required: true, message: '当前库存数不能为空', trigger: 'blur' }] },
          { label: '原线上库存', prop: 'oldQuantity', width: 90, rules: [{ required: true, message: '原线上库存数不能为空', trigger: 'blur' }] },
          { label: '更新库存', prop: 'newQuantity', width: 80, rules: [{ required: true, message: '更新线上库存数不能为空', trigger: 'blur' }] },
          { label: '操作类型', prop: 'operType', search: {}, type: 'select', dicData: [{}] },
          { label: '处理状态', prop: 'status', type: 'select', width: 80, search: {}, rules: [{ required: true, message: '处理状态1：成功 , 2：失败不能为空', trigger: 'blur' }], dicData: [{ value: 1, label: '成功' }, { value: 2, label: '失败' }] },
          { label: '响应信息', prop: 'msg', rules: [{ required: true, message: '响应信息不能为空', trigger: 'blur' }] },
          { label: '处理批次号', prop: 'executionId', search: true },
          { label: '重试次数', prop: 'retryCount', width: 80, hide: true, rules: [{ required: true, message: '失败重试次数不能为空', trigger: 'blur' }] },
          { label: '操作人', prop: 'operUserId', hide: true, rules: [{ required: true, message: '操作人不能为空', trigger: 'blur' }] },
          { label: '处理时间', prop: 'createTime', type: 'datetime', search: true, valueFormat: 'yyyyMMddHHmmss', searchRange: true, searchSpan: 12 }
        ]
      }
    }
  },
  created() {
    this.routerVal = this.$route.path
    this.data.executionId = this.$route.params && this.$route.params.id
    this.data.platformCode = this.$route.params && this.$route.params.platform
  },
  methods: {
    handleGetList() {
      if (this.query.condition.platformCode === null || this.query.condition.platformCode === undefined || this.query.condition.platformCode === '') {
        this.$message.warning('请选择平台')
        return
      }
      this.query.current = this.page.currentPage
      this.query.size = this.page.pageSize
      this.loading = true
      getList('/sales/stock/operate-log', this.query).then(res => {
        this.datas = res.body.data
        this.page.total = res.body.totalRecord
        this.loading = false
      })
    },
    handleSearch(params, done) {
      this.page.currentPage = 1
      if (params.createTime != null && params.createTime.length === 2) {
        this.query.queryBeginTime = params.createTime[0]
        this.query.queryEndTime = params.createTime[1]
        params.createTime = null
      } else {
        this.query.queryBeginTime = null
        this.query.queryEndTime = null
      }
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
    getRuleConfig(val) {
      if (val.value === '') return
      const conditions = { 'condition': { 'platformCode': val.value }}
      fetchList(conditions).then(response => {
        if (!response.body.data) return
        const dic = [{}]
        for (const x in response.body.data) {
          dic[x] = { label: response.body.data[x].id + '-' + response.body.data[x].description, value: response.body.data[x].id }
        }
        this.option.column[13].dicData = dic
      })
    }
  }
}
</script>
