export default function(){
  this.transition(
    this.toRoute('account'),
    this.use('fade'),
    this.reverse('fade')
  );

  this.transition(
    this.fromRoute('raids'),
    this.toRoute('raid'),
    this.use('toLeft'),
    this.reverse('toRight')
  );
}
