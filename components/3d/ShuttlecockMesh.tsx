'use client';

import { useRef, forwardRef, useImperativeHandle, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Ring buffer for motion trail
const TRAIL_LEN = 24;

export interface ShuttlecockHandles {
  groupRef: React.MutableRefObject<THREE.Group | null>;
}

const ShuttlecockMesh = forwardRef<ShuttlecockHandles>((_, ref) => {
  const groupRef = useRef<THREE.Group | null>(null);
  const trailRef = useRef<THREE.Mesh | null>(null);
  const trailPositions = useRef<THREE.Vector3[]>(
    Array.from({ length: TRAIL_LEN }, () => new THREE.Vector3(-4, 2.5, -2))
  );
  const trailGeoRef = useRef<THREE.BufferGeometry | null>(null);
  const idleT = useRef(0);
  const prevPos = useRef(new THREE.Vector3(-4, 2.5, -2));

  useImperativeHandle(ref, () => ({ groupRef }));

  // Procedural feather geometry — 16 fins around cone rim
  const featherGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const N = 16;
    const verts: number[] = [];
    const indices: number[] = [];

    for (let i = 0; i < N; i++) {
      const angle = (i / N) * Math.PI * 2;
      const rimR = 0.44;
      const rimY = 0.8; // cone top
      // Base on rim
      const bx = Math.cos(angle) * rimR;
      const bz = Math.sin(angle) * rimR;
      // Apex — flares outward and up
      const ax = Math.cos(angle) * 0.7;
      const ay = rimY + 0.55;
      const az = Math.sin(angle) * 0.7;
      // Side vertex for width
      const sAngle = angle + 0.18;
      const sx = Math.cos(sAngle) * 0.52;
      const sz = Math.sin(sAngle) * 0.52;
      const base = i * 3;
      verts.push(bx, rimY, bz, ax, ay, az, sx, rimY + 0.28, sz);
      indices.push(base, base + 1, base + 2);
    }

    geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    return geo;
  }, []);

  // Trail tube mesh — updated in useFrame
  const trailGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(TRAIL_LEN * 3);
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setDrawRange(0, 0);
    trailGeoRef.current = geo;
    return geo;
  }, []);

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;

    // Idle spin
    idleT.current += delta;
    group.rotation.y += delta * 6;

    // Update trail ring buffer
    const cur = group.position.clone();
    const moved = cur.distanceTo(prevPos.current) > 0.001;
    if (moved) {
      trailPositions.current.unshift(cur.clone());
      trailPositions.current.length = TRAIL_LEN;
      prevPos.current.copy(cur);
    }

    // Update trail geometry as a line strip
    const geo = trailGeoRef.current;
    if (geo) {
      const arr = geo.attributes.position.array as Float32Array;
      for (let i = 0; i < TRAIL_LEN; i++) {
        const p = trailPositions.current[i] ?? cur;
        arr[i * 3] = p.x;
        arr[i * 3 + 1] = p.y;
        arr[i * 3 + 2] = p.z;
      }
      geo.attributes.position.needsUpdate = true;
      geo.setDrawRange(0, moved ? TRAIL_LEN : 0);
    }
  });

  return (
    <group>
      {/* Motion trail — line strip */}
      <line>
        <bufferGeometry ref={trailGeoRef} />
        <lineBasicMaterial color={0xe2c97e} transparent opacity={0.45} linewidth={1} />
      </line>

      {/* Shuttlecock group — position driven by CameraRig */}
      <group ref={groupRef} position={[-4, 2.5, -2]}>
        {/* Cork base */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.18, 16, 12]} />
          <meshStandardMaterial color={0xf5f0e8} roughness={0.4} metalness={0.1} />
        </mesh>

        {/* Skirt cone */}
        <mesh position={[0, 0.4, 0]}>
          <coneGeometry args={[0.45, 0.8, 16, 1, true]} />
          <meshStandardMaterial
            color={0xffffff}
            transparent
            opacity={0.85}
            side={THREE.DoubleSide}
            roughness={0.3}
          />
        </mesh>

        {/* Feather fins */}
        <mesh geometry={featherGeo} position={[0, 0, 0]}>
          <meshStandardMaterial
            color={0xf5f0e8}
            side={THREE.DoubleSide}
            roughness={0.6}
            transparent
            opacity={0.9}
          />
        </mesh>
      </group>
    </group>
  );
});

ShuttlecockMesh.displayName = 'ShuttlecockMesh';
export default ShuttlecockMesh;
