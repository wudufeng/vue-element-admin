<template>
  <div>
    <el-row :gutter="40" class="panel-group">
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <p style="color: rgba(0, 0, 0, 0.45);font-weight: bold;font-size: 14px;padding:10px 14px 10px 140px;">上传情况一览</p>
          <ve-pie :data="pieData" :settings="pieSettings" style="margin:0px 0px -60px 3px;" />
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="10" class="card-panel-col">
        <div class="card-panel2">
          <p style="color: rgba(0, 0, 0, 0.45);font-weight: bold;font-size: 14px;padding-top:10px;padding-left: 300px">业务增长趋势</p>
          <ve-line :data="lineData" :settings="lineSettings" width="600px" height="240px" style="margin:-10px 0px 0px 40px;" />
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="8" class="card-panel-col">
        <div class="card-panel3">
          <div style="display: flex;margin-top: 14px">
            <p style="color: rgba(0, 0, 0, 0.45);font-weight: bold;font-size: 14px;margin:10px 0px -0px 80px;">ALI上传速度 /S</p>
            <p style="color: rgba(0, 0, 0, 0.45);font-weight: bold;font-size: 14px;margin:10px 0px -0px 150px;">EB上传速度 /S</p>
          </div>
          <div style="display: flex">
            <ve-gauge :data="aliMeterData" :settings="meterSettings" width="250px" style="margin-top: -90px" />
            <ve-gauge :data="ebMeterData" :settings="meterSettings" width="250px" style="margin-top: -90px" />
          </div>
        </div>
      </el-col>
    </el-row>

    <!--table表格操作-->
    <el-row style="margin-left:30px;margin-right:20px;">
      <avue-crud
        ref="crud"
        :data="data"
        :option="option"
        :page.sync="page"
        @on-load="uploadSearch"
        @search-change="uploadSearch"
        @refresh-change="uploadSearch"
        @size-change="uploadSearch"
        @current-change="uploadSearch"
        @selection-change="handleSelectionChange"
      >
        <template slot="menu" slot-scope="scope">
          <el-button v-if="scope.row.status===2" type="text" icon="el-icon-refresh" size="small" @click.stop="uploadRetry(scope.row.id)">上传重试</el-button>
        </template>

        <template slot="menuLeft">
          <el-button icon="el-icon-refresh" size="small" @click.stop="uploadRetry('')">上传重试</el-button>
        </template>
      </avue-crud>
    </el-row>
  </div>

</template>

<script>
import { uploadSearch, uploadRetry } from '@/api/image'

export default {
  components: {},
  data() {
    this.pieSettings = {
      radius: 40,
      offsetY: 90
    }
    this.lineSettings = {
      metrics: ['ALI', 'EB'],
      dimension: ['日期']
    }
    this.meterSettings = {
      seriesMap: {
        'speed': {
          min: 0,
          max: 100,
          axisLabel: {
            fontSize: 12
          },
          detail: {
            fontSize: 20
          }
        }
      }
    }
    return {
      pieData: {
        columns: ['status', 'count'],
        rows: [
          { 'status': '上传成功数量', 'count': 3804966 },
          { 'status': '上传失败数量', 'count': 1393 },
          { 'status': '待上传数量', 'count': 392 }
        ]
      },
      lineData: {
        columns: ['日期', 'ALI', 'EB'],
        rows: [
          { '日期': '17', 'ALI': 53149, 'EB': 216758 },
          { '日期': '18', 'ALI': 44367, 'EB': 166327 },
          { '日期': '19', 'ALI': 42656, 'EB': 104422 },
          { '日期': '20', 'ALI': 40053, 'EB': 84911 },
          { '日期': '21', 'ALI': 34144, 'EB': 147749 },
          { '日期': '22', 'ALI': 4319, 'EB': 29000 }
        ]
      },
      aliMeterData: {
        columns: ['type', 'value'],
        rows: [
          { type: 'speed', value: 20 }
        ]
      },
      ebMeterData: {
        columns: ['type', 'value'],
        rows: [
          { type: 'speed', value: 60 }
        ]
      },
      page: {
        total: 0,
        currentPage: 1,
        pageSize: 10
      },
      data: [],
      option: {
        columnBtn: false,
        refreshBtn: false,
        selection: true,
        cancelBtn: false,
        editBtn: false,
        delBtn: false,
        addBtn: false,
        align: 'center',
        menuAlign: 'center',
        selectable: (row, index) => {
          return row.status === 2
        },
        column: [
          {
            label: 'ID',
            hide: true,
            prop: 'id'
          },
          {
            label: '平台',
            search: true,
            searchSpan: 6,
            type: 'select',
            dicData: [{ label: 'ALI', value: 'ALI' }, { label: 'EB', value: 'EB' }],
            prop: 'platformCode'
          },
          {
            label: '账号',
            search: true,
            searchSpan: 6,
            prop: 'accountId'
          },
          {
            label: 'SKU',
            search: true,
            searchSpan: 6,
            prop: 'sku'
          },
          {
            label: '名称',
            overHidden: true,
            prop: 'imgName'
          },
          {
            label: '类别',
            prop: 'imgType'
          },
          {
            label: '平台地址',
            overHidden: true,
            prop: 'platformPath'
          },
          {
            label: '水印',
            prop: 'watermark'
          },
          {
            label: '状态',
            search: true,
            searchSpan: 6,
            type: 'select',
            dicData: [{ label: '成功', value: 1 }, { label: '失败', value: 2 }],
            prop: 'status'
          },
          {
            label: '失败次数',
            prop: 'failCount'
          },
          {
            label: '失败原因',
            overHidden: true,
            prop: 'note'
          },
          {
            label: '创建时间',
            type: 'date',
            overHidden: true,
            format: 'yyyy-MM-dd HH:mm:ss',
            prop: 'createTime'
          },
          {
            label: '修改时间',
            type: 'date',
            overHidden: true,
            format: 'yyyy-MM-dd HH:mm:ss',
            prop: 'updateTime'
          }
        ]
      }
    }
  },
  methods: {
    uploadSearch(params, done) {
      const data = {
        pn: this.page.currentPage,
        ps: this.page.pageSize,
        platformCode: params.platformCode,
        accountId: params.accountId,
        sku: params.sku,
        status: params.status
      }

      uploadSearch(data).then(res => {
        this.data = res.data.list
        this.page.total = res.data.total
        this.loading = false
        done ? done() : ''
      })
    },
    uploadRetry(params) {
      if (params) {
        uploadRetry(params)
        this.$notify({
          title: 'Success',
          message: '执行成功!',
          type: 'success'
        })
      } else if (this.selection.length) {
        const arr = []
        for (let i = 0; i < this.selection.length; i++) {
          arr.push(this.selection[i].id)
        }
        uploadRetry(arr.join(','))
        this.$notify({
          title: 'Success',
          message: '执行成功!',
          type: 'success'
        })
      }
    },
    handleSelectionChange(selection) {
      this.selection = selection
    }
  }
}
</script>

<style lang="scss" scoped>
  .panel-group {
    margin-top: 3px;

    .card-panel-col {
      margin-bottom: 32px;
    }

    .card-panel {
      margin-left: 32px;
      height: 220px;
      background: #f0f2f5;
    }
    .card-panel2 {
      height: 220px;
      background: #f0f2f5;
    }

    .card-panel3 {
      margin-right: 32px;
      height: 220px;
      background: #f0f2f5;
    }
  }
</style>

