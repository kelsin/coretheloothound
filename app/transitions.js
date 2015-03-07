export default function(){
  this.transition(
    this.toRoute('index'),
    this.use('crossFade'),
    this.reverse('crossFade')
  );

  this.transition(
    this.fromRoute('raids', 'raid'),
    this.toRoute('account'),
    this.use('toDown'),
    this.reverse('toUp')
  );

  this.transition(
    this.fromRoute('raids'),
    this.toRoute('raid'),
    this.use('toLeft'),
    this.reverse('toRight')
  );
}
