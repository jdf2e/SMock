module.exports = {
    plugins: [
        require('autoprefixer')({
                            browsers: ['> 3% in alt-AS','last 4 versions', 'Android >= 4','iOS >= 8','last 5 QQAndroid versions','last 5 UCAndroid versions']
                        })
    ]
}