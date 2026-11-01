// maren.js (11-01): MAREN QUILL, an original character (not in the 2D game): a Guild cartographer, twenty-nine, cheerful, and
// permanently lost. A side quest of three stops; nothing in the story depends on it, and it cannot be left stuck:
//   the camp      she has wandered in, asking for Valyndra City. Her map case went flying in the North Forest. (progress 10 to 114)
//   the forest    the case lies off the east path once she has asked after it.
//   the dungeon   (progress 130 on, once Anne comes back in) she has been arrested for walking into it by mistake. Anne vouches for
//                 her, Elora lets her go, and she pays with her best map. With the case or without it: the quest ends here.
// She is an ordinary person in ordinary clothes who talks, and that is all she is: no scene of hers touches anybody.
//   marenQuest(S, C, env) -> { fig, camp(at, yaw), forest(at), dungeon(at, yaw, o), showInCell() }     o: { elora: async (text) (her line) }
const V = new URL(import.meta.url).search;
const { createMaren, FACES4 } = await import('./cast4.js' + V);

export function marenQuest(S, C, env) {
  const { THREE, scene, anne } = S, { sparks } = C, F = FACES4.ma;
  const fig = createMaren(S, C), GOLD = new THREE.Color(1.7, 1.3, 0.4);
  const yawTo = (a, b) => Math.atan2(b.x - a.x, b.z - a.z);
  const seen = () => !!fig.obj && fig.obj.visible;
  const say = async (i, text) => { fig.expr(F[i] || 'smile'); fig.talk(true); await S.say('ma', i, text, { noFeet: true }); fig.talk(false); };
  const me = (i, text, o = {}) => S.say('a1', i, text, Object.assign({ noFeet: true }, o));
  const am = (i, text) => S.say('am', i, text, { noFeet: true });
  const meet = async () => { await S.turnTo(fig.obj.position, 0.2); fig.face(yawTo(fig.obj.position, anne.position)); S.cam.two(anne, fig.obj, { y: 1.4, dist: 2.7, pitch: 0.12 }); };
  const introduce = async () => { await say(1, 'Maren Quill, Guild cartographer! Six years\non the road, and never once on time.'); S.flag('marenMet', true); S.toast('Maren Quill, cartographer', 'note', 2.4); };
  S.late.push((dt, t) => { if (seen()) fig.update(dt, t); });

  // ---------- the camp ----------
  function camp(at, yaw) {
    const here = () => S.progress >= 10 && S.progress < 115 && !S.flag('marenGone');
    S.late.push(() => { if (S.isActive()) return; if (here() && !seen()) { fig.show(at, yaw, 'Idle'); fig.expr('smile'); } else if (!here() && seen()) fig.hide(); });
    S.avoid(at, 0.45, 2.2, seen);
    S.on({ id: 'maren', at, r: 1.9, action: 'E — talk to her', when: here, run: async () => {
      if (!seen()) { fig.show(at, yaw, 'Idle'); await S.frame(); }
      await meet();
      if (!S.flag('marenMet')) {
        await say(5, 'Oh, thank goodness, a person!\nPlease tell me this is Valyndra City.');
        await me(4, 'This is a campsite. In a forest.');
        await say(4, 'Right. Yes. I can see that now.');
        await introduce();
        await am(4, 'A mapmaker who is lost.\nI like her already, kitty.');
        await say(0, 'I HAD a map! The case went flying in the\nNorth Forest, when a pumpkin chased me.');
        await me(4, '...A pumpkin.');
        await say(5, 'A very fast one!');
      } else if (S.flag('marenCase')) {
        await me(7, 'Brown leather, smells a bit of panic.\nThis yours?');
        await say(3, 'My case! You found it!\nOh, you wonderful, wonderful person!');
        S.flag('marenGiven', true); S.counts(S.state.herbs, S.state.coins + 40); S.toast('+40 coins', 'success', 2.2); sparks.burst(fig.obj.position.clone().setY(1.2), GOLD, 16, 1.2, 0.7);
        await say(1, 'Valyndra is south. I am sure of it.\nMostly. Wish me luck!');
        await am(0, 'She is holding it upside down, kitty.');
        await S.fade(1, 0.35); fig.hide(); S.flag('marenGone', true); await S.fade(0, 0.35);
        S.cam.behind(anne, { dist: 4.6 }); console.log('MAREN gave case'); return;
      } else if (S.flag('marenAsked')) {
        await say(2, 'Any sign of my map case? I have been\npractising walking in a straight line.');
        await say(4, 'It is going badly.');
        S.cam.behind(anne, { dist: 4.6 }); console.log('MAREN chat'); return;
      } else await say(0, 'Back again! Did you change your mind\nabout that map case?');
      const pk = await S.choice(['I will keep an eye out for it', 'Good luck with that']);
      if (pk === 0) {
        S.flag('marenAsked', true); await say(3, 'You are a lifesaver! Brown leather tube.\nSmells faintly of panic.');
        S.toast("Side quest: Maren's map case", 'note', 2.6);
      } else await say(4, 'That is fair. I will be right here.\nWherever "here" is.');
      S.cam.behind(anne, { dist: 4.6 }); console.log('MAREN met');
    } });
  }

  // ---------- the forest: her case, in the grass ----------
  function forest(at) {
    const here = () => !!S.flag('marenAsked') && !S.flag('marenCase');
    const leather = new THREE.MeshStandardMaterial({ color: new THREE.Color(0.30, 0.17, 0.07), roughness: 0.7 }), brass = new THREE.MeshStandardMaterial({ color: new THREE.Color(0.7, 0.5, 0.18), roughness: 0.35, metalness: 0.7 });
    const g = new THREE.Group(), tube = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.62, 14), leather); tube.rotation.z = Math.PI / 2; tube.castShadow = true; g.add(tube);
    for (const s of [1, -1]) { const c = new THREE.Mesh(new THREE.CylinderGeometry(0.062, 0.062, 0.05, 14), brass); c.rotation.z = Math.PI / 2; c.position.x = s * 0.31; g.add(c); }
    g.position.copy(at).setY(0.07); g.rotation.y = 0.7; g.visible = false; scene.add(g);
    let tick = 0;
    S.late.push((dt) => { g.visible = here(); if (g.visible && (tick += dt) > 1.6) { tick = 0; sparks.burst(g.position.clone().setY(0.25), GOLD, 5, 0.5, 0.5); } });
    S.on({ id: 'marenCase', at, r: 1.5, lv: 0, action: 'E — pick up the map case', when: here, run: async () => {
      S.cam.two(anne, g, { y: 1.0, y2: 0.1, dist: 2.6, pitch: 0.3 }); await S.turnTo(at, 0.2);
      await me(10, 'Brown leather, and it smells faintly of panic.\nThis has to be it!');
      S.flag('marenCase', true); g.visible = false; S.toast("Maren's map case", 'success', 2.2);
      await am(0, 'She will still be at the camp, kitty.\nI doubt she has found the way out.');
      S.cam.behind(anne, { dist: 4.6 }); console.log('MAREN case found');
    } });
  }

  // ---------- the dungeon ----------
  let cellAt = null, cellYaw = 0;
  const showInCell = () => { if (cellAt && !S.flag('marenHome')) { fig.show(cellAt, cellYaw, 'Idle'); fig.expr('worried'); } };
  function dungeon(at, yaw, o = {}) {
    cellAt = at; cellYaw = yaw; S.avoid(at, 0.45, 2.2, seen);
    S.on({ id: 'marenCell', at, r: 1.8, action: 'E — talk to Maren', when: () => S.progress >= 130 && !S.flag('marenHome'), run: async () => {
      if (!seen()) { showInCell(); await S.frame(); }
      await meet();
      if (S.flag('marenMet')) await say(5, 'Anne! Oh, good. Would you please tell these\nnice guards that I am not a spy?');
      else { await say(5, 'Excuse me! You do not look like a guard.\nWould you tell them I am not a spy?'); await introduce(); }
      await me(4, 'How did you end up in a dungeon?');
      await say(4, S.flag('marenGiven') ? 'I followed the map exactly! It turns out\nI was holding it upside down.' : 'I walked south until I found a door.\nI thought it was an inn.');
      if (o.elora) { await o.elora('She walked in and asked for a room with a view.\nGet her out of my dungeon, outsider.'); S.cam.two(anne, fig.obj, { y: 1.4, dist: 2.7, pitch: 0.12 }); }
      await me(9, 'She is harmless. Just very, very lost.');
      const hasCase = S.flag('marenCase') && !S.flag('marenGiven');
      if (hasCase) { await me(7, 'Oh, and this is yours.'); await say(3, 'My case! You carried it all this way?!'); }
      await say(3, hasCase || S.flag('marenGiven') ? 'Here, my best work: the whole region.\nMostly right. Thank you, truly!' : 'I shall draw a new map, then. Here, the\none I made in the cell. It is mostly doors.');
      S.counts(S.state.herbs, S.state.coins + 80); S.toast('+80 coins', 'success', 2.2);
      S.flag('marenHome', true); S.toast("Quest done: Maren's way home", 'success', 2.6);
      await S.fade(1, 0.35); fig.hide(); await S.fade(0, 0.35);
      S.cam.behind(anne, { dist: 4.2 }); console.log('MAREN home');
    } });
  }
  return { fig, camp, forest, dungeon, showInCell };
}
