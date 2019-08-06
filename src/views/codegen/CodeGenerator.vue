<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.condition.tableName" placeholder="表名" style="width: 200px;" class="filter-item" clearable />
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
      <el-table-column label="表名" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.tableName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="表注释" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.tableComment }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.tableCreateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button size="mini" icon="el-icon-setting" @click="handleDetail(row)">生成</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.size" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="codeGeneratorForm" label-position="right" label-width="46%">
        <el-row>
          <el-col style="width:400px;"><el-form-item prop="tableName" label="表名"><el-input v-model="codeGeneratorForm.tableName" readonly clearable /></el-form-item></el-col>
          <el-col style="width:400px;"><el-form-item prop="packageName" label="包名"><el-input v-model="codeGeneratorForm.packageName" clearable /></el-form-item></el-col>
        </el-row>
        <el-row>
          <el-col style="width:400px;"><el-form-item prop="author" label="作者"><el-input v-model="codeGeneratorForm.author" clearable /></el-form-item></el-col>
          <el-col style="width:400px;"><el-form-item prop="moduleName" label="模块名称"><el-input v-model="codeGeneratorForm.moduleName" clearable /></el-form-item></el-col>
        </el-row>
        <el-row>
          <el-col style="width:400px;"><el-form-item prop="tablePrefix" label="表前缀"><el-input v-model="codeGeneratorForm.tablePrefix" placeholder="可为空，生成的代码截掉该字符" clearable /></el-form-item></el-col>
          <el-col style="width:400px;"><el-form-item prop="databaseId" label="数据源" hidden><el-input v-model="codeGeneratorForm.databaseId" clearable /></el-form-item></el-col>
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
import { getCodeGeneratorList, addCodeGenerator } from '@/api/codegen'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'

const defaultForm = {
}

export default {
  name: 'CodeGenerator',
  components: {
    Pagination },
  directives: { waves },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === undefined || value === '') {
        this.$message({
          message: rule.field + '为必传项',
          type: 'error'
        })
        callback(new Error(rule.field + '为必传项'))
      } else {
        callback()
      }
    }
    return {
      codeGeneratorForm: Object.assign({}, defaultForm),
      loading: false,
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: false,
      listQuery: {
        'current': 1,
        'size': 20,
        'condition': {
          databaseId: null
        },
        'extra': {},
        'queryBeginTime': null,
        'queryEndTime': null
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        view: '查看',
        update: '编辑',
        create: '新增'
      },
      rules: {
        databaseId: [{ validator: validateRequire }],
        tableName: [{ validator: validateRequire }],
        packageName: [{ validator: validateRequire }],
        author: [{ validator: validateRequire }],
        moduleName: [{ validator: validateRequire }]
      }
    }
  },
  created() {
    this.listQuery.condition.databaseId = this.$route.params && this.$route.params.databaseId
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getCodeGeneratorList(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.current = 1
      this.getList()
    },
    handleDetail(data) {
      this.codeGeneratorForm = Object.assign({}, data)
      this.codeGeneratorForm.tableName = data.tableName
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      this.dialogFormVisible = true
    },
    submitForm() {
      this.codeGeneratorForm.databaseId = this.listQuery.condition.databaseId
      console.log(this.codeGeneratorForm)
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.loading = true
          addCodeGenerator(this.codeGeneratorForm)
          this.loading = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
