var gulp=require("gulp");
//需要安装gulp-load-plugins在本地项目中
var gulpLoadPlugins=require("gulp-load-plugins");

var plugins=gulpLoadPlugins();


gulp.task("minifyJs",function(){
	gulp.src("dropzone.js")
	.pipe(plugins.rename({
		suffix:".min"
	}))
	.pipe(plugins.uglify())
	.pipe(gulp.dest("./"))
});

