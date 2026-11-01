// cast4.js (11-01): the later creatures of the forests: the MOTH GIRL, the BLACK MOON WITCH, the TREANT (the 2D game's "mothgirl",
// "Witch" and "Treant" events of Map 36; CE 61, the Holy Order's SORCERY job, CE 70) and the wandering PUMPKIN FIEND (CE 62).
// The first three are figures made from Anne's own model in colours of their own, like cast3.js's; all of them are fully
// dressed. The pumpkin is the camp's Mr. Pumpkin on a short vine (pumpkinhead.js).
//   the Moth Girl  after her map sprite: long pale lilac hair, magenta eyes, two feathery feelers, a white fluffy ruff, pale
//                  pink wings with an eye on each, a pale dress. She flutters.
//   the Witch      of the Black Moon Sorority: the tall hat, teal hair in two tails, a dusk-blue dress and cape, a crescent
//                  at her collar.
//   the Treant     a tree that walks like a woman: bark-brown skin, leaf-green hair, golden antlers, a dress of leaves, bark
//                  at her shoulders.
const V = new URL(import.meta.url).search;
const { createThief } = await import('./thief.js' + V);
const { pumpkinHead } = await import('./pumpkinhead.js' + V);
const { mul, rgb, NOHAT, lips, tubeOf, FACES3 } = await import('./cast3.js' + V);

