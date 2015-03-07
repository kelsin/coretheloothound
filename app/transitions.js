export default function(){
  this.transition(
    this.toRoute('account.characters.index'),
    this.use('toLeft'),
    this.reverse('toRight')
  );
}
