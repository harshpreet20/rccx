'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

// Geometric badminton player frozen in mid-smash jump
// All parts in local space, merged into one draw call
function buildPlayerGeometry(): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];

  const applyMatrix = (geo: THREE.BufferGeometry, mat: THREE.Matrix4) => {
    geo.applyMatrix4(mat);
    return geo;
  };

  const T = (x: number, y: number, z: number) =>
    new THREE.Matrix4().makeTranslation(x, y, z);
  const R = (axis: 'x' | 'y' | 'z', angle: number) => {
    const m = new THREE.Matrix4();
    if (axis === 'x') m.makeRotationX(angle);
    if (axis === 'y') m.makeRotationY(angle);
    if (axis === 'z') m.makeRotationZ(angle);
    return m;
  };

  // Torso
  const torso = new THREE.BoxGeometry(0.7, 1.2, 0.35);
  parts.push(applyMatrix(torso, T(0, 1.5, 0)));

  // Head
  const head = new THREE.SphereGeometry(0.26, 8, 6);
  parts.push(applyMatrix(head, T(0.1, 2.55, 0)));

  // Right upper arm — raised overhead for smash
  const rUpperArm = new THREE.BoxGeometry(0.22, 0.7, 0.2);
  const rUpperMat = T(0.55, 2.1, 0).multiply(R('z', -Math.PI * 0.65));
  parts.push(applyMatrix(rUpperArm, rUpperMat));

  // Right lower arm — fully extended up
  const rLowerArm = new THREE.BoxGeometry(0.18, 0.65, 0.18);
  const rLowerMat = T(0.85, 2.7, 0).multiply(R('z', -Math.PI * 0.85));
  parts.push(applyMatrix(rLowerArm, rLowerMat));

  // Right hand/grip
  const grip = new THREE.BoxGeometry(0.12, 0.12, 0.12);
  parts.push(applyMatrix(grip, T(1.05, 3.3, 0)));

  // Racquet shaft
  const shaft = new THREE.CylinderGeometry(0.025, 0.025, 0.7, 6);
  const shaftMat = T(1.2, 3.65, 0).multiply(R('z', -0.2));
  parts.push(applyMatrix(shaft, shaftMat));

  // Racquet head — oval-ish box
  const racquetHead = new THREE.BoxGeometry(0.5, 0.55, 0.04);
  const racquetMat = T(1.25, 4.1, 0).multiply(R('z', -0.15));
  parts.push(applyMatrix(racquetHead, racquetMat));

  // Left arm — outstretched for balance
  const lUpperArm = new THREE.BoxGeometry(0.22, 0.65, 0.2);
  const lUpperMat = T(-0.55, 1.9, 0).multiply(R('z', Math.PI * 0.35));
  parts.push(applyMatrix(lUpperArm, lUpperMat));

  const lLowerArm = new THREE.BoxGeometry(0.18, 0.55, 0.18);
  const lLowerMat = T(-0.85, 1.55, 0).multiply(R('z', Math.PI * 0.55));
  parts.push(applyMatrix(lLowerArm, lLowerMat));

  // Right leg — lunge forward
  const rThigh = new THREE.BoxGeometry(0.3, 0.85, 0.3);
  const rThighMat = T(0.22, 0.55, 0.2).multiply(R('x', 0.35));
  parts.push(applyMatrix(rThigh, rThighMat));

  const rShin = new THREE.BoxGeometry(0.26, 0.7, 0.26);
  const rShinMat = T(0.22, -0.1, 0.45).multiply(R('x', -0.3));
  parts.push(applyMatrix(rShin, rShinMat));

  // Left leg — push-off
  const lThigh = new THREE.BoxGeometry(0.3, 0.85, 0.3);
  const lThighMat = T(-0.22, 0.45, -0.3).multiply(R('x', -0.45));
  parts.push(applyMatrix(lThigh, lThighMat));

  const lShin = new THREE.BoxGeometry(0.26, 0.75, 0.26);
  const lShinMat = T(-0.22, -0.15, -0.55).multiply(R('x', 0.4));
  parts.push(applyMatrix(lShin, lShinMat));

  const merged = mergeGeometries(parts);
  return merged;
}

export default function PlayerSilhouette() {
  const geo = useMemo(() => buildPlayerGeometry(), []);

  return (
    <mesh
      geometry={geo}
      position={[-5, 0.5, -3]}
      rotation={[0, 0.3, 0]}
      castShadow
    >
      <meshStandardMaterial
        color={0x0a1628}
        roughness={0.4}
        metalness={0.2}
        envMapIntensity={0.5}
      />
    </mesh>
  );
}
