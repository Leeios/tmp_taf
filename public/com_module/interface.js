var comments = this.create(r.ComModule);
/*Data init: {item: DOMelement, format: 'column' || 'bubble', canvas: 'on' || 'off', dp: CommonDP}*/

comments.attachItem(el, 'on')
/*Lie l'element au commentaire, independant de l'affichage. La colonne peut être placée ailleurs
**'on' pour declencher le canvas
*/

comments.placeComments(el)
/*Place la colonne de commentaires en enfant du el*/

comments.setCanvas(el);
/*Associe le canvas a el*/

comments.switchFormat();
/*Permet de switcher entre le mode bulle et le mode colonne*/

var id = comments.addComment({txt: 'some txt', author: 'Me', actualTop: 10, actualLeft: 15});
/*Ajoute un commentaire à la colonne avec ses coordonnées
**Les Coordonnées sont auto lorsque canvas on
*/

comments.addReply(id, {txt: 'some txt', author: 'Me'})
/*Add a reply to comment with id*/

comments.edit(id, {txt: 'some new txt', data: 'some new date', author: 'You'});
/*Edit le comment id pour chaque champ qui suit*/

comments.remove(id);
/*remove le comment id*/

comments.suggestComment();
/*Propose un commentaire (non ajoute a la db). Ajout auto lorsque click create*/

this.showCom(20);
this.hideCom(20);
/*Show/hide tous les commentaires dont le actualTop est au dessus/dessous du param
**Si param est undefined, tout est show/hide
*/
