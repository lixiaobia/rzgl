<template>
  <el-form label-width="80px" style="width: 400px" class="demo-ruleForm">
    <el-form-item label="企业名称" prop="name">
      <el-input disabled :value="info.name"></el-input>
    </el-form-item>
    <el-form-item label="公司地址" prop="companyAddress">
      <el-input disabled :value="info.companyAddress"></el-input>
    </el-form-item>
    <el-form-item label="公司电话" prop="companyPhone">
      <el-input disabled :value="info.companyPhone"></el-input>
    </el-form-item>
    <el-form-item label="邮箱" prop="mailbox">
      <el-input disabled :value="info.mailbox"></el-input>
    </el-form-item>
    <el-form-item label="备注" prop="remarks">
      <el-input disabled :value="info.remarks"></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
import { getCompanyInfo } from '@/api/setting'
import { mapGetters } from 'vuex'
export default {

  data () {
    return {
      info: {}
    }
  },
  computed: {
    ...mapGetters(['companyId'])
  },
  watch: {

  },
  async created () {
    const res = await getCompanyInfo(this.companyId)
    // console.log(res)
    this.info = res
  },
  methods: {}
}
</script>

<style scoped>
</style>
