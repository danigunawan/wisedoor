<template>
  <div id="header">
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container">
        <img id="logo" class="navbar-brand" src="@/assets/logo.png" alt="">
        <!-- <a class="navbar-brand" href="#">智慧門鎖</a> -->
        <button id="nav-bar-toggle" class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav ml-auto">
                <li class="nav-item active">
                    <a class="nav-link loginout-button" href="#" @click="$emit('clickAddFace')" data-toggle="modal" data-target="#add-face-modal">新增臉孔</a>
                </li>
                <li class="nav-item active">
                    <a class="nav-link loginout-button" href="#" data-toggle="modal" data-target="#register-equipment-modal">新增設備</a>
                </li>
                <li class="nav-item active">
                    <a class="nav-link loginout-button" href="#" @click="$emit('clickChangeToOnlineClassify')">線上辨識</a>
                </li>
                <media :query="{maxWidth:768}">
                  <li class="nav-item active">
                      <a class="nav-link loginout-button" href="#" @click="$emit('clickEquipmentList')">設備列表</a>
                  </li>
                </media>  
                <li class="nav-item active">
                    <a class="nav-link loginout-button" href="#" @click="$emit('clickOpenDoorRecord')">開門紀錄</a>
                </li>
                <li class="nav-item active">
                    <a class="nav-link loginout-button" href="#" data-toggle="modal" data-target="#set-equipment-password-modal">密碼設定</a>
                </li>
                <li class="nav-item active">
                    <a class="nav-link loginout-button" href="#" data-toggle="modal" data-target="#login-modal">{{ userName }}</a>
                </li>
                <li class="nav-item active">
                    <a class="nav-link loginout-button" href="#" @click="logout()" v-if="isLogin">登出</a>
                </li>
            </ul>
        </div>
      </div>
    </nav>
    <media :query="{minWidth:768}">
      <div class="mb-4"></div>
    </media>    
    <media :query="{maxWidth:768}">
      <div class="mb-2"></div>
    </media>  
  </div>
</template>

<script>

import LoginService from '@/services/LoginService'
import Media from 'vue-media'

export default {
  name: 'Header',
  
  components: {
    Media
  },

  data () {
    return {
      userName: '登入',
      isLogin: false
    }
  },

  mounted () {
    this.setLinkCollapse () 
  },

  methods: {

    setLinkCollapse () {
      $('#navbarSupportedContent>ul').click(function(){
          $("#navbarSupportedContent").collapse('hide');
      });
    },

    setUserName (name) {
      this.userName = `Hi ! ${name}`
      this.isLogin = true
    },

    async logout () {
      await LoginService.logout()
      this.$emit('logout')
      this.userName = '登入'
      this.isLogin = false
    }
  }
}
</script>

<style>
#header {
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1);
}

@media only screen and (max-width: 768px) {
  #logo {
    max-width: 30%;
  }  
}
@media only screen and (min-width: 768px) {
  #logo {
    max-width: 10%;
  }  
}

</style>
