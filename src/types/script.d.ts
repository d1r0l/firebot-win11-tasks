type EffectScope<EffectParams> = {
  effect: EffectParams;
  [x: string]: any;
};
