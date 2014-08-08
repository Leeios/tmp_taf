sand.define('ColComments', [
  'DOM/toDOM',
  'Publisher',
  'SingleComment'
], function(r) {

  var ColComments = function() {
    this.commentList = [];
    this.el = r.toDOM({
      tag: "div.colComments"
    });
  }

  ColComments.prototype.addComment = function() {
    if (this.tmpComment.elDiv.innerHTML != "") {
      this.displayCol();
      return ;
    }
    this.tmpComment.validCom();
    this.el.appendChild(this.tmpComment.el);
    this.tmpComment.create.value = "Edit";
    this.commentList.push(this.tmpComment);
    this.tmpComment.on("deleteCom", this.remove.bind(this))
    this.tmpComment.on("editCom", this.edit.bind(this))
    this.tmpComment = null;
    this.commentList.sort(function (a, b) {
      return a.actualTop - b.actualTop;
    });
    this.displayCol();
  };

  ColComments.prototype.addArea = function(canArea) {
    if (!this.tmpComment) {
      this.tmpComment = new r.SingleComment("Enter a comment ...", 1);
      this.tmpComment.on("tmpComValid", this.addComment.bind(this));
      this.el.appendChild(this.tmpComment.el);
    }
    this.tmpComment.addArea(canArea);
    this.displayCol();
  };

  ColComments.prototype.displayCol = function() {
    var previous_down;

    for (var i = 0, len = this.commentList.length; i < len; i++) {
      this.commentList[i].displayArea();
      this.commentList[i].el.style.top = this.commentList[i].actualTop + "px";
      i > 0 && (previous_down = parseInt(this.commentList[i - 1].el.style.top) + parseInt(this.commentList[i - 1].el.offsetHeight))
      && (previous_down >= parseInt(this.commentList[i].el.style.top))
      && (this.commentList[i].el.style.top = previous_down + "px");
    }
  };

  ColComments.prototype.edit = function() {
    this.displayCol();
  }

  ColComments.prototype.remove = function(el) {
    for (var i = 0, len = this.commentList.length; i < len; i++) {
      if (el == this.commentList[i].el) {
        this.commentList.splice(i, 1);
        this.displayCol();
        return ;
      }
    }
  }

  ColComments = r.Publisher.extend(ColComments);
  return ColComments;
});