// ---------- the Moth Girl ----------
const PALE = [0.66, 0.56, 0.62], ROSE = [0.60, 0.26, 0.48];
export const MOTH_LOOK = {
  name: 'Moth Girl', hide: [...NOHAT, 'Anne_Choker'], bare: true, hairStyle: 'long', parts: ['Anne_SkirtTube', 'Anne_SkirtTubeTrim'],
  sock: [...ROSE, 0.72], sockLow: 0.085, band: ROSE,
  iris: [[0.95, 0.22, 0.80], [0.42, 0.04, 0.36]],
  hair: { base: [0.46, 0.38, 0.48], right: [0.56, 0.47, 0.58], left: [0.56, 0.47, 0.58] },
  tint: {
    Anne_Skin: mul(1.0, 0.95, 0.97), Anne_SkinShod: mul(1.0, 0.95, 0.97), Anne_GlovePaint: rgb(...PALE, 0.7),
    Anne_Suit: rgb(...PALE, 0.8), Anne_Skirt: rgb(...PALE, 0.8), Anne_Trim: rgb(...ROSE, 0.6, 0), Anne_Glove: rgb(...PALE, 0.7),
    Anne_Nail: ROSE, Anne_Brow: [0.36, 0.28, 0.38],
  },
};
function dressMoth({ tw, THREE, onBone }) {
  const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
  const head = onBone('head');
  if (head) {
    lips(tw, THREE, head);
    const blade = new THREE.MeshStandardMaterial({ color: new THREE.Color(0.86, 0.62, 0.78), roughness: 0.8 });
    const rib = new THREE.MeshStandardMaterial({ color: new THREE.Color(0.62, 0.30, 0.52), roughness: 0.6 });
    for (const s of [1, -1]) {                         // her feelers: two long feathers, up and out from her crown
      const g = new THREE.Group(); g.position.set(s * 0.05, 1.68, 0.04); g.rotation.set(-0.3, 0, -s * 0.62); head.add(g);
      const m = new THREE.Mesh(new THREE.SphereGeometry(1, 14, 10), blade); m.scale.set(0.03, 0.125, 0.008); m.position.y = 0.12; m.castShadow = true; g.add(m);
      g.add(tubeOf(THREE, [V3(0, 0, 0), V3(0, 0.12, 0.009), V3(0, 0.24, 0)], 0.005, 0.002, rib, 8));
    }
  }
  const chest = onBone('spine01');
  if (chest) {
    // her ruff: two rings of white fluff round her neck
    const fluff = new THREE.MeshStandardMaterial({ color: new THREE.Color(0.82, 0.80, 0.82), roughness: 1 });
    for (const [n, rx, rz, y, r] of [[15, 0.105, 0.095, 1.405, 0.036], [11, 0.078, 0.07, 1.44, 0.03]]) for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2, b = new THREE.Mesh(new THREE.SphereGeometry(r, 9, 7), fluff);
      b.position.set(Math.sin(a) * rx, y + 0.006 * Math.sin(a * 3), Math.cos(a) * rz + 0.006); b.castShadow = true; chest.add(b);
    }
    // her wings: two pairs, each hinged at her shoulder blade, an eye on each (the pivots are beaten by tick)
    const skin = new THREE.MeshStandardMaterial({ color: new THREE.Color(0.80, 0.56, 0.70), roughness: 0.75, side: THREE.DoubleSide });
    const eye = new THREE.MeshStandardMaterial({ color: new THREE.Color(0.46, 0.10, 0.34), roughness: 0.7, side: THREE.DoubleSide });
    const dot = new THREE.MeshStandardMaterial({ color: new THREE.Color(0.92, 0.84, 0.88), roughness: 0.7, side: THREE.DoubleSide });
    const wing = (len, wid) => { const sh = new THREE.Shape(); sh.moveTo(0, 0); sh.bezierCurveTo(len * 0.2, wid * 1.1, len * 0.8, wid * 1.15, len, wid * 0.45); sh.bezierCurveTo(len * 1.02, -wid * 0.1, len * 0.45, -wid * 0.7, 0, 0); return new THREE.ShapeGeometry(sh, 16); };
    tw.wings = [];
    for (const s of [1, -1]) for (const [k, len, wid, up] of [[0, 0.60, 0.30, 0.62], [1, 0.42, 0.24, -0.22]]) {
      const pivot = new THREE.Group(); pivot.position.set(s * 0.05, 1.345 - k * 0.06, -0.105); chest.add(pivot);
      const g = new THREE.Group(); g.rotation.set(0, s > 0 ? -0.45 : Math.PI + 0.45, up * (s > 0 ? 1 : -1)); pivot.add(g);
      const m = new THREE.Mesh(wing(len, wid), skin); m.castShadow = true; g.add(m);
      for (const z of [0.002, -0.002]) {
        const c = new THREE.Mesh(new THREE.CircleGeometry(wid * 0.26, 18), eye); c.position.set(len * 0.62, wid * 0.32, z); g.add(c);
        const d = new THREE.Mesh(new THREE.CircleGeometry(wid * 0.11, 14), dot); d.position.set(len * 0.62, wid * 0.32, z * 2); g.add(d);
      }
      tw.wings.push({ pivot, s, k });
    }
  }
}
// hover(h): how high she flutters (0: on her feet); buzz(k): how hard her wings beat
export function createMoth(S, C, o = {}) {
  const L = { buzz: 1, hover: 0, base: 0 };
  const fig = createThief(S, C, Object.assign({ look: MOTH_LOOK, dress: dressMoth, idle: 'IdleBare', bare: true, wrist: 0.7, twist: 0.6, tick(tw, dt, t) {
    if (tw.wings) for (const w of tw.wings) { const a = t * 11 + w.k * 0.8; w.pivot.rotation.set(0, w.s * 0.1 * Math.sin(a * 0.5) * L.buzz, w.s * (0.12 + 0.34 * Math.sin(a) * L.buzz)); }
    if (L.hover) tw.obj.position.y = L.base + L.hover * (0.28 + 0.06 * Math.sin(t * 3.4));
  } }, o));
  fig.hover = (h, base = 0) => { L.hover = h; L.base = base; if (!h && fig.obj) fig.obj.position.y = base; };
  fig.buzz = (k) => { L.buzz = k; };
  return fig;
}

