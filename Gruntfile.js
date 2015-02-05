module.exports = function(grunt){
   
   // project configuration
   grunt.initConfig({
      pkg:grunt.file.readJSON('package.json'),
	  uglify:{
	     options:{
		    banner: '/*! <%= grunt.template.today("yyy-mm-dd")%> */\n'
		 },
		 build: {
		    src: 'src/<%=pkg.name%>.js',
			dest:'build/<%=pkg.name%>.min.js'
		 }
	  }
   });
   
   //loads the uglify plugin
   grunt.loadNpmTasks('grunt-contrib-uglify');
   
   //default task(s)
   grunt.registerTask("default" , ['uglify']);
}