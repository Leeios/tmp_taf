sand.define('Library', [
  'DOM/toDOM'
], function(r) {

  var Library = {

    exceedSize: function(element, motherAtt) {
      var res;
      if ((res = (parseInt(element.style.top) + element.offsetHeight)) > parseInt(motherAtt)) {
        return res;
      }
      return false;
    },

    clickOut: function(el, callback, n) {
      var i = n || 1;
      var rc = function(e) {
        if (!Library.recursiveChild(el, e.target)) {
          i--;
          if (i !== 0) { return ; }
          document.body.removeEventListener('click', rc);
          callback(e);
        }
      }
      document.body.addEventListener('click', rc);
    },
/*Switc en recusrvie parent if el == document.body */
    recursiveChild: function(el, cmp) {
      if (el === cmp) { return true; }
      for (var i = 0, len = el.childNodes.length; i < len; i++) {
        if (Library.recursiveChild(el.childNodes[i], cmp)) { return true; }
      }
      return false;
    }

  }
return (Library);
})
