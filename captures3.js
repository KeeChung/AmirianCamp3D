// captures3.js (11-01): what happens when one of the forests' later creatures has her: one short slapstick scene for all of them
// (the moth girl's silk, the witch's hex, the treant's roots, the pumpkin's vines). She is lifted off the ground, her wrists and
// ankles held by strands of whatever it is, and two more strands go for her ribs. Seen from the side, from well back; a
// picture of her face now and then. Her shoes stay on, and the talk is the creature's own nonsense: this is a gag, over in
// half a minute, with a key prompt or two to break free. It does not chain into captures.js's `bound`.
//   held(rec, o) -> { free }   under a black screen with the stage ended, as captures.js's rounds do.
//     rec: { fig }  o: { seat, T (below), say (i, text) (the creature's line), idle (its standing clip), setup() (called in the dark) }
//     T: { theme, strand: [rgb, rgb], mound: { rgb, opacity, glow, h }, lift, se, spark, tries, anne: [3 lines], says: [[i, text] x 3], free, lost }
const V = new URL(import.meta.url).search;
const { createLimbs } = await import('./climb.js' + V);

export function createCaptures3(S, C, env, cap) {
  const { THREE, scene, anne, A, V3 } = S, { sparks } = C, { kit, stage } = cap;
  const { begin, end, pose, soleFrame, mid, nH, side2d, shot } = stage, { makeVine } = kit;
  const has = (n) => A.hasClip && A.hasClip(n), damp = THREE.MathUtils.damp;
  const LB = createLimbs(THREE), UPV = V3(0, 1, 0);
  const H = { on: false, arms: 0, armsGoal: 0, up: 0, upGoal: 0, rate: 1, tau: 0, root: V3(), set: null, pose: null, R: null };
  const _s1 = V3(), _s2 = V3(), _s3 = V3(), _s4 = V3(), _wl = V3(), _pl = V3(), _hd = V3(), _hf = V3(), _hl = V3();
  const SETS = new Map();

  // each theme's strands and what she is lifted over, made when first wanted
  function setOf(T) {
    if (SETS.has(T.theme)) return SETS.get(T.theme);
    const c0 = new THREE.Color(...T.strand[0]), c1 = new THREE.Color(...T.strand[1]), M = T.mound, c = new THREE.Color(...M.rgb), glow = M.glow || 0;
    const geo = new THREE.SphereGeometry(1, 30, 14), P = geo.attributes.position;
    for (let i = 0; i < P.count; i++) { const a = Math.atan2(P.getZ(i), P.getX(i)), y = Math.max(-0.1, P.getY(i)), k = 1 + 0.1 * Math.sin(a * 3 + 0.5) + 0.06 * Math.sin(a * 5 + 1.7); P.setXYZ(i, P.getX(i) * 0.66 * k, y * M.h, P.getZ(i) * 0.62 * k); }
    geo.computeVertexNormals();
    const op = M.opacity === undefined ? 1 : M.opacity, mound = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: c, roughness: 0.85, metalness: 0, transparent: op < 1, opacity: op, emissive: new THREE.Color(c.r * glow, c.g * glow, c.b * glow) }));
    mound.visible = false; mound.receiveShadow = true; scene.add(mound);
    const set = { hold: [0, 1, 2, 3].map(() => makeVine(c0, c1, 18, 8)), tips: [0, 1].map(() => makeVine(c0, c1, 22, 8)), mound };
    SETS.set(T.theme, set); return set;
  }
  function upd(dt) {
    const set = H.set; if (!set) return;
    if (!H.on) { for (const v of [...set.hold, ...set.tips]) v.hide(); set.mound.visible = false; H.set = null; return; }
    H.tau += dt * H.rate; H.arms = damp(H.arms, H.armsGoal, 3, dt); H.up = damp(H.up, H.upGoal, 4, dt);
    set.mound.visible = true;
    // her arms: wrists held up over her head, a little apart (her clip has them behind her; the limb tools raise them)
    H.pose.begin();
    if (H.up > 0.01) {
      const R = H.R; C.headPos(_hd); _hf.set(Math.sin(anne.rotation.y), 0, Math.cos(anne.rotation.y)); _hl.set(_hf.z, 0, -_hf.x);
      for (const sd of ['L', 'R']) {
        const s = sd === 'L' ? 1 : -1, sway = 0.02 * Math.sin(H.tau * 3.1 + s);
        _wl.copy(_hd).addScaledVector(_hl, s * 0.26 + sway).addScaledVector(_hf, -0.16); _wl.y += 0.3 + 0.02 * Math.sin(H.tau * 2.3 + s);
        anne.worldToLocal(_wl); _pl.set(s * 0.9, -0.2, 0.5);
        LB.reach(anne, R.arm[sd], _wl, _pl, H.up);
        LB.hand(anne, R, sd, _s4.set(s * 0.15, 1, -0.15).normalize(), _s3.set(0, 0, 1), 0.35, H.up);
      }
    }
    H.pose.keep();
    // the holders: 0, 1 her ankles; 2, 3 her wrists
    const feet = C.feet;
    set.hold.forEach((v, i) => {
      if (i < 2) { feet[i].shin.getWorldPosition(_s1); feet[i].foot.getWorldPosition(_s2); _s1.lerp(_s2, 0.82); }
      else { if (H.up < 0.3) { v.hide(); return; } H.R.arm[i === 2 ? 'R' : 'L'].end.getWorldPosition(_s1); }
      _s2.copy(H.root); _s2.x += (i % 2 ? 0.18 : -0.18) * (i < 2 ? 1 : 1.6); _s3.lerpVectors(_s2, _s1, 0.5); _s3.y += i < 2 ? 0.1 : 0.55; _s4.lerpVectors(_s2, _s1, 0.86); _s4.y += i < 2 ? -0.08 : 0.16;
      v.draw(_s2, _s3, _s4, _s1, UPV, 0.042, 0.018);
    });
    // the two that go for her ribs: tips beside her, below each shoulder, wiggling
    set.tips.forEach((v, j) => {
      if (H.arms < 0.03 || H.up < 0.6) { v.hide(); return; }
      H.R.arm[j ? 'L' : 'R'].up.getWorldPosition(_s1);
      _hf.set(Math.sin(anne.rotation.y), 0, Math.cos(anne.rotation.y)); _hl.set(_hf.z, 0, -_hf.x);
      _s1.y -= 0.17 - 0.014 * Math.sin(H.tau * 6.3 + j); _s1.addScaledVector(_hl, (j ? 1 : -1) * 0.015).addScaledVector(_hf, 0.02 + 0.012 * Math.sin(H.tau * 9 + j * 2));
      _s2.copy(H.root); _s2.x += j ? 0.5 : -0.5; _s3.lerpVectors(_s2, _s1, 0.5); _s3.y += 0.25; _s3.addScaledVector(_hf, 0.35); _s4.copy(_s1).addScaledVector(_hf, 0.12); _s4.y -= 0.03;
      v.draw(_s2, _s3, _s4, _s1, UPV, 0.03 * H.arms, 0.006);
    });
  }
  S.late.push((dt) => { if (H.set) upd(dt); });

  const laughing = (bank) => { S.voiceLoop(bank, bank === 'cackling' ? 2.2 : bank === 'laughter' ? 2.6 : 3.2); S.expr('laughHard', 0); };
  const hush = () => { S.voiceLoop(null); };
  async function held(rec, o) {
    const fig = rec.fig, T = o.T, say = o.say, seat = (o.seat || anne.position).clone(), set = setOf(T), LIFT = T.lift || 0.42;
    const yaw = Math.atan2(fig.obj.position.x - seat.x, fig.obj.position.z - seat.z);
    await S.fade(1, 0.35);
    if (o.setup) o.setup();
    begin(seat, yaw, []);
    let free = false;
    try {
      A.setHeelsWorn(true); await pose(has('VineHeldShod') ? 'VineHeldShod' : 'SitBoth');      // (her feet towards it)
      anne.position.y = LIFT; C.snapSoles(); await S.frame(); await S.frame(); C.snapSoles(); await S.frame(); soleFrame();
      H.pose = H.pose || LB.pose(anne); H.R = H.R || LB.rigOf(anne); H.set = set; H.root.copy(seat).setY(0.03);
      set.mound.position.copy(seat).setY(0); set.mound.rotation.y = yaw; H.on = true; H.arms = H.armsGoal = 0; H.up = H.upGoal = 0; H.rate = 1; H.tau = 0;
      // it stands well clear of her, its own distance from the middle of the picture
      const fy = Math.atan2(-nH.x, -nH.z), at = V3().copy(mid).addScaledVector(nH, 1.3).setY(0);
      fig.follow(null); fig.target(null); fig.show(at, fy, o.idle || 'IdleBare'); fig.face(fy); if (fig.hover) { fig.hover(1, 0); fig.buzz(1); } fig.expr('smug');
      const cc = V3(), wide = (o2 = {}) => { cc.lerpVectors(seat, at, 0.5).setY(1.0); side2d(cc, Object.assign({ dist: 4.8, fov: 38, see: [C.headPos(), fig.head(V3()), fig.head(V3()).setY(2.3)] }, o2)); };
      const face = () => shot.face({ dist: 1.9, turn: 0.3 });
      wide(); S.expr('shocked', 0); await S.wait(0.3); await S.fade(0, 0.45); await S.mark(o.kind + '1');
      await S.say('a2', 42, T.anne[0], { expr: 'shocked', noFeet: true });
      H.upGoal = 1; S.se(T.se || 'se_Wind4', 0.6, 1.1); await S.wait(0.7);
      await say(...T.says[0]);
      H.armsGoal = 1; S.se(T.se || 'se_Wind4', 0.5, 1.4); laughing('giggle'); await S.wait(1.1); await S.mark(o.kind + '1t');
      await say(...T.says[1]);
      laughing('laughter'); face();
      await S.say('a2', 18, T.anne[1], { expr: 'laughHard', noFeet: true });
      wide();
      free = await S.gauge({ label: 'Break free! Press SPACE in the green!', sub: T.tries > 1 ? 'Try 1 / 2' : 'Last chance', width: 0.22, speed: 0.85 });
      if (!free && T.tries > 1) {
        H.rate = 1.6; laughing('cackling');
        await say(...T.says[2]);
        face(); await S.say('a2', 18, T.anne[2], { expr: 'laughHard', noFeet: true });
        wide(); await S.mark(o.kind + '2');
        free = await S.gauge({ label: 'Break free! Press SPACE in the green!', sub: 'Last chance', width: 0.18, speed: 0.9 });
      }
      hush();
      if (free) { sparks.burst(V3(seat.x, 0.9, seat.z), T.spark, 30, 2.2, 1.0); fig.expr('shocked'); S.expr('angry'); S.toast(T.free, 'dialog', 2.2); await S.wait(0.7); }
      else { await say(...T.lost); await S.mark(o.kind + 'away'); await S.wait(0.4); }
      await S.fade(1, 0.3);
    } finally {
      hush(); H.on = false; H.arms = H.armsGoal = H.up = H.upGoal = 0; if (H.pose) H.pose.drop(); if (H.set) upd(0); anne.position.y = 0;
    }
    end();
    return { free };
  }
  return { held };
}
