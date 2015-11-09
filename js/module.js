(function(global){
	function xk(){
        	var modules=[];
        	var module=function(name){
        		modules.push(name);
        	};
		return {
			module:module
		};
	}
	global.xk=global.xk||xk();
})(window);