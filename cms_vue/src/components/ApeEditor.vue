<template>
  <div>
    <Editor id="tinymce" v-model="tinymceHtml" :init="tinymceData"></Editor>
  </div>
</template>

<script>
import 'tinymce/tinymce'
import Editor from '@tinymce/tinymce-vue'

import 'tinymce/themes/silver/theme'
import 'tinymce/plugins/contextmenu'
import 'tinymce/plugins/wordcount'
import 'tinymce/plugins/image'
import 'tinymce/plugins/media'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/link'
// import 'tinymce/plugins/autolink'
import 'tinymce/plugins/table'
import 'tinymce/plugins/hr'
import 'tinymce/plugins/preview'
import 'tinymce/plugins/code'
import 'tinymce/plugins/fullscreen'
// import 'tinymce/plugins/insertdatetime'
// import 'tinymce/plugins/template'
// import 'tinymce/plugins/paste'
import 'tinymce/plugins/textcolor'
import 'tinymce/plugins/anchor'
import 'tinymce/plugins/print'
//import 'tinymce/plugins/indent2em/plugin'
//import 'tinymce/plugins/lineheight/plugin'
import '@/../public/tinymce/plugins/indent2em/plugin'
import '@/../public/tinymce/plugins/lineheight/plugin'

export default {
  components: {
    Editor
  },
  props:{
    plugins:{
      type: String,
      //default:'link lists image table colorpicker textcolor wordcount ',
      default:'link lists image media table textcolor wordcount contextmenu hr preview fullscreen anchor code indent2em lineheight',
    },
    toolbar:{
      type: String,
      //default: 'undo redo | bold italic underline strikethrough | fontsizeselect | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent blockquote | table link unlink image | removeformat',
      default: 'undo redo paste | bold italic underline strikethrough | fontselect fontsizeselect | indent2em lineheight | forecolor backcolor | ltr rtl | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent blockquote | link unlink image media table | removeformat anchor hr | code preview fullscreen',
    },
    showMenu:{
      type: Boolean,
      default: true
    },
    editorHeight: {
      type: Number,
      default: 300,
    },
    initHtml:{
      type: String,
      default: ''
    },
    fontFormats: {
      type: String,
      default: '宋体=simsun,serif;仿宋体=FangSong,serif;楷体=KaiTi,serif;黑体=SimHei,sans-serif;微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;Verdana=verdana,geneva;'
    }
  },
  data() {
    return {
      tinymceHtml: '',
      tinymceData: {
        language_url: '/tinymce/zh_CN.js',
        language: 'zh_CN',
        skin_url: '/tinymce/skins/ui/oxide',
        //images_upload_url: '/admin_api/upload/editor'
        height: this.editorHeight,
        plugins: this.plugins,
        toolbar: this.toolbar,
        branding: false,
        menubar: this.showMenu,
        images_upload_handler: this.imagesUploadHandler,
        convert_urls:false,
        font_formats: this.fontFormats,
        toolbar_drawer: false
      }
    }
  },
  created(){
  },
  computed: {
  },
  watch: {
    // 初始化编辑器内容
    "initHtml": function(val) {
      this.tinymceHtml = val
    },
    // 处理编辑器内容变化
    "tinymceHtml" : function(val) {
      this.$emit('handleTinymceInput',val)
    }
  },
  methods: {
    imagesUploadHandler(blobInfo, success, failure){
      let filename = blobInfo.filename()
      let fileType = filename.substring(filename.lastIndexOf("."))
      this.$api.getOssToken().then((res)=>{
        let formData = new FormData()
        let ossUrl = false
        if(res.accessid){
          formData.append('key', res.dir+res.filename+fileType)
          formData.append('policy', res.policy)
          formData.append('OSSAccessKeyId', res.accessid)
          formData.append('success_action_status', '200')
          formData.append('callback', res.callback)
          formData.append('signature', res.signature)
          ossUrl = res.host
        }
        formData.append('file', blobInfo.blob(), blobInfo.filename())
        this.$api.editorUploadFile(formData, ossUrl).then((res)=>{
          success(res[0].full_path)
        }).catch(()=>{
          failure('上传失败')
        })
      }).catch(()=>{
        failure('上传失败')
      })
    }
  }
}
</script>
