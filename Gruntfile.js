/* global module:false */
module.exports = function(grunt) {
	var port = grunt.option('port') || 8000;
	var root = grunt.option('root') || '.';
	var slides = root + '/' + (grunt.option('slides') || 'slides');
	const sass = require('node-sass');

	if (!Array.isArray(root)) root = [root];

	// Project configuration
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		meta: {
			banner:
				'/*!\n' +
				' * reveal.js <%= pkg.version %> (<%= grunt.template.today("yyyy-mm-dd, HH:MM") %>)\n' +
				' * http://revealjs.com\n' +
				' * MIT licensed\n' +
				' *\n' +
				' * Copyright (C) 2018 Hakim El Hattab, http://hakim.se\n' +
				' */'
		},

		qunit: {
			files: [ 'revealjs/test/*.html' ]
		},

		uglify: {
			options: {
				banner: '<%= meta.banner %>\n',
				ie8: true
			},
			build: {
				src: 'revealjs/js/reveal.js',
				dest: 'build/js/reveal.min.js'
			}
		},

		sass: {
			options: { implementation: sass, sourceMap: true },
			core: {
				src: 'revealjs/css/reveal.scss',
				dest: 'build/css/reveal.css'
			},
			themes: {
				expand: true,
				cwd: 'revealjs/css/theme/source',
				src: ['*.sass', '*.scss'],
				dest: 'build/css/theme',
				ext: '.css'
			},
			presentation: {
				expand: true,
				cwd: slides + '/scss',
				src: ['*.sass', '*.scss'],
				dest: 'build/css/theme',
				ext: '.css'
			}
		},

		autoprefixer: {
			core: {
				src: 'build/css/reveal.css'
			}
		},

		cssmin: {
			options: {
				compatibility: 'ie9'
			},
			compress: {
				src: 'build/css/reveal.css',
				dest: 'build/css/reveal.min.css'
			}
		},

		jshint: {
			options: {
				curly: false,
				eqeqeq: true,
				immed: true,
				esnext: true,
				latedef: 'nofunc',
				newcap: true,
				noarg: true,
				sub: true,
				undef: true,
				eqnull: true,
				browser: true,
				expr: true,
				loopfunc: true,
				globals: {
					head: false,
					module: false,
					console: false,
					unescape: false,
					define: false,
					exports: false
				}
			},
			files: [ 'Gruntfile.js', 'revealjs/js/reveal.js' ]
		},

		connect: {
			server: {
				options: {
					port: port,
					base: 'build',
					livereload: true,
					open: true,
					useAvailablePort: true
				}
			}
		},

		zip: {
			bundle: {
				src: [
					'index.html',
					'css/**',
					'js/**',
					'lib/**',
					'images/**',
					'plugin/**',
					'**.md'
				],
				dest: 'reveal-js-presentation.zip'
			}
		},

		watch: {
			js: {
				files: [ 'Gruntfile.js', 'js/reveal.js' ],
				tasks: 'js'
			},
			theme: {
				files: [
					'revealjs/css/theme/source/*.sass',
					'revealjs/css/theme/source/*.scss',
					'revealjs/css/theme/template/*.sass',
					'revealjs/css/theme/template/*.scss'
				],
				tasks: 'css-themes'
			},
			css: {
				files: [ 'revealjs/css/reveal.scss' ],
				tasks: 'css-core'
			},
			html: {
				files: [slides + '/*.html'],
				tasks: ['buildIndex']
			},
			markdown: {
				files: [slides + '/*.md'],
				tasks: ['copy:slide_md', 'buildIndex']
			},
			images: {
				files: [ slides + '/images/*.*' ],
				task: 'copy:slide_images'
			},
			presentationCss: {
				files: slides + '/scss/*.*',
				tasks: ['sass:presentation', 'copy:slide_style_images']
			},
			presentionConfiguration: {
				files: slides + '/reveal.initialization.json',
				tasks: [ 'copy:configuration' ]
			},
			options: {
				livereload: true
			}
		},

		retire: {
			js: [ 'revealjs/js/reveal.js', 'revealjs/lib/js/*.js', 'revealjs/plugin/**/*.js' ],
			node: [ '.' ]
		},
		// prepare own presentation
		
		includes: {
			slides: {
				cwd: slides,
				src: [ 'slides.html' ],
				dest: 'build/temp/',
				options: {
					flatten: true,
					includePath: slides
				}
			},
			index: {
				cwd: 'base',
				src: [ 'index.html' ],
				dest: 'build/',
				options: {
					flatten: true,
					includePath: 'build/temp'
				}
			}
		},
		copy: {
			lib: { expand: true, flatten: false, cwd: 'revealjs/lib/', src: '**', dest: 'build/lib' },
			print: { expand: true, cwd: 'revealjs/css/print', src: '**/*.css', dest: 'build/css/print' },
			plugin: { expand: true, flatten: false, cwd: 'revealjs/plugin/', src: '**', dest: 'build/plugin' },
			reveal_core: { expand: false, src: 'revealjs/js/reveal.js', dest: 'build/js/reveal.js' },
			slide_style_images: { expand: true, flatten: false, cwd: slides + '/scss/images/', src: [ '**/*.*' ], dest: 'build/css/theme/images' },
			slide_images: { expand: true, flatten: false, cwd: slides + '/images/', src: '**/*.*', dest: 'build/images' },
			slide_md: { expand: true, flatten: false, cwd: slides, src: '**/*.md', dest: 'build', force: true },
			configuration: { expand: false, src: slides + '/reveal.initialization.json', dest: 'build/configuration/initialization.json' },
		},
		clean: {
			temp: [ 'build/temp/' ],
			build: [ 'build/' ]
		}
	});

	// Dependencies
	grunt.loadNpmTasks( 'grunt-contrib-connect' );
	grunt.loadNpmTasks( 'grunt-contrib-cssmin' );
	grunt.loadNpmTasks( 'grunt-contrib-jshint' );
	grunt.loadNpmTasks( 'grunt-contrib-qunit' );
	grunt.loadNpmTasks( 'grunt-contrib-uglify' );
	grunt.loadNpmTasks( 'grunt-contrib-watch' );
	grunt.loadNpmTasks( 'grunt-autoprefixer' );
	grunt.loadNpmTasks( 'grunt-retire' );
	grunt.loadNpmTasks( 'grunt-sass' );
	grunt.loadNpmTasks( 'grunt-zip' );

	grunt.loadNpmTasks( 'grunt-contrib-clean' );
	grunt.loadNpmTasks( 'grunt-contrib-copy' );
	grunt.loadNpmTasks( 'grunt-includes' ),

	// Default task
	grunt.registerTask( 'default', [ 'css', 'js' ] );

	// JS task
	grunt.registerTask( 'js', [ 'jshint', 'uglify', 'qunit' ] );

	// Theme CSS
	grunt.registerTask( 'css-themes', [ 'sass:themes' ] );

	// Core framework CSS
	grunt.registerTask( 'css-core', [ 'sass:core', 'autoprefixer', 'cssmin' ] );

	// All CSS
	grunt.registerTask( 'css', [ 'sass', 'autoprefixer', 'cssmin' ] );

	// Package presentation to archive
	grunt.registerTask( 'package', [ 'default', 'zip' ] );

	// Serve presentation locally
	grunt.registerTask( 'serve', [ 'build', 'connect', 'watch' ] );

	// Run tests
	grunt.registerTask( 'test', [ 'jshint', 'qunit' ] );

	// slides
	grunt.registerTask( 'buildIndex', [ 'includes:slides', 'includes:index' ] );
	grunt.registerTask( 'build', [ 'clean', 'css', 'uglify', 'copy', 'buildIndex', 'clean:temp' ]);

	console.log(slides + '/*.html');
	
};
