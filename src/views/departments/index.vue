<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card v-loading="isLoading" class="box-card">
        <el-tabs>
          <el-tab-pane label="用户管理">
            <!-- 用了一个行列布局 -->
            <TreeItem
              :node="titleObj"
              @delDepartment="getdepartmentList"
            ></TreeItem>
            <el-tree :data="data" default-expand-all>
              <template v-slot="scope">
                <TreeItem
                  :node="scope.node"
                  @delDepartment="getdepartmentList"
                ></TreeItem>
              </template>
            </el-tree>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <el-backtop></el-backtop>
  </div>
</template>

<script>
import { getdepartmentList } from '@/api/departments'
import { treeList } from '@/utils'
import TreeItem from './components/TreeItem'
export default {
  filters: {},
  components: {
    TreeItem
  },

  data () {
    return {
      data: [],
      titleObj: {},
      isLoading: true
    }
  },
  computed: {},
  watch: {},
  created () {
    this.getdepartmentList()
  },
  methods: {
    async getdepartmentList () {
      const res = await getdepartmentList()
      console.log(res)
      // 定义一个处理数据的递归函数  处理成树型结构

      this.data = treeList(res.depts, '')
      // console.log(res1)
      this.titleObj = res.depts[0]
      this.isLoading = false
    }
  }
}
</script>

<style scoped lang='scss'>
.tree-card {
  padding: 30px 140px;
  font-size: 14px;
}
</style>
