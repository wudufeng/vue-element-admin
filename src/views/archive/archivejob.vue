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
      @sortable-change="sortableChange"
    >
      <!--      <template slot="menuLeft" slot-scope="scope">-->
      <!--        <el-button-->
      <!--          type="danger"-->
      <!--          icon="el-icon-check"-->
      <!--          size="small"-->
      <!--          plain-->
      <!--          @click.stop="test(scope)"-->
      <!--        >禁用</el-button>-->
      <!--      </template>-->
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
  components: {},
  props: {},
  data() {
    var validCron = function(rule, value, callback) {
      if (value === '') {
        callback(new Error('cron不能为空'))
      }
      // if (value === '') {
      // callback(new Error('cron校验'))
      // }
      // TODO 后端url校验
      callback()
    }
    return {
      routerVal: '',
      data: {},
      loading: false,
      query: {
        current: 1,
        size: 100,
        condition: {}
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
        headerAlign: 'center',
        align: 'center',
        labelWidth: '42%',
        dialogType: 'drawer',
        // columnBtn: false,
        // index: true,
        // indexLabel: '序号',
        column: [
          {
            label: '',
            prop: 'id',
            addDisplay: false,
            editDisplay: false,
            addDisabled: true,
            editDisabled: true,
            hide: true,
            rules: [{ required: true, message: '不能为空', trigger: 'blur' }]
          },
          {
            label: '任务名',
            prop: 'name',
            search: true,
            rules: [{ required: true, message: '归档任务名不能为空', trigger: 'blur' }]
          },
          {
            label: 'cron',
            prop: 'execCron',
            rules: [{ required: true, message: 'cron不能为空', validator: validCron, trigger: 'blur' }],
            value: '* 15 1 * * ?'
          },
          {
            label: '源数据源',
            prop: 'sourceDatasource',
            type: 'select',
            search: true,
            rules: [{ required: true, message: '源数据源不能为空', trigger: 'blur' }],
            props: {
              label: 'name',
              value: 'id',
              res: 'body'
            },
            dicUrl: process.env.VUE_APP_BASE_API + '/archive/archive-datasource/dic'
          },
          {
            label: '目标数据源',
            prop: 'targetDatasource',
            type: 'select',
            rules: [{ required: true, message: '目标数据源不能为空', trigger: 'blur' }],
            props: {
              label: 'name',
              value: 'id',
              res: 'body'
            },
            dicUrl: process.env.VUE_APP_BASE_API + '/archive/archive-datasource/dic'
          },
          {
            label: '源库',
            prop: 'sourceDb',
            search: true,
            rules: [{ required: true, message: '源库不能为空', trigger: 'blur' }],
            width: '95%'
          },
          {
            label: '目标库', prop: 'targetDb', rules: [{ required: true, message: '目标库不能为空', trigger: 'blur' }],
            width: '95%'
          },
          {
            label: '源表',
            prop: 'sourceTable',
            search: true,
            rules: [{ required: true, message: '源表不能为空', trigger: 'blur' }]
          },
          { label: '目标表', prop: 'targetTable', rules: [{ required: true, message: '目标表不能为空', trigger: 'blur' }] },
          {
            label: '事务大小',
            prop: 'txSize',
            value: 5000,
            rules: [{ required: true, message: '事务大小不能为空', trigger: 'blur' }],
            width: '78%'
          },
          {
            label: '清理源数据',
            prop: 'isPurge',
            type: 'radio',
            rules: [{ required: true, message: '是否清理源数据不能为空', trigger: 'blur' }],
            dicData: [{ value: 1, label: '是' }, { value: 0, label: '否' }],
            value: 1,
            width: '91%'
          },
          {
            label: '启用状态',
            prop: 'deleted',
            type: 'select',
            search: true,
            dicData: [{ label: '启用', value: false }, { label: '禁用', value: true }],
            addDisplay: false,
            editDisplay: false,
            width: '78%'
          },
          {
            label: '过滤条件',
            prop: 'sqlWhere',
            type: 'textarea',
            rules: [{ required: true, message: '过滤条件不能为空', trigger: 'blur' }],
            value: 'create_time < DATE_ADD(CURDATE(),INTERVAL -180 DAY)'
          }
        ]
      }
    }
  },
  created() {
    this.routerVal = this.$route.path
  },
  methods: {
    // 执行归档
    // test(data) {
    //   alert(1)
    //   alert(JSON.stringify(data))
    //   alert(this.$refs.crud.store.states.selection)
    //   console.info(this.multipleSelection)
    // },
    // handleSelectionChange(val) {
    //   console.info(val)
    //   this.multipleSelection = val
    // },
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
        done()
        this.handleGetList()
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
        done()
        this.handleGetList()
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
