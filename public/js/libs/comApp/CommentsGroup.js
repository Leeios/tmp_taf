sand.define('CommentsGroup', [
  'Comment',
  'CanvasArea',
  'DOM/toDOM',
  'Seed'
], function(r) {

var CommentsGroup = r.Seed.extend({

  tpl: function() {
    return {
      tag: '.group-comment', children: [
        {tag: '.wrap-comments', as: 'wrap', children: [
          this.create(r.Comment, {
            id: this.mainId,
            idFile: this.idFile,
            color: this.color,
            onCreate: this.onCreate.bind(this),
            onRemove: function() {this.onRemove(this.mainId); this.removeGroup();}.bind(this),
            onReply: this.addReply.bind(this)
          }, 'main').el
        ]}
      ], events: {
        mouseover: this.highStyle.bind(this),
        mouseout: this.usualStyle.bind(this),
      }
    }
  },

  options: function() {
    return {
      mainId: 0,
      idFile: 0,
      tmpReply: null,
      actualTop: 0,
      replies: [],
      collapseEl: null,
      color: '#' + Math.floor(Math.random() * 16777215).toString(16),
      onCreate: function() {console.log('create is not available on this element')},
      onRemove: function() {console.log('remove not available on this element');}
    }
  },

  '+init': function() {
    this.wrap.style['border-color'] = this.color;
    this.query('dp').comments.on('insert', this.setReply.bind(this));
  },


  insertMain: function() {
    this.el.remove();
    this.main.valid();
    this.mainId = this.query('dp').comments.insert(this.main.getData()).id;
    this.main.id = this.mainId;
  },

  addArea: function(canvasArea) {/*INTERFACE*/
    if (canvasArea.points.length == 0) { return ; }
    this.main.areas.push(canvasArea);
    this.main.actualTop = canvasArea.points[0][1];
  },

  drawAreas: function() {
    for (var i = 0, len = this.main.areas.length; i < len; i++) {
      this.main.areas[i].draw();
    }
  },

  highStyle: function() {
    this.main.areas[0] && ((this.main.areas[0].ctx.strokeStyle =  this.color) && (this.main.areas[0].ctx.globalAlpha = 0.3));
    this.drawAreas();
    this.main.areas[0] && (this.main.areas[0].ctx.strokeStyle = "rgba(200, 200, 200, 0.3)");
  },

  usualStyle: function() {
    this.fire('redraw');
  },

  setMain: function(data, ctx) {
    var current_area;
    for (var i = 0, len = data.areas.length; i < len; i++) {
      current_area = this.create(r.CanvasArea, {form: 'points', points: data.areas[i], ctx: ctx});
      this.main.areas.push(current_area);
    }
    this.main.txt = data.txt;
    this.main.date = data.date;
    this.main.actualTop = data.actualTop;
    this.main.preValide();
    this.main.valid(data.date);
  },

  removeGroup: function() {
    this.el.remove();
    this.query('dp').comments.one(function(e){ return this.mainId == e.id }.bind(this)).remove();
  },

  addReply: function(data) {/*INTERFACE*/
    if (this.tmpReply !== null) {return ;}

    this.tmpReply = this.create(r.Comment, {
      idFile: this.idFile,
      idParent: this.mainId,
      onCreate: function() {
        this.tmpReply.el.remove();
        this.tmpReply.valid();
        delete this.tmpReply.id;
        this.query('dp').comments.insert(this.tmpReply.getData());
        this.tmpReply = null;
      }.bind(this)
    });
    this.wrap.appendChild(this.tmpReply.el);
  },

  removeReply: function(id) {
    this.query('dp').comments.one(function(e) {return e.id === id;}.bind(this)).remove();
    for (var i = 0, len = this.replies.length; i < len; i++) {
      if (id == this.replies[i].id) {
        this.replies.splice(i, 1);
        if (this.replies.length < 3 && this.collapseEl !== null) {
          for (var i = 0, len = this.replies.length; i < len; i++) {
            this.replies[i].show();
          }
          this.collapseEl.remove();
          this.collapseEl = null;
        }
        return ;
      }
    }
  },

  collapseCom: function() {
    if (this.collapseEl !== null) { return ;}
    this.wrap.appendChild(this.create(r.toDOM, {
      tag: '.collapse-com', innerHTML: 'Show', events: {
        click: function() {
          if (this.replies[this.replies.length - 1].el.style.display === 'none') {
            for (var i = 0, len = this.replies.length; i < len; i++) {
              this.replies[i].show();
              this.collapseEl.innerHTML = 'Hide';
            }
          } else {
            for (var i = 0, len = this.replies.length; i < len; i++) {
              this.replies[i].hide();
              this.collapseEl.innerHTML = 'Show';
            }
          }
        }.bind(this)
      }
    }, 'collapseEl'));
    for (var i = 0, len = this.replies.length; i < len; i++) {
      this.replies[i].hide();
    }
  },

  refreshDate: function(now) {
    this.main.refreshDate(now);
    for (var i = 0, len = this.replies.length; i < len; i++) {
      this.replies[i].refreshDate(now);
    }
  },

  setReply: function(model, options) {
    if (model[0].idParent !== this.mainId) { return ; }
    this.tmpReply = this.create(r.Comment, {
      id: model[0].id,
      idFile: model[0].idFile,
      idParent: model[0].idParent,
      txt: model[0].txt,
      onRemove: this.removeReply.bind(this),
      onReply: this.addReply.bind(this)
    });
    this.wrap.appendChild(this.tmpReply.el);
    this.tmpReply.preValide();
    this.tmpReply.valid(model[0].date);
    this.replies.push(this.tmpReply);
    if (this.replies.length > 2) {
      this.collapseCom();
    }
    this.tmpReply = null;
  }

});
return CommentsGroup;
});
