<!--
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
          <el-button v-if="row.executionStatus === 1" size="mini" type="danger" @click="retry(row)">执行</el-button>
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
      @row-save="handleAdd"
      @row-update="handleUpdate"
      @row-del="handleDel"
      @refresh-change="handleGetList"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <template slot="menu" slot-scope="scope">
        <el-button v-if="scope.row.executionStatus === 1" icon="el-icon-refresh" class="el-button el-button--text el-button--small" @click="retry(scope.row, '')">执行</el-button>
        <el-button v-if="scope.row.executionStatus === 4 " icon="el-icon-refresh" class="el-button el-button--text el-button--small" @click="retry(scope.row, '')">重试</el-button>
        <el-button v-if="scope.row.executionStatus === 4 && scope.row.platformCode === 'EB' " icon="el-icon-refresh" class="el-button el-button--text el-button--small" @click="retry(scope.row, 1)">切分任务重试</el-button>
      </template>
    </avue-crud>
  </div>
</template>

<script>
import { add, update, remove } from '@/api/crud'
import { getPullProductLogList, pullRetry } from '@/api/product'

export default {
  name: 'ProductPullLog',
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
          { label: '执行编号', prop: 'executionId', search: true, addDisplay: false, addDisabled: true, editDisabled: true, hide: true, rules: [{ required: true, message: '执行编号不能为空', trigger: 'blur' }] },
          { label: '平台编码', prop: 'platformCode', type: 'select', width: 120, search: true, dicData: [{ label: 'ALIEXPRESS', value: 'ALI' }, { label: 'AMAZON', value: 'AMAZON' }, { label: 'DARAZ', value: 'daraz' }, { label: 'EBAY', value: 'EB' }, { label: 'JOOM', value: 'JM' }, { label: 'WISH', value: 'KF' }, { label: 'LAZADA', value: 'LAZADA' }, { label: 'MYMALL', value: 'MY' }, { label: 'SHOPEE', value: 'SHOPEE' }, { label: 'RAKUTEN', value: 'rakuten' }, { label: 'MEESHO', value: 'Meesho' }] },
          { label: '账号ID', prop: 'accountId', search: true, width: 80, rules: [{ required: true, message: '账号ID不能为空', trigger: 'blur' }] },
          { label: '拉取起始时间', prop: 'queryBeginTime', rules: [{ required: true, message: '处理起始时间不能为空', trigger: 'blur' }] },
          { label: '拉取结束时间', prop: 'queryEndTime', type: 'datetime', search: true, searchLabelWidth: '108', valueFormat: 'yyyyMMddHHmmss', searchRange: true, searchSpan: 12 },
          { label: '执行状态', prop: 'executionStatus', width: 100, type: 'select', search: true, dicData: [{ value: 1, label: '待处理' }, { value: 2, label: '处理中' }, { value: 3, label: '处理成功' }, { value: 4, label: '处理失败' }, { value: 5, label: '忽略' }] },
          { label: '数据量', prop: 'dataRecord', search: true, width: 80, rules: [{ required: true, message: '处理数据数量不能为空', trigger: 'blur' }] },
          { label: '重试次数', prop: 'retryCount', width: 80, rules: [{ required: true, message: '重试次数不能为空', trigger: 'blur' }] },
          { label: '异常消息', prop: 'message', rules: [{ required: true, message: '响应消息不能为空', trigger: 'blur' }] },
          { label: '创建时间', prop: 'createTime', rules: [{ required: true, message: '创建时间不能为空', trigger: 'blur' }] },
          { label: '修改时间', prop: 'updateTime', rules: [{ required: true, message: '修改时间不能为空', trigger: 'blur' }] },
          { label: '请求参数', prop: 'extraJSON', hide: true, type: 'textarea', span: 24 }
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
      getPullProductLogList(this.query).then(res => {
        this.datas = res.body.data
        this.page.total = res.body.totalRecord
        this.loading = false
      })
    },
    handleSearch(params, done) {
      if (params.queryEndTime != null && params.queryEndTime.length === 2) {
        this.query.queryBeginTime = params.queryEndTime[0]
        this.query.queryEndTime = params.queryEndTime[1]
        params.queryEndTime = null
      } else {
        this.query.queryBeginTime = null
        this.query.queryEndTime = null
      }
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
    },
    handleDel(scope) {
      const _this = this
      this.$confirm('是否确认删除记录', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function() {
          return remove(_this.routerVal, scope.executionId)
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
    retry(row, productSplitDate) {
      pullRetry(row, productSplitDate).then(response => {
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
