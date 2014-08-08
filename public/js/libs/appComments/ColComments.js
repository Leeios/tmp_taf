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
    /*Ici le tmp comment est le commentaire en cours de validation
    on lui add les listeners et le prepare à etre un vrai com*/
    if (this.comValidation) {
      console.log('Wait for ID attribution');
      return ;
    }
    this.comValidation = this.tmpComment;
    this.tmpComment = null;
    this.comValidation.validCom();
    this.fire("add", this.formatCom(this.comValidation));
    this.el.appendChild(this.comValidation.el);
    this.comValidation.create.value = "Edit";
    this.commentList.push(this.comValidation);
    this.comValidation.on("editCom", this.edit.bind(this));
    this.comValidation.on("deleteCom", this.remove.bind(this));
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

  ColComments.prototype.edit = function(el) {
    var comment;
    for (var i = 0, len = this.commentList.length; i < len; i++) {
      if (el == this.commentList[i].el) {
        if (typeof this.commentList[i].id == "undefined") {
          console.log("Wait for ID attribution");
          return ;
        }
        this.fire("edit", this.formatCom(this.commentList[i]));
        this.displayCol();
        return ;
      }
    }
  }

  ColComments.prototype.remove = function(el) {
    for (var i = 0, len = this.commentList.length; i < len; i++) {
      if (el == this.commentList[i].el) {
        if (typeof this.commentList[i].id == "undefined") {
          console.log("Wait for ID attribution");
          return ;
        }
        this.fire("delete", this.formatCom(this.commentList[i]));
        this.commentList.splice(i, 1);
        this.displayCol();
        return ;
      }
    }
  }

ColComments.prototype.formatCom = function(com) {
  var parseCom = {};

  var parseAreas = [];
  for (var i = 0, len = com.areas.length; i < len; i++) {
    parseAreas[i] = {};
    parseAreas[i].origin = com.areas[i].origin.slice(0);
    parseAreas[i].end = com.areas[i].end.slice(0);
    parseAreas[i].form = com.areas[i].form;
  }
  parseCom = {txt: com.txt, areas: parseAreas, id: com.id};

  return (parseCom);
};

  ColComments = r.Publisher.extend(ColComments);
  return ColComments;
});
