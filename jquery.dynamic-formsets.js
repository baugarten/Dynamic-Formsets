/**
 * Used to manage a dynamic formset in django.
 * Basically there is a container that contains a set of
 * related models. This plugin handles updating the manager form
 * when adding and removing models from the formset
 *
 */
(function($) {

  jQuery.fn.dynamicFormset = function() {
    var defaults = {
      prefix: "", // The prefix for the formset
      addWrapper: false, // A selector that serves as the wrapper around the add button for finer placement. If false, will append to the wrapper
      addClass: "addbtn", // A class for the add button
      removeWrapper: false, // A selector that serves as the wrapper around the add button for finer placement. If false, will append to the wrapper
      removeClass: "removebtn", // A class for the remove button
      addAnimation: slideDown, // The animation to use when a new item is added
      addAnimationTime: 300, // The amount of time the add animation should take
      removeAnimation: slideUp, // The animation to use when an item is removed
      removeAnimationTime: 300, // The amount of time the remove animation should take 
      ignoreBlankMiddleObject: true, 
      ignoreBlankEndObject: true,
    };

    var methods = {
      init: function(options) {
        if (options) {
          $.extend(defaults, options);
        }
        $(this).find("input[type=submit]").submit(submit);
      },

      submit = function(event) {
        if (opts['ignoreBlankEnd'] || opts['ignoreBlankMiddle']) {
          var lastEmpty = -1;
          $(".wrapper").each(function() {
            $(this).find("input").each(function(index) {
              if (!$(this).data('blank') && !$(this).val() || $(this).val() == "") {
                if (opts['ignoreBlankMiddleObject']) {
                  removeElement(this);
                } else if (opts['ignoreBlankEndObject'] 
                    && $("#id_" + prefix + "-TOTAL_FORMS").val() == getElementFromId($(this).attr('id'))) {
                  if (lastEmpty != -1 && lastEmpty != index - 1) {
                    event.preventDefault();
                    opts.error("It seems like you're missing some information");
                    return;
                  }
                  lastEmpty = index;
                  var el = $("#id_" + prefix + "-TOTAL_FORMS");
                  el.val(el.val() - 1); 
                }
              }
            });
          });
        }
      },
    };

    $.fn.formset = function(method) {
      var args = arguments;
      var self = this;
      return this.each(function() {
        if (methods[method]) {
          return methods[method].apply(self, Array.prototype.slice.call(args, 1));
        } else if (typeof method === 'object' || !method) {
          return methods.init.apply(self, Array.prototype.slice.call(args, 0));
        } else {
          $.error('Method ' + method + ' does not exist on jQuery.dynamicFormet');
        } 
      });
    };

  };
})(jQuery);
