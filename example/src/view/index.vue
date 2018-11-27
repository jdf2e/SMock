<template>
    <div class="wrapper">
        <div class="box">测试页面</div>
        <p>修改src/view/index.vue文件，可以看到本页面变化</p>
        <div class="img-box">
        </div>

        <!-- <div>{{city}}</div> -->
    </div>
</template>

<script>
import axios from 'axios';
export default {
    data(){
        return{
            city:''
        }
    },
    components: {
    },
    methods:{
    },
    created(){
        console.log('just for test');
        //跨域
        // axios.get('http://chongzhi.jd.com/json/order/search_searchPhone.action?mobile=18600163270')
        // .then((response)=>{
        //     console.log(response);
        //     this.city = response.data.areaName;
        // })
        // .catch((error)=>{
        //     console.log(error);
        // });
    }
}
</script>

<style lang="scss">
.wrapper{
    font-size:.8rem;
}
.img-box{
    height:2rem;
    width:2rem;
    // background:url('http://misc.360buyimg.com/exploit/carefree/test.jpg') no-repeat;
    // background-size:cover;

}
</style>
