/**
 * Used to manage a dynamic formset in django.
 * Basically there is a container that contains a set of
 * related models. This plugin handles updating the manager form
 * when adding and removing models from the formset
 *
 */
(function($) {
  var defaults = {
    prefix: "form", // The prefix for the formset
    model: ".formset", // A selector for each of the top level model object
    addWrapper: false, // A selector that serves as the wrapper around the add button for finer placement. If false, will append to the bottom of the form
    addClass: "addbtn", // A class for the add button
    addHtml: false,
    removeWrapper: false, // A selector that serves as the wrapper around the add button for finer placement. If false, will append to the wrapper
    removeClass: "removebtn", // A class for the remove button  
    removeHtml: false,
    addAnimation: 'slideDown', // The animation to use when a new item is added
    addAnimationTime: 300, // The amount of time the add animation should take
    removeAnimation: 'slideUp', // The animation to use when an item is removed
    removeAnimationTime: 300, // The amount of time the remove animation should take 

    ignoreBlankMiddleObject: true, 
    ignoreBlankEndObject: true,

    tmpl: false, // Leave this false, it'll get overwrittedn anyway
  };

  var methods = {
    init: function(options) {
      if (options) {
        $.extend(defaults, options);
      }
      $(this).find("input[type=submit]").submit(methods.submit);

      var adding;
      if (!defaults.addWrapper) {
        adding = $(this).parent();
      } else {
        adding = $(this).parent().find(defaults.addWrapper);
      }
      $(defaults.addHtml || "<input type='button' value='Add' class='" + defaults.addClass + "' />")
        .appendTo(adding)
        .click($.proxy(methods.add, this));

      $(this).find(defaults.model).each(function(index) {
        $(defaults.removeHtml || "<input type='button' class='" + defaults.removeClass + "' />")
          .addClass(defaults.removeClass)
          .attr('data-index', index)
          .appendTo($(this).find(defaults.removeWrapper))
          .click($.proxy(methods.remove, this));
      });
      defaults.max = $(this).find(defaults.model).length;
      if (defaults.max < 1 && !defaults.tmpl) {
        alert("Fail. No templated and no models"); 
      }
      methods.makeTmpl.apply(this);
    },
    add: function() {
      methods.fillTmpl(defaults.max)
        .hide()
        .appendTo($(this))
        [defaults.addAnimation](defaults.addAnimationTime);
      methods.updateManager.apply(this, [defaults.max]);
      defaults.max += 1;
    },
    remove: function(event) {
      var index = $(event.currentTarget).attr('data-index'),
        model = $($(defaults.model)[index]),
        identifier = defaults.prefix + "-" + index;
      defaults.max -= 1;
      methods.updateManager.apply(this, [defaults.max]);
      if ($(model).find("input[name$='-id']").val()) {
        $(model).append(
          "<input type='hidden' name='" + identifier + "-DELETE' " +
            "id='id_" + identifier + "-DELETE' value=1 checked='yes' />"
        );
        $(model).addClass("deleted").css({ display: 'none' });
      } else {
        $(model).remove();
      }
      $(defaults.model + ":not(.deleted)").each(methods.reindex);
    },
    updateManager: function(numForms) {
      $(this).parent().find("#id_" + defaults.prefix + "-TOTAL_FORMS").val(numForms);
    },
    makeTmpl: function() {
      defaults.tmpl = $(this).find(defaults.model + ":first").clone();
      defaults.tmpl.find("input").each(function() {
        $(this).val('');
      });
    },
    fillTmpl: function(index) {
      return methods.reindex.apply(defaults.tmpl.clone(), [index]);
    },
    replace: function(label, attr, difference) {
      $(this).find(label).each(function() {
        $(this).attr(attr, function(i, attrval) {
          return methods.formsetReplace(attrval, difference);
        });
      });
    },
    formsetReplace: function(attr, difference) {
      return attr && attr.replace(/-\d+-/g, function(n) { 
        return "-" + (parseInt(n.substr(1,n.length-2)) + difference) + "-"; 
      });
    },
    reindex: function(index) {
      var oldIndex = $(this).find("." + defaults.removeClass).attr('data-index');
      if (!oldIndex) { oldIndex = 0; }
      var difference = index - oldIndex;
      methods.replace.apply(this, ["input", "name", difference]);
      methods.replace.apply(this, ["input", "id", difference]);
      methods.replace.apply(this, ["label", "for", difference]);
      $(this).find("label").each(function() { 
        $(this).html($(this).html().replace(/\d+/g, function(n) { return parseInt(n) + difference; }));
      });
      $(this).find("." + defaults.removeClass).click($.proxy(methods.remove, this));
      return this;
    },
    submit: function(event) {
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

  $.fn.dynamicFormset = function(method) {
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

})(jQuery);
