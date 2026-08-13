"use client";

import { type CSSProperties, type KeyboardEvent, type MouseEvent, type PointerEvent, useEffect, useRef, useState } from "react";

const tiles = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l"];
const voxels = [
  [-520, -178, 30, -80, 0], [-454, 74, 22, -42, 45], [-402, -48, 44, -95, 90], [-348, 166, 28, -20, 135],
  [-312, -218, 24, -66, 180], [-254, 96, 38, -48, 225], [-202, -82, 20, -105, 270], [-148, 190, 24, -36, 315],
  [-116, -170, 36, -72, 360], [-64, 112, 18, -26, 405], [8, -238, 24, -86, 450], [48, 168, 32, -54, 495],
  [98, -112, 18, -118, 540], [146, 102, 26, -30, 585], [198, -198, 42, -62, 630], [246, 194, 20, -104, 675],
  [286, -42, 36, -40, 720], [336, 118, 24, -88, 765], [378, -164, 28, -18, 810], [426, 54, 46, -72, 855],
  [482, -92, 20, -110, 900], [526, 152, 30, -44, 945], [-474, 184, 18, -96, 990], [-362, -132, 16, -34, 1035],
  [-182, 28, 28, -76, 1080], [176, 18, 22, -48, 1125], [314, 202, 16, -92, 1170], [468, -208, 24, -28, 1215],
  [-124, -58, 34, -64, 1260], [390, 224, 20, -116, 1305],
] as const;

type DragState = {
  pointerId: number;
  clientX: number;
  clientY: number;
  x: number;
  y: number;
  left: number;
  top: number;
  viewX: number;
  viewY: number;
  moved: boolean;
  wasDispersed: boolean;
};

type IntroStage = "scatter" | "gather" | "synthesize" | "done";
type InteractionStage = "idle" | "fracture" | "launch" | "gather" | "synthesize";

