<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.condition.tenantId" placeholder="租户" style="width: 200px;" class="filter-item" clearable />
      <el-input v-model="listQuery.condition.seqName" placeholder="序列名称" style="width: 200px;" class="filter-item" clearable />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleDetail('create', {})">
        新增
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
      <el-table-column label="租户编码" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.tenantId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="序列名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.seqName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最小值" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.minValue }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最大值" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.maxValue }}</span>
        </template>
      </el-table-column>
      <el-table-column label="增长缓冲区" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.increase }}</span>
        </template>
      </el-table-column>
      <el-table-column label="当前值" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.currentValue }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否允许循环" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.cycle }}</span>
        </template>
      </el-table-column>
      <el-table-column label="字符长度" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.charLength }}</span>
        </template>
      </el-table-column>
      <el-table-column label="序列前缀" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.prefix }}</span>
        </template>
      </el-table-column>
      <el-table-column label="日期填充格式" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.appendDateFormat }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最后更新时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="240">
        <template slot-scope="{row}">
          <el-button size="mini" @click="handleDetail('view',row)">查看</el-button>
          <el-button size="mini" @click="handleDetail('update',row)">编辑</el-button>
          <el-button size="mini" @click="remove(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.size" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="sequenceDefinitionForm" label-position="right" label-width="46%">
        <el-row>
          <el-col style="width:400px;" :hidden="dialogStatus!=='view'"><el-form-item prop="id" label="主键"><el-input v-model="sequenceDefinitionForm.id" :disabled="dialogStatus==='view'" clearable /></el-form-item></el-col>
          <el-col style="width:400px;" :hidden="dialogStatus==='update'"><el-form-item prop="tenantId" label="租户编码"><el-input v-model="sequenceDefinitionForm.tenantId" :disabled="dialogStatus==='view'" clearable /></el-form-item></el-col>
        </el-row>
        <el-row>
          <el-col style="width:400px;" :hidden="dialogStatus==='update'"><el-form-item prop="seqName" label="序列名称"><el-input v-model="sequenceDefinitionForm.seqName" :disabled="dialogStatus==='view'" clearable /></el-form-item></el-col>
          <el-col style="width:400px;"><el-form-item prop="minValue" label="最小值"><el-input v-model="sequenceDefinitionForm.minValue" :disabled="dialogStatus==='view'" clearable /></el-form-item></el-col>
        </el-row>
        <el-row>
          <el-col style="width:400px;"><el-form-item prop="maxValue" label="最大值"><el-input v-model="sequenceDefinitionForm.maxValue" :disabled="dialogStatus==='view'" clearable /></el-form-item></el-col>
          <el-col style="width:400px;"><el-form-item prop="increase" label="增长缓冲区"><el-input v-model="sequenceDefinitionForm.increase" :disabled="dialogStatus==='view'" clearable /></el-form-item></el-col>
        </el-row>
        <el-row>
          <el-col style="width:400px;" :hidden="dialogStatus==='update'"><el-form-item prop="currentValue" label="当前值"><el-input v-model="sequenceDefinitionForm.currentValue" :disabled="dialogStatus==='view'" clearable /></el-form-item></el-col>
          <el-col style="width:400px;">
            <el-form-item prop="cycle" label="是否允许循环">
              <el-select v-model="sequenceDefinitionForm.cycle" :disabled="dialogStatus==='view'">
                <el-option label="是" value="true" />
                <el-option label="否" value="false" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col style="width:400px;"><el-form-item prop="charLength" label="字符长度"><el-input v-model="sequenceDefinitionForm.charLength" :disabled="dialogStatus==='view'" clearable /></el-form-item></el-col>
          <el-col style="width:400px;"><el-form-item prop="prefix" label="序列前缀"><el-input v-model="sequenceDefinitionForm.prefix" :disabled="dialogStatus==='view'" clearable /></el-form-item></el-col>
        </el-row>
        <el-row>
          <el-col style="width:400px;"><el-form-item prop="appendDateFormat" label="日期填充格式"><el-input v-model="sequenceDefinitionForm.appendDateFormat" :disabled="dialogStatus==='view'" clearable /></el-form-item></el-col>
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button v-if="dialogStatus!=='view'" v-loading="loading" style="margin-left: 10px;" type="primary" @click="submitForm">
          Submit
        </el-button>
        <el-button @click="dialogFormVisible = false">
          Close
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getSequenceDefinitionList, addSequenceDefinition, getSequenceDefinitionDetail, updateSequenceDefinition, removeSequenceDefinition } from '@/api/sequence'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'

const defaultForm = {
}

export default {
  name: 'SequenceDefinition',
  components: {
    Pagination },
  directives: { waves },
  data() {
    return {
      sequenceDefinitionForm: Object.assign({}, defaultForm),
      loading: false,
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        'current': 1,
        'size': 20,
        'condition': {},
        'extra': {}
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        view: '查看',
        update: '编辑',
        create: '新增'
      },
      rules: {
        tenantId: [{ required: true, message: '请输入租户编码', trigger: 'blur' }],
        seqName: [{ required: true, message: '请输入序列名称', trigger: 'blur' }],
        minValue: [{ required: true, message: '请输入最小值', trigger: 'blur' }],
        maxValue: [{ required: true, message: '请输入最大值', trigger: 'blur' }],
        increase: [{ required: true, message: '请输入增长缓冲区', trigger: 'blur' }],
        cycle: [{ required: true, message: '请输入是否允许循环', trigger: 'blur' }],
        charLength: [{ required: true, message: '请输入字符长度', trigger: 'blur' }]
      }
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
    },
    handleDetail(type, data) {
      this.dialogStatus = type
      this.sequenceDefinitionForm = Object.assign({}, data)
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      this.dialogFormVisible = true
    },
    fetchData(id) {
      const params = {
        id: id
      }
      getSequenceDefinitionDetail(params).then(response => {
        this.sequenceDefinitionForm = response.data
      }).catch(err => {
        console.log(err)
      })
    },
    submitForm() {
      console.log(this.sequenceDefinitionForm)
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.loading = true
          if (this.dialogStatus === 'create') {
            addSequenceDefinition(this.sequenceDefinitionForm).then(response => {
              this.$notify({
                title: '成功',
                message: '新增序列定义成功',
                type: 'success'
              })
              this.list.unshift(this.sequenceDefinitionForm)
              this.loading = false
              this.dialogFormVisible = false
              this.getList()
            })
          } else {
            updateSequenceDefinition(this.sequenceDefinitionForm.id, this.sequenceDefinitionForm).then(response => {
              this.$notify({
                title: '成功',
                message: '修改序列定义成功',
                type: 'success'
              })
              this.loading = false
              this.dialogFormVisible = false
              this.getList()
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    remove(row, index) {
      const _this = this
      this.$confirm('是否确认删除记录', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function() {
          const params = {
            tenantId: row.tenantId,
            seqName: row.seqName
          }
          return removeSequenceDefinition(params)
        })
        .then(data => {
          _this.$message({
            showClose: true,
            message: '删除成功',
            type: 'success'
          })
          this.getList()
        })
    }
  }
}
</script>
