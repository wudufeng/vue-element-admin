<template>
  <div>
    <el-row :gutter="40" class="panel-group">
      <el-col :xs="12" :sm="12" :lg="8" class="card-panel-col">
        <div class="card-panel">
          <div style="display: flex;">
            <div style="width:70%;padding-top: 2%;">
              <p style="text-align: center;">本地图片数量占比</p>
              <div style="margin-left: 10px">
                <ve-pie :data="chartData" :settings="chartSettings" />
              </div>
            </div>
            <div style="width: 30%;padding-top: 2%;padding-right:1%">
              <div style="text-align: right;font-weight: bold;">
                <p style="line-height: 18px;color: rgba(0, 0, 0, 0.45);font-size: 18px;margin:10px 60px 15px 20px;">
                  本地</p>
                <p style="font-size: 15px;margin:1px 60px 25px 20px;">
                  <count-to :end-val="5024000" />
                </p>
                <p style="line-height: 10px;color: rgba(0, 0, 0, 0.45);font-size: 13px;margin:20px 60px 15px 20px;">
                  服务器容量</p>
                <p style="line-height: 10px;font-size: 12px;color: rgba(0, 0, 0, 0.45);margin:2px 60px 25px 20px;">
                  <count-to :end-val="3578" />
                  GB
                </p>
                <p style="line-height: 10px;color: rgba(0, 0, 0, 0.45);font-size: 13px;margin:20px 60px 15px 30px;">
                  已使用</p>
                <p style="line-height: 10px;font-size: 12px;color: rgba(0, 0, 0, 0.45);margin:2px 60px 25px 20px;">
                  <count-to :end-val="1145" />
                  GB
                </p>
              </div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="8" class="card-panel-col">
        <div class="card-panel1">
          <div style="display: flex;">
            <div style="width:70%;padding-top: 2%;">
              <p style="text-align: center;">清溪图片数量占比</p>
              <div style="margin-left: 10px">
                <ve-pie :data="chartData" :settings="chartSettings" />
              </div>
            </div>
            <div style="width: 30%;padding-top: 2%;padding-right:1%;text-align:center">
              <div style="text-align: right;font-weight: bold;">
                <p style="line-height: 18px;color: rgba(0, 0, 0, 0.45);font-size: 18px;margin:10px 60px 15px 20px;">
                  清溪</p>
                <p style="font-size: 15px;margin:1px 60px 25px 20px;">
                  <count-to :end-val="5024000" />
                </p>
                <p style="line-height: 10px;color: rgba(0, 0, 0, 0.45);font-size: 13px;margin:20px 60px 15px 20px;">
                  服务器容量</p>
                <p style="line-height: 10px;font-size: 12px;color: rgba(0, 0, 0, 0.45);margin:2px 60px 25px 20px;">
                  <count-to :end-val="3578" />
                  GB
                </p>
                <p style="line-height: 10px;color: rgba(0, 0, 0, 0.45);font-size: 13px;margin:20px 60px 15px 30px;">
                  已使用</p>
                <p style="line-height: 10px;font-size: 12px;color: rgba(0, 0, 0, 0.45);margin:2px 60px 25px 20px;">
                  <count-to :end-val="1145" />
                  GB
                </p>
              </div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="8" class="card-panel-col">
        <div class="card-panel2">
          <div style="display: flex;">
            <div style="width:70%;padding-top: 2%;">
              <p style="text-align: center;">海外图片数量占比</p>
              <div style="margin-left: 10px">
                <ve-pie :data="chartData" :settings="chartSettings" />
              </div>
            </div>
            <div style="width: 30%;padding-top: 2%;padding-right:1%">
              <div style="text-align: right;font-weight: bold;">
                <p style="line-height: 18px;color: rgba(0, 0, 0, 0.45);font-size: 18px;margin:10px 60px 15px 20px;">
                  海外</p>
                <p style="font-size: 15px;margin:1px 60px 25px 20px;">
                  <count-to :end-val="5024000" />
                </p>
                <p style="line-height: 10px;color: rgba(0, 0, 0, 0.45);font-size: 13px;margin:20px 60px 15px 20px;">
                  服务器容量</p>
                <p style="line-height: 10px;font-size: 12px;color: rgba(0, 0, 0, 0.45);margin:2px 60px 25px 20px;">
                  <count-to :end-val="3578" />
                  GB
                </p>
                <p style="line-height: 10px;color: rgba(0, 0, 0, 0.45);font-size: 13px;margin:20px 60px 15px 30px;">
                  已使用</p>
                <p style="line-height: 10px;font-size: 12px;color: rgba(0, 0, 0, 0.45);margin:2px 60px 25px 20px;">
                  <count-to :end-val="1145" />
                  GB
                </p>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row style="margin-left:30px;margin-right:20px">
      <avue-crud
        ref="crud"
        :data="data"
        :option="option"
        :page.sync="page"
        :table-loading="loading"
        @search-change="imageSearch"
        @row-update="imageUpdate"
        @size-change="imageSearch"
        @current-change="imageSearch"
      >
        <template slot="menuRight">
          <el-button type="primary" size="small" icon="el-icon-sort" @click="typeSwitch(1)">公共图</el-button>
          <el-button type="primary" size="small" icon="el-icon-sort" @click="typeSwitch(2)">自定义图</el-button>
          <el-button type="primary" size="small" icon="el-icon-sort" @click="typeSwitch(3)">边框图</el-button>
          <el-button type="primary" size="small" icon="el-icon-sort" @click="typeSwitch(4)">水印图</el-button>
        </template>

        <template slot="menuLeft">
          <div style="display: flex">
            <el-select v-model="value" placeholder="请选择" size="small" style="margin-left: 45px" @clearable="false" @change="warehouseSwitch(value)">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </div>
        </template>

        <template slot="menu" slot-scope="scope">
          <el-button type="text" icon="el-icon-picture-outline" size="small" @click.stop="preview(scope.row)">预览</el-button>
          <el-button v-if="dataType===1 && value===3" type="text" icon="el-icon-refresh" size="small" @click.stop="syncToLocal(scope.row.id)">同步到本地</el-button>
        </template>

      </avue-crud>
    </el-row>
    <el-row>
      <el-dialog title="预览" :visible.sync="dialogTableVisible" width="25%" :center="true">
        <img :src="imageUrl" style="height:300px;width:430px;">
      </el-dialog>
    </el-row>
  </div>
