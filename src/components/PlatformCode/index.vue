<template>
  <span>
    <el-select v-model="platform_code" placeholder="平台编码" style="width: 140px" class="filter-item" @change="handlePChange">
      <el-option v-for="item in platformOptions" :key="item.lable" :label="item.label" :value="item.value" />
    </el-select>
  </span>
</template>

<script>

export default {
  name: 'PlatformCode',
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      platformOptions: [
        { label: 'ALIEXPRESS', value: 'ALI' },
        { label: 'AMAZON', value: 'AMAZON' },
        { label: 'DARAZ', value: 'daraz' },
        { label: 'EBAY', value: 'EB' },
        { label: 'JOOM', value: 'JM' },
        { label: 'WISH', value: 'KF' },
        { label: 'LAZADA', value: 'LAZADA' },
        { label: 'MYMALL', value: 'MY' },
        { label: 'SHOPEE', value: 'SHOPEE' }
      ]
    }
  },
  computed: {
    platform_code: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  methods: {
    handlePChange(val) {
      return this.$emit('change', val)
    }
  }
}
</script>
