export default function(){
  this.transition(
    this.fromRoute('raids.index'),
    this.toRoute('account.characters.index'),
    this.use('toLeft'),
    this.reverse('toRight')
  );
}
