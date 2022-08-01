import gulp from "gulp"
import less from "gulp-less"
import LessAutoprefix from "less-plugin-autoprefix"
import sourcemaps from "gulp-sourcemaps"
import cleanCss from "gulp-clean-css"
import cache from "gulp-cache"
import imagemin from "gulp-imagemin"
import uglify from "gulp-uglify"
import browserSync from "browser-sync"
import fileinclude from "gulp-file-include"
import htmlmin from "gulp-htmlmin"

const paths = {
	styles: {
		src: 'assets/less/site.less',
		dest: 'public_html/css',
		watch: 'assets/less/**/*.less'
	},
	static: {
		src: 'assets/static/*.html',
		dest: 'public_html',
		watch: 'assets/static/**/*'
	},
	img: {
		src: 'assets/img/**/*.{jpg,png,gif,ico}',
		dest: 'public_html/img'
	},
	fonts:{
		src: 'assets/fonts/**/*.{svg,ttf,woff,woff2,eot}',
		dest: 'public_html/fonts'
	},
	js:{
		src: 'assets/js/app.js',
		dest: 'public_html/js'
	},
	html:{
		src: 'assets/static/*.html',
		dest: 'public_html'
	}
}

gulp.task('styles', async () => {
	gulp.src(paths.styles.src)
	.pipe(sourcemaps.init())
	.pipe(less({
		plugins: [new LessAutoprefix({ browsers: ['last 2 versions'] })]
	}))
	.pipe(sourcemaps.write())
	.pipe(cleanCss())
	.pipe(gulp.dest(paths.styles.dest))
	.pipe(browserSync.reload({
		stream: true
	}))
})

gulp.task('img', async () => {
	gulp.src(paths.img.src)
	.pipe(cache(imagemin({
		interlaced: true
	})))
	.pipe(gulp.dest(paths.img.dest))
	.pipe(browserSync.reload({
		stream: true
	}))
})

gulp.task('fonts', async () => {
	gulp.src(paths.fonts.src)
	.pipe(gulp.dest(paths.fonts.dest))
	.pipe(browserSync.reload({
		stream: true
	}))
})

gulp.task('js', async () => {
	gulp.src(paths.js.src,{"allowEmpty": true})
	.pipe(uglify())
	.pipe(gulp.dest(paths.js.dest))
	.pipe(browserSync.reload({
		stream: true
	}))
})

gulp.task('fileinclude', async () => {
	gulp.src(paths.static.src)
		.pipe(fileinclude({
			prefix: '@@',
			basepath: '@file'
		}))
		.pipe(htmlmin({collapseWhitespace: true}))
		.pipe(gulp.dest(paths.static.dest))
		.pipe(browserSync.reload({
			stream: true
		}))
})

// Starts a BrowserSync instance
gulp.task('browserSync', async () => {
	browserSync.init({server: 'public_html', port: 8080});
});

gulp.task('watch', async () => {
	gulp.watch(paths.styles.watch, gulp.series('styles'))
	gulp.watch(paths.static.watch, gulp.series('fileinclude'))
	gulp.watch(paths.js.src, gulp.series('js'))
	gulp.watch(paths.img.src, gulp.series('img'))
})

gulp.task('default', gulp.series('styles', 'img', 'fonts', 'js', 'fileinclude'))
gulp.task('dev', gulp.series('default', 'watch', 'browserSync'));