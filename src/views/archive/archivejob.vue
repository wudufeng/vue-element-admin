
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
        <el-button icon="el-icon-check" size="small" @click.stop="enableArchiveJob(scope.row.id)">启用</el-button>
        <el-button icon="el-icon-check" size="small" @click.stop="disableArchiveJob(scope.row.id)">禁用</el-button>
        <el-button icon="el-icon-check" size="small" @click.stop="execArchiveJob(scope.row)">执行</el-button>
      </template>
    </avue-crud>
  </div>
</template>

<script>
import { getList, add, update, remove } from '@/api/crud'
import { execArchiveJob, enableArchiveJob, disableArchiveJob } from '@/api/archive'

export default {
  name: 'ArchiveJob',
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
        selection: true,
        border: true,
        searchResetBtn: false,
        viewBtn: true,
        delBtn: true,
        index: true,
        headerAlign: 'center',
        align: 'center',
        labelWidth: '42%',
        dialogType: 'drawer',
        indexLabel: '序号',
        column: [
          { label: '', prop: 'id', addDisplay: false, addDisabled: true, editDisabled: true, hide: true, rules: [{ required: true, message: '不能为空', trigger: 'blur' }] },
          { label: '源数据源', prop: 'sourceDatasource', rules: [{ required: true, message: '源数据源不能为空', trigger: 'blur' }] },
          // { label: '源数据源', prop: 'sourceDatasource', type: 'select', rules: [{ required: true, message: '源数据源不能为空', trigger: 'blur' }] },
          { label: '目标数据源', prop: 'targetDatasource', rules: [{ required: true, message: '目标数据源不能为空', trigger: 'blur' }] },
          { label: '源库', prop: 'sourceDb', rules: [{ required: true, message: '源库不能为空', trigger: 'blur' }] },
          { label: '目标库', prop: 'targetDb', rules: [{ required: true, message: '目标库不能为空', trigger: 'blur' }] },
          { label: '源表', prop: 'sourceTable', rules: [{ required: true, message: '源表不能为空', trigger: 'blur' }] },
          { label: '目标表', prop: 'targetTable', rules: [{ required: true, message: '目标表不能为空', trigger: 'blur' }] },
          { label: '过滤条件', prop: 'sqlWhere', rules: [{ required: true, message: '过滤条件不能为空', trigger: 'blur' }] },
          { label: '事务大小', prop: 'txSize', valueDefault: '122', rules: [{ required: true, message: '事务大小不能为空', trigger: 'blur' }] },
          { label: '清理源数据', prop: 'isPurge', type: 'radio', rules: [{ required: true, message: '是否清理源数据不能为空', trigger: 'blur' }], dicData: [{ value: true, label: '是' }, { value: false, label: '否' }], valueDefault: true },
          { label: '启用状态', prop: 'deleted', dicData: [{ label: '禁用', value: true }, { label: '启用', value: false }], addDisplay: false },
          // {
          //   label: '城市',
          //   prop: 'city',
          //   type: 'select',
          //   props: {
          //     label: 'name',
          //     value: 'code'
          //   },
          //   dicUrl: 'https://cli2.avuejs.com/api/area/getProvince'
          // },
          // {
          //   label: '权限',
          //   // prop: 'start-time',
          //   type: 'select',
          //   // props: {
          //   //   label: 'name',
          //   //   value: 'code'
          //   // },
          //   dicUrl: 'info'
          // },
          // {
          //   label: '省份',
          //   prop: 'province',
          //   type: 'select',
          //   dataType: 'number',
          //   props: {
          //     label: 'name',
          //     value: 'code'
          //   },
          //   dicUrl: 'http://172.16.6.132:10204/baseplatform/archive/info',
          //   rules: [
          //     {
          //       required: true,
          //       message: '请选择省份',
          //       trigger: 'blur'
          //     }
          //   ]
          // },
          { label: 'cron', prop: 'execCron', rules: [{ required: true, message: 'cron不能为空', trigger: 'blur' }] }
        ]
      }
    }
  },
  created() {
    this.routerVal = this.$route.path
  },
  methods: {
    // 执行归档
    execArchiveJob(data) {
      execArchiveJob(data)
    },
    // 批量启用归档任务
    enableArchiveJob(data) {
      enableArchiveJob(data)
    },
    // 批量禁用归档任务
    disableArchiveJob(data) {
      disableArchiveJob(data)
    },
    handleGetList() {
      this.loading = true
      this.query.current = this.page.currentPage
      this.query.size = this.page.pageSize
      getList(this.routerVal, this.query).then(res => {
        this.datas = res.body.data
        this.page.total = res.body.totalRecord
        this.loading = false
      })
    },
    handleSearch(params) {
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
          return remove(_this.routerVal, scope.id)
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
