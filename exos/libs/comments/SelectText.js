sand.define('Comments/SelectText', [
  'Comments/AskBox'
], function(r) {

  var SelectText = function () {
    this.sText = "";
    this.ask = null;
    document.addEventListener("mouseup", this.getSelectedText.bind(this));
    document.addEventListener("mousedown", this.destroyAsk.bind(this));
  }

  SelectText.prototype.getSelectedText = function(e) {
    if (this.ask != null)
      return ;
    if (window.getSelection) {
      sText = window.getSelection().toString();
    }
    else if (document.getSelection) {
      sText = document.getSelection();
    }
    else if (document.selection) {
      sText = document.selection.createRange().text;
    }
    if (sText === "")
      return ;
    this.ask = new r.AskBox(sText, e);
  }

  SelectText.prototype.destroyAsk = function(e) {
    if (e.target == this.ask || this.ask == null) {
      return ;
    }
    this.ask.destroy(e);
    this.ask = null;
  }

  return SelectText;
});