</template>
<script>
import CountTo from 'vue-count-to'
import { imageSearch, imageUpdate, syncToLocal } from '@/api/image'

export default {
  components: {
    CountTo
  },
  data() {
    this.chartSettings = {
      radius: 40,
      offsetY: 90,
      limitShowNum: 2
    }
    return {
      loading: false,
      dataType: 1,
      dialogTableVisible: false,
      value: 1,
      imageUrl: '',
      data: [],
      option: {},
      options: [{ label: '本地库', value: 1 }, { label: '清溪库', value: 2 }, { label: '海外中间库', value: 3 }, { label: '海外库', value: 4 }],
      page: {
        total: 0,
        currentPage: 1,
        pageSize: 10
      },
      chartData: {
        columns: ['类型', '数量'],
        rows: [
          { '类型': '公共图片', '数量': 8000 },
          { '类型': '自定义图片', '数量': 2000 },
          { '类型': '水印图片', '数量': 300 },
          { '类型': '边框图片', '数量': 1500 }
        ]
      },
      imageOption: {
        columnBtn: false,
        refreshBtn: false,
        cancelBtn: false,
        addBtn: false,
        delBtn: false,
        align: 'center',
        menuAlign: 'center',
        column: [
          {
            label: '平台',
            search: true,
            searchSpan: 4,
            editDisabled: true,
            type: 'select',
            dicData: [{ label: 'ALI', value: 'ALI' }, { label: 'EB', value: 'EB' }, { label: 'LAZADA', value: 'LAZADA'
            }, { label: 'SHOPEE', value: 'SHOPEE' }, { label: 'JM', value: 'JM' }, { label: 'KF', value: 'KF' }],
            prop: 'platformCode'
          },
          {
            label: 'SKU',
            search: true,
            searchSpan: 4,
            editDisabled: true,
            prop: 'sku'
          },
          {
            label: '名称',
            search: true,
            overHidden: true,
            searchSpan: 4,
            editDisabled: true,
            prop: 'imgName'
          },
          {
            label: '类别',
            search: true,
            searchSpan: 4,
            type: 'select',
            editDisabled: true,
            dicData: [{ label: '主图', value: 'main' }, { label: '附图', value: 'normal' }],
            prop: 'imgType'
          },
          {
            label: '分组',
            overHidden: true,
            prop: 'dfsGroup'
          },
          {
            label: '路径',
            overHidden: true,
            prop: 'dfsPath'
          },
          {
            label: '删除状态',
            type: 'select',
            clearable: false,
            dicData: [{ label: 'false', value: 'false' }, { label: 'true', value: 'true' }],
            prop: 'del'
          },
          {
            label: '创建时间',
            editDisplay: false,
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
            editDisplay: false,
            prop: 'updateTime'
          },
          {
            label: '同步时间',
            type: 'date',
            format: 'yyyy-MM-dd HH:mm:ss',
            overHidden: true,
            editDisplay: false,
            prop: 'synTime'
          }
        ]
      },
      customOption: {
        columnBtn: false,
        refreshBtn: false,
        addBtn: false,
        editBtn: false,
        delBtn: false,
        cancelBtn: false,
        align: 'center',
        menuAlign: 'center',
        column: [
          {
            label: '编码',
            search: true,
            overHidden: true,
            searchSpan: 5,
            prop: 'listingImageNo'
          },
          {
            label: '平台',
            search: true,
            searchSpan: 4,
            type: 'select',
            dicData: [{ label: 'ALI', value: 'ALI' }, { label: 'EB', value: 'EB' }, {
              label: 'LAZADA',
              value: 'LAZADA'
            }, { label: 'SHOPEE', value: 'SHOPEE' }, { label: 'JM', value: 'JM' }, { label: 'KF', value: 'KF' }],
            prop: 'platform'
          },
          {
            label: '账号ID',
            searchSpan: 4,
            search: true,
            prop: 'account'
          },
          {
            label: '分组',
            overHidden: true,
            prop: 'dfsGroup'
          },
          {
            label: '路径',
            overHidden: true,
            prop: 'dfsPath'
          },
          {
            label: '状态',
            prop: 'del'
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
      frameOption: {
        columnBtn: false,
        refreshBtn: false,
        editBtn: false,
        delBtn: false,
        addBtn: false,
        cancelBtn: false,
        align: 'center',
        menuAlign: 'center',
        column: [
          {
            label: 'SKU',
            search: true,
            searchSpan: 4,
            prop: 'sku'
          },
          {
            label: '平台',
            search: true,
            searchSpan: 4,
            type: 'select',
            dicData: [{ label: 'ALI', value: 'ALI' }, { label: 'EB', value: 'EB' }, {
              label: 'LAZADA',
              value: 'LAZADA'
            }, { label: 'SHOPEE', value: 'SHOPEE' }, { label: 'JM', value: 'JM' }, { label: 'KF', value: 'KF' }],
            prop: 'platform'
          },
          {
            label: '账号',
            search: true,
            searchSpan: 4,
            prop: 'account'
          },
          {
            label: '分组',
            overHidden: true,
            prop: 'dfsGroup'
          },
          {
            label: '路径',
            overHidden: true,
            prop: 'dfsPath'
          },
          {
            label: '创建时间',
            type: 'date',
            format: 'yyyy-MM-dd HH:mm:ss',
            overHidden: true,
            prop: 'createTime'
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
      watermarkOption: {
        columnBtn: false,
        refreshBtn: false,
        addBtn: false,
        delBtn: false,
        editBtn: false,
        cancelBtn: false,
        align: 'center',
        menuAlign: 'center',
        column: [
          {
            label: '平台',
            search: true,
            searchSpan: 4,
            type: 'select',
            dicData: [{ label: 'ALI', value: 'ALI' }, { label: 'EB', value: 'EB' }, {
              label: 'LAZADA',
              value: 'LAZADA'
            }, { label: 'SHOPEE', value: 'SHOPEE' }, { label: 'JM', value: 'JM' }, { label: 'KF', value: 'KF' }],
            prop: 'platform'
          },
          {
            label: '账号',
            search: true,
            searchSpan: 4,
            prop: 'account'
          },
          {
            label: '分组',
            overHidden: true,
            prop: 'dfsGroup'
          },
          {
            label: '路径',
            overHidden: true,
            prop: 'dfsPath'
          },
          {
            label: '创建时间',
            type: 'date',
            format: 'yyyy-MM-dd HH:mm:ss',
            overHidden: true,
            prop: 'createTime'
          },
          {
            label: '修改时间',
            type: 'date',
            format: 'yyyy-MM-dd HH:mm:ss',
            overHidden: true,
            prop: 'updateTime'
          }
        ]
      }
    }
  },
  created() {
    this.typeSwitch(this.dataType)
  },
  methods: {
    warehouseSwitch(value) {
      const params = {}
      this.value = value
      this.page.currentPage = 1
      this.page.pageSize = 10
      this.imageSearch(params)
    },
    typeSwitch(type) {
      const params = {}
      this.page.currentPage = 1
      this.page.pageSize = 10
      switch (type) {
        case 2:
          this.dataType = 2
          this.data = []
          this.option = this.customOption
          this.imageSearch(params)
          break
        case 3:
          this.dataType = 3
          this.data = []
          this.option = this.frameOption
          this.imageSearch(params)
          break
        case 4:
          this.dataType = 4
          this.data = []
          this.option = this.watermarkOption
          this.imageSearch(params)
          break
        default:
          this.dataType = 1
          this.data = []
          this.option = this.imageOption
          this.imageSearch(params)
      }
    },
    imageSearch(params, done) {
      this.loading = true
      if (this.value === 1) {
        if (this.dataType === 2 || this.dataType === 3) {
          this.$message.warning('本地没有自定义图 边框图!')
          return
        }
      }
      if (this.value === 2) {
        if (this.dataType === 2 || this.dataType === 3 || this.dataType === 4) {
          this.$message.warning('清溪没有自定义图 边框图 水印图!')
          return
        }
      }
      const data = {
        pn: this.page.currentPage,
        ps: this.page.pageSize,
        platformCode: params.platformCode,
        sku: params.sku,
        imgName: params.imgName,
        imgType: params.imgType,

        listingNo: params.listingImageNo,
        account: params.account,
        platform: params.platform
      }

      // 确定环境
      var path = '/local/image/'
      if (this.value === 2) {
        path = '/qx/image/'
      } else if (this.value === 3) {
        path = '/middle/image/'
      } else if (this.value === 4) {
        path = '/overseas/image/'
      }

      // 确定类型
      if (this.dataType === 2) {
        path = path + 'listingImage/list'
      } else if (this.dataType === 3) {
        path = path + 'adorn/list'
      } else if (this.dataType === 4) {
        path = path + 'image/watermark/list'
      } else {
        path = path + 'skuImage/list'
      }

      imageSearch(path, data).then(res => {
        this.data = res.data.list
        this.page.total = res.data.total
        this.loading = false
        done ? done() : ''
        this.loading = false
      })
    },
    imageUpdate(form, index, done) {
      // 确定环境
      var path = '/local/image/skuImage/update'
      if (this.value === 2) {
        path = '/qx/image/skuImage/update'
      } else if (this.value === 3) {
        path = '/middle/image/skuImage/update'
      } else if (this.value === 4) {
        path = '/overseas/image/skuImage/update'
      }

      const data = {
        id: form.id,
        group: form.dfsGroup,
        path: form.dfsPath,
        isDel: form.del
      }

      imageUpdate(path, data).then(() => {
        this.loading = false
        this.$notify({
          title: 'Success',
          message: '更新成功!',
          type: 'success'
        })
        done()
        const params = {}
        this.imageSearch(params)
      })
    },
    syncToLocal(id) {
      var path = '/local/image/syn/image/nodeTobase/manual'
      syncToLocal(path, id).then(() => {
        this.loading = false
        this.$notify({
          title: 'Success',
          message: '执行成功!',
          type: 'success'
        })
      })
    },
    preview(row) {
      // 确定环境
      var path = 'http://172.16.2.63:18084/'
      if (this.value === 2) {
        path = 'http://172.17.1.8:8084/'
      } else if (this.value === 3) {
        path = 'http://172.16.2.63:8084/'
      } else if (this.value === 4) {
        path = 'http://w.neototem.com/'
      }

      // 确定类型
      if (this.dataType === 2) {
        path = path + 'listingImage/download/' + row.listingImageNo
      } else if (this.dataType === 3) {
        path = path + 'adorn/download/' + row.platform + '/' + row.account + '/' + row.site
      } else if (this.dataType === 4) {
        path = path + 'image/watermark/' + row.platform + '/' + row.account + '/' + row.site + '.jpg'
      } else {
        path = path + 'image/' + row.sku + '/' + row.imgType + '/' + row.imgName
      }
      this.imageUrl = path
      this.dialogTableVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
  .panel-group {
    margin-top: 18px;

    .card-panel-col {
      margin-bottom: 32px;
    }

    .card-panel {
      margin-left: 32px;
      height: 220px;
      background: #f0f2f5;
    }

    .card-panel1 {
      height: 220px;
      background: #f0f2f5;
    }

    .card-panel2 {
      margin-right: 32px;
      height: 220px;
      background: #f0f2f5;
    }
  }
</style>
