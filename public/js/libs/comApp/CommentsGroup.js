sand.define('CommentsGroup', [
  'Seed'
], function(r) {

/*
**Fire: 3
**On:   4
*/
var CommentsGroup = r.Seed.extend({

  '+options': {
    tmp: null,
    sub: []
  },

  addComment: function() {
    /*Ici le tmp comment est le commentaire en cours de validation
    on lui add les listeners et le prepare à etre un vrai com*/
    this.tmp.valid();
    this.fire('insert', this.tmp.formateEl());
    this.el.appendChild(this.tmp.el);
    this.tmp.create.value = 'Edit';
    this.sub.push(this.tmp);
    this.tmp.on('editEl', this.edit.bind(this));
    this.tmp.on('deleteEl', this.remove.bind(this));
    this.sub.sort(function (a, b) {
      return a.actualTop - b.actualTop;
    });
    this.tmp = null;
    this.displaySub();
  },

  addTmpComment: function() {
    if (!this.tmp && this.Schema) {
      this.tmp = new this.Schema({ txt: 'Enter a comment ...'});
      this.tmp.on('createEl', this.addComment.bind(this));
      this.tmp.on('redraw', function() {
        this.displaySub();
      }.bind(this));
      this.el.appendChild(this.tmp.el);
    }
  },

  edit: function(editSub) {
    for (var i = 0, len = this.sub.length; i < len; i++) {
      if (editSub == this.sub[i]) {
        this.fire('edit', this.sub[i].formateEl());
        this.displaySub();
        return ;
      }
    }
  },

  remove: function(rmSub) {
    for (var i = 0, len = this.sub.length; i < len; i++) {
      if (rmSub == this.sub[i]) {
        this.fire('remove', this.sub[i].formateEl());
        this.sub.splice(i, 1);
        this.displaySub();
        return ;
      }
    }
  },

  formateAll: function() {
    var formateComGroup = [];

    for (var i = 0, len = this.sub.length; i < len; i++) {
      formateComGroup.push(this.sub[i].formateEl());
    }
    return formateComGroup;
  },

  /*Display array sub*/
  displaySub: function() {
    var previous_down;
    this.tmp && this.tmp.displayArea();
    for (var i = 0, len = this.sub.length; i < len; i++) {
      this.sub[i].el.style.top = this.sub[i].actualTop + 'px';
      i > 0 && (previous_down = parseInt(this.sub[i - 1].el.style.top) + this.sub[i - 1].getHeight())
      && (previous_down >= parseInt(this.sub[i].el.style.top))
      && (this.sub[i].el.style.top = previous_down + 'px');
      this.sub[i].displayArea();
    }
  },

  /*Use for import dataserv*/
  setComGroup: function(data, ctx) {
    if (typeof data == 'undefined')
      return ;
    for (var i = 0, len = data.length; i < len; i++) {
      if (data[i].idParent == -1) {
        this.tmp = new this.Schema(data[i]);
        this.tmp.setAreas(data[i].areas, ctx);
        this.tmp.preValide();
        this.tmp.on('redraw', function() {
          this.displaySub();
        }.bind(this));
        this.addComment(data);
      }
    }
  }

});
return CommentsGroup;
});
