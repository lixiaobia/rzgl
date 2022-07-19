<template>
  <div style="width: 100%">
    <el-row
      type="flex"
      justify="space-between"
      align="middle"
      style="height: 40px; padding: 30px 0; font-size: 14px; width: 100%"
    >
      <el-col>
        <span>{{ node.data ? node.data.name : "浙江机电" }}</span>
      </el-col>
      <el-col :span="4">
        <el-row type="flex" justify="end">
          <!-- 两个内容 -->
          <el-col>{{ node.data ? node.data.manager : "负责人" }}</el-col>
          <el-col>
            <!-- 下拉菜单 element -->
            <el-dropdown @command="oncommand">
              <span> 操作<i class="el-icon-arrow-down" /> </span>
              <!-- 下拉菜单 -->
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="a">添加子部门</el-dropdown-item>
                <template v-if="node.data">
                  <el-dropdown-item command="b">编辑部门</el-dropdown-item>
                  <el-dropdown-item command="c">删除部门</el-dropdown-item>
                </template>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <!-- 弹窗 -->
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="50%"
      @click.native.stop
      @close="handlerClose"
    >
      <el-form
        ref="form"
        label-width="80px"
        :model="addDepartmentForm"
        :rules="rules"
      >
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="addDepartmentForm.name" placeholder="3-10个字符" />
        </el-form-item>
        <el-form-item label="部门编码" prop="code">
          <el-input v-model="addDepartmentForm.code" placeholder="3-10个字符" />
        </el-form-item>
        <el-form-item label="部门负责人" prop="manager">
          <el-select
            v-model="addDepartmentForm.manager"
            style="width: 100%"
            placeholder="请选择"
            filterable
          >
            <el-option
              v-for="item in users"
              :key="item.id"
              :label="item.username"
              :value="item.username"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门介绍" prop="introduce">
          <el-input
            v-model="addDepartmentForm.introduce"
            placeholder="1-300个字符"
            type="textarea"
            :rows="3"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSumbit"> 确 定 </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getSimpleUserList } from '@/api/user'
import { delDepartment, addDepartment, getdepartmentList } from '@/api/departments'
export default {
  props: {
    node: {
      type: Object,
      required: true
    }
  },
  data () {
    const vaildateName = async (rule, value, callback) => {
      // 获取部门数据
      const res = await getdepartmentList()
      if (this.isEdit) {
        // 当前点击的选项的pid
        const pid = this.node.data.pid
        // 跟这个pid相等的就是他的同级别的兄弟  但是对比又不能包含他自己 所以还要吧自己排除掉  因为id没有相同的  所以只要id相同就说明是同一个  排除掉就好了
        res.depts.filter(item => item.pid === pid && item.id !== this.node.data.id).some(item => item.name === value) ? callback(new Error('部门名称重复')) : callback()
      } else {
        // 一级得pid为空 其他得子级pid等于父级id
        const id = this.node.data ? this.node.data.id : ''
        // 筛选子级 遍历每一项 看看name值有没有跟输入的一样的 一样就提示
        res.depts.filter(item => item.pid === id).some(item => item.name === value) ? callback(new Error('部门名称重复')) : callback()
      }
    }
    return {
      dialogVisible: false,
      addDepartmentForm: {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      },
      rules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' },
          // 表单的值改变时再发送请求  性能好点
          { validator: vaildateName, trigger: 'change' }
        ]
      },
      users: [],
      isEdit: false// 判断是添加还是编辑
    }
  },
  computed: {
    title () {
      return this.isEdit ? '编辑部门' : '添加部门'
    }
  },
  methods: {
    // 三种点击事件
    async oncommand (key) {
      if (this.users.length === 0) {
        this.getSimpleUserList()
      }
      if (key === 'a') {
        this.isEdit = false
        this.dialogVisible = true
      } else if (key === 'b') {
        this.isEdit = true
        this.dialogVisible = true
        this.addDepartmentForm = { ...this.node.data }
      } else {
        try {
          await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          await delDepartment(this.node.data.id)
          this.$emit('delDepartment')
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        } catch (error) {
          this.$notify.info({
            message: '取消删除'
          })
        }
      }
    },
    // 获取部门负责人下拉列表的数据
    async getSimpleUserList () {
      const res = await getSimpleUserList()
      console.log(res)
      this.users = res
    },
    // 关闭弹窗的回调
    handlerClose () {
      // 对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
      this.$refs.form.resetFields()
    },
    async onSumbit () {
      if (this.isEdit) {
        // 删除对象中的一个属性
        delete this.addDepartmentForm.children
        await addDepartment(this.addDepartmentForm)
      } else {
        this.addDepartmentForm.pid = this.node.data ? this.node.data.id : ''
        await addDepartment(this.addDepartmentForm)
      }
      // console.log(res)
      this.dialogVisible = false

      this.$emit('delDepartment')
      this.$message.success('添加成功')
    }
  }
}
</script>

<style scoped lang='scss'>
::v-deep .el-tree-node {
  padding: 10px !important;
  span,
  div {
    font-size: 20px;
  }
}
::v-deep .el-tree-node__content {
  padding: 20px 0 !important;
}
</style>
