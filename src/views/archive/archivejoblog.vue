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
        labelWidth: '42%',
        dialogType: 'drawer',
        indexLabel: '序号',
        column: [
          {
            label: '',
            prop: 'id',
            addDisplay: false,
            addDisabled: true,
            editDisabled: true,
            hide: true,
            rules: [{ required: true, message: '不能为空', trigger: 'blur' }]
          },
          { label: '库', prop: 'jobId', rules: [{ required: true, message: '库不能为空', trigger: 'blur' }] },
          { label: '任务执行状态', prop: 'status', dicData: [{ value: 1, label: '失败' }, { value: 0, label: '成功' }] },
          { label: '任务启动时间', prop: 'jobStartTime', rules: [{ required: true, message: '任务启动时间不能为空', trigger: 'blur' }] },
          { label: '任务结束时间', prop: 'jobEndTime', rules: [{ required: true, message: '任务结束时间不能为空', trigger: 'blur' }] },
          { label: '任务耗时(秒)', prop: 'jobSpend', rules: [{ required: true, message: '任务耗时(秒)不能为空', trigger: 'blur' }] },
          { label: '操作数据数', prop: 'count', rules: [{ required: true, message: '操作数据数不能为空', trigger: 'blur' }] },
          {
            label: '日志详情',
            prop: 'content',
            rules: [{ required: true, message: '日志详情不能为空', trigger: 'blur' }],
            hide: true
          },
          {
            label: '日志时间',
            prop: 'createTime',
            rules: [{ required: true, message: '创建时间不能为空', trigger: 'blur' }],
            addDisplay: false,
            editDisplay: false
          }
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
    }
  }
}
</script>
