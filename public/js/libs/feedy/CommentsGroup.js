sand.define('CommentsGroup', [
  'Seed',
  'DOM/toDOM',
  'Library',
  'Comment',
  'CanvasArea'
], function(r) {

var CommentsGroup = r.Seed.extend({

  tpl: function() {
    return {
      tag: '.group-comment', children: [
        {tag: '.wrap-comments.usual', as: 'wrap', children: [
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
        click: function(e) {
          if (e.target === this.wrap) {
            this.color = (this.color == this.colorTab.length - 1) ? 0 : this.color + 1;
            this.main.color = this.color;
            this.wrap.style['border-color'] = this.colorTab[this.color];
            var tmp = this.query('dp').comments.one(function(e) {return e.id === this.main.id}.bind(this));
            if (tmp !== null) {tmp.edit({color: this.color});}
          }
          this.focusCom();
        }.bind(this)
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
      colorTab: ['#fffbbe', '#ffbfbf', '#bfffc4'],
      color: Math.floor(Math.random()*3),
      onCreate: function() {console.log('create is not available on this element')},
      onRemove: function() {console.log('remove not available on this element');}
    }
  },

  '+init': function() {
    this.main.color = this.color;
    this.wrap.style['border-color'] = this.colorTab[this.main.color];
    this.query('dp').comments.on('insert', this.setReply.bind(this));
    this.query('dp').comments.on('edit', function(mod, changes) {
      if (mod[0].idParent == this.main.id) {
        for (var i = 0, len = this.replies.length; i < len; i++) {
          if (mod[0].id === this.replies[i].id) {
            for (var att in changes) {
              this.replies[i][att] = changes[att];
            }
            this.replies[i].preValid();
            this.replies[i].valid();
          }
        }
      } else if (mod[0].id == this.main.id) {
        for (var att in changes) {
          this.main[att] = changes[att];
        }
        this.main.preValid();
        this.main.valid();
      }
    }.bind(this));
    this.query('dp').comments.on('remove', function(mod, op) {
      if (mod[0].idParent === this.main.id) {
        this.removeReply(mod[0].id);
      }
    }.bind(this));
  },

  insertMain: function() {
    this.el.remove();
    this.main.author = this.getCookie('name');
    this.query('dp').comments.insert(this.main.getData());
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
    this.fire('redraw');
    this.main.areas[0] && ((this.main.areas[0].ctx.strokeStyle =  this.colorTab[this.main.color]) && (this.main.areas[0].ctx.globalAlpha = 0.3));
    this.drawAreas();
    this.main.areas[0] && (this.main.areas[0].ctx.strokeStyle = "rgba(200, 200, 200, 0.3)");
  },

  usualStyle: function() {
    this.fire('redraw');
  },

  focusCom: function(n) {
    if (this.el.style.marginLeft === '-12px') { return ; }
    this.el.style.marginLeft = '-12px';
    this.highStyle();

    var callback = function() {
      this.el.style.marginLeft = '0px';
      this.usualStyle();
    }.bind(this);

    r.Library.clickOut(this.el, callback, n);
  },

  setMain: function(data, ctx) {
    var current_area;
    for (var i = 0, len = data.areas.length; i < len; i++) {
      current_area = this.create(r.CanvasArea, {form: 'points', points: data.areas[i], ctx: ctx});
      this.main.areas.push(current_area);
    }
    this.main.setAuthor(data.author);
    this.main.color = data.color;
    this.wrap.style['border-color'] = this.colorTab[this.main.color];
    this.main.txt = data.txt;
    this.main.date = data.date;
    this.main.actualTop = data.actualTop;
    this.main.preValid();
    this.main.valid(data.date);
    this.query('dp').comments.where(function(e) { return e.idParent === this.mainId;
    }.bind(this)).each(function(c) { this.setReply([c]); }.bind(this));
    SyntaxHighlighter.highlight();
  },

  removeGroup: function() {
    this.query('dp').comments.where(function(e){ return this.mainId == e.idParent }.bind(this))
    .each(function(com){ com.remove(); }.bind(this));
    this.query('dp').comments.one(function(e){ return this.mainId == e.id }.bind(this)).remove();
  },

  addReply: function(data) {/*INTERFACE*/
    if (this.tmpReply !== null) {return ;}
    this.el.style.zIndex = 30;
    this.tmpReply = this.create(r.Comment, {
      idFile: this.idFile,
      idParent: this.mainId,
      author: this.getCookie('name'),
      onCreate: function() {
        this.tmpReply.el.remove();
        delete this.tmpReply.id;
        this.query('dp').comments.insert(this.tmpReply.getData());
        this.tmpReply = null;
        this.el.style.zIndex = 10;
      }.bind(this)
    });
    this.wrap.appendChild(this.tmpReply.el);
  },

  removeReply: function(id) {
    for (var i = 0, len = this.replies.length; i < len; i++) {
      if (id == this.replies[i].id) {
        this.replies[i].el.remove();
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
      tag: '.collapse-com', innerHTML: 'Hide', events: {
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
  },

  refreshDate: function(now) {
    this.main.refreshDate(now);
    for (var i = 0, len = this.replies.length; i < len; i++) {
      this.replies[i].refreshDate(now);
    }
  },

  getCookie: function (cname) {
      var name = cname + "=";
      var ca = document.cookie.split(';');
      for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
          if (c.indexOf(name) != -1) return c.substring(name.length,c.length);
      }
      return "";
    },

  setReply: function(model, options) {
    if (model[0].idParent !== this.mainId) { return ; }
    this.tmpReply = this.create(r.Comment, {
      id: model[0].id,
      idFile: model[0].idFile,
      idParent: model[0].idParent,
      author: model[0].author,
      txt: model[0].txt,
      onRemove: function() {this.query('dp').comments.one(function(e) {return e.id === model[0].id}.bind(this)).remove()}.bind(this),
      onReply: this.addReply.bind(this)
    });
    this.tmpReply.el.style.marginLeft = '24px';
    this.wrap.appendChild(this.tmpReply.el);
    this.tmpReply.preValid();
    this.tmpReply.valid(model[0].date);
    this.replies.push(this.tmpReply);
    if (this.replies.length > 2) {
      this.collapseCom();
    }
    this.tmpReply = null;
    /*Resize collapse*/
    if (this.collapseEl != null) {
      this.collapseEl.remove();
      this.collapseEl = null;
      this.collapseCom();
    }
  }

});
return CommentsGroup;
});
