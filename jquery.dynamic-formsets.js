(function($) {

     jQuery.fn.dynamicFormset = function() {
         
         var methods = {
             init: function() {
             }
         };

         var submit() = function() {
             if (opts['ignoreBlankEnd'] || opts['ignoreBlankMiddle']) {
                 $(".wrapper").each(function() {
                                        $(this).find("input").each(function() {
                                                                       if ($(this).val() == "") {
                                                                           if (opts['ignoreBlankMiddle']) {
                                                                               removeElement(getElementFromId($(this).id));
                                                                           } else if (opts['ignoreBlankEnd'] 
                                                                                      && $("#id_" + prefix + "-TOTAL_FORMS").val() == getElementFromId($(this).attr('id'))) {
                                                                               var el = $("#id_" + prefix + "-TOTAL_FORMS");
                                                                               el.val(el.val() - 1); // youre going to need to recurse again to make sure the next to last isn't blank, and so on
                                                                               submit();
                                                                           }
                                                                       }
                                                                   });
                                    });
             }
         };
         
         $.fn.formset = function( opts ) {
             opts = $.extend({
                                 prefix: "",
                                 ignoreBlankMiddle: false,
                                 ignoreBlankEnd: true,
                                 addButton: true,
                                 removeButton: true,
                                 addAnimation: slideDown,
                                 addAnimationTime: 300,
                                 removeAnimation: slideUp,
                                 removeAnimationTime: 300
                             });
             var wrapper = prefix || "formset";        
             $("input:submit").live("click", submit()); 

         };
         
     };
 })(jQuery);