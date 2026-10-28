<template>
    <v-alert
      :type="type"
      :title="title"
      :text="text"
    ></v-alert>
  </template>
  <script>
  export default {
    props:{
        type:String,
        title:String,
        text:String,
    }
  }
</script>