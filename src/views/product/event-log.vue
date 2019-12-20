<!--
<template>
  <div class="app-container">
    <div class="filter-container">
      <PlatformCode v-model="listQuery.condition.platformCode" />
      <el-input v-model="listQuery.condition.accountId" placeholder="账号" style="width: 200px;" class="filter-item" clearable />
      <el-input v-model="listQuery.condition.platformProductId" placeholder="平台商品编号" style="width: 200px;" class="filter-item" clearable />
      <el-input v-model="listQuery.condition.sku" placeholder="sku" style="width: 200px;" class="filter-item" clearable />
      <el-input v-model="listQuery.condition.field" placeholder="field" style="width: 200px;" class="filter-item" clearable />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >

      <el-table-column label="平台" width="120px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.platformCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="账号" width="120px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.accountId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="平台商品编号" width="195px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.platformProductId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Sku" width="125px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.sku }}</span>
        </template>
      </el-table-column>
      <el-table-column label="属性" width="120px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.field }}</span>
        </template>
      </el-table-column>
      <el-table-column label="原数据" width="280px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.originValue }}</span>
        </template>
      </el-table-column>
      <el-table-column label="新数据" width="280px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.replaceValue }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作类型" width="120px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.eventType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作时间" width="180px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.size" @pagination="getList" />

  </div>
</template>

<script>
import PlatformCode from '@/components/PlatformCode'
import { getEventLogList } from '@/api/product'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'

export default {
  name: 'EventLogList',
  components: {
    PlatformCode, Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        'current': 1,
        'size': 20,
        'condition': {
          'platformCode': ''
        }
      },
      temp: {},
      dialogFormVisible: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getEventLogList(this.listQuery).then(response => {
        this.list = response.body.data
        this.total = response.body.totalRecord
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.current = 1
      this.getList()
    }
  }
}
</script>

-->

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
      <template slot="search">
        <el-form-item label="处理时间">
          <el-date-picker
            v-model="query.queryTime"
            type="datetimerange"
            value-format="yyyyMMddHHmmss"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          />
        </el-form-item>
      </template>
    </avue-crud>
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
          { label: '处理时间', prop: 'createTime' }
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
        this.query.queryBeginTime = null
        this.query.queryEndTime = null
        this.loading = false
      })
    },
    handleSearch(params) {
      if (this.query.queryTime !== null && this.query.queryTime !== undefined && this.query.queryTime !== '' && this.query.queryTime.length === 2) {
        this.query.queryBeginTime = this.query.queryTime[0]
        this.query.queryEndTime = this.query.queryTime[1]
      }
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
    }
  }
}
</script>
