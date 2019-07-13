<template>
  <span>
    <el-select v-model="platform_code" placeholder="平台编码" clearable style="width: 120px" class="filter-item">
      <el-option v-for="item in platformOptions" :key="item" :label="item" :value="item" />
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
      platformOptions: ['ALI', 'AMAZON', 'daraz', 'EB', 'JM', 'KF', 'LAZADA', 'MY', 'SHOPEE']
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
  }
}
</script>
