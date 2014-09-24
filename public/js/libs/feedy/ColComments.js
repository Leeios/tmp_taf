sand.define('ColComments', [
  'Seed',
  'DOM/toDOM',
  'Library',
  'CommentsGroup'
], function(r) {

/*
**Fire: 1
**On:   0
*/
var ColComments = r.Seed.extend({
  tpl: {
    tag: ".col-comments"
  },

  options: {
    dp: null,
    commentsList: [],
    tmpGroup: null,
    collapseEl: null
  },

  '+init': function() {
    this.dp.comments.on('insert', this.appendCom.bind(this));
  },

  addArea: function(canArea) {/*INTERFACE*/
    if (!this.tmpGroup) {
      this.tmpGroup = this.create(r.CommentsGroup, {
        idFile: this.idFile,
        onCreate: function() {
          this.tmpGroup.insertMain();
          this.tmpGroup = null;
        }.bind(this)
      });
      this.tmpGroup.el.style.zIndex = 50;
      this.tmpGroup.main.setAuthor('');
      this.tmpGroup.on('redraw', this.drawAreas.bind(this), this);
      this.el.appendChild(this.tmpGroup.el);
    }
    this.tmpGroup.addArea(canArea);
    this.drawAreas();
  },

  drawAreas: function() {
    this.fire('clearCanvas');
    this.tmpGroup && this.tmpGroup.drawAreas();
    for (var i = 0, len = this.commentsList.length; i < len; i++) {
      this.commentsList[i].drawAreas();
    }
    this.displayComments();
  },

  deleteComGroup: function(id) {
    for (var i = 0, len = this.commentsList.length; i < len; i++) {
      if (id == this.commentsList[i].mainId) {
        this.commentsList.splice(i, 1);
        this.drawAreas();
        return ;
      }
    }
  },

  canTarget: function(e) {
    if (this.ctx.getImageData(e[0], e[1], 1, 1).data[3] === 0) { return 0;}

    /*CORE*/
    for (var i = 0, len = this.commentsList.length; i < len; i++) {
      var areas = this.commentsList[i].main.areas;
      for (var j = 0, lenj = areas.length; j < lenj; j++) {
        for (var k = 1, lenk = areas[j].points.length; k < lenk; k++) {

          var u = [(e[0] - areas[j].points[k][0]), (e[1] - areas[j].points[k][1])];
          var v = [(areas[j].points[k - 1][0] - areas[j].points[k][0]), (areas[j].points[k - 1][1] - areas[j].points[k][1])];
          var uNorm = Math.sqrt(u[0] * u[0] + u[1] * u[1]);
          var vNorm = Math.sqrt(v[0] * v[0] + v[1] * v[1]);
          var angle = Math.acos((u[0] * v[0] + u[1] * v[1]) / (uNorm * vNorm));
          var dotProdu = Math.cos(angle) * uNorm;
          var distPoint = Math.abs(Math.sin(angle) * uNorm);

          if (dotProdu >= 0 && dotProdu <= vNorm + 8 && distPoint <= 8) {
            this.commentsList[i].focusCom(2);
            return 1;
          }
        }
      }
    }
    /*!CORE*/
  },

  setHeight: function(h) {
    this.el.style.height = h + 'px';
  },

  displayComments: function() {
    this.el.style.zIndex = 50;
    this.commentsList.sort(function (a, b) {
      return a.main.actualTop - b.main.actualTop;
    });
   var prevDown;
   if (this.tmpGroup !== null) { this.tmpGroup.el.style.top = this.tmpGroup.main.actualTop + 'px'; }
    for (var i = 0, len = this.commentsList.length; i < len; i++) {
      this.commentsList[i].refreshDate();
      this.commentsList[i].el.style.top = this.commentsList[i].main.actualTop + 'px';
      if (i > 0 && (prevDown = r.Library.exceedSize(this.commentsList[i - 1].el, this.commentsList[i].el.style.top))) {
        this.commentsList[i].el.style.top = prevDown + 3 + 'px';
      }
    }
    /*Check collapse*/
    if (i == 0 || this.commentsList[i - 1].el.style.display === 'none') { return ;}
    if(r.Library.exceedSize(this.commentsList[i - 1].el, this.el.offsetHeight)) {
      this.el.style.zIndex = 4;
      this.collapseCom();
    } else if (this.collapseEl !== null) {
      for (var i = 0, len = this.commentsList.length; i < len; i++) {
        this.el.style.zIndex = 50;
        this.commentsList[i].show();
      }
      this.collapseEl.remove();
      this.collapseEl = null;
    }
  },

  resetCol: function(fid, ctx) {
    this.el.innerHTML = '';
    this.tmpGroup = null;
    this.commentsList = [];
    this.idFile = fid;
    this.ctx = ctx;
    this.dp.comments.where(function(e) {
      return e.idFile === this.idFile
    }.bind(this)).each(function(c) {
      this.appendCom([c]);
    }.bind(this));
  },

  appendCom: function(model, options) {
    if (model[0].idParent != 0 || model[0].idFile != this.idFile) { return ; }
    this.tmpGroup = this.create(r.CommentsGroup, {
      mainId: model[0].id,
      idFile: model[0].idFile,
      onRemove: this.deleteComGroup.bind(this),
    });
    this.tmpGroup.setMain(model[0], this.ctx);
    this.tmpGroup.on('redraw', this.drawAreas.bind(this), this);

    this.el.appendChild(this.tmpGroup.el);
    SyntaxHighlighter.highlight();
    this.commentsList.push(this.tmpGroup);
    this.tmpGroup = null;
    this.drawAreas();
  },

  collapseCom: function() {
    if (this.collapseEl !== null) { return ;}
    this.el.appendChild(this.create(r.toDOM, {
      tag: '.collapse-col.usual', innerHTML: 'Hide', events: {
        click: function() {
          if (this.collapseEl.innerHTML == 'Show') {
            for (var i = 0, len = this.commentsList.length; i < len; i++) {
              if (this.commentsList[i].el.style.display !== 'none') { continue ; }
              this.commentsList[i].show();
            }
            this.collapseEl.innerHTML = 'Hide';
          } else {
            for (var i = 0, len = this.commentsList.length; i < len; i++) {
              if (r.Library.exceedSize(this.commentsList[i].el, this.el.offsetHeight)) {
                this.commentsList[i].hide();
              }
              this.collapseEl.innerHTML = 'Show';
            }
          }
        }.bind(this)
      }
    }, 'collapseEl'));
  }

});
return ColComments;
});
