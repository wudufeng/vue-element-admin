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
    />
  </div>
</template>

<script>
import { getList, add, update, remove } from '@/api/crud'

export default {
  name: 'UserInfo',
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
        viewBtn: true,
        delBtn: true,
        index: true,
        headerAlign: 'center',
        align: 'center',
        labelWidth: '36%',
        dialogType: 'drawer',
        indexLabel: '序号',
        column: [
          { label: '主键ID', prop: 'userId', addDisplay: false, addDisabled: true, editDisabled: true, hide: true, rules: [{ required: true, message: '主键ID不能为空', trigger: 'blur' }] },
          { label: '用户名', prop: 'username', search: {}, rules: [{ required: true, message: '用户名不能为空', trigger: 'blur' }] },
          { label: '登录密码', prop: 'password', type: 'password', hide: true, rules: [{ required: true, message: '登录密码不能为空', trigger: 'blur' }] },
          { label: '昵称', prop: 'nickname', rules: [{ required: true, message: '昵称不能为空', trigger: 'blur' }] },
          { label: '姓名', prop: 'realname', rules: [{ required: true, message: '姓名不能为空', trigger: 'blur' }] },
          { label: '性别', prop: 'sex', rules: [{ required: true, message: '性别不能为空', trigger: 'blur' }], type: 'select', dicData: [{ value: '0', label: '未知' }, { value: '1', label: '男' }, { value: '2', label: '女' }] },
          { label: '头像', prop: 'headImgUrl', hide: true, rules: [{ required: true, message: '头像url不能为空', trigger: 'blur' }] },
          { label: '手机号码', prop: 'phone', rules: [{ required: true, message: '手机号码不能为空', trigger: 'blur' }] },
          { label: 'Email', prop: 'email', rules: [{ required: true, message: 'Email不能为空', trigger: 'blur' }] },
          { label: '所在国家', prop: 'country', rules: [{ required: true, message: '所在国家不能为空', trigger: 'blur' }] },
          { label: '所在省份', prop: 'province', rules: [{ required: true, message: '所在省份不能为空', trigger: 'blur' }] },
          { label: '所在城市', prop: 'city', rules: [{ required: true, message: '所在城市不能为空', trigger: 'blur' }] },
          { label: '住址', prop: 'address', rules: [{ required: true, message: '住址不能为空', trigger: 'blur' }] },
          { label: '个性签名', prop: 'signature', hide: true, rules: [{ required: true, message: '个性签名不能为空', trigger: 'blur' }] },
          { label: '状态', prop: 'status', search: {}, rules: [{ required: true, message: '状态不能为空', trigger: 'blur' }], type: 'select', dicData: [{ value: '1', label: '正常' }, { value: '2', label: '锁定' }, { value: '3', label: '注销' }] }
        ]
      }
    }
  },
  created() {
    this.routerVal = this.$route.path
  },
  methods: {
    handleGetList() {
      this.query.current = this.page.currentPage
      this.query.size = this.page.pageSize
      getList(this.routerVal, this.query).then(res => {
        this.datas = res.data.records
        this.page.total = res.data.total
      })
    },
    handleSearch(params) {
      this.page.currentPage = 1
      this.query.condition = params
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
          return remove(_this.routerVal, scope.userId)
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
