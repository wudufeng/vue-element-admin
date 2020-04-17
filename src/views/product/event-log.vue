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
import { getEventLogList } from '@/api/product'

export default {
  name: 'EventLogList',
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
        addBtn: false,
        editBtn: false,
        viewBtn: true,
        delBtn: false,
        index: true,
        headerAlign: 'center',
        align: 'center',
        labelWidth: '142',
        menuWidth: '140',
        dialogType: 'drawer',
        indexLabel: '序号',
        column: [
          { label: '平台编码', prop: 'platformCode', type: 'select', width: 120, search: true, dicData: [{ label: 'ALIEXPRESS', value: 'ALI' }, { label: 'AMAZON', value: 'AMAZON' }, { label: 'DARAZ', value: 'daraz' }, { label: 'EBAY', value: 'EB' }, { label: 'JOOM', value: 'JM' }, { label: 'WISH', value: 'KF' }, { label: 'LAZADA', value: 'LAZADA' }, { label: 'MYMALL', value: 'MY' }, { label: 'SHOPEE', value: 'SHOPEE' }, { label: 'RAKUTEN', value: 'rakuten' }, { label: 'MEESHO', value: 'Meesho' }] },
          { label: '账号', prop: 'accountId', search: true, width: 80 },
          { label: '平台商品编码', search: true, prop: 'platformProductId' },
          { label: 'SKU', prop: 'sku', search: true },
          { label: '字段', prop: 'field', search: true },
          { label: '原值', prop: 'originValue' },
          { label: '更新值', prop: 'replaceValue' },
          { label: '操作类型', prop: 'eventType', type: 'select', search: true, dicData: [{ label: '新增', value: 'INSERT' }, { label: '修改', value: 'UPDATE' }] },
          { label: '处理时间', prop: 'createTime', type: 'datetime', search: true, valueFormat: 'yyyyMMddHHmmss', searchRange: true, searchSpan: 12 }
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
      getEventLogList(this.query).then(res => {
        this.datas = res.body.data
        this.page.total = res.body.totalRecord
        this.loading = false
      })
    },
    handleSearch(params, done) {
      if (params.createTime != null && params.createTime.length === 2) {
        this.query.queryBeginTime = params.createTime[0]
        this.query.queryEndTime = params.createTime[1]
        params.createTime = null
      } else {
        this.query.queryBeginTime = null
        this.query.queryEndTime = null
      }
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
    }
  }
}
</script>
