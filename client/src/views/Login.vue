// eslint-disable-next-line
/* eslint-disable */
<template>
<h1>{{message}}</h1>
</template>
<script>
// @ is an alias to /src
import { Api } from '@/Api'
export default {
  name: 'login',
  data() {
    return {
      message: 'none'
    }
  },
  methods: {
    getMessage() {
      Api.get('/mytest')
        .then(response => {
          this.message = response.data.anothermessage
        })
        .catch(error => {
          this.message = error
        })
    }
  }
}
</script>
