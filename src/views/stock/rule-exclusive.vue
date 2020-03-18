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
        <el-button v-if="!scope.row.status" icon="el-icon-circle-check" class="el-button el-button--text el-button--small" @click="handleDel(scope.row)">启用</el-button>
        <el-button v-if="scope.row.status" icon="el-icon-delete" class="el-button el-button--text el-button--small" @click="handleDel(scope.row)">禁用</el-button>
      </template>
    </avue-crud>
  </div>
</template>

<script>
import { getList, get, add, update } from '@/api/crud'

export default {
  name: 'RuleExclusive',
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
        index: true,
        headerAlign: 'center',
        align: 'center',
        labelWidth: '120',
        dialogType: 'drawer',
        indexLabel: '序号',
        column: [
          { label: '主键', prop: 'id', addDisplay: false, editDisplay: false, addDisabled: true, editDisabled: true, hide: true, showColumn: false, rules: [{ required: true, message: '主键不能为空', trigger: 'blur' }] },
          { label: '平台', prop: 'platformCode', search: true, editDisplay: false, editDisabled: true, hide: true, showColumn: false, type: 'select', value: 'EB', change: (val) => { this.getRuleConfig(val) }, dicData: [{ label: 'ALIEXPRESS', value: 'ALI' }, { label: 'AMAZON', value: 'AMAZON' }, { label: 'DARAZ', value: 'daraz' }, { label: 'EBAY', value: 'EB' }, { label: 'JOOM', value: 'JM' }, { label: 'WISH', value: 'KF' }, { label: 'LAZADA', value: 'LAZADA' }, { label: 'MYMALL', value: 'MY' }, { label: 'SHOPEE', value: 'SHOPEE' }, { label: 'MEESHO', value: 'Meesho' }] },
          { label: '规则类型', prop: 'ruleType', addDisplay: false, editDisplay: false, addDisabled: true, editDisabled: true, search: true, type: 'select', dicData: [{ value: 1, label: '所有平台指定SKU' }, { value: 2, label: '单个平台的所有规则指定SKU' }, { value: 3, label: '单个平台的所有规则指定账号' }, { value: 4, label: '单个平台的所有规则指定部门' }, { value: 5, label: '单个平台的所有规则指定商品编码' }, { value: 6, label: '单条规则指定SKU' }, { value: 7, label: '单条规则指定账号' }, { value: 8, label: '单条规则指定部门' }, { value: 9, label: '单条规则指定商品编码' }, { value: 10, label: '单条规则指定SKU指定账号' }, { value: 11, label: '单条规则指定SKU指定部门' }, { value: 12, label: '单条规则指定SKU指定商品编码' }, { value: 13, label: '单个平台的所有规则指定SKU指定账号' }, { value: 14, label: '单个平台的所有规则指定SKU指定部门' }, { value: 15, label: '单个平台的所有规则指定SKU指定商品编码' }, { value: 16, label: '单个平台的所有规则指定账号指定商品编码' }, { value: 17, label: '单条规则指定账号指定商品编码' }] },
          { label: '规则范围', prop: 'ruleId', editDisabled: true, search: true, rules: [{ required: true, message: '规则范围不能为空', trigger: 'blur' }], type: 'select', dicData: [] },
          { label: '排除类型', prop: 'refType', editDisabled: true, search: true, rules: [{ required: true, message: '排除类型不能为空', trigger: 'blur' }], type: 'select', dicData: [{ value: 1, label: 'sku' }, { value: 2, label: '账号' }, { value: 3, label: '部门' }, { value: 4, label: '平台商品编码' }] },
          { label: '排除类型值', prop: 'refVal', type: 'textarea', span: 24, search: true, rules: [{ required: true, message: '排除类型值不能为空', trigger: 'blur' }] },
          { label: '级联类型', prop: 'cascadeType', editDisabled: true, rules: [{ required: true, message: '级联类型不能为空', trigger: 'blur' }], type: 'select', dicData: [{ value: 1, label: '不限制' }, { value: 2, label: '账号' }, { value: 3, label: '部门' }, { value: 4, label: '平台商品编码' }] },
          { label: '级联类型值', prop: 'cascadeVal', type: 'textarea', span: 24 },
          { label: '状态', prop: 'status', addDisplay: false, type: 'select', dicData: [{ value: false, label: '无效' }, { value: true, label: '有效' }] },
          { label: '创建时间', prop: 'createTime', type: 'datetime', addDisplay: false, editDisplay: false, addDisabled: true, editDisabled: true },
          { label: '修改时间', prop: 'updateTime', type: 'datetime', addDisplay: false, editDisplay: false, addDisabled: true, editDisabled: true }
        ]
      }
    }
  },
  created() {
    this.routerVal = this.$route.path
    this.getRuleConfig()
  },
  methods: {
    handleGetList(params, done) {
      this.loading = true
      this.query.current = this.page.currentPage
      this.query.size = this.page.pageSize
      getList(this.routerVal, this.query).then(res => {
        this.datas = res.body.data
        this.page.total = res.body.totalRecord
        this.loading = false
        done ? done() : ''
      })
    },
    handleSearch(params, done) {
      this.page.currentPage = 1
      this.query.condition = params
      this.handleGetList(params, done)
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
      add(this.routerVal + '/add', this.data).then(() => {
        this.loading = false
        this.$notify({
          title: 'Success',
          message: '新增成功!',
          type: 'success'
        })
        done()
        this.handleGetList()
      })
      setTimeout(() => {
        done()
      }, 3000)
    },
    handleUpdate(row, index, done, loading) {
      update(this.routerVal, this.data).then(() => {
        this.loading = false
        this.$notify({
          title: 'Success',
          message: '更新成功!',
          type: 'success'
        })
        done()
        this.handleGetList()
      })
      setTimeout(() => {
        done()
      }, 3000)
    },
    handleDel(scope) {
      const params = { id: scope.id, status: true }
      if (scope.status) {
        params.status = false
      }
      update(this.routerVal + '/enable', params).then(() => {
        this.$notify({
          title: 'Success',
          message: (params.status ? '启用' : '禁用') + '成功',
          type: 'success'
        })
        scope.status = params.status
      })
    },
    getRuleConfig(val) {
      get('/sales/stock/rule-config/dict?platformCode=' + val.value).then(response => {
        if (!response.body) return
        const dic = [{}]
        var idx = 0
        for (var key in response.body) {
          dic[idx] = { label: key + '-' + response.body[key], value: key }
          idx = idx + 1
        }
        this.option.column[3].dicData = dic
      })
    }
  }
}
</script>
