<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="listQuery.platform" placeholder="平台编码" clearable style="width: 120px" class="filter-item">
        <el-option v-for="item in platformOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate('')">
        Add
      </el-button>
      <el-checkbox v-model="showCreateTimeCondition" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">
        Sku创建时间
      </el-checkbox>
      <el-checkbox v-model="showPurchasingCycleCondition" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">
        采购周期
      </el-checkbox>
      <el-checkbox v-model="showExclusiveCondition" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">
        排除条件
      </el-checkbox>
      <el-checkbox v-model="showDescription" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">
        描述
      </el-checkbox>
      <el-checkbox v-model="showEnable" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">
        启用状态
      </el-checkbox>
    </div>

    <el-table
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="规则ID" prop="id" align="center" width="70">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="平台编码" width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.platform }}</span>
        </template>
      </el-table-column>
      <el-table-column label="规则类型" width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.ruleType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="仓库编码" min-width="80px">
        <template slot-scope="{row}">
          <span>{{ row.warehouseIds }}</span>
        </template>
      </el-table-column>
      <el-table-column label="库存汇总类型" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ stockTypesFilter(scope.row.stockTypes) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="当前库存数量条件" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.stockCondition }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Sku状态" width="80px">
        <template slot-scope="scope">
          <span>{{ skuStatusFilter(scope.row.statusCondition) }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showCreateTimeCondition" label="Sku创建时间" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.createTimeCondition }}</span>
        </template>
      </el-table-column>
      <el-table-column label="断货状态" class-name="status-col" width="80">
        <template slot-scope="{row}">
          <span>{{ shortOfSupplyConditionFilter(row.shortOfSupplyCondition) }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showPurchasingCycleCondition" label="采购周期" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <span>{{ row.purchasingCycleCondition }}</span>
        </template>
      </el-table-column>
      <el-table-column label="判断侵权" class-name="status-col" width="60">
        <template slot-scope="{row}">
          <span>{{ row.checkInfringement }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showExclusiveCondition" label="排除条件" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <span>{{ row.exclusiveCondition }}</span>
        </template>
      </el-table-column>
      <el-table-column label="线上库存调整阈值" class-name="status-col" width="160">
        <template slot-scope="{row}">
          <span>{{ row.onlineStockCondition }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设置库存数" class-name="status-col" width="65">
        <template slot-scope="{row}">
          <span>{{ updateStockFilter(row.updateStock) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="下架/删除" class-name="status-col" width="60">
        <template slot-scope="{row}">
          <span>{{ row.offline }}</span>
        </template>
      </el-table-column>
      <el-table-column label="判断多属性" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <span>{{ row.offlineConsiderOtherSku }}</span>
        </template>
      </el-table-column>
      <el-table-column label="判断活动" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <span>{{ row.dropActivity }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作类型" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <span>{{ row.operType }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showDescription" label="描述" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <span>{{ row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showEnable" label="是否启用" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <span>{{ row.enable }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="240" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row.id)">
            Edit
          </el-button>
          <el-button v-if="!row.enable" size="mini" type="success" @click="handleEnable(row, true)">
            Enable
          </el-button>
          <el-button v-if="row.enable" size="mini" type="danger" @click="handleEnable(row, false)">
            Disable
          </el-button>
          <el-button type="success" size="mini" @click="handleCreate(row)">
            Copy
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="170px" style="width: 400px; margin-left:50px;">
        <el-form-item v-if="dialogStatus==='update'" label="规则编号" prop="id">
          <el-input v-model="temp.id" readonly="true" />
        </el-form-item>
        <el-form-item label="平台编码" prop="platform">
          <el-select v-model="temp.platform" class="filter-item" placeholder="Please select">
            <el-option v-for="item in platformOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="规则类型" prop="ruleType">
          <el-select v-model="temp.ruleType" class="filter-item" placeholder="Please select">
            <el-option key="AUTO" label="AUTO" value="AUTO" />
            <el-option key="MANUAL" label="MANUAL" value="MANUAL" />
          </el-select>
        </el-form-item>
        <el-form-item label="仓库编码" prop="warehouseIds">
          <el-input v-model="temp.warehouseIds" />
        </el-form-item>
        <el-form-item label="库存汇总类型" prop="stockTypes">
          <el-input v-model="temp.stockTypes" placeholder="AVAILABLE,TRANSIT" />
        </el-form-item>
        <el-form-item label="当前库存数量条件" prop="stockCondition">
          <el-input v-model="temp.stockCondition" />
        </el-form-item>
        <el-form-item label="Sku状态" prop="statusCondition">
          <el-input v-model="temp.statusCondition" placeholder="4,5,6,7" />
        </el-form-item>
        <el-form-item label="Sku创建时间" prop="createTimeCondition">
          <el-input v-model="temp.createTimeCondition" />
        </el-form-item>
        <el-form-item label="断货状态" prop="shortOfSupplyCondition">
          <el-input v-model="temp.shortOfSupplyCondition" placeholder="NEVER_SET,CANCAL,EFFECTIVE" />
        </el-form-item>
        <el-form-item label="采购周期" prop="purchasingCycleCondition">
          <el-input v-model="temp.purchasingCycleCondition" placeholder="purcharsingCycleDay>7" />
        </el-form-item>
        <el-form-item label="判断侵权" prop="checkInfringement">
          <el-input v-model="temp.checkInfringement" />
        </el-form-item>
        <el-form-item label="排除条件" prop="exclusiveCondition">
          <el-input v-model="temp.exclusiveCondition" />
        </el-form-item>
        <el-form-item label="线上库存调整阈值" prop="onlineStockCondition">
          <el-input v-model="temp.onlineStockCondition" />
        </el-form-item>
        <el-form-item label="设置库存数" prop="updateStock">
          <el-input v-model="temp.updateStock" />
        </el-form-item>
        <el-form-item label="下架/删除" prop="offline">
          <el-select v-model="temp.offline" class="filter-item" placeholder="Please select">
            <el-option key="false" label="false" value="false" />
            <el-option key="true" label="true" value="true" />
          </el-select>
        </el-form-item>
        <el-form-item label="判断多属性" prop="offlineConsiderOtherSku">
          <el-select v-model="temp.offlineConsiderOtherSku" class="filter-item" placeholder="Please select">
            <el-option key="false" label="false" value="false" />
            <el-option key="true" label="true" value="true" />
          </el-select>
        </el-form-item>
        <el-form-item label="删除活动" prop="dropActivity">
          <el-select v-model="temp.dropActivity" class="filter-item" placeholder="Please select">
            <el-option key="false" label="false" value="false" />
            <el-option key="true" label="true" value="true" />
          </el-select>
        </el-form-item>
        <el-form-item label="操作类型" prop="operType">
          <el-input v-model="temp.operType" />
        </el-form-item>
        <el-form-item label="规则描述" prop="description">
          <el-input v-model="temp.description" />
        </el-form-item>
        <el-form-item label="启用状态" prop="enable">
          <el-select v-model="temp.enable" class="filter-item" placeholder="Please select">
            <el-option label="false" value="false" />
            <el-option label="true" value="true" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          Confirm
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, getRuleConfig, enableRuleConfig, addRuleConfig, updateRuleConfig } from '@/api/stock'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 50,
        platform: 'ALI'
      },
      platformOptions: ['ALI', 'AMAZON', 'daraz', 'EB', 'JM', 'KF', 'LAZADA', 'MY', 'SHOPEE'],
      showCreateTimeCondition: false,
      showPurchasingCycleCondition: false,
      showExclusiveCondition: false,
      showDescription: false,
      showEnable: false,
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      stockTypesMap: {
        AVAILABLE: '可用',
        TRANSIT: '在途'
      },
      skuStatusMap: {
        4: '在售中',
        5: '已滞销',
        6: '待清仓',
        7: '已停售'
      },
      shortOfSupplyCondition: {
        NEVER_SET: '未设置',
        CANCAL: '已取消',
        EFFECTIVE: '生效中'
      },
      textMap: {
        update: '编辑',
        create: '新增'
      },
      rules: {
        platform: [{ required: true, message: '请选择平台编码', trigger: 'change' }],
        ruleType: [{ required: true, message: '请选择规则类型', trigger: 'blur' }],
        warehouseIds: [{ required: true, message: '请仓库ID', trigger: 'blur' }],
        stockTypes: [{ required: true, message: '请输入库存汇总类型', trigger: 'blur' }],
        updateStock: [{ required: true, message: '请输入更新库存', trigger: 'blur' }],
        offline: [{ required: true, message: '请选择规则类型', trigger: 'change' }],
        operType: [{ required: true, message: '请输入操作类型', trigger: 'blur' }],
        description: [{ required: true, message: '请输入描述', trigger: 'blur' }],
        enable: [{ required: true, message: '请选择启用状态', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery.platform).then(response => {
        this.list = response.body.data
        this.total = response.body.totalRecord

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleCreate(row) {
      this.dialogStatus = 'create'
      if (row !== '') {
        this.temp = Object.assign({}, row) // copy obj
        this.temp.id = undefined
      } else {
        this.temp = {}
      }

      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          addRuleConfig(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Add Rule Successfully',
              type: 'success',
              duration: 3000
            })
          })
        }
      })
    },
    handleUpdate(id) {
      // 列表是从缓存获取，修改是从数据库重新获取
      getRuleConfig(id).then(resp => {
        this.temp = resp.body
      })
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateRuleConfig(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleEnable(row, enable) {
      enableRuleConfig(row.id, enable).then(() => {
        this.$notify({
          title: 'Success',
          message: enable ? 'Enable' : 'Disable' + ' Successfully',
          type: 'success',
          duration: 3000
        },
        row.enable = enable
        )
      })
    },
    stockTypesFilter(data) {
      var st = ''
      for (const t of data) {
        st = st + this.stockTypesMap[t] + ' '
      }
      return st
    },
    skuStatusFilter(data) {
      var st = ''
      if (data == null) {
        return st
      }
      for (const t of data) {
        st = st + this.skuStatusMap[t] + ' '
      }
      return st
    },
    shortOfSupplyConditionFilter(data) {
      var st = ''
      if (data == null) {
        return st
      }
      for (const t of data) {
        st = st + this.shortOfSupplyCondition[t] + ' '
      }
      return st
    },
    updateStockFilter(data) {
      if (data === -1) {
        return '实时库存'
      }
      if (data === -2) {
        return '刊登库存'
      }
      return data
    }
  }
}
</script>
