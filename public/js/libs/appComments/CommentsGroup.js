sand.define('CommentsGroup', [
  'Comment',
  'DOM/toDOM',
  'Seed'
], function(r) {

//Si 'init', le .el n'est pas crée !!!
  var CommentsGroup = Seed.extend({
    tpl: {
      tag: "div.commentsGroup"
    },
    '+init': function() {
      this.commentList = [];
    }
  });

  CommentsGroup.prototype.addComment = function() {
    /*Ici le tmp comment est le commentaire en cours de validation
    on lui add les listeners et le prepare à etre un vrai com*/
    this.tmpComment.validCom();
    this.fire("add", this.formatCom(this.tmpComment));
    this.el.appendChild(this.tmpComment.el);
    this.tmpComment.create.value = "Edit";
    this.commentList.push(this.tmpComment);
    this.tmpComment.on("editCom", this.edit.bind(this));
    this.tmpComment.on("deleteCom", this.remove.bind(this));
    this.tmpComment = null;
    this.commentList.sort(function (a, b) {
      return a.actualTop - b.actualTop;
    });
    this.displayCol();
  };

  CommentsGroup.prototype.addArea = function(canArea) {
    if (!this.tmpComment) {
      this.tmpComment = new r.Comment({ txt: "Enter a comment ...", edit: 1});
      this.tmpComment.on("tmpComValid", this.addComment.bind(this));
      this.el.appendChild(this.tmpComment.el);
    }
    this.tmpComment.addArea(canArea);
    this.displayCol();
  };

  CommentsGroup.prototype.displayCol = function() {
    var previous_down;

    for (var i = 0, len = this.commentList.length; i < len; i++) {
      this.commentList[i].displayArea();
      this.commentList[i].el.style.top = this.commentList[i].actualTop + "px";
      i > 0 && (previous_down = parseInt(this.commentList[i - 1].el.style.top) + parseInt(this.commentList[i - 1].el.offsetHeight))
      && (previous_down >= parseInt(this.commentList[i].el.style.top))
      && (this.commentList[i].el.style.top = previous_down + "px");
    }
  };

  CommentsGroup.prototype.edit = function(el) {
    var comment;
    for (var i = 0, len = this.commentList.length; i < len; i++) {
      if (el == this.commentList[i].el) {
        this.fire("edit", this.formatCom(this.commentList[i]));
        this.displayCol();
        return ;
      }
    }
  }

  CommentsGroup.prototype.remove = function(el) {
    for (var i = 0, len = this.commentList.length; i < len; i++) {
      if (el == this.commentList[i].el) {
        this.fire("delete", this.formatCom(this.commentList[i]));
        this.commentList.splice(i, 1);
        this.displayCol();
        return ;
      }
    }
  }

CommentsGroup.prototype.formatCom = function(com) {
  var parseCom = {};

  var parseAreas = [];
  for (var i = 0, len = com.areas.length; i < len; i++) {
    parseAreas[i] = {};
    parseAreas[i].origin = com.areas[i].origin.slice(0);
    parseAreas[i].end = com.areas[i].end.slice(0);
    parseAreas[i].form = com.areas[i].form;
  }
  parseCom = {txt: com.txt, actualTop: com.actualTop, areas: parseAreas, uid: com.uid};
  return (parseCom);
};

CommentsGroup.prototype.setComGroup = function(data, ctx) {
  for (var i = 0, len = data.length; i < len; i++) {
    this.tmpComment = new r.Comment(data[i]);
    this.tmpComment.setAreas(data[i].areas, ctx);
    this.tmpComment.preValideCom();
    this.addComment();
  }
};

  return CommentsGroup;
});
