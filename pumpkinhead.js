// pumpkinhead.js (11-01): Mr. Pumpkin's head, moved out of traps.js so that the forests' wandering pumpkin fiends (cast4.js) can
// have it too: a ribbed pumpkin with a carved face that glows when he is awake. makeTongue is the camp's alone; without it, none.
export function pumpkinHead({ THREE, scene, K, makeTongue }, R = 0.21) {
  const PI = Math.PI, TAU = PI * 2, V3 = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z), hexC = (h) => new THREE.Color(h), col = K.col;
  const DK = [col(0.045, 0.075, 0.055), col(0.07, 0.105, 0.065), col(0.105, 0.135, 0.075)];
  const sst = (x, a, b) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
  const shadowy = (m) => { m.castShadow = true; m.receiveShadow = true; return m; };
  const g = new THREE.Group(), RIBS = 9, NU = RIBS * 8, NV = 20, SQ = 0.82;
  const groove = (u) => Math.abs(Math.cos((u + 0.5 / RIBS) * PI * RIBS)) ** 4;      // (a rib, not a groove, runs down the middle of his face)
  // the rind: u round it (0 = his face, +Z), v from the stalk (0) to underneath (1); k: how far off it
  const surf = (u, v, out, k = 1) => {
    const down = v * PI, sn = Math.sin(down), r = R * Math.pow(Math.max(0, sn), 0.75) * (1 - 0.13 * groove(u) * Math.pow(Math.max(0, sn), 0.3)) * (1 + 0.07 * (v - 0.5));
    const y = Math.cos(down) - 0.32 * Math.exp(-((down / 0.5) ** 2)) + 0.12 * Math.exp(-(((PI - down) / 0.45) ** 2));
    return out.set(Math.sin(u * TAU) * r * k, y * R * SQ * k, Math.cos(u * TAU) * r * k);
  };
  {
    const pos = [], colr = [], idx = [], P = V3(), c = new THREE.Color();
    const RIND = hexC('#c8650f'), LIGHT = hexC('#e08a1c'), GROOVE = hexC('#8f3d08'), PALE = hexC('#c99a3a');
    for (let j = 0; j <= NV; j++) for (let i = 0; i <= NU; i++) {
      const u = i / NU, v = j / NV; surf(u, v, P); pos.push(P.x, P.y, P.z);
      c.copy(RIND).lerp(LIGHT, 0.55 * sst(v, 0.55, 0.1)).lerp(GROOVE, 0.8 * groove(u) * sst(v, 0, 0.15)).lerp(PALE, 0.45 * sst(v, 0.72, 1)).lerp(GROOVE, 0.6 * sst(v, 0.09, 0));
      colr.push(c.r, c.g, c.b);
      if (i < NU && j < NV) { const a = j * (NU + 1) + i, b = a + NU + 1; idx.push(a, b, a + 1, a + 1, b, b + 1); }
    }
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); geo.setAttribute('color', new THREE.Float32BufferAttribute(colr, 3)); geo.setIndex(idx); geo.computeVertexNormals();
    g.add(shadowy(new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.5 }))));
  }
  // the face: each cut is drawn twice on the rind, a dark rim and, a little smaller and further out, the light inside.
  // A cut is a list of triangles in face co-ordinates [a, v]: a = the angle round from the middle of his face, v as above.
  const rim = new THREE.MeshBasicMaterial({ color: 0x241003 }), glowMat = new THREE.MeshBasicMaterial({ color: 0x241003 });
  const cuts = [];
  const eye = (sx) => [[[sx * 0.24, 0.445], [sx * 0.66, 0.385], [sx * 0.42, 0.285]]];
  cuts.push(eye(1), eye(-1), [[[-0.075, 0.535], [0.075, 0.535], [0, 0.455]]]);
  { const N = 28, top = (a) => 0.665 - 0.105 * (a / 0.82) ** 2, bot = (a) => 0.80 - 0.19 * (a / 0.82) ** 2, saw = (x) => Math.abs(((x % 1) + 1) % 1 - 0.5) * 2, m = [];      // a wide grin with teeth
    const T = (a) => top(a) + 0.034 * saw(a * 4.2 + 0.25) * (1 - (a / 0.82) ** 2), B = (a) => bot(a) - 0.034 * saw(a * 4.2 + 0.75) * (1 - (a / 0.82) ** 2);
    for (let i = 0; i < N; i++) { const a0 = -0.82 + 1.64 * i / N, a1 = -0.82 + 1.64 * (i + 1) / N; m.push([[a0, T(a0)], [a0, B(a0)], [a1, B(a1)]], [[a0, T(a0)], [a1, B(a1)], [a1, T(a1)]]); }
    cuts.push(m); }
  const build = (shrink, k, mat) => {
    const pos = [], P = V3();
    const put = (q) => { surf(q[0] / TAU, q[1], P, k); pos.push(P.x, P.y, P.z); };
    const tri = (p0, p1, p2, lv) => {
      if (lv === 0) { put(p0); put(p1); put(p2); return; }
      const m01 = [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2], m12 = [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2], m20 = [(p2[0] + p0[0]) / 2, (p2[1] + p0[1]) / 2];
      tri(p0, m01, m20, lv - 1); tri(m01, p1, m12, lv - 1); tri(m20, m12, p2, lv - 1); tri(m01, m12, m20, lv - 1);
    };
    for (const cut of cuts) {
      let ca = 0, cv = 0, n = 0; for (const t of cut) for (const q of t) { ca += q[0]; cv += q[1]; n++; } ca /= n; cv /= n;
      const sh = (q) => [ca + (q[0] - ca) * shrink, cv + (q[1] - cv) * shrink];
      for (const t of cut) tri(sh(t[0]), sh(t[1]), sh(t[2]), cut.length > 4 ? 1 : 2);
    }
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    const m = new THREE.Mesh(geo, mat); m.material.side = THREE.DoubleSide; g.add(m); return m;
  };
  build(1, 1.012, rim); build(0.8, 1.02, glowMat);
  // the stalk he hangs by
  g.add(new THREE.Mesh(K.tube([V3(0, R * SQ * 0.62, 0), V3(0, R * SQ * 0.95, -0.01), V3(0.01, R * SQ * 1.2, -0.05)], (t) => 0.03 * (1 - 0.45 * t), () => DK[1], 7, 6), K.MAT.plant));
  scene.add(g);
  const ON = new THREE.Color(1.7, 0.95, 0.22), OFF = new THREE.Color(0x241003);
  return { g, R, SQ, glowMat, glow: 0, glowTo: 0, gp: V3(), gq: new THREE.Quaternion(), snap: true, tongue: makeTongue ? makeTongue('#7436a8') : null, tk: 0, foot: 0, ON, OFF,
    mouth: (out) => g.localToWorld(out.set(0, -0.105, 0.165)), top: (out) => g.localToWorld(out.set(0.01, R * SQ * 1.2, -0.05)) };
}
