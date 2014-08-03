sand.define('Comments/SelectText', [
  'Comments/AskBox'
], function(r) {

  var SelectText = function () {
    this.sText = "";
    this.ask = null;
    this.range = null;
    document.addEventListener("mouseup", this.getSelectedText.bind(this));
    document.addEventListener("mousedown", this.destroyAsk.bind(this));
  };

  SelectText.prototype.getSelectedText = function(e) {
    if (this.ask !== null)
      return ;
    if (window.getSelection) {
      this.sText = window.getSelection();
    }
    else if (document.getSelection) {
      this.sText = document.getSelection();
    }
    else if (document.selection) {
      this.sText = document.selection.createRange().text;
    }
    if (this.sText.toString() === "" || !(this.sText))
      return ;
    this.setRange();
    this.ask = new r.AskBox(this.sText, e);
  };

  SelectText.prototype.setRange = function() {
    if (this.sText.rangeCount > 0) {
      this.range = this.sText.getRangeAt(0).cloneRange();
      this.range.collapse(false);
      console.log(this.range);
    }
  };

  SelectText.prototype.destroyAsk = function(e) {
    if (this.ask == null || e.target == document.confirmCom || e.target == document.inputCom) {
      return ;
    }
    this.ask.com.remove();
    this.ask = null;
    this.range = null;
  };

  return SelectText;
});
