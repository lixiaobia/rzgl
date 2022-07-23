<template>
  <div>
    <el-button
      type="primary"
      size="mini"
      @click="
        roleDialogVisible = true;
        isEdit = false;
      "
      >新增角色</el-button
    >
    <el-table :data="roleList" border>
      <el-table-column label="序号" type="index"> </el-table-column>
      <el-table-column prop="name" label="角色名" sortable width="160px">
      </el-table-column>
      <el-table-column prop="description" label="描述" sortable>
      </el-table-column>
      <el-table-column prop="name" label="操作">
        <template v-slot="scope">
          <el-button type="text" @click="showRightDialog(scope.row.id)"
            >分配权限</el-button
          ><el-button type="text" @click="showDialog(scope.row)">修改</el-button
          ><el-button type="text" @click="del(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-row type="flex" justify="end" align="middle">
      <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :current-page="paramsObj.page"
        :page-sizes="[2, 4, 6, 8]"
        :page-size="paramsObj.pagesize"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </el-row>
    <!-- 分配权限 -->
    <el-dialog title="分配权限" :visible.sync="rightDialog" width="30%">
      <el-tree
        v-if="rightDialog"
        ref="mytree"
        :data="permissions"
        :props="{ label: 'name' }"
        default-expand-all
        show-checkbox
        node-key="id"
        :default-checked-keys="selectedPermissions"
      ></el-tree>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加和编辑的对话框 -->
    <el-dialog
      :title="isEdit ? '编辑' : '新增'"
      :visible.sync="roleDialogVisible"
      width="50%"
      @close="reset"
    >
      <el-form
        ref="myForm"
        :model="form"
        :rules="rules"
        label-width="80px"
        class="demo-ruleForm"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input v-model="form.description"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onClick">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getRoleList, delRole, addRole, editRole } from '@/api/setting'
import { getPermissions, getPermissionsById, assignPermission } from '@/api/permission'
import { treeList } from '@/utils'
export default {
  filters: {},
  components: {},
  data () {
    return {
      paramsObj: {
        page: 1, // 默认拿第一页的数据
        pagesize: 4// 每页数量
      },
      roleList: [],
      total: null,
      rightDialog: false, // 分配角色的弹窗
      permissions: [],
      selectedPermissions: [],
      id: null, // 角色id
      roleDialogVisible: false, // 添加和编辑的弹窗
      form: {
        name: '',
        description: ''
      },
      rules: {
        name: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ]
      },
      isEdit: false
    }
  },
  computed: {},
  watch: {},
  created () {
    this.getRoleList()
  },
  methods: {
    async getRoleList () {
      const res = await getRoleList(this.paramsObj)
      // console.log(res)
      this.roleList = res.rows
      this.total = res.total// 用于做分页
    },
    // 分页函数
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.paramsObj.pagesize = val
      this.getRoleList()
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.paramsObj.page = val
      this.getRoleList()
    },
    // 删除操作
    del (id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await delRole(id)
        if (this.paramsObj.length === 1 && this.paramsObj.page > 1) {
          this.paramsObj.page--
        }
        this.getRoleList()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 分配权限
    async showRightDialog (id) {
      this.id = id
      // 获取所有的权限点
      const res = await getPermissions()
      this.permissions = treeList(res, '0')
      // 获取当前权限点
      const res1 = await getPermissionsById(id)
      // console.log(res1)
      this.selectedPermissions = res1.permIds
      this.rightDialog = true
    },
    async save () {
      // console.log(this.$refs.mytree.getCheckedKeys())
      await assignPermission(this.id, this.$refs.mytree.getCheckedKeys())
      // console.log(res)
      this.rightDialog = false
    },
    // 添加和分配的确定按钮
    onClick () {
      // 表单二次校验
      this.$refs.myForm.validate(async (bool) => {
        if (!bool) return this.$message.error('表单数据非法')
        if (this.isEdit) {
          await editRole(this.form)
        } else {
          await addRole(this.form)
        }
        this.getRoleList()
        this.roleDialogVisible = false
      })
    },
    reset () {
      this.$refs.myForm.resetFields()
      this.form = {
        name: '',
        description: ''
      }
    },
    // 修改
    showDialog (row) {
      this.isEdit = true
      this.roleDialogVisible = true
      this.form = { ...row }// 浅拷贝
      // this.form = Object.assign({}, row)// 浅拷贝
    }

  }
}
</script>

<style scoped lang="scss">
.el-table {
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>
