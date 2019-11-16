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
      <template slot="originDataForm">
        <div>
          <json-editor ref="jsonEditor" :value="data.originData" />
        </div>
      </template>
      <template slot="menu" slot-scope="scope">
        <el-button icon="el-icon-refresh" class="el-button el-button--text el-button--small" @click="retryPullOrder(scope.row)">刷新</el-button>
        <el-button v-if="scope.row.processStatus==='PULL'" icon="el-icon-message" class="el-button el-button--text el-button--small" @click="transferOrder(scope.row)">转换</el-button>
      </template>
    </avue-crud>
  </div>
</template>

<script>
import { getList, get, add } from '@/api/crud'
import JsonEditor from '@/components/JsonEditor'

export default {
  name: 'OriginOrder',
  components: { JsonEditor },
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
        menuWidth: 180,
        labelWidth: '42%',
        dialogType: 'drawer',
        indexLabel: '序号',
        column: [
          { label: '订单ID', prop: 'id', viewDisplay: false, addDisplay: false, addDisabled: true, editDisabled: true, hide: true },
          { label: '平台编码', prop: 'platformCode', viewDisplay: false, type: 'select', search: true, dicData: [{ label: 'ALIEXPRESS', value: 'ALI' }, { label: 'AMAZON', value: 'AMAZON' }, { label: 'DARAZ', value: 'daraz' }, { label: 'EBAY', value: 'EB' }, { label: 'JOOM', value: 'JM' }, { label: 'WISH', value: 'KF' }, { label: 'LAZADA', value: 'LAZADA' }, { label: 'MYMALL', value: 'MY' }, { label: 'SHOPEE', value: 'SHOPEE' }, { label: 'RAKUTEN', value: 'rakuten' }] },
          { label: '账号ID', prop: 'accountId', search: true, viewDisplay: false, width: 80 },
          { label: '平台订单编号', prop: 'platformOrderId', search: true, viewDisplay: false },
          { label: '平台订单状态', prop: 'platformOrderStatus', viewDisplay: false },
          { label: '平台订单创建时间', prop: 'platformOrderCreateTime', viewDisplay: false },
          { label: '平台订单支付时间', prop: 'platformOrderPaymentTime', viewDisplay: false },
          { label: '平台订单修改时间', prop: 'platformOrderUpdateTime', viewDisplay: false },
          { label: '处理状态', prop: 'processStatus', search: true, viewDisplay: false, width: 100, type: 'select', dicData: [{ label: '拉单处理中', value: 'INIT' }, { label: '未转换', value: 'PULL' }, { label: '已转换', value: 'TRANSFORM' }, { label: '已取消', value: 'CANCELED' }, { label: '废弃', value: 'IGNORE' }] },
          { label: '处理信息', prop: 'processMessage', viewDisplay: false },
          { label: '创建时间', prop: 'createTime', viewDisplay: false },
          { label: '修改时间', prop: 'updateTime', viewDisplay: false },
          { label: '', prop: 'originData', labelWidth: '5%', hide: true, formslot: true, span: 24 }
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
      getList(this.routerVal + '/origin', this.query).then(res => {
        this.datas = res.body.data
        for (var i = 0; i < this.datas.length; i++) {
          if (this.datas[i].originData !== undefined && this.datas[i].originData !== null && this.datas[i].originData !== '') {
            this.datas[i].originData = JSON.parse(this.datas[i].originData)
          }
        }
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
    retryPullOrder(row) {
      const data = {
        platformCode: row.platformCode,
        accountId: row.accountId,
        platformOrderId: row.platformOrderId
      }
      add(this.routerVal + '/pull/detail', data).then(() => {
        this.$notify({
          title: 'Success',
          message: '刷新成功!',
          type: 'success'
        })
        this.handleGetList
      })
    },
    transferOrder(row) {
      const data = {
        platformCode: row.platformCode,
        accountId: row.accountId,
        platformOrderId: row.platformOrderId
      }
      get(this.routerVal + '/transfer', data).then(() => {
        this.$notify({
          title: 'Success',
          message: '转换订单成功!',
          type: 'success'
        })
        this.handleGetList
      })
    }
  }
}
</script>
