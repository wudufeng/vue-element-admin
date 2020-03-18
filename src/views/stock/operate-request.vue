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
        <el-button v-if="scope.row.executionStatus === 4 " icon="el-icon-refresh" class="el-button el-button--text el-button--small" @click="retry(scope.row)">重试</el-button>
        <el-button v-if="scope.row.executionStatus === 4 " icon="el-icon-delete" class="el-button el-button--text el-button--small" @click="ignore(scope.row)">忽略</el-button>
      </template>
    </avue-crud>
  </div>
</template>

<script>
import { getList, add, update, remove } from '@/api/crud'
import { fetchList } from '@/api/stock'

export default {
  name: 'StockOperateRequest',
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
        size: 50,
        condition: { }
      },
      page: {
        total: 0,
        currentPage: 1,
        pageSizes: [10, 50, 100, 1000, 5000],
        pageSize: 50
      },
      datas: [],
      option: {
        border: true,
        searchResetBtn: true,
        viewBtn: true,
        delBtn: false,
        addBtn: false,
        editBtn: true,
        menu: true,
        excelBtn: true,
        index: true,
        headerAlign: 'center',
        align: 'center',
        labelWidth: '164',
        dialogType: 'drawer',
        indexLabel: '序号',
        menuWidth: 129,
        column: [
          { label: '任务编号', prop: 'id', search: true, addDisplay: false, editDisplay: false, addDisabled: true, editDisabled: true, hide: true, showColumn: false, rules: [{ required: true, message: '主键不能为空', trigger: 'blur' }] },
          { label: '平台', prop: 'platformCode', search: true, type: 'select', change: (val) => { this.getRuleConfig(val) }, cascaderItem: ['accountId'], dicData: [{ label: 'ALIEXPRESS', value: 'ALI' }, { label: 'AMAZON', value: 'AMAZON' }, { label: 'DARAZ', value: 'daraz' }, { label: 'EBAY', value: 'EB' }, { label: 'JOOM', value: 'JM' }, { label: 'WISH', value: 'KF' }, { label: 'LAZADA', value: 'LAZADA' }, { label: 'MYMALL', value: 'MY' }, { label: 'SHOPEE', value: 'SHOPEE' }, { label: 'MEESHO', value: 'Meesho' }] },
          // { label: '账号', prop: 'accountId', search: true, type: 'select', remote: true, dicFlag: false, dicUrl: 'http://localhost:10120/sale/app/account/info/dic?platformCode={{key}}', dicMethod: 'get', dicQuery: {}, dicFormatter: (res) => { return res.body }, tpyeformat: (item, label, value) => { return `${item[label]}-${item[value]}` }, props: { label: 'shortName', value: 'accountId' }},
          { label: '账号', prop: 'accountId', search: true },
          { label: '平台商品编码', prop: 'platformProductId', search: true },
          { label: '系统sku', prop: 'sku', search: true },
          { label: '销售sku', prop: 'platformSku', search: true },
          { label: '站点/仓库', prop: 'site', hide: true },
          { label: '系统库存', prop: 'stock' },
          { label: '原库存', prop: 'onlineStock' },
          { label: '修改库存', prop: 'updateStock' },
          { label: 'SKU状态', prop: 'skuStatus', search: true, type: 'select', dicData: [{ value: 4, label: '在售中' }, { value: 5, label: '已滞销' }, { value: 6, label: '待清仓' }, { value: 7, label: '已停售' }] },
          { label: '操作类型', prop: 'actionType', search: true, type: 'select', dicData: [{ value: 'SYNCHRONIZE_STOCK', label: '修改库存' }, { value: 'OUT_OF_STOCK', label: '调0' }, { value: 'OFFLINE', label: '下架' }] },
          { label: '调整规则', prop: 'ruleConfigId', type: 'select', search: true, dicData: [{}] },
          { label: '执行状态', prop: 'executionStatus', search: true, type: 'select', dicData: [{ value: 1, label: '待处理' }, { value: 2, label: '处理中' }, { value: 3, label: '处理成功' }, { value: 4, label: '处理失败' }, { value: 5, label: '忽略异常' }] },
          { label: '请求ID', prop: 'requestId', hide: true, search: true },
          { label: '请求参数', prop: 'requestData', hide: true, type: 'textarea', span: 24 },
          { label: '请求参数md5', prop: 'requestMd5', hide: true, rules: [{ required: true, message: '请求参数md5不能为空', trigger: 'blur' }] },
          { label: '响应码', prop: 'respCode', hide: true, rules: [{ required: true, message: '响应码不能为空', trigger: 'blur' }] },
          { label: '处理信息', prop: 'respMsg', type: 'textarea', rules: [{ required: true, message: '处理信息不能为空', trigger: 'blur' }] },
          { label: '重试次数', prop: 'retryCount', hide: true, search: true },
          { label: '操作人', prop: 'operUserId', hide: true, rules: [{ required: true, message: '操作人不能为空', trigger: 'blur' }] },
          { label: '版本号', prop: 'version', hide: true },
          { label: '创建时间', prop: 'createTime', type: 'datetime' },
          { label: '修改时间', prop: 'updateTime', type: 'datetime', search: true, valueFormat: 'yyyyMMddHHmmss', searchRange: true, searchSpan: 12 }
        ]
      }
    }
  },
  created() {
    this.routerVal = this.$route.path
  },
  methods: {
    handleGetList(params) {
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
      if (params.updateTime != null && params.updateTime.length === 2) {
        this.query.queryBeginTime = params.updateTime[0]
        this.query.queryEndTime = params.updateTime[1]
        params.updateTime = null
      } else {
        this.query.queryBeginTime = null
        this.query.queryEndTime = null
      }
      this.page.currentPage = 1
      this.query.condition = params
      this.handleGetList(params)
      done()
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
        this.handleGetList()
      })
      done()
    },
    handleUpdate(row, index, done, loading) {
      update(this.routerVal, this.data).then(() => {
        this.loading = false
        this.$notify({
          title: 'Success',
          message: '更新成功!',
          type: 'success'
        })
        this.handleGetList()
      })
      done()
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
        this.option.column[12].dicData = dic
      })
    },
    retry(row) {
      update(this.routerVal + '/' + row.platformCode + '/retry?id=' + row.id + '&version=' + row.version).then(response => {
        this.$notify({
          title: '成功',
          message: '处理成功!',
          type: 'success',
          duration: 2000
        })
        row.executionStatus = 2
      })
    },
    ignore(row) {
      update(this.routerVal + '/' + row.platformCode + '/ignore?id=' + row.id + '&version=' + row.version).then(response => {
        this.$notify({
          title: '成功',
          message: '处理成功!',
          type: 'success',
          duration: 2000
        })
        row.executionStatus = 2
      })
    }
  }
}
</script>
