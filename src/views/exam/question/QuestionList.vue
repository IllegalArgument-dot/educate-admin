<template>
  <div class="app-container">
    <el-container>
      <sidebar/>
      <el-main>
        <el-form :model="queryParam" ref="queryForm" :inline="true" label-width="auto" label-position="top"
                 align="left">
          <el-form-item>
            <el-row>
              <el-col :span="7">
                <span>题目ID：</span>
              </el-col>
              <el-col :span="15">
                <el-input v-model="queryParam.id"></el-input>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item>
            <el-row>
              <el-col :span="7">
                <span>题目内容：</span>
              </el-col>
              <el-col :span="15">
                <el-input v-model="queryParam.content"></el-input>
              </el-col>
            </el-row>
          </el-form-item>
          <!-- 下面的几个表单项都使用下拉框 -->
          <el-form-item @change="levelChange">
            <el-row>
              <el-col :span="7">
                <span>年级：</span>
              </el-col>
              <el-col :span="15">
                <el-select v-model="queryParam.level" placeholder="请选择">
                  <el-option
                      v-for="item in levelEnum"
                      :key="item.key"
                      :label="item.value"
                      :value="item.key">
                  </el-option>
                </el-select>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item>
            <el-row>
              <el-col :span="7">
                <span>学科：</span>
              </el-col>
              <el-col :span="15">
                <el-select v-model="queryParam.subjectId" placeholder="请选择">
                  <el-option
                      v-for="item in subjectFilter"
                      :key="item.id"
                      :label="item.name+' ( '+item.levelName+' ) '"
                      :value="item.id">
                  </el-option>
                </el-select>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item>
            <el-row>
              <el-col :span="7">
                <span>题型：</span>
              </el-col>
              <el-col :span="15">
                <el-select v-model="queryParam.questionType" placeholder="请选择">
                  <el-option
                      v-for="item in questionType"
                      :key="item.key"
                      :label="item.value"
                      :value="item.key">
                  </el-option>
                </el-select>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm">查询</el-button>
            <el-popover placement="bottom" trigger="click">
              <el-button type="warning" size="mini" v-for="item in editUrlEnum" :key="item.key">
                {{ item.name }}
              </el-button>
              <el-button style="margin-left: 5px;" slot="reference" type="primary" class="link-left">添加</el-button>
            </el-popover>
          </el-form-item>
        </el-form>

        <el-table
            :data="tableData"
            border
            fit
            highlight-current-row
            style="width: 100%">
          <el-table-column
              prop="id"
              label="id"
              width="90px">
          </el-table-column>
          <el-table-column
              prop="subjectId"
              label="学科"
              :formatter="subjectFormatter"
              width="120px">
          </el-table-column>
          <el-table-column
              prop="questionType"
              :formatter="questionTypeFormatter"
              label="题型"
              width="70px">
          </el-table-column>
          <el-table-column
              prop="shortTitle"
              label="题干"
              show-overflow-tooltip>
          </el-table-column>
          <el-table-column
              prop="score"
              label="分数"
              width="60px">
          </el-table-column>
          <el-table-column
              prop="difficult"
              label="难度"
              width="60px">
          </el-table-column>
          <el-table-column
              prop="createTime"
              label="创建时间"
              width="120px">
          </el-table-column>
          <el-table-column
              align="center"
              label="操作"
              width="220px">
            <template v-slot:default="{row}">
              <el-button size="mini" @click="showQuestion(row)">预览</el-button>
              <el-button size="mini" @click="editQuestion(row)">编辑</el-button>
              <el-button size="mini" type="danger" @click="deleteQuestion(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination
            @size-change="search"
            @current-change="search"
            :current-page.sync="queryParam.pageIndex"
            :page-sizes="[5, 10, 20, 30, 50]"
            :page-size.sync="queryParam.pageSize"
            layout="sizes, prev, pager, next"
            :total="total">
        </el-pagination>
        <!-- 点击预览时候弹出的对话框 -->
        <el-dialog :visible.sync="questionShow.dialog" style="width: 100%;height: 100%">
          <QuestionShow :question="questionShow.question" :qType="questionShow.qType"
                        :qLoading="questionShow.loading"/>
        </el-dialog>
      </el-main>
    </el-container>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import {mapState, mapGetters, mapActions} from "vuex";
import questionApi from '@/api/question'
import QuestionShow from "@/views/exam/question/components/QuestionShow.vue";
import Sidebar from "@/layout/Sidebar/index.vue";

export default {
  components: {Sidebar, QuestionShow},
  data() {
    return {
      queryParam: {
        id: null,
        questionType: null,
        level: null,
        subjectId: null,
        pageIndex: 1,
        pageSize: 5
      },
      subjectFilter: null,
      listLoading: true,
      tableData: [],
      total: 0,
      questionShow: {
        qType: 0,
        dialog: false,
        question: null,
        loading: false
      }
    }
  },
  created() {
    let _this = this
    this.initSubject(function () {
      _this.subjectFilter = _this.subjects
    })
    this.search()
  },
  methods: {
    submitForm() {
      this.queryParam.pageIndex = 1
      this.search()
    },
    search() {
      this.listLoading = true
      questionApi.pageList(this.queryParam).then(data => {
        const re = data.response
        console.log(re.list)
        this.tableData = re.list
        this.total = re.total
        this.queryParam.pageIndex = re.pageNum
        this.listLoading = false
      })
    },
    editQuestion(row) {
      let url = this.enumFormat(this.editUrlEnum, row.questionType)
      console.log('跳转到题目编辑页面')
      this.$router.push({path: url, query: {id: row.id}})
    },
    levelChange() {
      this.queryParam.subjectId = null
      this.subjectFilter = this.subjects.filter(data => data.level === this.queryParam.level)
    },
    deleteQuestion(row) {
      this.$confirm('此操作将永久删除该题目,是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let _this = this
        questionApi.deleteQuestion(row.id).then(re => {
          if (re.code === 1) {
            _this.search()  // 删除后要重新刷新页面
            _this.$message.success(re.message)
          } else {
            _this.$message.error(re.message)
          }
        })
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    showQuestion(row) {
      let _this = this
      this.questionShow.dialog = true
      this.questionShow.loading = true
      questionApi.select(row.id).then(re => {
        _this.questionShow.qType = re.response.questionType
        _this.questionShow.question = re.response
        _this.questionShow.loading = false
      })
    },
    questionTypeFormatter(row, column, cellValue) {
      return this.enumFormat(this.questionType, cellValue)
    },
    subjectFormatter(row, column, cellValue) {
      return this.subjectEnumFormat(cellValue)
    },
    ...mapActions('exam', {initSubject: 'initSubject'})
  },
  computed: {
    ...mapGetters('enumItem', ['enumFormat']),
    ...mapState('enumItem', {
      questionType: state => state.exam.question.typeEnum,
      editUrlEnum: state => state.exam.question.editUrlEnum,
      levelEnum: state => state.user.levelEnum
    }),
    ...mapGetters('exam', ['subjectEnumFormat']),
    ...mapState('exam', {subjects: state => state.subjects})
  }
}
</script>

<style scoped>

</style>