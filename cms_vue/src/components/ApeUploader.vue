<template>
  <div>
  <el-upload
    class="ape-uploader"
    :class="{'ape-uploader-image':isImage, 'ape-uploader-disabled':disabledUpload}"
    name="file"
    :action="uploadToken.host"
    :headers="uploadHeaders"
    :data="uploadData"
    :on-preview="handlePictureCardPreview"
    :before-upload="beforeUpload"
    :on-success="afterUpload"
    :on-remove="removeUpload"
    :list-type="listType"
    :on-error="onError"
    :file-list="uploadFileList"
    :limit = "limit"
    :on-exceed="onExceed"
    >
      <el-button v-if="listType == 'text' && !disabledUpload" size="small" type="primary">点击上传</el-button>
      <i v-if="listType == 'picture-card' && !disabledUpload" class="el-icon-plus"></i>
  </el-upload>
  <div slot="tip" class="el-upload__tip">{{uploadTip?uploadTip:'请上传文件，最多上传'+limit+'张/份。'}}</div>
  <el-dialog :visible.sync="dialogVisible" append-to-body>
    <img width="100%" :src="dialogImageUrl" alt="">
  </el-dialog>
  </div>
</template>

<script>
export default {
  props:{
      isImage:{
        type: Boolean,
        default: true
      },
      uploadFileList:{
        type:Array,
        default:function(){
          return []
        }
      },
      limit:{
        type: Number,
        default: 1
      },
      uploadTip:{
        type: String,
        default: ''
      },
      allowTypeList:{
        type: Array,
        default: function(){
          return ['image/jpeg', 'image/png','application/zip','application/rar']
        }
      },
      allowSize:{
        type: Number,
        default: 1024*1024*2 //默认2MB
      }
  },
  data() {
    return {
      // disabledUpload:false,
      imageUrl: '',
      fileType: '',
      dialogVisible: false,
      dialogImageUrl: '',
      uploadHeaders:{},
      uploadData: {},
      uploadToken: {
          accessid: '',
          host: '',
          policy: '',
          signature: '',
          expire: 0,
          callback: '',
          dir: '',
          upload_save: '',
          filename: '',
      },
    };
  },
  created(){
  },
  computed: {
    listType: function(){
      if(this.isImage){
        return 'picture-card'
      }else{
        return 'text'
      }
    },
    disabledUpload() {
      if(this.uploadFileList.length>=this.limit){
        return true
      }else{
        return false
      }
    }
  },
  methods: {
    /**
     * 点击文件列表中已上传的文件时的钩子
     */
    handlePictureCardPreview(file) {
      if (this.isImage) {
        this.dialogImageUrl = file.url
        this.dialogVisible = true
      }
    },
    /**
     * 超过文件最多数量
     */
    onExceed(files, fileList){
      let length = fileList.length
      let msg = "最多上传"+length+"个文件"
      this.$message.error(msg);
    },
    /**
     * 获取上传凭证
     */
    async getOssToken(){
      this.uploadToken = await this.$api.getOssToken();
    },
    /**
     * 上传完成
     */
    afterUpload(res, file, fileList) {
      this.imageUrl = URL.createObjectURL(file.raw);
      this.$emit('handleUploadSuccess', res.data[0], this.formatFileList(fileList))
    },
    /**
     * 删除文件
     */
    removeUpload(file, fileList) {
      this.$emit('handleUploadRemove', file, this.formatFileList(fileList))
    },
    /**
     * 上传失败
     */
    onError(err, file, fileList) {
      this.$emit('handleUploadError', err, file, fileList)
    },
    /**
     * 上传前
     */
    async beforeUpload(file) {
      // console.log(file)
      let checkType = this.allowTypeList.indexOf(file.type)
      let checkSize = file.size > this.allowSize

      if (checkType<0) {
        this.$message.error('文件类型不合法')
        throw '文件类型不合法'
      }
      if (checkSize) {
        this.$message.error('文件大小超过限制')
        throw '文件大小超过限制'
      }
      const suffix_index = file.name.lastIndexOf(".")
      this.fileType = file.name.substring(suffix_index)
      //上传配置
      await this.setOssParams()
      await this.$emit('handleUploadBefore', file)
      return true
    },
    /**
     * 设置上传参数
     */
    async setOssParams(){
      await this.getOssToken()
      let fileKey = this.uploadToken.dir + this.uploadToken.filename;
      if(this.fileType){
          fileKey+=this.fileType
      }
      if (this.uploadToken.upload_save == 'oss') {
        this.uploadData =  {
          key: fileKey,
          policy: this.uploadToken.policy,
          OSSAccessKeyId: this.uploadToken.accessid,
          success_action_status: "200", //让服务端返回200,不然，默认会返回204
          callback: this.uploadToken.callback,
          signature: this.uploadToken.signature
        }
      }
      if (this.uploadToken.upload_save == 'local') {
        this.uploadHeaders={
          'HYPERF-SESSION-ID':localStorage.getItem("HYPERF_SESSION_ID")
        }
        this.uploadData =  {
          upload_path: this.uploadToken.dir
        }
      } 
    },
    /**
     * 格式化文件列表
     */
    formatFileList(fileList){
      let result = []
      for(var i=0; i<fileList.length; i++){
        if(fileList[i].response == undefined){
          result.push(fileList[i])
        }else{
          let resData = fileList[i].response.data[0]
          let item = {
            id: resData.id,
            name: resData.title,
            path: resData.path,
            url: resData.full_path,
            size: resData.size
          }
          result.push(item)
        }
      }
      return result
    }
  }
}
</script>
<style lang="stylus">
  //按钮宽度
  $icon-width = 100px
  //按钮高度
  $icon-height = 100px
  .ape-uploader-image
    .el-upload-dragger
      width $icon-width
      height $icon-height
  .ape-uploader-image
    .el-upload--picture-card
      width $icon-width
      height $icon-height
      line-height: $icon-height
  .ape-uploader-image
    .el-upload-list--picture-card
      .el-upload-list__item
        width $icon-width
        height $icon-height
  .ape-uploader-disabled
    .el-upload--picture-card
      display none
  .el-progress--circle
    width 80px !important 
  .el-progress-circle
    width 80px !important
    height 80px !important
</style>
