<template>
  <div class="app-container">
    <div class="filter-container">
      <PlatformCode v-model="listQuery.condition.platformCode" />
      <el-input v-model="listQuery.condition.accountId" placeholder="账号" style="width: 200px;" class="filter-item" clearable />
      <el-input v-model="listQuery.condition.platformProductId" placeholder="平台商品编号" style="width: 200px;" class="filter-item" clearable />
      <el-input v-model="listQuery.condition.sku" placeholder="sku" style="width: 200px;" class="filter-item" clearable />
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
      <el-table-column label="站点" width="120px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.siteId }}</span>
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
