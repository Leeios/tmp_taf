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

    eventOut: function(eventName, el, callback, n) {
      (function () {
        var i = n || 1;
        var rc = function(e) {
          if (!Library.recursiveParent(e.target, el)) {
            i--;
            if (i !== 0) { return ; }
            document.body.removeEventListener(eventName, rc);
            callback(e);
          }
        }
        document.body.addEventListener(eventName, rc);
      })();
    },

    recursiveParent: function(el, cmp) {
      if (el === cmp) { return true; }
      if (el === document.body || !el || !el.parentNode) { return false; }
      return (this.recursiveParent(el.parentNode, cmp));
    }

  }
return (Library);
})
