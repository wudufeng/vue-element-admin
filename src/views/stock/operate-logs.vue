<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row>
        <el-col :span="2">
          <PlatformCode v-model="listQuery.platformCode" style="width: 120px;" />
        </el-col>
        <el-col :span="3">
          <el-input v-model="listQuery.executionId" placeholder="执行批次号" style="width: 180px;padding-left: 10px" class="filter-item" />
        </el-col>
        <el-col :span="2">
          <el-input v-model="listQuery.accountId" placeholder="账号" style="width: 120px;" class="filter-item" />
        </el-col>
        <el-col :span="2">
          <el-input v-model="listQuery.sku" placeholder="sku" style="width: 120px;" class="filter-item" />
        </el-col>
        <el-col :span="3">
          <el-input v-model="listQuery.platformProductId" placeholder="平台商品ID" style="width: 180px;" class="filter-item" />
        </el-col>
        <el-col :span="7">
          <el-date-picker v-model="listQuery.createTime[0]" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="开始时间" />
          <el-date-picker v-model="listQuery.createTime[1]" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="结束时间" />
        </el-col>
        <el-col :span="2">
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
            Search
          </el-button>
        </el-col>
      </el-row>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="账号" width="80px" prop="productId" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.accountId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="站点" width="70px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.siteId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="平台商品ID" width="160px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.platformProductId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Sku" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.sku }}</span>
        </template>
      </el-table-column>
      <el-table-column label="当时库存" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.stock }}</span>
        </template>
      </el-table-column>
      <el-table-column label="原线上库存" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.oldQuantity }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新库存" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.newQuantity }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作类型" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.operType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="110px" align="center">
        <template slot-scope="scope">
          {{ statusFilter(scope.row.status) }}
        </template>
      </el-table-column>
      <el-table-column label="处理批次号" width="190px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.executionId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="重试次数" width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.retryCount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="处理时间" width="170px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="响应消息" width="240px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.msg }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page.current" :limit.sync="listQuery.page.size" @pagination="getList" />

  </div>
</template>

<script>
import PlatformCode from '@/components/PlatformCode'
import { fetchOperateLogList } from '@/api/stock'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'

export default {
  name: 'OperateLogs',
  components: {
    PlatformCode, Pagination
  },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      platformOptions: ['ALI', 'AMAZON', 'daraz', 'EB', 'JM', 'KF', 'LAZADA', 'MY', 'SHOPEE'],
      listLoading: false,
      listQuery: {
        'page': {
          current: 1,
          size: 50
        },
        'platformCode': '',
        'platformProductId': '',
        'sku': '',
        'executionId': '',
        'createTime': []
      },
      statusMap: [
        '',
        '成功',
        '失败'
      ]
    }
  },
  created() {
    this.listQuery.executionId = this.$route.params && this.$route.params.id
    this.listQuery.platformCode = this.$route.params && this.$route.params.platform
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchOperateLogList(this.listQuery).then(response => {
        this.list = response.body.data
        this.total = response.body.totalRecord

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page.current = 1
      this.getList()
    },
    statusFilter(status) {
      return this.statusMap[status]
    }
  }
}
</script>
