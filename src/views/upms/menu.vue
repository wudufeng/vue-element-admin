<template>
  <el-container class="app-container">
    <el-aside style="background-color: #ffffff; width: 30%">
      <avue-tree :option="treeOption" :data="treeData" @node-click="nodeClick">
        <template slot="menuBtn" slot-scope="scope">
          <li class="el-dropdown-menu__item" @click="save(scope.data, scope.node, true)">新增同级菜单</li>
          <li class="el-dropdown-menu__item" @click="save(scope.data, scope.node, false)">新增下级菜单</li>
          <li class="el-dropdown-menu__item" @click="edit = true">编辑当前菜单</li>
          <li class="el-dropdown-menu__item" @click="del(scope.data, scope.node)">删除当前菜单</li>
        </template>
      </avue-tree>
    </el-aside>
    <el-main>
      <avue-form ref="form" v-model="data" :option="option" @submit="handleSubmit" />
    </el-main>
  </el-container>
</template>

<script>
import { get, getDetail, add, update, remove } from '@/api/crud'

export default {
  name: 'Menu',
  components: { },
  props: {
  },
  data() {
    return {
      routerVal: '',
      data: { id: '' },
      edit: true, // 区分是新增还是编辑
      parentMenuName: '',
      treeData: [],
      treeOption: {
        nodeKey: 'id',
        expandAll: false,
        addBtn: false,
        editBtn: false,
        delBtn: false,
        menu: true,
        size: 'small',
        formOption: {
          labelWidth: 100,
          column: [
            { label: '菜单ID', prop: 'id' },
            { label: '菜单编码', prop: 'code' },
            { label: '菜单名称', prop: 'name' },
            { label: '上级菜单编号', prop: 'parentCode' }
          ]
        },
        props: {
          label: 'name',
          value: 'id',
          children: 'children'
        }
      },
      option: {
        card: false,
        emptyBtn: false,
        align: 'center',
        labelWidth: '15%',
        dialogType: 'drawer',
        indexLabel: '序号',
        submitBtn: true,
        submitText: '新增',
        gutter: 10,
        column: [
          { label: '菜单ID', prop: 'id', display: false, span: 24, rules: [{ required: true, message: '菜单ID不能为空', trigger: 'blur' }] },
          { label: '菜单编码', prop: 'code', span: 24, display: false },
          { label: '上级菜单', prop: 'parentCode', span: 24, disabled: true, placeholder: '请选择上级菜单，留空则为顶层菜单' },
          { label: '菜单名称', prop: 'name', span: 24, rules: [{ required: true, message: '菜单名称不能为空', trigger: 'blur' }] },
          { label: '前端URL', prop: 'path', span: 24, rules: [{ required: true, message: '前端URL不能为空', trigger: 'blur' }] },
          { label: '图标', prop: 'icon', span: 24, rules: [{ required: true, message: '图标不能为空', trigger: 'blur' }] },
          { label: 'VUE页面', prop: 'component', span: 24, rules: [{ required: true, message: 'VUE页面不能为空', trigger: 'blur' }] },
          { label: '排序', prop: 'sort', span: 24, rules: [{ required: true, message: '排序值不能为空', trigger: 'blur' }] },
          { label: '路由缓存', prop: 'keepAlive', type: 'switch', span: 24, rules: [{ required: true, message: '路由缓存:0-开启,1-关闭不能为空', trigger: 'blur' }], dicData: [{ value: '0', label: '开启' }, { value: '1', label: '关闭' }] },
          { label: '菜单类型', prop: 'menuType', valueDefault: '0', span: 24, rules: [{ required: true, message: '菜单类型不能为空', trigger: 'blur' }], type: 'radio', dicData: [{ value: '0', label: '菜单' }, { value: '1', label: '按钮' }] },
          { label: '菜单权限标识', prop: 'permission', display: false, span: 24, rules: [{ required: true, message: '菜单权限标识不能为空', trigger: 'blur' }] },
          { label: '是否删除', prop: 'del', display: false, span: 24, rules: [{ required: true, message: '是否删除不能为空', trigger: 'blur' }], type: 'select', dicData: [{ value: true, label: '正常' }, { value: false, label: '已删除' }] }
        ]
      }
    }
  },
  watch: {
    edit(val, oldVal) {
      for (const item in this.option.column) {
        this.option.column[item].disabled = !val
      }
      this.option.column[2].disabled = true
      this.option.submitBtn = val
    },
    'data.id': {
      handler(val, oldVal) {
        if (val === '') {
          this.option.submitText = '新增'
        } else {
          this.option.submitText = '更新'
        }
      },
      deep: true
    },
    'data.menuType': {
      handler(value, oldVal) {
        this.option.column[5].display = value === '0'
        this.option.column[6].display = value === '0'
        this.option.column[7].display = value === '0'
        this.option.column[8].display = value === '0'
        this.option.column[10].display = value === '1'
      },
      deep: true
    }
  },
  created() {
    this.routerVal = this.$route.path
    this.handleTree()
  },
  methods: {
    handleTree() {
      get(this.routerVal + '/trees').then(res => {
        this.treeData = res.data
      })
    },
    nodeClick(data) {
      if (data !== null) {
        getDetail(this.routerVal, data.id).then(res => {
          this.data = res.data
        })
        this.edit = false
      }
    },
    del(data, node) {
      const uri = this.routerVal
      this.$confirm('是否确认删除记录', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function() {
          remove(uri, data.id).then(res => {
            node.remove()
          })
        })
    },
    save(data, node, parent) {
      this.data.id = ''
      this.data.name = ''
      this.data.parentCode = parent ? data.parentCode : data.code
      this.edit = true
    },
    handleSubmit(form, done) {
      if (form.id !== '') {
        update(this.routerVal, form).then(res => {
          this.handleTree()
        })
      } else {
        add(this.routerVal, form).then(res => {
          this.handleTree()
        })
      }
      setTimeout(() => {
        done()
      }, 1000)
    }
  }
}
</script>
