/*
 * jQuery slidebox (jQuery Plugin)
 *
 * Copyright (c) 2010 Tom Shimada
 *
 * Depends Script:
 *	js/jquery.js (1.3.2~)
 */

(function($) {
  $.fn.slidebox = function(configs) {
    var defaults = {
      handle: null,
      contents: null,
      action: 'click',
      axis: 'x',
      direction: 'asc',
      fulcrum: 0,
      space: 0,
      speed: 300,
      easing: 'swing',
      openBeforeFunc: null,
      openAfterFunc: null,
      closeBeforeFunc: null,
      closeAfterFunc: null
    };
    if (!configs) return;
    configs = $.extend(defaults, configs);
    configs['position'] = {};
    if (!configs.handle || !configs.contents) return;
    if (configs.axis != 'x' && configs.axis != 'y') return;
    if (configs.direction != 'asc' && configs.direction != 'desc') return;
    if (configs.fulcrum != 0 && configs.fulcrum != 1) return;
    var selectors = {
        container: this,
        handle: configs.handle.nodeType ? configs.handle : $(configs.handle, this),
        contents: configs.contents.nodeType ? configs.contents : $(configs.contents, this),
        parent: $(this.parent().get(0))
    };
    if (!selectors.handle.length || !selectors.contents.length || !selectors.parent.length) return;
    var is_msie6 = (!$.support.style && typeof document.documentElement.style.maxHeight === 'undefined');
    setPosition();
    setBottonAction();
    enable();

    function toggle() {
      if (!chkReady()) return;
      if (!chkView()) open();
        else close();
    }

    function open() {
      if (!chkReady() || chkView()) return;
      disable();
      if ($.isFunction(configs.openBeforeFunc)) configs.openBeforeFunc(selectors.container, selectors.handle, selectors.contents);
      selectors.container.animate(
        configs.position.css_open,
        configs.speed,
        configs.easing,
        function() {
          view();
          if ($.isFunction(configs.openAfterFunc)) configs.openAfterFunc(selectors.container, selectors.handle, selectors.contents);
          enable();
        }
      );
    }

    function close() {
      if (!chkReady() || !chkView()) return;
      disable();
      if ($.isFunction(configs.closeBeforeFunc)) configs.closeBeforeFunc(selectors.container, selectors.handle, selectors.contents);
      selectors.container.animate(
        configs.position.css_close,
        configs.speed,
        configs.easing,
        function() {
          unview();
          if ($.isFunction(configs.closeAfterFunc)) configs.closeAfterFunc(selectors.container, selectors.handle, selectors.contents);
          enable();
        }
      );
    }

    function chkReady() {
      return selectors.container.hasClass('ready');
    }

    function enable() {
      selectors.container.removeClass('ready').addClass('ready');
    }

    function disable() {
      selectors.container.removeClass('ready');
    }

    function chkView() {
      return selectors.container.hasClass('view');
    }

    function view() {
      selectors.container.removeClass('view').addClass('view');
    }

    function unview() {
      selectors.container.removeClass('view');
    }

    function setPosition() {
      var nodeName;
      if (typeof selectors.parent.context === 'undefined') {
        nodeName = selectors.parent[0].nodeName.toUpperCase();
      } else {
        nodeName = selectors.parent.context.nodeName.toUpperCase();
      }
      if (nodeName !== 'BODY') {
        if (!selectors.parent.css('position') || selectors.parent.css('position') == 'static') {
          selectors.parent.css('position', 'relative');
        }
      }

      var position_top = 0,
          position_left = 0,
          position_right = 0,
          position_bottom = 0;
      if (configs.axis == 'x') {
        var close_top = configs.space + 'px',
            close_left = (selectors.handle.outerWidth(false) - selectors.container.outerWidth(false)) + 'px',
            open_top = configs.space + 'px',
            open_left = '0px';

        if (configs.direction == 'asc') {
          if (configs.fulcrum == 0) {
            configs.position.css_close = {
              top: close_top,
              left: close_left
            };
            configs.position.css_open = {
              top: open_top,
              left: open_left
            };
          } else {
            configs.position.css_close = {
              bottom: close_top,
              left: close_left
            };
            configs.position.css_open = {
              bottom: open_top,
              left: open_left
            };
          }
        } else {
          if (configs.fulcrum == 0) {
            configs.position.css_close = {
              top: close_top,
              right: close_left
            };
            configs.position.css_open = {
              top: open_top,
              right: open_left
            };
          } else {
            configs.position.css_close = {
              bottom: close_top,
              right: close_left
            };
            configs.position.css_open = {
              bottom: open_top,
              right: open_left
            };
          }
        }
        var contentsHeight = selectors.contents.outerHeight(false),
            handleHeight = selectors.handle.outerHeight(false);
        if (contentsHeight > handleHeight) {
          selectors.handle.css('height', contentsHeight - (handleHeight - selectors.handle.height()) + 'px');
        } else {
          selectors.contents.css('height', handleHeight - (contentsHeight - selectors.contents.height()) + 'px');
        }
      } else {
        var close_top = (selectors.handle.outerHeight(false) - selectors.container.outerHeight(false)) + 'px',
            close_left = configs.space + 'px',
            open_top = '0px',
            open_left = configs.space + 'px';

        if (configs.direction == 'asc') {
          if (configs.fulcrum == 0) {
            configs.position.css_close = {
              top: close_top,
              left: close_left
            };
            configs.position.css_open = {
              top: open_top,
              left: open_left
            };
          } else {
            configs.position.css_close = {
              top: close_top,
              right: close_left
            };
            configs.position.css_open = {
              top: open_top,
              right: open_left
            };
          }
        } else {
          if (configs.fulcrum == 0) {
            configs.position.css_close = {
              bottom: close_top,
              left: close_left
            };
            configs.position.css_open = {
              bottom: open_top,
              left: open_left
            };
          } else {
            configs.position.css_close = {
              bottom: close_top,
              right: close_left
            };
            configs.position.css_open = {
              bottom: open_top,
              right: open_left
            };
          }
        }
      }
      if (is_msie6 === false) {
        selectors.container.css('position', 'fixed');
      } else {
        selectors.container.css('position', 'absolute');
        /* Todo: IE6 に対応 */
      }
      selectors.container.css(configs.position.css_close);
    }

    function setBottonAction() {
      selectors.handle.bind(configs.action, toggle);
    }
  }
})(jQuery);
