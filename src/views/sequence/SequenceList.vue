<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.condition.tenantId" placeholder="租户编号" style="width: 200px;" class="filter-item" clearable />
      <el-input v-model="listQuery.condition.seqName" placeholder="序列名称" style="width: 200px;" class="filter-item" clearable />
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
    >
      <el-table-column label="租户编码" width="120px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.tenantId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="序列名称" width="120px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.seqName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最小值" width="120px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.minValue }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最大值" width="120px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.maxValue }}</span>
        </template>
      </el-table-column>
      <el-table-column label="增长缓冲区" width="120px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.increase }}</span>
        </template>
      </el-table-column>
      <el-table-column label="当前值" width="120px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.currentValue }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否允许循环" width="120px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.cycle }}</span>
        </template>
      </el-table-column>
      <el-table-column label="字符长度" width="120px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.charLength }}</span>
        </template>
      </el-table-column>
      <el-table-column label="序列前缀" width="120px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.prefix }}</span>
        </template>
      </el-table-column>
      <el-table-column label="日期填充格式" width="120px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.appendDateFormat }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="180" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <router-link :to="'/sequence/definition/edit/'+row.id">
            Edit
          </router-link>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.size" @pagination="getList" />
  </div>
</template>

<script>
import { getSequenceDefinitionList } from '@/api/sequence'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'

export default {
  name: 'SequenceList',
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
        'current': 1,
        'size': 20,
        'condition': {
          'appendDateFormat': ''
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
      getSequenceDefinitionList(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.total
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
