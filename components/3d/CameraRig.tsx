'use client';

import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useScrollContext } from '@/lib/scrollContext';

// Broadcast crane path — overhead drone → mid-court push → net level → reverse angle → wide pull-back
const CAM_PATH = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, 28, 0),      // 0%  — drone overhead, straight down
  new THREE.Vector3(0, 20, 10),     // 10% — crane tilting, court enters frame
  new THREE.Vector3(-2, 14, 18),    // 20% — classic broadcast angle, full court
  new THREE.Vector3(-3, 8, 14),     // 35% — following shuttle arc, pushing in
  new THREE.Vector3(2, 5, 8),       // 50% — net height, deception drop reveal
  new THREE.Vector3(-1, 7, 2),      // 60% — reverse angle through net
  new THREE.Vector3(0, 10, -6),     // 75% — pulling back, tournament section
  new THREE.Vector3(3, 12, -14),    // 90% — wide arena shot, community section
  new THREE.Vector3(0, 22, -20),    // 100% — full crane-out godview finale
]);

// Shuttle deception arc path (position 0-1 mapped to scroll 0-45%)
const SHUTTLE_PATH = new THREE.CatmullRomCurve3([
  new THREE.Vector3(-4, 2.5, -2),   // racquet contact
  new THREE.Vector3(-1, 5.5, 1),    // rising arc (looks like a smash)
  new THREE.Vector3(2, 4.8, 3),     // peak — deception moment
  new THREE.Vector3(4.5, 1.2, 5),   // drops suddenly — the drop shot
]);

// Look-at targets per scroll section
const LOOK_TARGETS = [
  new THREE.Vector3(0, 0, 0),       // 0% — court centre
  new THREE.Vector3(0, 1, 0),       // 20% — court centre
  new THREE.Vector3(2, 3, 4),       // 35% — following shuttle
  new THREE.Vector3(4, 1.5, 4),     // 50% — shuttle near net (deception)
  new THREE.Vector3(0, 1, 0),       // 65% — centre, about section
  new THREE.Vector3(0, 2, -2),      // 80% — bracket area
  new THREE.Vector3(0, 0, 0),       // 100% — back to court
];

interface CameraRigProps {
  shuttleGroupRef: React.MutableRefObject<THREE.Group | null>;
  introCompleteRef: React.MutableRefObject<boolean>;
  onDeceptionTrigger: () => void;
}

export default function CameraRig({ shuttleGroupRef, introCompleteRef, onDeceptionTrigger }: CameraRigProps) {
  const { camera } = useThree();
  const { scrollProgress } = useScrollContext();
  const smoothT = useRef(0);
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const deceptionTriggered = useRef(false);

  useEffect(() => {
    // Set initial camera position (overhead drone)
    camera.position.set(0, 28, 0);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  useFrame(() => {
    if (!introCompleteRef.current) return;

    const target = scrollProgress.current;
    // Smooth the t value — prevents jitter
    smoothT.current += (target - smoothT.current) * 0.055;
    const t = Math.max(0, Math.min(1, smoothT.current));

    // Camera position along crane path
    const camPos = CAM_PATH.getPoint(t);
    camera.position.lerp(camPos, 0.05);

    // Shuttle position — mapped to first 45% of scroll
    if (shuttleGroupRef.current) {
      const st = Math.min(t / 0.45, 1);
      const shuttlePos = SHUTTLE_PATH.getPoint(st);
      shuttleGroupRef.current.position.lerp(shuttlePos, 0.08);
    }

    // Deception trigger at ~30% scroll
    if (!deceptionTriggered.current && t > 0.28) {
      deceptionTriggered.current = true;
      onDeceptionTrigger();
    }

    // Look-at interpolation
    const lookIdx = t * (LOOK_TARGETS.length - 1);
    const lookFloor = Math.floor(lookIdx);
    const lookFrac = lookIdx - lookFloor;
    const fromLook = LOOK_TARGETS[Math.min(lookFloor, LOOK_TARGETS.length - 1)];
    const toLook = LOOK_TARGETS[Math.min(lookFloor + 1, LOOK_TARGETS.length - 1)];
    const lookTarget = fromLook.clone().lerp(toLook, lookFrac);
    currentLookAt.current.lerp(lookTarget, 0.05);
    camera.lookAt(currentLookAt.current);
  });

  return null;
}
