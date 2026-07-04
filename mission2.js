// ── MISSION 2 — PLANET ASSAULT (Waves 11–20) ──
// Same wave shape as Mission 1's SPACE_LEVELS in index.html, fighter counts doubled.
window.MISSION2_LEVELS = [
  { fighters:6,  maxAttackers:1, hitsToKill:1, attackSpeed:[420,520]  },
  { fighters:8,  maxAttackers:1, hitsToKill:1, attackSpeed:[480,600]  },
  { fighters:10, maxAttackers:1, hitsToKill:1, attackSpeed:[540,680]  },
  { fighters:12, maxAttackers:1, hitsToKill:2, attackSpeed:[580,720]  },
  { fighters:12, maxAttackers:2, hitsToKill:2, attackSpeed:[620,760]  },
  { fighters:14, maxAttackers:2, hitsToKill:2, attackSpeed:[660,800]  },
  { fighters:16, maxAttackers:2, hitsToKill:3, attackSpeed:[700,850]  },
  { fighters:16, maxAttackers:3, hitsToKill:3, attackSpeed:[740,900]  },
  { fighters:20, maxAttackers:3, hitsToKill:3, attackSpeed:[780,950]  },
  { fighters:24, maxAttackers:4, hitsToKill:4, attackSpeed:[820,1000] },
];

// The alien planet — 20000 units out from the Ironclad (world origin).
window.MISSION2_PLANET_POS = { x: 120000, y: 0, z: 0 };

// Builds the planet group. Called once THREE is loaded; caller positions it and adds it to the scene.
window.buildMission2Planet = function () {
  const g = new THREE.Group();

  const bodyMat = new THREE.MeshStandardMaterial({ color: 0xaa5533, roughness: 0.95, metalness: 0.05 });
  const body = new THREE.Mesh(new THREE.SphereGeometry(36000, 40, 40), bodyMat);
  g.add(body);

  // Mottled surface detail — a few darker patches
  const patchMat = new THREE.MeshStandardMaterial({ color: 0x7a3f28, roughness: 1 });
  for (let i = 0; i < 10; i++) {
    const a = Math.random() * Math.PI * 2, b = Math.random() * Math.PI;
    const patch = new THREE.Mesh(new THREE.SphereGeometry(3600 + Math.random() * 4400, 10, 10), patchMat);
    patch.position.set(
      36000 * Math.sin(b) * Math.cos(a),
      36000 * Math.cos(b),
      36000 * Math.sin(b) * Math.sin(a)
    );
    g.add(patch);
  }

  const atmoMat = new THREE.MeshBasicMaterial({ color: 0xff8855, transparent: true, opacity: 0.15, side: THREE.BackSide });
  const atmo = new THREE.Mesh(new THREE.SphereGeometry(39000, 32, 32), atmoMat);
  g.add(atmo);

  const light = new THREE.PointLight(0xffaa66, 1, 120000);
  g.add(light);

  g.name = 'mission2Planet';
  return g;
};