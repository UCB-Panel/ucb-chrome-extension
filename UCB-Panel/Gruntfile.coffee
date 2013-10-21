module.exports = (grunt) ->
	# Project configuration.
	grunt.initConfig
		pkg: grunt.file.readJSON('package.json'),
		coffee:
			options:
				banner: "/* <%= grunt.template.today(\"dd.mm.yyyy\") %> */\n"
			glob_to_multiple:
				expand: true,
				flatten: true,
				cwd: 'pre/coffee',
				src: ['*.coffee'],
				dest: 'js/',
				ext: '.js'

		compass:
			dist:
				options:
					config: 'config.rb'

		uglify:
			options:
				banner: '/* 
\nAuthor:     UCB-Panel Team
\nProject:    UCB-Panel
\nLicense:    GPL v3
\nBuild date: <%= grunt.template.today(\"dd.mm.yyyy\") %> \n
*/\n'

			dynamic_mappings:
				#Grunt will search for "**/*.js" under "lib/" when the "minify" task
				# runs and build the appropriate src-dest file mappings then, so you
				# don't need to update the Gruntfile when files are added or removed.
				files: [
					expand: true,		# Enable dynamic expansion.
					cwd: 'js/',		# Src matches are relative to this path.
					src: ['*.js'],	# Actual pattern(s) to match.
					dest: 'js/min/',		# Destination path prefix.
					ext: '.min.js',		# Dest filepaths will have this extension.
				]

		watch:
			coffee:
				files: ['pre/coffee/*.coffee'],
				tasks: ['coffee', 'uglify']
			compass:
				files: ['pre/scss/*.scss'],
				tasks: ['compass']



	# Load the plugin that provides the "uglify" task.
	grunt.loadNpmTasks "grunt-contrib-uglify"
	grunt.loadNpmTasks "grunt-contrib-coffee"
	grunt.loadNpmTasks "grunt-contrib-watch"
	grunt.loadNpmTasks "grunt-contrib-compass"

	grunt.event.on('watch', (action, filepath, target) ->
		#change the source and destination in the uglify task at run time so that it affects the changed file only
		destFilePath = filepath.replace(/(.+)\.js$/, 'js/min/$1.js')
	)

	# Default task(s).
	grunt.registerTask "default", ["watch"]