export default function HomeHeroField() {
  const [dispersed, setDispersed] = useState(false);
  const [introStage, setIntroStage] = useState<IntroStage>("scatter");
  const [interactionStage, setInteractionStage] = useState<InteractionStage>("idle");
  const fieldRef = useRef<HTMLDivElement>(null);
  const blockRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState | null>(null);
  const dispersedRef = useRef(false);
  const interactionStageRef = useRef<InteractionStage>("idle");
  const motionTimersRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);

  useEffect(() => () => {
    motionTimersRef.current.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    const gatherTimer = setTimeout(() => setIntroStage("gather"), 520);
    const synthesizeTimer = setTimeout(() => setIntroStage("synthesize"), 2080);
    const completeTimer = setTimeout(() => setIntroStage("done"), 2920);
    return () => {
      clearTimeout(gatherTimer);
      clearTimeout(synthesizeTimer);
      clearTimeout(completeTimer);
    };
  }, []);

  const setDispersedState = (value: boolean) => {
    dispersedRef.current = value;
    setDispersed(value);
  };

  const setInteractionState = (value: InteractionStage) => {
    interactionStageRef.current = value;
    setInteractionStage(value);
  };

  const clearMotionTimers = () => {
    motionTimersRef.current.forEach(clearTimeout);
    motionTimersRef.current = [];
  };

  const startDisperse = () => {
    if (dispersedRef.current || interactionStageRef.current !== "idle" || introStage !== "done") return;
    clearMotionTimers();
    setInteractionState("fracture");
    motionTimersRef.current = [
      setTimeout(() => {
        setDispersedState(true);
        setInteractionState("launch");
      }, 1080),
      setTimeout(() => setInteractionState("idle"), 4280),
    ];
  };

  const collectVoxels = () => {
    if (!dispersedRef.current || interactionStageRef.current !== "idle") return;
    clearMotionTimers();
    setDispersedState(false);
    setInteractionState("gather");
    motionTimersRef.current = [
      setTimeout(() => setInteractionState("synthesize"), 1500),
      setTimeout(() => setInteractionState("idle"), 2340),
    ];
  };

  const setPosition = (x: number, y: number) => {
    const block = blockRef.current;
    if (!block) return;
    block.dataset.dragX = String(x);
    block.dataset.dragY = String(y);
    block.style.setProperty("--drag-x", `${x}px`);
    block.style.setProperty("--drag-y", `${y}px`);
  };

  const setView = (x: number, y: number) => {
    const block = blockRef.current;
    if (!block) return;
    block.dataset.viewX = String(x);
    block.dataset.viewY = String(y);
    block.style.setProperty("--view-x", `${x}deg`);
    block.style.setProperty("--view-y", `${y}deg`);
  };

  const clampPosition = (x: number, y: number) => {
    const field = fieldRef.current;
    const block = blockRef.current;
    if (!field || !block) return { x, y };
    const fieldRect = field.getBoundingClientRect();
    const blockRect = block.getBoundingClientRect();
    const currentX = Number(block.dataset.dragX ?? 0);
    const currentY = Number(block.dataset.dragY ?? 0);
    const baseLeft = blockRect.left - currentX;
    const baseTop = blockRect.top - currentY;
    const margin = 16;
    return {
      x: Math.min(Math.max(x, fieldRect.left + margin - baseLeft), fieldRect.right - margin - blockRect.width - baseLeft),
      y: Math.min(Math.max(y, fieldRect.top + margin - baseTop), fieldRect.bottom - margin - blockRect.height - baseTop),
    };
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    const block = blockRef.current;
    if (!block || introStage !== "done") return;
    event.preventDefault();
    const rect = block.getBoundingClientRect();
    dragRef.current = {
      pointerId: event.pointerId,
      clientX: event.clientX,
      clientY: event.clientY,
      x: Number(block.dataset.dragX ?? 0),
      y: Number(block.dataset.dragY ?? 0),
      left: rect.left,
      top: rect.top,
      viewX: Number(block.dataset.viewX ?? 0),
      viewY: Number(block.dataset.viewY ?? 0),
      moved: false,
      wasDispersed: dispersedRef.current,
    };
    block.setPointerCapture(event.pointerId);
    block.classList.add("is-dragging", "is-pressing");
    if (!dispersedRef.current) startDisperse();
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    const field = fieldRef.current;
    const block = blockRef.current;
    if (!drag || !field || !block || drag.pointerId !== event.pointerId || interactionStageRef.current !== "idle") return;
    const deltaX = event.clientX - drag.clientX;
    const deltaY = event.clientY - drag.clientY;
    if (Math.hypot(deltaX, deltaY) > 6) {
      drag.moved = true;
    }

    if (dispersedRef.current) {
      setView(
        Math.min(20, Math.max(-20, drag.viewX - deltaY * .09)),
        Math.min(24, Math.max(-24, drag.viewY + deltaX * .1)),
      );
      return;
    }

    const fieldRect = field.getBoundingClientRect();
    const blockRect = block.getBoundingClientRect();
    const margin = 16;
    const desiredLeft = drag.left + deltaX;
    const desiredTop = drag.top + deltaY;
    const clampedLeft = Math.min(Math.max(desiredLeft, fieldRect.left + margin), fieldRect.right - blockRect.width - margin);
    const clampedTop = Math.min(Math.max(desiredTop, fieldRect.top + margin), fieldRect.bottom - blockRect.height - margin);
    setPosition(drag.x + clampedLeft - drag.left, drag.y + clampedTop - drag.top);
  };

  const finishPress = (event: PointerEvent<HTMLDivElement>) => {
    const block = blockRef.current;
    const drag = dragRef.current;
    if (block?.hasPointerCapture(event.pointerId)) block.releasePointerCapture(event.pointerId);
    block?.classList.remove("is-dragging", "is-pressing");
    dragRef.current = null;
    if (drag && !drag.moved && drag.wasDispersed) collectVoxels();
  };

  const losePointer = () => {
    blockRef.current?.classList.remove("is-dragging", "is-pressing");
    dragRef.current = null;
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const block = blockRef.current;
    if (!block || introStage !== "done") return;
    const step = event.shiftKey ? 24 : 12;
    const x = Number(block.dataset.dragX ?? 0);
    const y = Number(block.dataset.dragY ?? 0);
    if (event.key === "Home") {
      event.preventDefault();
      setPosition(0, 0);
      setView(0, 0);
      collectVoxels();
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (!event.repeat) {
        if (dispersedRef.current) collectVoxels();
        else startDisperse();
      }
      return;
    }
    const delta = {
      ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step],
    }[event.key];
    if (!delta) return;
    event.preventDefault();
    if (dispersed) {
      const viewX = Number(block.dataset.viewX ?? 0);
      const viewY = Number(block.dataset.viewY ?? 0);
      setView(
        Math.min(20, Math.max(-20, viewX + delta[1] * .3)),
        Math.min(24, Math.max(-24, viewY + delta[0] * .3)),
      );
      return;
    }
    const next = clampPosition(x + delta[0], y + delta[1]);
    setPosition(next.x, next.y);
  };

  const handleFieldClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget && dispersedRef.current) collectVoxels();
  };

  return (
    <div ref={fieldRef} className="home-hero-field" aria-hidden="false" onClick={handleFieldClick}>
      <div className="home-hero-field__halo" aria-hidden="true" />
      <div className="home-hero-field__wave home-hero-field__wave--one" aria-hidden="true" />
      <div className="home-hero-field__wave home-hero-field__wave--two" aria-hidden="true" />
      {tiles.map((tile) => <span key={tile} className={`hero-field__tile hero-field__tile--${tile}`} aria-hidden="true" />)}
      <div
        ref={blockRef}
        className={`home-hero-field__draggable${dispersed ? " is-dispersed" : ""}${interactionStage !== "idle" ? ` is-motion is-${interactionStage}` : ""}${introStage !== "done" ? ` is-intro is-intro-${introStage}` : ""}`}
        role="button"
        tabIndex={0}
        aria-pressed={dispersed}
        aria-label="溥源知识源立方体，点击分解或聚合，分解后拖动可改变观察角度"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishPress}
        onPointerCancel={finishPress}
        onLostPointerCapture={losePointer}
        onKeyDown={handleKeyDown}
      >
        <div className="home-hero-voxels" aria-hidden="true">
          {voxels.map(([x, y, size, depth, delay], index) => {
            const assemblyX = (index % 5 - 2) * 32;
            const assemblyY = (Math.floor(index / 5) % 3 - 1) * 32;
            const assemblyZ = (Math.floor(index / 15) - .5) * 32;
            return (
              <span
                className="home-hero-voxel"
                key={index}
                style={{
                  "--voxel-x": `${x}px`, "--voxel-y": `${y}px`, "--voxel-size": `${size}px`,
                  "--voxel-depth": `${depth}px`, "--voxel-half": `${size / 2}px`, "--voxel-delay": `${delay * .25}ms`,
                  "--assembly-x": `${assemblyX}px`, "--assembly-y": `${assemblyY}px`, "--assembly-z": `${assemblyZ}px`,
                  "--assembly-scale": `${32 / size}`,
                  "--assembly-end-scale": `${(32 / size) * .76}`,
                  "--voxel-spin-x-mid": `${70 + (index % 4) * 34}deg`,
                  "--voxel-spin-y-mid": `${120 + (index % 5) * 72}deg`,
                  "--voxel-spin-z-mid": `${(index % 3 - 1) * 68}deg`,
                  "--voxel-spin-x-end": `${140 + (index % 4) * 55}deg`,
                  "--voxel-spin-y-end": `${260 + (index % 5) * 105}deg`,
                  "--voxel-spin-z-end": `${(index % 3 - 1) * 136}deg`,
                } as CSSProperties}
              >
                <i><b /><b /><b /><b /><b /><b /></i>
              </span>
            );
          })}
        </div>
        <div className="home-hero-field__core" aria-hidden="true">
          <div className="home-hero-cube">
            <span className="home-hero-cube__face home-hero-cube__face--front"><i className="home-hero-cube__energy" /><b>溥源科技</b></span>
            <span className="home-hero-cube__face home-hero-cube__face--back" />
            <span className="home-hero-cube__face home-hero-cube__face--right"><i className="home-hero-cube__energy" /></span>
            <span className="home-hero-cube__face home-hero-cube__face--left" />
            <span className="home-hero-cube__face home-hero-cube__face--top" />
            <span className="home-hero-cube__face home-hero-cube__face--bottom" />
          </div>
        </div>
      </div>
    </div>
  );
}
