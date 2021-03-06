<template>
  <div class="app-container">
    <avue-crud
      ref="crud"
      v-model="data"
      :option="option"
      :data="datas"
      :table-loading="loading"
      :page="page"
      @on-load="handleSearch"
      @search-change="handleSearch"
      @row-save="handleAdd"
      @row-update="handleUpdate"
      @row-del="handleDel"
      @refresh-change="handleGetList"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      @sortable-change="sortableChange"
      @selection-change="handleSelectionChange"
    >
      <template slot="menu" slot-scope="scope">
        <el-button v-if="scope.row.deleted" type="text" icon="el-icon-unlock" size="small" @click.stop="enableArchiveJob(scope.row.id)">启用</el-button>
        <el-button v-if="!scope.row.deleted" type="text" icon="el-icon-lock" size="small" @click.stop="disableArchiveJob(scope.row.id)">禁用</el-button>
        <el-button type="text" icon="el-icon-video-play" size="small" @click.stop="execArchiveJob(scope.row.id)">执行</el-button>
      </template>
      <template slot="menuLeft">
        <el-button icon="el-icon-unlock" size="small" @click.stop="enableArchiveJob('')">启用</el-button>
        <el-button icon="el-icon-lock" size="small" @click.stop="disableArchiveJob('')">禁用</el-button>
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
        menuWidth: 200,
        selection: true,
        border: true,
        searchResetBtn: true,
        // viewBtn: true,
        delBtn: false,
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
            showColumn: false,
            rules: [{ required: true, message: '不能为空', trigger: 'blur' }]
          },
          {
            label: '任务名',
            prop: 'name',
            search: true,
            sortable: true,
            rules: [{ required: true, message: '归档任务名不能为空', trigger: 'blur' }]
          },
          {
            label: 'cron',
            prop: 'execCron',
            rules: [{ required: true, message: 'cron不能为空', validator: validCron, trigger: 'blur' }],
            value: '0 15 1 * * ?',
            width: '98%'
          },
          {
            label: '源数据源',
            prop: 'sourceDatasource',
            type: 'select',
            width: '100%',
            search: true,
            searchFilterable: true,
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
            width: '100%',
            searchFilterable: true,
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
            hide: true,
            rules: [{ required: true, message: '事务大小不能为空', trigger: 'blur' }],
            width: '78%'
          },
          {
            label: '清理源数据',
            prop: 'isPurge',
            type: 'radio',
            hide: true,
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
            hide: true,
            rules: [{ required: true, message: '过滤条件不能为空', trigger: 'blur' }],
            value: 'create_time < DATE_ADD(CURDATE(),INTERVAL -180 DAY)'
          },
          {
            label: '批量操作',
            prop: 'isBatch',
            type: 'radio',
            hide: true,
            searchTip: '非自增长主键请勿使用批量操作',
            rules: [{ required: true, message: '是否批量操作不能为空', trigger: 'blur' }],
            dicData: [{ value: 1, label: '是' }, { value: 0, label: '否' }],
            value: 1,
            width: '91%'
          }
        ]
      },
      selection: []
    }
  },
  created() {
    this.routerVal = this.$route.path
  },
  methods: {
    getSelectIds() {
      const arr = []
      for (let i = 0; i < this.selection.length; i++) {
        arr.push(this.selection[i].id)
      }
      return arr
    },
    // 执行归档
    execArchiveJob(id) {
      execArchiveJob(id).then(() => {
        this.loading = false
        this.$notify({
          title: 'Success',
          message: '执行成功!',
          type: 'success'
        })
      })
    },
    // 批量启用归档任务
    enableArchiveJob(data) {
      if (data) {
        enableArchiveJob(data).then(() => {
          this.loading = false
          this.$notify({
            title: 'Success',
            message: '启用成功!',
            type: 'success'
          })
          this.handleGetList()
        })
      } else if (this.selection.length) {
        enableArchiveJob(this.getSelectIds().join(',')).then(() => {
          this.loading = false
          this.$notify({
            title: 'Success',
            message: '批量启用成功!',
            type: 'success'
          })
          this.handleGetList()
        })
      } else {
        this.$message.error('请选择数据')
      }
      this.handleGetList()
    },
    // 批量禁用归档任务
    disableArchiveJob(data) {
      if (data) {
        disableArchiveJob(data).then(() => {
          this.loading = false
          this.$notify({
            title: 'Success',
            message: '禁用成功!',
            type: 'success'
          })
          this.handleGetList()
        })
      } else if (this.selection.length) {
        disableArchiveJob(this.getSelectIds().join(',')).then(() => {
          this.loading = false
          this.$notify({
            title: 'Success',
            message: '批量禁用成功!',
            type: 'success'
          })
          this.handleGetList()
        })
      } else {
        this.$message.error('请选择数据')
      }
    },
    handleGetList(params, done) {
      this.loading = true
      this.query.current = this.page.currentPage
      this.query.size = this.page.pageSize
      getList(this.routerVal, this.query).then(res => {
        this.datas = res.body.data
        this.page.total = res.body.totalRecord
        this.loading = false
        done ? done() : ''
      })
    },
    handleSearch(params, done) {
      this.page.currentPage = 1
      this.query.condition = params
      this.handleGetList(params, done)
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
          this.handleGetList()
        })
    },
    sortableChange() {},
    handleSelectionChange(selection) {
      this.selection = selection
    }
  }
}
</script>
