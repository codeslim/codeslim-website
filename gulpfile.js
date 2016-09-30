var gulp = require('gulp');
var cp = require('child_process');
var minifyCss = require('gulp-minify-css');
var notify = require("gulp-notify") 
var sass = require('gulp-ruby-sass') ;
var bower = require('gulp-bower');
var browserSync = require('browser-sync');

var config = { 
    sassPath: './_sass',
     bowerDir: './bower_components',
    assetDir: './assets',
    outputDir: './_site' 
}

var messages = {
    jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};

gulp.task('bower', function() { 
    return bower() .pipe(gulp.dest(config.bowerDir)) 
});

gulp.task('jekyll-build', [
    'css',
    'font-awesome-icons',
    'jquery',
    'bootstrap',
    'bower'
], function(done) {
    browserSync.notify(messages.jekyllBuild);
    return cp.spawn('jekyll', ['build'], {
            stdio: 'inherit'
        })
        .on('close', done);
});

gulp.task('jekyll-rebuild', ['jekyll-build'], function() {
    browserSync.reload();
});

gulp.task('font-awesome-icons', function() { 
    return gulp.src(config.bowerDir + '/font-awesome/fonts/**.*') 
        .pipe(gulp.dest(config.assetDir + '/fonts'))
        .pipe(gulp.dest(config.outputDir + '/assets/fonts')); 
});

gulp.task('jquery', function() { 
    return gulp.src(config.bowerDir + '/jquery/dist/jquery.min.js') 
        .pipe(gulp.dest(config.assetDir + '/js/jquery'))
        .pipe(gulp.dest(config.outputDir + '/assets/js/jquery')); 
});

gulp.task('bootstrap', function() { 
    return gulp.src(config.bowerDir + '/bootstrap-sass/assets/javascripts/**.*') 
        .pipe(gulp.dest(config.assetDir + '/js/bootstrap'))
        .pipe(gulp.dest(config.outputDir + '/assets/js/bootstrap')); 
});

// gulp.task('bootstrap-sprockets', function() { 
//     return gulp.src(config.bowerDir + 'bower_components/bootstrap-sass/assets/javascripts/bootstrap-sprockets.js') 
//         .pipe(gulp.dest(config.assetDir + '/js/bootstrap'))
//         .pipe(gulp.dest(config.outputDir + '/assets/js/bootstrap')); 
// });

gulp.task('css', function() { 
    return sass(
        config.sassPath + '/main.scss',
        { 
            style: 'nested',
             loadPath: [ config.sassPath,
                config.bowerDir + '/font-awesome/scss',  
                config.bowerDir + '/bootstrap-sass/assets/stylesheets'
            ],
            compass: true 
        }) 
        .pipe(minifyCss())
        .pipe(gulp.dest(config.assetDir + '/css')) .pipe(gulp.dest(config.outputDir + '/assets/css'))
        .pipe(browserSync.stream()); 
});

gulp.task('build', ['bower', 'font-awesome-icons', 'jquery', 'css', 'bootstrap', 'jekyll-build']);

gulp.task('serve', ['build'], function() {
    browserSync.init({
        server: {
            baseDir: "./_site"
        }
    });

    // Start a watch for rebuilds
    gulp.watch(['_sass/*.scss'], ['css'])
    gulp.watch(['index.html', '_layouts/*.html', '_includes/*', '_posts/*'], ['jekyll-rebuild']);
});


gulp.task('default', ['serve']);