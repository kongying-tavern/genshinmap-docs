---
title: 问题反馈
layout: page
aside: false
---

<script setup lang="ts">
import { defineClientComponent } from 'vitepress'

const ForumTopicPage = defineClientComponent(() => {
  return import('../../components/forum/topic/ForumTopicPage.vue')
})
</script>

<ForumTopicPage />