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
      @refresh-change="handleGetList"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { getList } from '@/api/crud'

export default {
  name: 'ArchiveJobLog',
  components: {},
  props: {},
  data() {
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
        border: true,
        searchResetBtn: true,
        addBtn: false,
        delBtn: false,
        editBtn: false,
        viewBtn: true,
        index: true,
        headerAlign: 'center',
        align: 'center',
        labelWidth: '142',
        dialogType: 'drawer',
        indexLabel: '序号',
        column: [
          {
            label: '',
            prop: 'id',
            addDisplay: false,
            editDisplay: false,
            viewDisplay: false,
            addDisabled: true,
            editDisabled: true,
            hide: true,
            showColumn: false
          },
          // { label: '任务id', prop: 'jobId', rules: [{  message: '任务id不能为空', trigger: 'blur' }] },
          {
            label: '任务名称',
            prop: 'jobId',
            type: 'select',
            search: true,
            searchFilterable: true,
            props: {
              label: 'name',
              value: 'id',
              res: 'body'
            },
            dicUrl: process.env.VUE_APP_BASE_API + '/archive/archive-job/dic'
          },
          {
            label: '执行状态',
            prop: 'status',
            search: true,
            type: 'select',
            dicData: [{ value: 1, label: '失败' }, { value: 0, label: '成功' }]
          },
          { label: '启动时间', prop: 'jobStartTime' },
          { label: '结束时间', prop: 'jobEndTime' },
          { label: '耗时(秒)', prop: 'jobSpend' },
          { label: '归档数量', prop: 'count' },
          {
            label: '日志时间',
            prop: 'createTime',
            addDisplay: false,
            editDisplay: false
          },
          {
            label: '日志详情',
            prop: 'content',
            type: 'textarea',
            hide: true,
            maxRows: 25,
            minRows: 25,
            span: 24
          }
        ]
      }
    }
  },
  created() {
    this.routerVal = this.$route.path
  },
  methods: {
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
    }
  }
}
</script>
