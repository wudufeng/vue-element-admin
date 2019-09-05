<template>
  <div class="app-container">
    <div class="filter-container">
      <PlatformCode v-model="listQuery.condition.platformCode" clearable />
      <el-input v-model="listQuery.condition.accountId" placeholder="账号" style="width: 100px;" class="filter-item" clearable />
      <el-input v-model="listQuery.condition.dataRecord" placeholder="处理数据量大于" style="width: 145px;" class="filter-item" clearable />
      <el-select v-model="listQuery.condition.executionStatus" clearable placeholder="处理状态">
        <el-option v-for="(key, value) in statusMap" :key="value" :label="key" :value="value" />
      </el-select>
      <el-date-picker v-model="listQuery.queryBeginTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" placeholder="开始时间" clearable />
      <el-date-picker v-model="listQuery.queryEndTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" placeholder="结束时间" clearable />
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
      <el-table-column label="平台编码" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.platformCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="账号ID" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.accountId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品状态" align="center">
        <template slot-scope="scope">
          {{ productStatusFilter(scope.row.productStatus) }}
        </template>
      </el-table-column>
      <el-table-column label="查询起始时间" width="160px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.queryBeginTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="查询结束时间" width="160px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.queryEndTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数据量" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.dataRecord }}</span>
        </template>
      </el-table-column>
      <el-table-column label="执行状态" width="120px" align="center">
        <template slot-scope="scope">
          <span>{{ statusMap[scope.row.executionStatus] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="响应消息" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.message }}</span>
        </template>
      </el-table-column>
      <el-table-column label="重试次数" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.retryCount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="180px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改时间" width="180px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button size="mini" @click="handleDetail('view',row)">查看</el-button>
          <el-button v-if="row.executionStatus === 4" size="mini" type="danger" @click="retry(row)">Retry</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.size" @pagination="getList" />

    <el-dialog title="详情" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="productPullLogForm" label-position="right" label-width="46%">
        <el-row>
          <el-col style="width:400px;"><el-form-item prop="executionId" label="执行编号"><el-input v-model="productPullLogForm.executionId" disabled clearable /></el-form-item></el-col>
          <el-col style="width:400px;"><el-form-item prop="platformCode" label="内部平台编码"><el-input v-model="productPullLogForm.platformCode" disabled clearable /></el-form-item></el-col>
        </el-row>
        <el-row>
          <el-col style="width:400px;"><el-form-item prop="accountId" label="账号ID"><el-input v-model="productPullLogForm.accountId" disabled clearable /></el-form-item></el-col>
          <el-col style="width:400px;"><el-form-item prop="productStatus" label="商品状态"><el-input v-model="productPullLogForm.productStatus" disabled clearable /></el-form-item></el-col>
        </el-row>
        <el-row>
          <el-col style="width:400px;"><el-form-item prop="queryBeginTime" label="处理起始时间"><el-input v-model="productPullLogForm.queryBeginTime" disabled clearable /></el-form-item></el-col>
          <el-col style="width:400px;"><el-form-item prop="queryEndTime" label="处理结束时间"><el-input v-model="productPullLogForm.queryEndTime" disabled clearable /></el-form-item></el-col>
        </el-row>
        <el-row>
          <el-col style="width:400px;"><el-form-item prop="executionStatus" label="执行状态"><el-input v-model="productPullLogForm.executionStatus" disabled clearable /></el-form-item></el-col>
          <el-col style="width:400px;"><el-form-item prop="dataRecord" label="处理数据数量"><el-input v-model="productPullLogForm.dataRecord" disabled clearable /></el-form-item></el-col>
        </el-row>
        <el-row>
          <el-col style="width:400px;"><el-form-item prop="retryCount" label="重试次数"><el-input v-model="productPullLogForm.retryCount" disabled clearable /></el-form-item></el-col>
          <el-col style="width:400px;"><el-form-item prop="message" label="响应消息"><el-input v-model="productPullLogForm.message" disabled clearable /></el-form-item></el-col>
        </el-row>
        <el-row>
          <el-col style="width:400px;"><el-form-item prop="createTime" label="创建时间"><el-input v-model="productPullLogForm.createTime" disabled clearable /></el-form-item></el-col>
          <el-col style="width:400px;"><el-form-item prop="updateTime" label="修改时间"><el-input v-model="productPullLogForm.updateTime" disabled clearable /></el-form-item></el-col>
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Close
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import PlatformCode from '@/components/PlatformCode'
import { getPullProductLogList, pullRetry } from '@/api/product'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'

export default {
  name: 'ProductPullLog',
  components: {
    PlatformCode, Pagination },
  directives: { waves },
  data() {
    return {
      productPullLogForm: Object.assign({}),
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: false,
      listQuery: {
        'current': 1,
        'size': 20,
        'condition': {},
        'extra': {},
        'queryBeginTime': null,
        'queryEndTime': null
      },
      temp: {},
      dialogFormVisible: false,
      productStatusMap: [
        '所有',
        '在线',
        '下线',
        '已删除'
      ],
      statusMap: {
        1: '待处理',
        2: '处理中',
        3: '处理成功',
        4: '处理失败'
      }
    }
  },
  created() {
  },
  methods: {
    getList() {
      this.listLoading = true
      getPullProductLogList(this.listQuery).then(response => {
        this.list = response.body.data
        this.total = response.body.totalRecord
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.current = 1
      this.getList()
    },
    handleDetail(type, data) {
      this.productPullLogForm = Object.assign({}, data)
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      this.dialogFormVisible = true
    },
    productStatusFilter(status) {
      return this.productStatusMap[status]
    },
    retry(row) {
      pullRetry(row.executionId).then(response => {
        this.$notify({
          title: '成功',
          message: '处理成功!',
          type: 'success',
          duration: 2000
        })
        row.executionStatus = 3
      })
    }
  }
}
</script>