// ---------- the Witch ----------
const DUSK = [0.075, 0.13, 0.30], DEEP = [0.03, 0.05, 0.13], SILVER = rgb(0.62, 0.62, 0.70, 0.3, 0.7);
export const WITCH_LOOK = {
  name: 'Witch', hide: ['Anne_Choker'], hairStyle: 'twintails', parts: ['Anne_Cape', 'Anne_CapeTrim', 'Anne_SkirtPencil', 'Anne_SkirtPencilTrim', 'Anne_Belt'],
  sock: [...DEEP, 0.85], band: DEEP, sleeve: [...DUSK, 0.95],
  iris: [[0.30, 0.86, 0.78], [0.04, 0.34, 0.32]],
  hair: { base: [0.06, 0.26, 0.26], right: [0.09, 0.34, 0.33], left: [0.09, 0.34, 0.33] },
  tint: {
    Anne_Suit: rgb(...DUSK, 0.6), Anne_Skirt: rgb(...DUSK, 0.6), Anne_Trim: SILVER, Anne_Cape: rgb(...DEEP, 0.7), Anne_Belt: SILVER, Anne_Buckle: SILVER,
    Anne_Hat: rgb(...DUSK, 0.65), Anne_HatBand: rgb(...DEEP, 0.5), Anne_Cuffs: rgb(...DUSK, 0.6), Anne_CuffTrim: SILVER, Anne_GlovePaint: rgb(...DUSK, 0.6),
    Anne_HeelPurple: rgb(...DEEP, 0.4, 0.1), Anne_HeelSole: [0.03, 0.03, 0.05], Anne_Nail: DUSK, Anne_Brow: [0.05, 0.2, 0.2],
  },
};
function dressWitch({ tw, THREE, onBone }) {
  const head = onBone('head'); if (head) lips(tw, THREE, head);
  // the Sorority's crescent, at her collar (carried by her chest)
  const chest = onBone('spine01');
  if (chest) {
    const m = new THREE.Mesh(new THREE.TorusGeometry(0.03, 0.007, 8, 22, Math.PI * 1.35), new THREE.MeshStandardMaterial({ color: new THREE.Color(0.8, 0.8, 0.9), roughness: 0.3, metalness: 0.7, emissive: new THREE.Color(0.12, 0.1, 0.25) }));
    m.position.set(0, 1.385, 0.125); m.rotation.set(-0.1, 0, 2.2); chest.add(m);
  }
}
export const createWitch = (S, C, o = {}) => createThief(S, C, Object.assign({ look: WITCH_LOOK, dress: dressWitch, idle: 'Idle', wrist: 0.7, twist: 0.6 }, o));

// ---------- the Treant ----------
export const TREANT_LOOK = {
  name: 'Treant', hide: [...NOHAT, 'Anne_Choker'], bare: true, hairStyle: 'wavy', parts: ['Anne_Tutu', 'Anne_TutuTrim', 'Anne_Panels', 'Anne_PanelsTrim'],
  iris: [[0.72, 0.16, 0.14], [0.26, 0.04, 0.03]],
  hair: { base: [0.14, 0.40, 0.14], right: [0.26, 0.52, 0.20], left: [0.26, 0.52, 0.20] },
  band: [0.20, 0.12, 0.05],
  tint: {
    Anne_Skin: mul(0.66, 0.50, 0.36), Anne_SkinShod: mul(0.66, 0.50, 0.36), Anne_GlovePaint: mul(0.66, 0.50, 0.36, 0.6),
    Anne_Suit: rgb(0.09, 0.22, 0.06, 0.75), Anne_Trim: rgb(0.30, 0.20, 0.06, 0.8, 0), Anne_Skirt: rgb(0.12, 0.30, 0.08, 0.8),
    Anne_Nail: [0.20, 0.12, 0.05], Anne_Brow: [0.12, 0.30, 0.10],
  },
};
function dressTreant({ tw, THREE, onBone }) {
  const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
  const head = onBone('head');
  if (head) {
    lips(tw, THREE, head);
    const gold = new THREE.MeshStandardMaterial({ color: new THREE.Color(0.66, 0.50, 0.14), roughness: 0.55 });
    for (const s of [1, -1]) {                         // antlers, wider than the dryad's: a main beam out and up, three tines
      head.add(tubeOf(THREE, [V3(s * 0.05, 1.668, 0.02), V3(s * 0.12, 1.735, 0.0), V3(s * 0.20, 1.785, -0.02), V3(s * 0.27, 1.86, -0.03)], 0.016, 0.004, gold));
      head.add(tubeOf(THREE, [V3(s * 0.11, 1.73, 0.0), V3(s * 0.10, 1.80, 0.03), V3(s * 0.115, 1.85, 0.045)], 0.009, 0.003, gold, 8));
      head.add(tubeOf(THREE, [V3(s * 0.17, 1.77, -0.012), V3(s * 0.175, 1.835, 0.0), V3(s * 0.195, 1.885, 0.01)], 0.008, 0.003, gold, 8));
      head.add(tubeOf(THREE, [V3(s * 0.22, 1.80, -0.022), V3(s * 0.28, 1.80, -0.01), V3(s * 0.33, 1.825, 0.0)], 0.007, 0.0025, gold, 8));
    }
  }
  const chest = onBone('spine01');
  if (chest) {
    const bark = new THREE.MeshStandardMaterial({ color: new THREE.Color(0.20, 0.12, 0.055), roughness: 0.95 });
    const leaf = new THREE.MeshStandardMaterial({ color: new THREE.Color(0.14, 0.34, 0.09), roughness: 0.8, side: THREE.DoubleSide });
    for (const s of [1, -1]) {                         // bark at her shoulders, each plate over the last
      for (let i = 0; i < 3; i++) { const p = new THREE.Mesh(new THREE.SphereGeometry(1, 10, 8), bark); p.scale.set(0.07 - i * 0.008, 0.035, 0.075 - i * 0.008); p.position.set(s * (0.13 + i * 0.03), 1.41 - i * 0.022, -0.005); p.rotation.z = -s * (0.25 + i * 0.25); p.castShadow = true; chest.add(p); }
    }
    for (let i = 0; i < 13; i++) { const a = (i / 13) * Math.PI * 2, l = new THREE.Mesh(new THREE.SphereGeometry(0.034, 8, 6), leaf); l.scale.set(0.55, 1, 0.16); l.position.set(Math.sin(a) * 0.085, 1.41 + 0.012 * Math.sin(a * 2), Math.cos(a) * 0.08); l.rotation.set(0.5, a, 0); l.castShadow = true; chest.add(l); }
  }
}
export const createTreant = (S, C, o = {}) => createThief(S, C, Object.assign({ look: TREANT_LOOK, dress: dressTreant, idle: 'IdleBare', bare: true, wrist: 0.7, twist: 0.6 }, o));

