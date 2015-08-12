/**
 * jQuery.macro 
 * ---
 * @author James Padolsey (http://james.padolsey.com)
 * @version 0.1
 * @updated 26-DEC-09
 * ---
 * Note: Read the README!
 * ---
 * @info http://james.padolsey.com/javascript/macros-in-jquery/
 */

jQuery.macro = (function(){
    
    var records = {};
    
    function Macro(name) {
        
        if ( !(this instanceof Macro) ) {
            return new Macro(name);
        }
    
        var recorded = this.recorded = [],
            records[name] = this;
        
        this.add = function(name, args) {
            recorded.push({
                name: name,
                args: args
            });
        };
        
        jQuery.fn.macro = function(name) {
            
            var m, i = 0, prev = this, cur = this;
            
            while (m = records[name].recorded[i++]) {
                cur = this[m.name].apply(prev, m.args);
                // Returned collection must be instanceof jQuery
                // since it will be the context for the next call
                if ( !(cur instanceof jQuery) ) {
                    cur = prev;
                }
                prev = cur;
            }
            
            return cur;
            
        };
        
    }
    
    function register(name, fn) {

        proto[name] = function() {
            this.add(name, arguments);
            return this;
        };
        
    }
    
    var proto = Macro.prototype = jQuery.extend({}, jQuery.fn),
        excludes = Macro.excludes = { init: true };
        
    Macro.register = register;
    
    for (var i in proto)  {

        if ( !jQuery.isFunction(proto[i]) || i in excludes ) {
            continue;
        }
        
        register(i);
        
    }
    register("macro");
    
    return Macro;
    
})();
