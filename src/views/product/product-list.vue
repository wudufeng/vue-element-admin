<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.platformCode" placeholder="平台" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.platformProduct" placeholder="平台" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
      </el-button>
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
      <el-table-column label="序号" prop="id" align="center" width="50">
        <template slot-scope="scope">
          <span>{{ scope.row.index }}</span>
        </template>
      </el-table-column>
      <el-table-column label="账号ID" width="120px" prop="productId" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.accountId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="平台商品ID" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.platformProductId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品名称" min-width="150px">
        <template slot-scope="{row}">
          <a v-if="row.url !== ''" class="link-type" :href="row.url" target="_blank">{{ row.name }}</a>
          <span v-else>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Sku" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.sku }}</span>
        </template>
      </el-table-column>
      <el-table-column label="库存" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.quantity }}</span>
        </template>
      </el-table-column>
      <el-table-column label="价格" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="110px" align="center">
        <template slot-scope="scope">
          {{ statusFilter(scope.row.status) }}
        </template>
      </el-table-column>
      <el-table-column label="商品创建时间" width="170px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.productCreateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品更新时间" width="170px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.productUpdateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="180" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="success" size="mini" @click="handleProductDetail(row)">
            详情
          </el-button>
          <el-button type="primary" size="mini" @click="handleRefresh(row)">
            刷新
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page.current" :limit.sync="listQuery.page.size" @pagination="getList" />

    <el-dialog title="详情" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="46%" style="width: 400px; margin-left:50px;">
        <el-form-item label="平台"><el-input v-model="temp.platformCode" :readonly="true" /></el-form-item>
        <el-form-item label="站点"><el-input v-model="temp.siteId" :readonly="true" /></el-form-item>
        <el-form-item label="账号ID"><el-input v-model="temp.accountId" :readonly="true" /></el-form-item>
        <el-form-item label="平台商品编号"><el-input v-model="temp.platformProductId" :readonly="true" /></el-form-item>
        <el-form-item label="sku"><el-input v-model="temp.sku" :readonly="true" /></el-form-item>
        <el-form-item label="商品名称"><el-input v-model="temp.name" :readonly="true" /></el-form-item>
        <el-form-item label="平台分类ID"><el-input v-model="temp.platformCategoryId" :readonly="true" /></el-form-item>
        <el-form-item label="在线库存数"><el-input v-model="temp.quantity" :readonly="true" /></el-form-item>
        <el-form-item label="商品价格"><el-input v-model="temp.price" :readonly="true" /></el-form-item>
        <el-form-item label="浏览量"><el-input v-model="temp.pageview" :readonly="true" /></el-form-item>
        <el-form-item label="点赞/关注数"><el-input v-model="temp.interest" :readonly="true" /></el-form-item>
        <el-form-item label="已售数"><el-input v-model="temp.sold" :readonly="true" /></el-form-item>
        <el-form-item label="促销/活动ID"><el-input v-model="temp.activityId" :readonly="true" /></el-form-item>
        <el-form-item label="是否多属性"><el-input v-model.trim="temp.variation" :readonly="true" />
          <el-select v-model="temp.variation" class="filter-item" placeholder="Please select" :readonly="true">
            <el-option key="false" label="否" value="false" />
            <el-option key="true" label="是" value="true" />
          </el-select>
        </el-form-item>
        <el-form-item label="商品链接"><el-input v-model="temp.url" :readonly="true" /></el-form-item>
        <el-form-item label="商品创建时间"><el-input v-model="temp.productCreateTime" :readonly="true" /></el-form-item>
        <el-form-item label="商品更新时间"><el-input v-model="temp.productUpdateTime" :readonly="true" /></el-form-item>
        <el-form-item label="数据创建时间"><el-input v-model="temp.createTime" :readonly="true" /></el-form-item>
        <el-form-item label="数据更新时间"><el-input v-model="temp.updateTime" :readonly="true" /></el-form-item>
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
import { fetchList, refreshProduct } from '@/api/product'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'

export default {
  name: 'ProductList',
  components: {
    Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        'page': {
          'current': 1,
          'size': 20
        },
        'platformCode': '',
        'platformProductId': '',
        'platformSku': ''
      },
      temp: {},
      statusMap: [
        '',
        '在线',
        '下线',
        '已删除'
      ],
      dialogFormVisible: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
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
    },
    handleProductDetail(data) {
      this.temp = Object.assign({}, data) // copy obj
      this.dialogFormVisible = true
    },
    handleRefresh(data) {
      refreshProduct(data).then(() => {
        this.$notify({
          title: 'Success',
          message: 'Refresh Successfully',
          type: 'success',
          duration: 2000
        })
      })
    }
  }
}
</script>
