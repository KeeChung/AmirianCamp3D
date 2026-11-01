// creatures2.js (10-12): the Forest of Lys's HORNETS and SLIMES as she meets them: the 2D game's map events "Hornet" and
// "Slime" (eight of each on its Map 36; here a few, in the glades off the road) and its CE 58 / CE 59:
//   HORNETS!! / SLIMES!!!   she walks into one (they come for her: the hornets fast, the slimes slowly)
//   a word about how she looks (her feet and shoes, her outfit, her kind: by turns), then the fight: the gauge, twice
//   lost:  caught. captures2.js: her shoes come off and her feet are tickled, a sister joins; still caught after that,
//          she is tied up on her front (captures.js `bound`: the player's "when caught" choice, T) and comes round at
//          the last checkpoint
//   won:   the 2D's DOMINATION: "GOTCHAA!!", then the party tickles HER (the area's own scene: o.tame), and if she
//          gave up, the reward: Honey ("HORNET UNLOCKED!!" / "SLIME UNLOCKED!!" the first time)
// Everybody is dressed and stays so; only shoes come off; the 2D's adult stages are not built.
//
// (11-01) The later creatures use the same packs: the MOTH GIRL, the BLACK MOON WITCH, the TREANT, the PUMPKIN FIEND (cast4.js).
// Each has `held` (its lines and colours for captures3.js's one slapstick scene, which is what losing to it is: her shoes stay
// on, and it does not chain into `bound`) and `remarks` (its own lines, nothing about her looks). Beaten, it gives up and pays
// up (`yields`, `item`): the taming on the stump is the hornets', the slimes' and the dryad's only. `still`: it stands where it
// is and turns to look; `action`: she walks up and presses E; `ask`: a word first, and she may walk away; `rounds`: gauges;
// `plain`: no portrait. o.when: only while this is true (later in the story); such a pack is only made once she is near.
//
// One figure per kind for all its spots (and one sister): a twin of Anne's model is a whole character to draw, and the
// forest is thick: one glade is in sight at a time. She is at whichever of her spots Anne is nearest to, and changes
// spot only when Anne is far from both. A beaten one is gone until the forest is entered again (as in the 2D game).
// She is drawn only within RANGE of Anne and in the picture (she and her shadow are some 180,000 triangles a frame).
//
//   creatureKit2(S, C, env, ck, cap, cap2, cast3) -> { pack(kind, spots, o) }
//     kind 'hornet' | 'slime';  spots [[tx, ty], ...];  o: { tame: async ({ kind, fig, sheet, say, back, P }) -> stage 0..3,
//       aside() (whoever travels with her goes out of the picture: she is caught), back() (and comes back) }
//     pack -> { kind, fig, sis, recs, update(dt, t), cur(), meet(i) }      (the area calls update from its S.late hook)
export function creatureKit2(S, C, env, ck, cap, cap2, cast3, ext = {}) {
  const { THREE, anne, A, TILE } = S, { sparks } = C, PI = Math.PI, LED = S.ledge, { cap3, cast4 } = ext;
  const V3 = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
  const pick = (L) => L[Math.floor(Math.random() * L.length)], rr = (a, b) => a + Math.random() * (b - a);
  const HONEY = new THREE.Color(1.9, 1.3, 0.25), AQUA = new THREE.Color(0.5, 1.1, 1.9), GOLD = new THREE.Color(1.7, 1.3, 0.4), DUST = new THREE.Color(1.8, 1.0, 1.5), HEX = new THREE.Color(0.9, 0.5, 1.9), SAP = new THREE.Color(0.9, 1.3, 0.3), EMBER = new THREE.Color(1.8, 0.9, 0.2);
  const yawTo = (a, b) => Math.atan2(b.x - a.x, b.z - a.z);
  const walkable = (x, z) => env.walkAt(Math.floor(x / TILE), Math.floor(z / TILE)) && (!LED || LED.levelAt(x, z) === 0);
  const clear = (a, b) => { for (let k = 1; k <= 8; k++) if (!walkable(a.x + (b.x - a.x) * k / 8, a.z + (b.z - a.z) * k / 8)) return false; return true; };

  const KIND = {
    hornet: { sheet: 'ho', who: 'hornet', name: 'Hornet', warn: 'HORNETS!!', flies: true, speed: 2.0, notice: 6.5, radius: 2.6, leash: 5.5, gauge: [0.2, 0.95], spark: HONEY, pitch: 1.22,
      got: "GOTCHAA!!|You can't escape now...|Now, what should I do with you?", off: 'Now, get lost, you buzzing pest!|Lesson learned, buzz-brain!|You have messed up with the wrong girl!',
      free: 'STAP IT ALREADY, YOU CREEPY THING!!!|HANDS OFF!!', away: 'The hornets buzz off, very pleased with themselves.',
      flag: 'hornetUnlocked', unlock: ['HORNET UNLOCKED!!', 'Spoil her delicious honey!'], item: ['Honey', 1, 4],
      bound: { open: [[0, "Hold ssstill, prezziousss...\nthe hive hazz ssso many feathers to try! BZZT!"]], tickle: [[0, 'BZZZT! Lizzten to her zzing!\nLouder, lil flower, louder!']], lick: [[0, 'Ssso ticklish... our queen\nwill be zzzo pleazzed!']],
        fast: [[0, 'BZZZZZZZT!! FASSSTER, SSSISTERS!!']], lost: [[0, "Hzzhzzhzz... don't pout, prezziousss!\nWe'll play again zzzoon!"]] } },
    slime: { sheet: 'sl', who: 'slime', name: 'Slime', warn: 'SLIMES!!!', flies: false, speed: 0.85, notice: 5, radius: 2.0, leash: 4, gauge: [0.23, 0.8], spark: AQUA, pitch: 0.94,
      got: 'Come here, you, jelly face!', off: 'GET LOST, SLIMMY!!|Uggghh... too sticky...', free: 'Stay away!!', away: 'The slimes ooze away, very pleased with themselves.',
      flag: 'slimeUnlocked', unlock: ['SLIME UNLOCKED!!', 'This is getting sticky!'], item: ['Jelly Drops', 1, 2],
      bound: { open: [[0, 'Blub... stay a little longer...\nyou are so nice and warm!']], tickle: [[0, 'Blub blub! Wiggly toes!\nI like wiggly toes!']], lick: [[0, 'So squirmy... blub...\nlike a little fish!']],
        fast: [[0, 'BLUB BLUB BLUB!! MORE WIGGLES!!']], lost: [[0, 'Blub... bye bye, warm girl...\ncome and play again!']] } },
    // (11-01) the later ones
    moth: { sheet: 'mo', who: 'moth', name: 'Moth Girl', warn: 'MOTH GIRL!!', flies: true, make: 'createMoth', speed: 1.5, notice: 6, radius: 2.2, leash: 5, rounds: 2, gauge: [0.21, 0.9], spark: DUST, pitch: 1.15, later: true,
      remarks: ["You're the brightest thing in this whole forest!\nI simply HAVE to bump into you. Repeatedly.", "What lovely fabric you're wearing!\nDon't mind me, I'm only a little peckish.", "Hold still, I've been circling you\nfor an hour and I'm getting dizzy!"],
      snare: 'Threads!|Silk, everywhere!', got: 'Got you, dusty!|Flutter off!', free: 'And STAY off my sleeves!|ACHOO! Go find a lamp!', away: 'The moth girl flutters off, very pleased with herself.',
      yields: ['All right, all right, I give up!\nTake my silk and let me find a nice lamp.', 'Ow! My wings are all bent!\nHere, have some silk, just stop swatting!'],
      flag: 'mothUnlocked', unlock: ['MOTH GIRL UNLOCKED!!', 'Mind the wing dust!'], item: ['Silk Thread', 1, 3],
      held: { theme: 'silk', strand: [[0.74, 0.68, 0.72], [0.92, 0.88, 0.90]], mound: { rgb: [0.80, 0.76, 0.78], opacity: 0.94, h: 0.3 }, se: 'se_Wind4', spark: DUST, tries: 2,
        anne: ['EEEK! What IS this stuff?!\nGet it off my sleeves!', "AHAHA! THAT'S M-MY RIBS!\nACHOO! AND YOUR DUST!", 'HAHAHA! I WILL BLOW OUT\nEVERY LAMP YOU OWN! ACHOO!'],
        says: [[1, 'Only silk, darling! One thread per wrist,\none per ankle. I am very tidy.'], [2, 'Now, how ticklish is a person, anyway?\nI have only ever tried this on lampshades.'], [2, 'You sneeze AND laugh? Marvellous!\nA few more threads, I think!']],
        free: 'Snap! No silk beats a good sneeze!', lost: [1, 'Lights out, darling.\nI will drop you off on my way to the lamp.'] } },
    witch: { sheet: 'wi', who: 'witch', name: 'Witch', warn: 'BLACK MOON WITCH!!', still: true, make: 'createWitch', idle: 'Idle', rounds: 2, gauge: [0.2, 0.92], spark: HEX, pitch: 1.05, later: true, action: 'E — confront the witch',
      ask: ['Hey, you! What are you doing out here?', 'Black Moon Sorority business, trespasser.\nMove along.', ['Stop right there!', 'Let her alone']],
      remarks: ['You are in a great deal of trouble now.\nI hope you brought a pencil.', 'No one interrupts the Black Moon Sorority.\nThe paperwork alone is a nightmare.'],
      snare: 'A hex!|She floats off the ground!', got: 'Spell broken!|Hat first, witch!', free: 'Find a new hobby!|Hexes are NOT research!', away: 'The witch files her report, very pleased with herself.',
      yields: ['Enough! I withdraw from the field.\nHere, a charm for your trouble. Do not tell the Dean.', 'My notes! My HAT!\nFine, you win. Take this and leave me be.'],
      flag: 'witchUnlocked', unlock: ['WITCH UNLOCKED!!', 'The Black Moon will remember this!'], item: ['Black Moon Charm', 1, 2],
      held: { theme: 'hex', strand: [[0.24, 0.10, 0.52], [0.60, 0.34, 0.95]], mound: { rgb: [0.26, 0.12, 0.56], opacity: 0.7, glow: 0.7, h: 0.03 }, lift: 0.62, se: 'se_Wind4', spark: HEX, tries: 2,
        anne: ['HEY! Put me down,\nyou pointy-hatted menace!', 'AHAHA! T-TAKE YOUR NOTES\nAND-- HAHAHAHA!', 'HAHAHA! WHO WRITES\nTHESE SPELLS?!'],
        says: [[1, 'Hex of Harmless Giggles, field test nine.\nDo hold still, my notes must be neat.'], [3, 'Laughter: loud. Dignity: none.\nThe Sorority will be thrilled.'], [1, 'Hmm. Let us try the stronger wording.']],
        free: 'The hex fizzles out!', lost: [1, 'Test complete. Result: extremely ticklish.\nDo sign the form on your way out.'] } },
    treant: { sheet: 'tr', who: 'treant', name: 'Treant', warn: 'THE TREE IS MOVING!!', still: true, make: 'createTreant', rounds: 3, gauge: [0.2, 0.86], spark: SAP, pitch: 0.82, later: true,
      remarks: ['Hooo... something small...\nis walking on my roots...', 'Three hundred years I have stood here...\nand you are the rudest of them all.', 'Leaf... now... or stay...\nI have all the time there is.'],
      snare: 'Roots!|The ground grabs her!', got: 'TIMBER!!|Take that, firewood!', free: 'Stay in the ground!|And STAY rooted!', away: 'The treant settles back into the ground, very pleased with herself.',
      yields: ['Hooo... enough...\nTake a little heartwood... and let me nap...'],
      flag: 'treantUnlocked', unlock: ['TREANT UNLOCKED!!', 'She will grow on you.'], item: ['Heartwood', 2, 4],
      held: { theme: 'roots', strand: [[0.10, 0.06, 0.03], [0.30, 0.20, 0.10]], mound: { rgb: [0.16, 0.10, 0.05], h: 0.32 }, se: 'se_Down1', spark: SAP, tries: 2,
        anne: ['WHOA! That tree just grabbed me!', 'AHAHA! BAD ROOTS!\nBAD, BAD ROOTS!', 'HAHAHA! THIS IS\nUNBE-LEAF-ABLE!'],
        says: [[0, 'Hooo... not a tree... a treant...\nPeople always mix that up...'], [1, 'My roots... are curious...\nThey have not met ribs before...'], [3, 'Hoo... hoo... hoo...\nBest fun since the great acorn drought...']],
        free: 'SNAP! The roots give way!', lost: [1, 'Rest now, traveller...\nYou are a very noisy shrub...'] } },
    pumpkin: { sheet: '', who: 'pumpkin', name: 'Mr. Pumpkin', warn: 'PUMPKIN FIEND!!', plain: true, make: 'createPumpkin', speed: 1.3, notice: 5.5, radius: 2.2, leash: 4.5, rounds: 1, gauge: [0.24, 0.85], spark: EMBER, pitch: 1, zapY: 0.4,
      remarks: ['Hee hee hee! Seed thief! Seed thief!', 'Hee hee! Round and round the pumpkin patch!'],
      snare: 'Vines!|He has her by the ankle!', got: 'Pumpkin pie it is!|Squashed!', free: 'Overgrown SQUASH!!|Soup! I am making SOUP!', away: 'Mr. Pumpkin rolls off, cackling.',
      yields: ["Ow ow ow! My rind!\nTake the seeds! Take the seeds!"],
      flag: 'fiendBeaten', unlock: ['PUMPKIN FIEND BEATEN!!', 'Mr. Pumpkin is not amused.'], item: ['Pumpkin Seeds', 1, 3],
      held: { theme: 'pumpkin', strand: [[0.045, 0.075, 0.055], [0.105, 0.135, 0.075]], mound: { rgb: [0.06, 0.09, 0.06], h: 0.32 }, se: 'se_Down1', spark: EMBER, tries: 1,
        anne: ['Oh, not YOU again,\nyou overgrown squash!', 'AHAHA! W-WHEN I GET DOWN,\nI AM MAKING PIE!', ''],
        says: [[0, "Hee hee hee! Can't catch me, can't squash me!"], [0, 'Pie? PIE?! Now you are in trouble! Hee hee!'], [0, '']],
        free: 'Ha! Kicked him into the bushes!', lost: [0, 'Hee hee! Sweet dreams, seed thief!'] } },
  };

  function pack(kind, spots, o = {}) {
    const P = KIND[kind], make = (x) => (P.make ? cast4[P.make](S, C, kind === 'pumpkin' ? { vine: cap.kit.makeVine(new THREE.Color(0.045, 0.075, 0.055), new THREE.Color(0.105, 0.135, 0.075), 14, 6) } : x) : kind === 'hornet' ? cast3.createHornet(S, C, x) : cast3.createSlime(S, C, x));
    const fig = make({}), sis = P.held ? { obj: null } : make({ sister: true });
    const say = P.plain ? (i, text, o2 = {}) => S.say('', 0, text, Object.assign({ name: P.name, noFeet: true }, o2)) : cap2.sayAs(P.sheet, fig);
    const CLIP = P.idle || 'IdleBare', TAG = S.level.name.toUpperCase(), LAZY = 30;
    const st = { cur: null, at: V3(), to: null, wait: 1, busy: false, grace: 0, near: false };
    const RANGE = 24, _fr = new THREE.Frustum(), _pm = new THREE.Matrix4(), _sp = new THREE.Sphere();
    // is she in the picture? (her whole figure in a ball; the camera as it stood for the frame just drawn)
    const inView = () => { const cam = S.camera; _pm.multiplyMatrices(cam.projectionMatrix, cam.matrixWorldInverse); _fr.setFromProjectionMatrix(_pm); fig.obj.getWorldPosition(_sp.center); _sp.center.y += 1.0; _sp.radius = 2.0; return _fr.intersectsSphere(_sp); };
    const idle = () => { fig.clip(CLIP, 0.3); if (P.flies) { fig.hover(1, 0); fig.buzz(1); } };
    const recs = spots.map(([tx, ty], i) => {
      const rec = { id: kind + i, i, kind, home: S.tileC(tx, ty), fig, alive: true };
      rec.ev = S.on({ id: rec.id, at: rec.home.clone(), r: P.action ? 1.8 : 1.25, lv: 0, touch: !P.action, action: P.action, when: () => st.cur === rec && !st.busy && st.grace <= 0 && !!fig.obj && fig.obj.visible, run: () => meet(rec) });
      if (!rec.ev) rec.alive = false;
      else if (P.still) S.avoid(rec.home, 0.45, 2.2, () => st.cur === rec && !!fig.obj && fig.obj.visible);
      return rec;
    });
    // where she is: at the spot nearest to Anne, changed only while Anne is far from where she is now
    function choose() {
      if (o.when && !o.when()) { if (st.cur) { fig.hide(); st.cur = null; } return; }
      let best = null, bd = 1e9;
      for (const r of recs) if (r.alive) { const d = Math.hypot(anne.position.x - r.home.x, anne.position.z - r.home.z); if (d < bd) { bd = d; best = r; } }
      if (!best) { if (st.cur) { fig.hide(); st.cur = null; } return; }
      if (best === st.cur || (st.cur && Math.hypot(anne.position.x - st.at.x, anne.position.z - st.at.z) < 15)) return;
      if (P.held && !st.cur && bd > LAZY) return;      // (a whole figure to make: not until she is on her way)
      st.cur = best; st.at.copy(best.home); st.to = null; st.wait = rr(0.5, 2);
      fig.show(st.at, 0, CLIP); idle(); S.settle(fig.obj, 0); best.ev.p.copy(st.at);
    }
    function roam(dt) {
      const rec = st.cur, p = st.at, dA = Math.hypot(anne.position.x - p.x, anne.position.z - p.z);
      st.near = dA < RANGE; fig.obj.visible = st.near && inView(); if (!st.near) return;
      if (st.grace > 0) st.grace -= dt;
      if (P.still) { if (dA < 8) fig.face(yawTo(fig.obj.position, anne.position)); return; }
      let goal = null, sp = P.speed * 0.5;
      if (st.grace <= 0 && dA < P.notice && (!LED || LED.level() === 0)) {      // she comes for her, never further from home than her leash
        goal = V3(anne.position.x, 0, anne.position.z);
        if (goal.distanceTo(rec.home) > P.leash * TILE) goal.sub(rec.home).setLength(P.leash * TILE).add(rec.home);
        if (walkable(goal.x, goal.z) && clear(p, goal)) { sp = P.speed; st.to = null; } else goal = null;
      }
      if (!goal) {
        if (st.wait > 0) { st.wait -= dt; return; }
        if (!st.to) {
          for (let k = 0; k < 8 && !st.to; k++) { const a = Math.random() * 6.283, r = (0.3 + 0.7 * Math.random()) * P.radius * TILE, q = V3(rec.home.x + Math.cos(a) * r, 0, rec.home.z + Math.sin(a) * r); if (walkable(q.x, q.z) && clear(p, q)) st.to = q; }
          if (!st.to) { st.wait = 1; return; }
        }
        goal = st.to;
      }
      const dx = goal.x - p.x, dz = goal.z - p.z, d = Math.hypot(dx, dz);
      if (d < 0.08) { if (goal === st.to) { st.to = null; st.wait = rr(0.8, 2.8); } return; }
      const step = Math.min(d, sp * dt); p.x += dx / d * step; p.z += dz / d * step;
      fig.face(Math.atan2(dx, dz)); fig.obj.position.x = p.x; fig.obj.position.z = p.z; if (!P.flies) fig.obj.position.y = 0;
      rec.ev.p.copy(p);
    }
    function update(dt, t) {
      if (!S.isActive() && !st.busy) { choose(); if (st.cur && fig.obj) roam(dt); }
      else if (!st.busy && st.cur && fig.obj) fig.obj.visible = st.near;      // (another scene plays: its camera may turn anywhere)
      if (fig.obj && fig.obj.visible) fig.update(dt, t); else if (fig.off) fig.off();
      if (sis.obj && sis.obj.visible) sis.update(dt, t);
    }
    const home = (rec) => { st.at.copy(rec.home); st.to = null; st.wait = 2; fig.show(st.at, 0, CLIP); idle(); fig.expr('smile'); S.settle(fig.obj, 0); rec.ev.p.copy(st.at); if (sis.obj) sis.hide(); };
    const zapM = { get obj() { return fig.obj; }, zapY: P.zapY || (P.flies ? 1.5 : 1.15), shake() { fig.expr('shocked'); }, lean() {} };

    // ---------- she walks into her (or is caught up with) ----------
    async function meet(rec) {
      st.busy = true;
      try {
        if (st.cur !== rec || !fig.obj) { st.cur = rec; home(rec); }      // (she is always there when it is walked into; a test may start it from afar)
        fig.obj.visible = true; st.near = true;
        const back = anne.position.clone().setY(0);
        fig.follow(null); fig.face(yawTo(fig.obj.position, anne.position)); fig.expr('smug');
        if (P.ask) {                                   // (a word first: she may still walk away)
          await S.turnTo(fig.obj.position, 0.2); S.cam.two(anne, fig.obj, { y: 1.3, dist: 3.1, pitch: 0.16 });
          await S.say('a1', 7, P.ask[0], { noFeet: true }); await say(0, P.ask[1]);
          if (await S.choice(P.ask[2]) === 1) { S.cam.behind(anne, { dist: 4.6 }); console.log(TAG + ' ' + kind + ' left alone'); return; }
        }
        S.toast(P.warn, 'warning'); S.expr('angry'); S.emote(anne, 'exclaim', 0.8); await S.turnTo(fig.obj.position, 0.2);
        S.cam.two(anne, fig.obj, { y: 1.25, dist: 3.1, pitch: 0.18 });
        if (kind === 'slime') await S.say('a1', 47, pick(['Dammit!', 'Here we go again!', 'Heads up!', 'Careful!']), { expr: 'angry' }); else await S.wait(0.45);
        // a word on how she looks: her feet and shoes, what she wears, her kind (by turns)
        const R = P.remarks || (C.lookRemarks ? C.lookRemarks(P.who, 3) : []), n = S.state.flags[kind + 'LookN'] = (S.state.flags[kind + 'LookN'] || 0) + 1, k = R.length ? (n - 1) % R.length : 0;
        if (R[k]) await say(0, R[k], { feet: !P.remarks && k === 0 });
        let won = true;
        const N = P.rounds || 2;
        for (let i = 0; i < N; i++) {
          const hit = await S.gauge({ label: 'Strike! Press SPACE in the green!', sub: `${P.name}  (${i + 1} / ${N})`, width: P.gauge[0] - 0.02 * i, speed: P.gauge[1] + 0.08 * i });
          if (!hit) { won = false; break; }
          await ck.zap(zapM); sparks.burst(V3(fig.obj.position.x, zapM.zapY, fig.obj.position.z), P.spark, 16, 1.4, 0.9);
        }
        if (won) await beaten(rec, back); else await caught(rec, back);
      } finally { st.busy = false; st.grace = 3.5; }
    }
    async function beaten(rec, back) {
      S.toast(P.got, 'success', 2.2); S.expr('smug'); fig.expr('worried'); if (P.flies) { fig.hover(0.25, 0); fig.buzz(0.4); } await S.wait(1.0);
      if (P.yields) await say(0, pick(P.yields));
      const stage = o.tame ? await o.tame({ kind, fig, sheet: P.sheet, say, back, P }) : P.held ? 3 : 0;
      if (stage >= 3) {
        S.se('se_Item3', 0.7);
        if (!S.flag(P.flag)) { S.flag(P.flag, true); S.toast(P.unlock[0], 'success', 2.4); await S.wait(1.0); S.toast(P.unlock[1], 'note', 2.2); await S.wait(0.7); }
        const [nm, a, b] = P.item, n = a + Math.floor(Math.random() * (b - a + 1)); S.addHerbs(n); S.toast(`${nm} x${n}`, 'success', 2.2);
      } else S.toast(P.off, 'dialog', 2.2);
      // she is gone: until the forest is entered again
      if (fig.obj && fig.obj.visible) sparks.burst(V3(fig.obj.position.x, 1.0, fig.obj.position.z), P.spark, 30, 1.8, 1.2);
      fig.hide(); rec.alive = false; S.remove(rec.id, false); st.cur = null; S.expr('smug');
      await S.wait(0.6); C.checkpoint(); console.log(TAG + ' ' + kind + ' beaten');
    }
    async function caught(rec, back) {
      if (P.held) { S.toast(P.snare, 'warning', 1.6); await S.wait(0.5); }
      else if (kind === 'hornet') { S.se('se_Load', 0.6); await S.say('a1', 42, 'Oucchhhh!! WHAT THE ....', { expr: 'shocked' }); } else { S.se('se_Down1', 0.6); S.toast('Too slow!|It has her ankles!', 'warning', 1.6); await S.wait(0.5); }
      const way = S.capStyle ? S.capStyle() : '2d';
      let r = P.held ? await cap3.held({ fig }, { seat: back, T: P.held, say, idle: CLIP, kind, setup: o.aside }) : way === 'tied' && cap.bound ? null : await cap2[kind]({ fig }, { seat: back, sister: sis, setup: o.aside });      // (it ends in the dark, its stage ended)
      if (!P.held && (!r || (way === 'both' && !r.free && cap.bound))) {
        const proxy = { get obj() { return fig.obj; }, lean() {}, laugh(on) { fig.expr(on ? 'laugh' : 'smug'); }, shake() { fig.expr('shocked'); }, hop() {} };
        r = await cap.bound({ kind, list: [proxy], keep: true, chained: !!r, seat: back, yaw: yawTo(back, rec.home), theme: kind === 'hornet' ? 'rope' : 'mist',
          setup: ({ mid, out }) => { if (o.aside) o.aside(); if (sis.obj) sis.hide(); fig.follow(null); if (P.flies) { fig.hover(0, 0); fig.buzz(0.3); } fig.show(V3(mid.x + out.x * 1.55, 0, mid.z + out.z * 1.55), Math.atan2(-out.x, -out.z), 'KneelSit'); fig.expr('smug'); },
          tools: [[0, 0, 'stroke', 'toes', 'duster', { rate: 1.1 }], [0, 1, 'stroke', 'toes', 'duster', { rate: 1.2, ph: 2.0 }], [0, 0, 'arch', 'side', 'catkin', { rate: 1.3 }], [0, 1, 'toes', 'side', 'catkin', { rate: 1.2, ph: 1.1 }]],
          say: async (stage) => { for (const [i, text] of P.bound[stage] || []) await say(i, text); } });
      }
      // (dark) everybody back to their own places
      S.clip('Idle', 0); home(rec);
      if (r.free) {
        const away = V3(back.x - rec.home.x, 0, back.z - rec.home.z); if (away.lengthSq() < 0.01) away.set(0, 0, 1); away.normalize();
        // (a step further from her home, as far as there is ground to stand on: not into the stream, not into the trees)
        let k = 1.6; while (k > 0.05 && !walkable(back.x + away.x * k, back.z + away.z * k)) k -= 0.2;
        S.place(V3(back.x + away.x * k, 0, back.z + away.z * k), Math.atan2(-away.x, -away.z));
        if (o.back) o.back();
        await cap.kit.putShoesOn(); S.cam.behind(anne, { cut: true, dist: 4.5 }); await S.fade(0, 0.4); S.expr('angry');
        S.toast(P.free, 'dialog', 2.2); if (A.hasClip && A.hasClip('Stomp')) { S.clip('Stomp', 0.1); await S.wait(0.9); S.clip('Idle', 0.2); }
        console.log(TAG + ' ' + kind + ' caught free'); return;
      }
      C.toCheckpoint(); if (o.back) o.back();         // (whoever travels with her is beside her as she comes round)
      await ck.wakeUp(false);
      S.toast(P.away, 'note', 2.4); console.log(TAG + ' ' + kind + ' caught lost');
    }
    return { kind, P, fig, sis, recs, update, cur: () => st.cur, meet: (i) => meet(recs[i]), state: st };
  }
  return { pack, KIND };
}
