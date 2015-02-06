module.exports = function(grunt){
   
   // project configuration
   grunt.initConfig({
      pkg:grunt.file.readJSON('package.json'),
	  jshint:{
		files: ['Gruntfile.js' , 'src/**/.js'],
		 options:{
		     globals:{
			   console:true,
			   module:true,
			   document:true
			 }
		 }
		 
	  },
	  concat:{
	     options:{
		    seperator:';'
		 },
		 dist:{
		    src:['src/**/*.js'],
			dest:'dist/<%=pkg.name%>.js'
		 }
	  },
	  uglify:{
	     options:{
		    banner:'/*! <%= pkg.name%> <%= grunt.template.today("dd-mm-yyyy") %>*/\n'
		 },
		 dist:{
		    files:{
			   'dist/<%= pkg.name%>.min.js':['<%= concat.dist.dest%>']
			}
		 }
	  },
	  watch:{
	     files:['<%= jshint.files %>'],
		 tasks:['default']
	  }
   });
   
   //loads grunt tasks runners
   grunt.loadNpmTasks('grunt-contrib-jshint');
   grunt.loadNpmTasks('grunt-contrib-watch');
   grunt.loadNpmTasks('grunt-contrib-concat');
   grunt.loadNpmTasks('grunt-contrib-uglify');
   
   //default task(s)
   grunt.registerTask("default" , ['jshint']);
};