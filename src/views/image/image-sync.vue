<template>
  <div>
    <!--数据面板展示-->
    <avue-data-cardtext :option="panel" style="margin-left:15px;margin-right:15px;margin-top: 10px" />
    <!--table表格操作-->
    <el-row style="margin-left:30px;margin-right:20px;margin-top: 30px">
      <avue-crud
        ref="crud"
        :data="data"
        :option="option"
        :page.sync="page"
        @on-load="syncSearch"
        @search-change="syncSearch"
        @refresh-change="syncSearch"
        @size-change="syncSearch"
        @current-change="syncSearch"
        @row-del="syncDel"
        @selection-change="handleSelectionChange"
        @reset-change="syncSearch"
      >
        <template slot="menu" slot-scope="scope">
          <el-button type="text" icon="el-icon-refresh" size="small" @click.stop="syncRetry(scope.row.imgId)">同步重试</el-button>
        </template>

        <template slot="menuLeft">
          <div style="display: flex">
            <el-select v-model="value" placeholder="请选择" size="small" style="margin-left: 30px" @clearable="false" @change="syncList(value)">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <el-button icon="el-icon-refresh" size="small" style="margin-left: 10px" @click.stop="syncRetry('' )">同步重试</el-button>
            <el-button icon="el-icon-delete" size="small" @click.stop="syncDel('')">删除</el-button>
          </div>
        </template>
      </avue-crud>
    </el-row>

  </div>
</template>

<script>
import { syncSearch, syncDel, syncRetry } from '@/api/image'

export default {
  data() {
    return {
      selection: [],
      panel: {
        span: 8,
        data: [
          {
            click: function(item) {
              alert(JSON.stringify(item))
            },
            title: '本地',
            color: 'yellow',
            icon: 'el-icon-bell',
            content: '待同步数: [10256],同步成功: [9856],同步失败: [12]',
            target: '_blank',
            name: '点击查询详情',
            date: '当前同步情况'
          },
          {
            click: function(item) {
              alert(JSON.stringify(item))
            },
            title: '海外',
            icon: 'el-icon-bell',
            color: 'green',
            content: '待同步数: 10256,已同步: 9856,同步失败: 12',
            name: '点击查看详情',
            date: '当前同步情况'
          },
          {
            click: function(item) {
              alert(JSON.stringify(item))
            },
            title: '清溪',
            icon: 'el-icon-bell',
            color: '#3fa1ff',
            content: '待同步数: 10256,已同步: 9856,同步失败: 12',
            name: '点击查看详情',
            date: '当前同步情况'
          }
        ]
      },
      options: [{
        value: 1,
        label: '本地环境'
      }, {
        value: 2,
        label: '清溪环境'
      }, {
        value: 3,
        label: '海外环境'
      }],
      value: 1,
      data: [],
      option: {
        columnBtn: false,
        refreshBtn: false,
        selection: true,
        cancelBtn: false,
        editBtn: false,
        addBtn: false,
        align: 'center',
        menuAlign: 'center',
        column: [
          {
            label: '记录ID',
            search: true,
            searchSpan: 4,
            prop: 'id'
          },
          {
            label: '图片ID',
            search: true,
            searchSpan: 4,
            prop: 'imgId'
          },
          {
            label: 'SKU',
            search: true,
            searchSpan: 4,
            prop: 'sku'
          },
          {
            label: '名称',
            search: true,
            searchSpan: 4,
            overHidden: true,
            prop: 'imgName'
          },
          {
            label: '类别',
            type: 'select',
            dicData: [{ label: 'main', value: 'main' }, { label: 'normal', value: 'normal' }, { label: 'main', value: '1' }, { label: 'normal', value: '2' }],
            prop: 'imgType'
          },
          {
            label: '失败原因',
            overHidden: true,
            prop: 'describe'
          },
          {
            label: '失败次数',
            prop: 'failCount'
          },
          {
            label: '图片来源',
            dicData: [{ label: '本地ERP', value: 1 }, { label: '海外ERP', value: 2 }],
            prop: 'source'
          },
          {
            label: '创建时间',
            type: 'date',
            format: 'yyyy-MM-dd HH:mm:ss',
            overHidden: true,
            prop: 'createdTime'
          },
          {
            label: '修改时间',
            type: 'date',
            format: 'yyyy-MM-dd HH:mm:ss',
            overHidden: true,
            prop: 'updateTime'
          }
        ]
      },
      page: {
        total: 0,
        currentPage: 1,
        pageSize: 10
      }
    }
  },
  methods: {
    syncSearch(params, done) {
      const data = {
        pn: this.page.currentPage,
        ps: this.page.pageSize,
        id: params.id,
        imgId: params.imgId,
        sku: params.sku,
        imaName: params.imgName,
        imgType: params.imgType
      }

      var path = '/local/image/syn/image/fail/list'
      if (this.value === 2) {
        path = '/qx/image/syn/image/fail/list'
      } else if (this.value === 3) {
        path = '/middle/image/syn/image/fail/list'
      }

      syncSearch(path, data).then(res => {
        this.data = res.data.list
        this.page.total = res.data.total
        this.loading = false
        done ? done() : ''
      })
    },
    syncList(value) {
      const data = {
        pn: this.page.currentPage,
        ps: this.page.pageSize
      }
      if (value != null) {
        this.value = value
      }

      var path = '/local/image/syn/image/fail/list'
      if (this.value === 2) {
        path = '/qx/image/syn/image/fail/list'
      } else if (this.value === 3) {
        path = '/middle/image/syn/image/fail/list'
      }

      syncSearch(path, data).then(res => {
        this.data = res.data.list
        this.page.total = res.data.total
        this.loading = false
      })
    },
    syncDel(scope) {
      this.$confirm('是否确认删除记录', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var path = '/local/image/syn/image/fail/delete'
        if (this.value === 2) {
          path = '/qx/image/syn/image/fail/delete'
        } else if (this.value === 3) {
          path = '/middle/image/syn/image/fail/delete'
        }

        if (this.selection.length) {
          const arr = []
          for (let i = 0; i < this.selection.length; i++) {
            arr.push(this.selection[i].id)
          }
          syncDel(path, arr.join(',')).then(() => {
            this.$notify({
              title: 'Success',
              message: '删除成功!',
              type: 'success'
            })
            this.syncList()
          })
        } else {
          syncDel(path, scope.id).then(() => {
            this.$notify({
              title: 'Success',
              message: '删除成功!',
              type: 'success'
            })
          })
          this.syncList()
        }
      })
    },
    syncRetry(params) {
      var path = '/local/image/syn/image/base/manual'
      if (this.value === 2) {
        path = '/qx/image/syn/image/node/manual'
      } else if (this.value === 3) {
        path = '/middle/image/syn/image/node/manual'
      }

      if (params) {
        syncRetry(path, params).then(() => {
          this.$notify({
            title: 'Success',
            message: '执行成功!',
            type: 'success'
          })
          this.syncList()
        })
      } else if (this.selection.length) {
        const arr = []
        for (let i = 0; i < this.selection.length; i++) {
          arr.push(this.selection[i].imgId)
        }
        syncRetry(path, arr.join(',')).then(() => {
          this.$notify({
            title: 'Success',
            message: '执行成功!',
            type: 'success'
          })
          this.syncList()
        })
      }
    },
    handleSelectionChange(selection) {
      this.selection = selection
    }
  }
}
</script>
