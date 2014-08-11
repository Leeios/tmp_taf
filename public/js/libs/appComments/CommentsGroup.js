sand.define('CommentsGroup', [
  'Comment',
  'Seed'
], function(r) {

var CommentsGroup = Seed.extend({

  '+options': {
    main: null,
    tmp: null,
    sub: []
  },

  addComment: function() {
    /*Ici le tmp comment est le commentaire en cours de validation
    on lui add les listeners et le prepare à etre un vrai com*/
    this.tmp.validCom();
    this.fire("add", this.tmp.formatCom());
    this.el.appendChild(this.tmp.el);
    this.tmp.create.value = "Edit";
    this.sub.push(this.tmp);
    this.tmp.on("editCom", this.edit.bind(this));
    this.tmp.on("deleteCom", this.remove.bind(this));
    this.tmp = null;
    this.sub.sort(function (a, b) {
      return a.actualTop - b.actualTop;
    });
    this.displaySub();
  },

  addTmpComment: function() {
    if (!this.tmp) {
      this.tmp = new r.Comment({ txt: "Enter a comment ..."});
      this.tmp.on("createCom", this.addComment.bind(this));
      this.tmp.on("redraw", function() {
        this.displaySub();
      }.bind(this));
      this.el.appendChild(this.tmp.el);
    }
  },

  edit: function(editSub) {
    for (var i = 0, len = this.sub.length; i < len; i++) {
      if (editSub == this.sub[i]) {
        this.fire("edit", this.formatCom(this.sub[i]));
        this.displaySub();
        return ;
      }
    }
  },

  remove: function(rmSub) {
    for (var i = 0, len = this.sub.length; i < len; i++) {
      if (rmSub == this.sub[i]) {
        this.fire("delete", this.sub[i].formatCom());
        this.sub.splice(i, 1);
        this.displaySub();
        return ;
      }
    }
  },

  displaySub: function() {
    var previous_down;
    this.tmp && this.tmp.displayArea();
    for (var i = 0, len = this.sub.length; i < len; i++) {
      this.sub[i].el.style.top = this.sub[i].actualTop + "px";
      i > 0 && (previous_down = parseInt(this.sub[i - 1].el.style.top) + parseInt(this.sub[i - 1].el.offsetHeight))
      && (previous_down >= parseInt(this.sub[i].el.style.top))
      && (this.sub[i].el.style.top = previous_down + "px");
      this.sub[i].displayArea();
    }
  },

//Affiche 2 fois les areas au setting server (usual style + display courant)
  setComGroup: function(data, ctx) {
    for (var i = 0, len = data.length; i < len; i++) {
      this.tmp = new r.Comment(data[i]);
      this.tmp.setAreas(data[i].areas, ctx);
      this.tmp.preValideCom();
      this.tmp.on("redraw", function() {
        this.displaySub();
      }.bind(this));
      this.addComment();
    }
  }

});
return CommentsGroup;
});
