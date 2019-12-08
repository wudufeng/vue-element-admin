<template>
  <div class="app-container">
    <avue-crud
      ref="crud"
      v-model="data"
      :option="option"
      :data="datas"
      :table-loading="loading"
      :page="page"
      :row-style="rowStyle"
      @search-change="handleSearch"
      @row-save="handleAdd"
      @row-update="handleUpdate"
      @row-del="handleDel"
      @refresh-change="handleGetList"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      @cell-dblclick="handleCellDblclick"
    >
      <template slot="searchMenu">
        <el-button size="small" icon="el-icon-refresh" @click="reloadData(null)">拉取</el-button>
      </template>
      <template slot="menu" slot-scope="scope">
        <el-button v-if="scope.row.parentProductId === scope.row.productId" icon="el-icon-refresh" class="el-button el-button--text el-button--small" @click="reloadData(scope.row)">刷新</el-button>
      </template>
      <template slot="menuForm">
        <router-link :to="'/product/payload/'+data.platformCode+'/'+(data.parentProductId == 0 ? data.productId : data.parentProductId)">
          <el-button type="info" icon="el-icon-check" size="small">查看原始报文</el-button>
        </router-link>
      </template>
    </avue-crud>
  </div>
</template>

<script>
import { getList, add, update, remove } from '@/api/crud'
import { refreshProduct } from '@/api/product'

