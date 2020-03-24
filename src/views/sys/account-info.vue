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
      @refresh-change="handleGetList"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { getList, add, update } from '@/api/crud'

export default {
  name: 'AccountInfo',
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
        index: true,
        headerAlign: 'center',
        align: 'center',
        labelWidth: '42%',
        menuWidth: '140',
        dialogType: 'drawer',
        indexLabel: '序号',
        column: [
          { label: '平台编码', prop: 'platformCode', search: true, addDisplay: false, addDisabled: true, editDisabled: true, hide: true, rules: [{ required: true, message: '平台编码不能为空', trigger: 'blur' }] },
          { label: '账号ID', prop: 'accountId', search: true, addDisplay: false, addDisabled: true, editDisabled: true, rules: [{ required: true, message: '账号ID不能为空', trigger: 'blur' }] },
          { label: '授权信息主键', prop: 'authId', hide: true, rules: [{ required: true, message: '授权信息主键不能为空', trigger: 'blur' }] },
          { label: '国家/站点', prop: 'site' },
          { label: '状态类型', prop: 'accountType', hide: true, rules: [{ required: true, message: '状态类型:1-国内仓账号,2-海外仓账号不能为空', trigger: 'blur' }], type: 'select', dicData: [{ value: 1, label: '国内仓账号' }, { value: 2, label: '海外仓账号' }] },
          { label: '账号名称', prop: 'accountName', search: true, rules: [{ required: true, message: '账号名称不能为空', trigger: 'blur' }] },
          { label: '账号简称', prop: 'shortName', search: true, rules: [{ required: true, message: '账号首字母-站点简称（两位），均为大写不能为空', trigger: 'blur' }] },
          { label: '登录邮箱', prop: 'email', hide: true },
          { label: '所属部门', prop: 'departmentId', hide: true, rules: [{ required: true, message: '所属部门不能为空', trigger: 'blur' }] },
          { label: '指定发货仓库', prop: 'warehouseId', rules: [{ required: true, message: '指定发货仓库,0表示默认不能为空', trigger: 'blur' }], dicData: [{ value: 0, label: '默认' }] },
          { label: '拉取订单', prop: 'pullOrderEnable', search: true, rules: [{ required: true, message: '启用拉单:0-否,1-是不能为空', trigger: 'blur' }], type: 'select', dicData: [{ value: false, label: '禁用' }, { value: true, label: '启用' }] },
          { label: '拉取商品', prop: 'pullProductEnable', search: true, rules: [{ required: true, message: '启用拉listing:0-否,1-是不能为空', trigger: 'blur' }], type: 'select', dicData: [{ value: false, label: '禁用' }, { value: true, label: '启用' }] },
          { label: '自动调价', prop: 'autoChangePrice', rules: [{ required: true, message: '是否进行自动调价:0-否,1-是不能为空', trigger: 'blur' }], type: 'select', dicData: [{ value: false, label: '禁用' }, { value: true, label: '启用' }] },
          { label: '自动调整库存', prop: 'autoReviseQuantity', rules: [{ required: true, message: '是否自动调整库存:0-否,1-是不能为空', trigger: 'blur' }], type: 'select', dicData: [{ value: false, label: '禁用' }, { value: true, label: '启用' }] },
          { label: '刊登数量', prop: 'publishQuantity', rules: [{ required: true, message: '默认刊登数量，0表示与当前库存数一致不能为空', trigger: 'blur' }], dicData: [{ value: 0, label: '当前库存数' }] },
          { label: '自动恢复库存数量', prop: 'reviseQuantity', rules: [{ required: true, message: '自动恢复库存数量不能为空', trigger: 'blur' }], type: 'select', dicData: [{ value: 0, label: '按库存规则配置' }, { value: -1, label: '实时库存' }, { value: -2, label: '2两倍实时库存' }, { value: -3, label: '三倍实时库存' }] },
          { label: '锁定', prop: 'lock', hide: true, rules: [{ required: true, message: '账号是否被锁 1：是 0：否不能为空', trigger: 'blur' }], type: 'select', dicData: [{ value: true, label: '锁定' }, { value: false, label: '正常' }] },
          { label: '状态', prop: 'status', rules: [{ required: true, message: '状态:1-启用,0-停用不能为空', trigger: 'blur' }], type: 'select', dicData: [{ value: true, label: '启用' }, { value: false, label: '停用' }] },
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
    }
  }
}
</script>