// ---------- the Pumpkin Fiend ----------
// Not a figure: his carved head on a short vine that trails along the ground behind him. He answers what a pack (creatures2.js)
// asks of a figure, the bones and clips he does not have doing nothing. o.vine: a vine of captures.js's (kit.makeVine).
export function createPumpkin(S, C, o = {}) {
  const { THREE, scene } = S, h = pumpkinHead({ THREE, scene, K: C.K }, 0.26), obj = new THREE.Group(), vine = o.vine, UP = new THREE.Vector3(0, 1, 0);
  const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3(), d = new THREE.Vector3(), f = new THREE.Vector3();
  scene.remove(h.g); obj.add(h.g); obj.visible = false; scene.add(obj); h.glowTo = 1;
  const none = { to() {}, hold() {} };
  const fig = { obj, made: true, kind: 'pumpkin',
    show(at, yaw) { obj.position.copy(at); obj.rotation.y = yaw; obj.visible = true; }, hide() { obj.visible = false; if (vine) vine.hide(); }, off() { if (vine) vine.hide(); },
    face(y) { obj.rotation.y = y; }, expr(e) { h.glowTo = e === 'worried' || e === 'shocked' ? 0.25 : 1; }, clip() {}, follow() {}, target() {}, talk() {}, lean() {}, arm: () => none,
    head(out) { return h.g.getWorldPosition(out); }, tw: null,
    update(dt, t) {
      h.glow += (h.glowTo - h.glow) * Math.min(1, dt * 5); h.glowMat.color.copy(h.OFF).lerp(h.ON, h.glow * (0.86 + 0.14 * Math.sin(t * 7.3)));
      h.g.position.y = h.R * h.SQ * 0.95 + 0.07 * Math.abs(Math.sin(t * 6.5)); h.g.rotation.z = 0.08 * Math.sin(t * 3.25);
      if (!vine) return;
      obj.updateMatrixWorld(true); h.top(d); f.set(Math.sin(obj.rotation.y), 0, Math.cos(obj.rotation.y));
      a.copy(obj.position).addScaledVector(f, -0.95).setY(0.03); b.copy(obj.position).addScaledVector(f, -0.62).setY(0.05); c.copy(d).addScaledVector(f, -0.22); c.y += 0.12;
      vine.draw(a, b, c, d, UP, 0.05, 0.03);
    } };
  return fig;
}

// the faces of their portraits (faces/moth.png, faces/witch.png, faces/treant.png; by index) -> an expression of the model's
export const FACES4 = {
  mo: { 0: 'smug', 1: 'happy', 2: 'laugh', 3: 'neutral', 4: 'worried', 5: 'surprised', 6: 'smile', 7: 'shocked' },
  wi: { 0: 'neutral', 1: 'smug', 2: 'happy', 3: 'laugh', 4: 'worried', 5: 'surprised', 6: 'smile', 7: 'shocked' },
  tr: { 0: 'neutral', 1: 'smile', 2: 'smug', 3: 'laugh', 4: 'worried', 5: 'surprised', 6: 'happy', 7: 'shocked' },
};
Object.assign(FACES3, FACES4);