export default {
  name: 'Product',
  components: { },
  props: {
  },
  data() {
    return {
      routerVal: '',
      data: { },
      loading: false,
      query: {
        current: 1,
        size: 10,
        condition: { }
      },
      page: {
        total: 0,
        currentPage: 1,
        pageSize: 10
      },
      datas: [],
      option: {
        border: true,
        viewBtn: true,
        addBtn: false,
        searchResetBtn: false,
        delBtn: false,
        editBtn: false,
        menuWidth: 160,
        index: true,
        headerAlign: 'center',
        align: 'center',
        labelWidth: '42%',
        dialogType: 'drawer',
        indexLabel: '序号',
        column: [
          { label: '商品编码', prop: 'productId', addDisplay: false, addDisabled: true, editDisabled: true, hide: true, rules: [{ required: true, message: '内部listing ID不能为空', trigger: 'blur' }] },
          { label: '父ID', prop: 'parentProductId', hide: true, rules: [{ required: true, message: '上级product_id(0表示无上级)不能为空', trigger: 'blur' }] },
          { label: '平台', prop: 'platformCode', type: 'select', search: { searchDefault: 'ALI' }, editDisabled: true, dicData: [{ label: 'ALIEXPRESS', value: 'ALI' }, { label: 'AMAZON', value: 'AMAZON' }, { label: 'DARAZ', value: 'daraz' }, { label: 'EBAY', value: 'EB' }, { label: 'JOOM', value: 'JM' }, { label: 'WISH', value: 'KF' }, { label: 'LAZADA', value: 'LAZADA' }, { label: 'MYMALL', value: 'MY' }, { label: 'SHOPEE', value: 'SHOPEE' }, { label: 'RAKUTEN', value: 'rakuten' }, { label: 'MEESHO', value: 'Meesho' }] },
          { label: '账号ID', prop: 'accountId', width: 80, search: true, rules: [{ required: true, message: '账号ID不能为空', trigger: 'blur' }] },
          { label: '平台商品编码', prop: 'platformProductId', search: true, rules: [{ required: true, message: '平台listing ID不能为空', trigger: 'blur' }] },
          { label: '商品名称', prop: 'name', rules: [{ required: true, message: '产品标题/名称不能为空', trigger: 'blur' }] },
          { label: 'sku', prop: 'sku', search: true, rules: [{ required: true, message: '系统sku不能为空', trigger: 'blur' }] },
          { label: '平台销售sku', prop: 'platformSku', rules: [{ required: true, message: '平台销售sku不能为空', trigger: 'blur' }] },
          { label: '内部分类ID', prop: 'categoryId', hide: true, rules: [{ required: true, message: '内部分类ID不能为空', trigger: 'blur' }] },
          { label: '平台分类ID', prop: 'platformCategoryId', hide: true, rules: [{ required: true, message: '平台分类ID不能为空', trigger: 'blur' }] },
          { label: '线上库存数', prop: 'quantity', search: true, width: 100, rules: [{ required: true, message: '线上库存数不能为空', trigger: 'blur' }] },
          { label: '价格', prop: 'price', search: true, rules: [{ required: true, message: '价格不能为空', trigger: 'blur' }] },
          { label: '币种', prop: 'currency', hide: true },
          { label: '浏览量', prop: 'pageview', hide: true, rules: [{ required: true, message: '浏览量不能为空', trigger: 'blur' }] },
          { label: '点赞/关注数', prop: 'interest', hide: true, rules: [{ required: true, message: '点赞/关注数不能为空', trigger: 'blur' }] },
          { label: '已售数', prop: 'sold', hide: true, rules: [{ required: true, message: '已售数不能为空', trigger: 'blur' }] },
          { label: '促销/活动ID', prop: 'activityId', hide: true, rules: [{ required: true, message: '促销/活动ID不能为空', trigger: 'blur' }] },
          { label: '多属性', prop: 'variation', hide: true, rules: [{ required: true, message: '请选择是否为多属性', trigger: 'blur' }], type: 'radio', button: true, dicData: [{ value: true, label: '是' }, { value: false, label: '否' }] },
          { label: '状态', prop: 'status', width: 80, search: true, rules: [{ required: true, message: '产品状态不能为空', trigger: 'blur' }], type: 'select', dicData: [{ value: 1, label: '在线' }, { value: 2, label: '下线' }, { value: 3, label: '已删除' }] },
          { label: '产品链接', prop: 'url', hide: true, rules: [{ required: true, message: '产品链接不能为空', trigger: 'blur' }] },
          { label: '商品创建时间', prop: 'productCreateTime', rules: [{ required: true, message: '平台产品创建时间不能为空', trigger: 'blur' }] },
          { label: '商品修改时间', prop: 'productUpdateTime', rules: [{ required: true, message: '平台产品修改时间不能为空', trigger: 'blur' }] },
          { label: '创建时间', prop: 'createTime', hide: true, rules: [{ required: true, message: '创建时间不能为空', trigger: 'blur' }] },
          { label: '修改时间', prop: 'updateTime', hide: true, rules: [{ required: true, message: '修改时间不能为空', trigger: 'blur' }] }
        ]
      }
    }
  },
  created() {
    this.routerVal = this.$route.path
  },
  methods: {
    rowStyle({ row, column, rowIndex }) {
      if (row.parentProductId === row.productId) {
        return {
          backgroundColor: '#fdf5e6'
        }
      } else {
        return {
          backgroundColor: '#f0f9eb'
        }
      }
    },
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
      this.query.condition = Object.assign({}, params)
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
          return remove(_this.routerVal, scope.productId)
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
    reloadData(params) {
      if (params === undefined || params === null) {
        params = this.$refs['crud'].$refs['headerSearch'].searchForm
      } else {
        this.$refs['crud'].$refs['headerSearch'].searchForm.platformCode = params.platformCode
        this.$refs['crud'].$refs['headerSearch'].searchForm.accountId = params.accountId
        this.$refs['crud'].$refs['headerSearch'].searchForm.platformProductId = params.platformProductId
      }
      if (params.platformCode === '' || params.platformProductId === '' || params.accountId === '') {
        return
      }
      refreshProduct(params).then(() => {
        this.$notify({
          title: 'Success',
          message: 'Refresh Successfully',
          type: 'success'
        })
        this.handleSearch(params)
      })
    },
    handleCellDblclick(row, column, cell, event) {
      this.$refs['crud'].$refs['headerSearch'].searchForm.platformCode = row.platformCode
      if (column.property === 'accountId') {
        this.$refs['crud'].$refs['headerSearch'].searchForm.accountId = row.accountId
      }

      if (column.property === 'platformProductId') {
        this.$refs['crud'].$refs['headerSearch'].searchForm.platformProductId = row.platformProductId
      }

      if (column.property === 'sku') {
        this.$refs['crud'].$refs['headerSearch'].searchForm.sku = row.sku
      }

      if (column.property === 'name' && row.url !== undefined) {
        const link = document.createElement('a')
        link.style.display = 'none'
        link.href = row.url
        link.setAttribute('target', '_blank')
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    }
  }
}
</script>
