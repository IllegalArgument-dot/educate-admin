<template>
  <div class="app-container">
    <el-container>
      <sidebar/>
      <el-main>
        <el-form ref="form" :model="form" label-width="100px" v-loading="formLoading" :rules="rules">
          <el-form-item label="年级：" prop="gradeLevel" align="left" required>
            <el-select v-model="form.gradeLevel" placeholder="年级" @change="levelChange" clearable>
              <el-option v-for="item in levelEnum" :key="item.key" :value="item.key" :label="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="学科：" prop="subjectId" align="left" required>
            <el-select v-model="form.subjectId" placeholder="学科">
              <el-option v-for="item in subjectFilter" :key="item.id" :value="item.id"
                         :label="item.name+' ( '+item.levelName+' )'"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="题干：" prop="title" align="left" required>
            <el-input v-model="form.title" @focus="inputClick(form,'title')"/>
          </el-form-item>
          <el-form-item label="选项：" required>
            <el-form-item :label="item.prefix" :key="item.prefix" v-for="(item, index) in form.items" label-width="50px"
                          class="question-item-label">
              <!-- 这个prefix和上面的el-form-item的prefix是绑定的，这个是用来编辑，而上面那个只能预览不能编辑 -->
              <el-input v-model="item.prefix" style="width: 50px;margin-right: 10px"/>
              <el-input v-model="item.content" @focus="inputClick(form, 'content')"
                        class="question-item-content-input" :style="{ width: '200px',marginRight: '10px' }"/>
              <el-button type="danger" size="mini" class="question-item-remove" icon="el-icon-delete"
                         @click="questionItemRemove(index)"></el-button>
            </el-form-item>
          </el-form-item>
          <el-form-item label="解析：" prop="analyze" required>
            <el-input v-model="form.analyze" @focus="inputClick(form,'analyze')"/>
          </el-form-item>
          <el-form-item label="分数：" prop="score" required>
            <el-input-number v-model="form.score" :precision="1" :step="1" :max="100"></el-input-number>
          </el-form-item>
          <el-form-item label="难度：" required>
            <el-rate v-model="form.difficult" class="question-item-rate"></el-rate>
          </el-form-item>
          <el-form-item label="正确答案：" prop="correct" required>
            <el-radio-group v-model="form.correct">
              <el-radio v-for="item in form.items" :key="item.prefix" :label="item.prefix">{{ item.prefix }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <!-- 最下方的提交等按钮 -->
          <el-form-item>
            <el-button type="primary" @click="submitForm">提交</el-button>
            <el-button @click="resetForm">重置</el-button>
            <el-button type="success" @click="questionItemAdd">添加选项</el-button>
            <el-button type="success" @click="showQuestion">预览</el-button>
          </el-form-item>
        </el-form>
        <!-- 确定、取消对话框 -->
        <el-dialog :visible.sync="richEditor.dialogVisible" append-to-body :close-on-click-modal="false"
                   style="width: 100%;height: 100%" :show-close="false" center>
          <UE @ready="editorReady"/>
          <span>请填上您要编辑的内容</span>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="editorConfirm">确 定</el-button>
            <el-button @click="richEditor.dialogVisible = false">取 消</el-button>
          </span>
        </el-dialog>
        <!-- 预览对话框 -->
        <el-dialog :visible.sync="questionShow.dialog" style="width: 100%;height: 100%">
          <QuestionShow :qType="questionShow.qType" :question="questionShow.question" :qLoading="questionShow.loading"/>
        </el-dialog>
      </el-main>
    </el-container>
  </div>
</template>


<script>
import Sidebar from "@/layout/Sidebar/index.vue";
import {mapGetters, mapState, mapActions} from "vuex";
import questionApi from '@/api/question'
import UE from "@/components/Ueditor/index.vue";
import QuestionShow from "@/views/exam/question/components/QuestionShow.vue";

export default {
  components: {QuestionShow, UE, Sidebar},
  data() {
    return {
      form: {
        id: null,
        questionType: 1,
        gradeLevel: null,
        subjectId: null,
        title: '',
        items: [
          {prefix: 'A', content: ''},
          {prefix: 'B', content: ''},
          {prefix: 'C', content: ''},
          {prefix: 'D', content: ''}
        ],
        analyze: '',
        correct: '',
        score: '',
        difficult: 0
      },
      subjectFilter: null,
      formLoading: false,
      rules: {
        gradeLevel: [
          {required: true, message: '请选择年级', trigger: 'change'}
        ],
        subjectId: [
          {required: true, message: '请选择学科', trigger: 'change'}
        ],
        title: [
          {required: true, message: '请输入题干', trigger: 'blur'}
        ],
        analyze: [
          {required: true, message: '请输入解析', trigger: 'blur'}
        ],
        score: [
          {required: true, message: '请输入分数', trigger: 'blur'}
        ],
        correct: [
          {required: true, message: '请选择正确答案', trigger: 'change'}
        ]
      },
      richEditor: {
        dialogVisible: false,
        object: null,
        parameterName: '',
        instance: null
      },
      questionShow: {
        qType: 0,
        dialog: false,
        question: null,
        loading: false
      }
    }
  },
  created() {
    let id = this.$route.query.id
    let _this = this
    this.initSubject(function () {
      _this.subjectFilter = _this.subjects
    })
    if (id && parseInt(id) !== 0) {
      _this.formLoading = true
      questionApi.select(id).then(re => {
        _this.form = re.response
        _this.formLoading = false
      })
    }
  },
  methods: {
    submitForm() {

    },
    resetForm() {

    },
    questionItemAdd() {

    },
    editorReady(instance) {
      this.richEditor.instance = instance
      let currentContent = this.richEditor.object[this.richEditor.parameterName]
      this.richEditor.instance.setContent(currentContent)
      // 光标定位到Ueditor
      this.richEditor.instance.focus(true)
    },
    inputClick(object, parameterName) {
      this.richEditor.object = object
      this.richEditor.parameterName = parameterName
      this.richEditor.dialogVisible = true
    },
    editorConfirm() {
      let content = this.richEditor.instance.getContent()
      this.richEditor.object[this.richEditor.parameterName] = content
      this.richEditor.dialogVisible = false
    },
    questionItemRemove(index) {
      this.form.items.splice(index, 1)
    },
    levelChange() {
      this.form.subjectId = null
      this.subjectFilter = this.subjects.filter(data => data.level === this.form.gradeLevel)
    },
    showQuestion() {
      this.questionShow.dialog = true
      this.questionShow.qType = this.form.questionType
      this.questionShow.question = this.form
    },
    ...mapActions('exam', {initSubject: 'initSubject'}),
    ...mapActions('tagsView', {delCurrentView: 'delCurrentView'})
  },
  computed: {
    ...mapGetters('enumItem', ['enumFormat']),
    ...mapState('enumItem', {
      questionTypeEnum: state => state.exam.question.typeEnum,
      levelEnum: state => state.user.levelEnum
    }),
    ...mapState('exam', {subjects: state => state.subjects})
  }
}
</script>

<style>
</style>