<script setup>

import Nav from './components/Nav.vue'

import { Head } from '@vueuse/head'

import {getHead} from './router'
import router from './router'
import { computed } from 'vue'

const head=computed(()=>{
  return getHead(router.currentRoute.value.path)
})
</script>

<template>
  <Head>
    <title v-if="head.title">{{head.title}}</title>
    <meta name="description" :content="head.description" v-if="head.description">
    <meta name="keywords" :content="head.keywords" v-if="head.keywords">
    <meta name="author" content="Seng's Technology">
  </Head>
  <Nav/>
  <router-view class="pt-12"></router-view>
</template>

<style>

</style>
