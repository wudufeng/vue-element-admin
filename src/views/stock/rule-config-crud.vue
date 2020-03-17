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
    >
      <template slot="menu" slot-scope="scope">
        <el-button icon="el-icon-check" class="el-button el-button--text el-button--small" @click="handleCopy(scope.row)">复制</el-button>
        <el-button v-if="!scope.row.enable" icon="el-icon-circle-check" class="el-button el-button--text el-button--small" @click="handleDel(scope.row)">启用</el-button>
        <el-button v-if="scope.row.enable" icon="el-icon-delete" class="el-button el-button--text el-button--small" @click="handleDel(scope.row)">禁用</el-button>
      </template>
    </avue-crud>
  </div>
</template>

<script>
import { getList, add, getDetail, update } from '@/api/crud'

export default {
  name: 'RuleConfigCrud',
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
        viewBtn: true,
        delBtn: false,
        excelBtn: true,
        index: true,
        headerAlign: 'center',
        align: 'center',
        labelWidth: '142',
        dialogType: 'drawer',
        indexLabel: '序号',
        column: [
          { label: '规则ID', prop: 'id', addDisplay: false, addDisabled: true, editDisabled: true },
          { label: '平台', prop: 'platformCode', type: 'select', valueDefault: 'ALI', hide: true, search: { searchDefault: 'ALI' }, editDisabled: true, dicData: [{ label: 'ALIEXPRESS', value: 'ALI' }, { label: 'AMAZON', value: 'AMAZON' }, { label: 'DARAZ', value: 'daraz' }, { label: 'EBAY', value: 'EB' }, { label: 'JOOM', value: 'JM' }, { label: 'WISH', value: 'KF' }, { label: 'LAZADA', value: 'LAZADA' }, { label: 'MYMALL', value: 'MY' }, { label: 'SHOPEE', value: 'SHOPEE' }, { label: 'MEESHO', value: 'Meesho' }] },
          { label: '规则类型', prop: 'ruleType', type: 'select', dicData: [{ value: 'AUTO', label: '自动触发' }, { value: 'MANUAL', label: '接口触发' }] },
          { label: '仓库编码', prop: 'warehouseIds', rules: [{ required: true, message: '请输入仓库编码', trigger: 'blur' }] },
          { label: '库存汇总类型', prop: 'stockTypes', type: 'checkbox', dicData: [{ value: 'AVAILABLE', label: '可用' }, { value: 'TRANSIT', label: '在途' }, { value: 'TRUE', label: '实际' }] },
          { label: '当前库存数量条件', prop: 'stockCondition' },
          { label: 'Sku状态', prop: 'statusCondition', type: 'checkbox', dicData: [{ value: 4, label: '在售中' }, { value: 5, label: '已滞销' }, { value: 6, label: '待清仓' }, { value: 7, label: '已停售' }] },
          { label: 'Sku创建时间', prop: 'createTimeCondition', hide: true },
          { label: '断货状态', prop: 'shortOfSupplyCondition', type: 'checkbox', dicData: [{ value: 'NEVER_SET', label: '未设置' }, { value: 'CANCEL', label: '已取消' }, { value: 'EFFECTIVE', label: '生效中' }] },
          { label: '采购周期', prop: 'purchasingCycleCondition', hide: true },
          { label: '判断侵权', prop: 'checkInfringement', hide: true, type: 'select', dicData: [{ value: true, label: '是' }, { value: false, label: '否' }] },
          { label: '是否判断排除条件', prop: 'exclusiveCondition', hide: true, dicData: [{ value: true, label: '是' }, { value: false, label: '否' }] },
          { label: '线上库存调整阈值', prop: 'onlineStockCondition', hide: true },
          { label: '设置库存数', prop: 'updateStock', dicData: [{ value: -1, label: '实时库存' }, { value: -2, label: '刊登库存' }] },
          { label: '是否触发拉取listing', prop: 'triggerListing', type: 'select', hide: false, dicData: [{ value: true, label: '是' }, { value: false, label: '否' }] },
          { label: '下架/删除', prop: 'offline', type: 'select', dicData: [{ value: true, label: '是' }, { value: false, label: '否' }] },
          { label: '判断多属性', prop: 'offlineConsiderOtherSku', type: 'select', hide: true, dicData: [{ value: true, label: '是' }, { value: false, label: '否' }] },
          { label: '判断活动', prop: 'dropActivity', type: 'select', hide: true, dicData: [{ value: true, label: '是' }, { value: false, label: '否' }] },
          { label: '操作类型', prop: 'operType', hide: true },
          { label: '描述', prop: 'description' },
          { label: '是否启用', prop: 'enable', type: 'select', dicData: [{ value: true, label: '启用' }, { value: false, label: '禁用' }] }
        ],
        group: [
          {
            label: '基本信息',
            prop: 'bsxx',
            icon: 'el-icon-edit-outline',
            column: [
              { label: '规则ID', prop: 'id', addDisplay: false, addDisabled: true, editDisabled: true },
              { label: '平台', prop: 'platformCode', type: 'select', valueDefault: 'ALI', hide: true, search: true, editDisabled: true, rules: [{ required: true, message: '请选择平台编码', trigger: 'change' }], dicData: [{ label: 'ALIEXPRESS', value: 'ALI' }, { label: 'AMAZON', value: 'AMAZON' }, { label: 'DARAZ', value: 'daraz' }, { label: 'EBAY', value: 'EB' }, { label: 'JOOM', value: 'JM' }, { label: 'WISH', value: 'KF' }, { label: 'LAZADA', value: 'LAZADA' }, { label: 'MYMALL', value: 'MY' }, { label: 'SHOPEE', value: 'SHOPEE' }, { label: 'MEESHO', value: 'Meesho' }] },
              { label: '规则类型', prop: 'ruleType', type: 'select', rules: [{ required: true, message: '请选择规则类型', trigger: 'change' }], dicData: [{ value: 'AUTO', label: '自动触发' }, { value: 'MANUAL', label: '接口触发' }] },
              { label: '仓库编码', prop: 'warehouseIds', rules: [{ required: true, message: '请输入仓库编码', trigger: 'change' }] },
              { label: '库存汇总类型', prop: 'stockTypes', type: 'checkbox', rules: [{ required: true, message: '请输入库存汇总类型', trigger: 'change' }], dicData: [{ value: 'AVAILABLE', label: '可用' }, { value: 'TRANSIT', label: '在途' }, { value: 'TRUE', label: '实际' }] },
              { label: '操作类型', prop: 'operType', hide: true },
              { label: '描述', prop: 'description', rules: [{ required: true, message: '请输入规则描述', trigger: 'change' }] },
              { label: '是否启用', prop: 'enable', type: 'select', rules: [{ required: true, message: '请选择是否启用', trigger: 'change' }], dicData: [{ value: true, label: '启用' }, { value: false, label: '禁用' }] }
            ]
          },
          {
            label: '判断规则',
            prop: 'jrxx',
            icon: 'el-icon-edit-outline',
            column: [
              { label: '当前库存数量条件', prop: 'stockCondition' },
              { label: 'Sku状态', prop: 'statusCondition', type: 'checkbox', dicData: [{ value: 4, label: '在售中' }, { value: 5, label: '已滞销' }, { value: 6, label: '待清仓' }, { value: 7, label: '已停售' }] },
              { label: 'Sku创建时间', prop: 'createTimeCondition', hide: true },
              { label: '断货状态', prop: 'shortOfSupplyCondition', type: 'checkbox', dicData: [{ value: 'NEVER_SET', label: '未设置' }, { value: 'CANCEL', label: '已取消' }, { value: 'EFFECTIVE', label: '生效中' }] },
              { label: '采购周期', prop: 'purchasingCycleCondition', hide: true },
              { label: '判断侵权', prop: 'checkInfringement', hide: true, type: 'select', rules: [{ required: true, message: '请选择是否需要判断侵权', trigger: 'change' }], dicData: [{ value: true, label: '是' }, { value: false, label: '否' }] }
            ]
          },
          {
            label: 'SQL过滤条件',
            prop: 'sqlxx',
            icon: 'el-icon-edit-outline',
            column: [
              { label: '是否判断排除条件', prop: 'exclusiveCondition', hide: true, dicData: [{ value: true, label: '是' }, { value: false, label: '否' }] },
              { label: '线上库存调整阈值', prop: 'onlineStockCondition', hide: true, type: 'textarea', span: 24 }
            ]
          },
          {
            label: '调整逻辑',
            prop: 'upxx',
            icon: 'el-icon-edit-outline',
            column: [
              { label: '设置库存数', prop: 'updateStock', dicData: [{ value: -1, label: '实时库存' }, { value: -2, label: '刊登库存' }], rules: [{ required: true, message: '请设置库存数', trigger: 'blur' }] },
              { label: '下架/删除', prop: 'offline', type: 'select', dicData: [{ value: true, label: '是' }, { value: false, label: '否' }] },
              { label: '判断多属性', prop: 'offlineConsiderOtherSku', type: 'select', hide: true, dicData: [{ value: true, label: '是' }, { value: false, label: '否' }] },
              { label: '判断活动', prop: 'dropActivity', type: 'select', hide: true, dicData: [{ value: true, label: '是' }, { value: false, label: '否' }] },
              { label: '是否触发拉取listing', prop: 'triggerListing', type: 'select', hide: false, dicData: [{ value: true, label: '是' }, { value: false, label: '否' }] }
            ]
          }
        ]
      }
    }
  },
  created() {
    this.routerVal = this.$route.path
  },
  methods: {
    handleGetList() {
      if (this.query.condition.platformCode === undefined || this.query.condition.platformCode === '') {
        this.$message.warning('请选择平台!')
        return
      }
      this.query.current = this.page.currentPage
      this.query.size = this.page.pageSize
      getList(this.routerVal, this.query).then(res => {
        this.datas = res.body.data
        this.page.total = res.body.totalRecord
      })
    },
    handleSearch(params, done) {
      this.page.currentPage = 1
      this.query.condition = params
      this.handleGetList()
      setTimeout(() => {
        done()
      }, 2000)
    },
    handleAdd(row, done, loading) {
      this.data.id = ''
      add(this.routerVal, this.data).then(() => {
        this.loading = false
        this.$notify({
          title: 'Success',
          message: '新增规则成功!',
          type: 'success'
        })
      })
      loading()
      setTimeout(() => {
        done()
      }, 3000)
    },
    handleUpdate(row, index, done, loading) {
      update(this.routerVal, this.data).then(() => {
        this.loading = false
        this.$notify({
          title: 'Success',
          message: '更新规则成功!',
          type: 'success'
        })
        loading()
      })
    },
    handleDel(scope) {
      const params = { id: scope.id, enable: true }
      if (scope.enable) {
        params.enable = false
      }
      update(this.routerVal + '/enable', params).then(() => {
        this.$notify({
          title: 'Success',
          message: (params.enable ? '启用' : '禁用') + '成功',
          type: 'success'
        })
        scope.enable = params.enable
      })
    },
    handleCopy(scope) {
      this.data = scope
      getDetail(this.routerVal, scope.id).then(res => {
        this.data = res.body
      })
      this.$refs.crud.rowAdd()
    }
  }
}
</script>
