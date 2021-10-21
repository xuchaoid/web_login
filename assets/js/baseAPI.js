// JQ中有一个方法$.ajaxPrefilter可以给每次请求服务器端口拼接根路径在自己的js文件中每次向服务器发起的请求可以通过该方法给端口拼接上端口的根路径从而发起真正的请求
$.ajaxPrefilter(function(options) { //option即发起服务器请求获取到的请求信息然后在这个信息中给url拼接上根路径就可以发起真正的请求了
    // 在发起真正的 Ajax 请求之前，统一给所有请求接口拼接请求的根路径
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url
    console.log(options.url);
})