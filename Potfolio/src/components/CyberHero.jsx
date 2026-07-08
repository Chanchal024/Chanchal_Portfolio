import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const CyberHero = () => {
	const canvasRef = useRef(null);

	useEffect(() => {
		if (!canvasRef.current) return;

		// scene & camera
		const scene = new THREE.Scene();
		const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
		camera.position.z = 1;

		// renderer
		const renderer = new THREE.WebGLRenderer({
			canvas: canvasRef.current,
			antialias: true,
			alpha: true, // Enable transparency for blending
		});
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.setClearColor(0x000000, 0); // Transparent background

		// Ajusta la cámara ortográfica al aspect ratio de la ventana
		const updateCamera = () => {
			const aspect = window.innerWidth / window.innerHeight;
			camera.left = -aspect;
			camera.right = aspect;
			camera.top = 1;
			camera.bottom = -1;
			camera.updateProjectionMatrix();
		};
		updateCamera();

		// Escala el plano para cubrir la pantalla (cover)
		const fitCover = (plane) => {
			const winAspect = window.innerWidth / window.innerHeight;
			if (winAspect >= 1) {
				plane.scale.set(winAspect, 1, 1);
			} else {
				plane.scale.set(1, 1 / winAspect, 1);
			}
		};

		// ---- MÁSCARA DE PINTURA (canvas) ----
		const MASK_SIZE = 1024;
		const maskCanvas = document.createElement("canvas");
		maskCanvas.width = MASK_SIZE;
		maskCanvas.height = MASK_SIZE;
		const maskCtx = maskCanvas.getContext("2d");
		maskCtx.fillStyle = "black";
		maskCtx.fillRect(0, 0, MASK_SIZE, MASK_SIZE);
		const maskTexture = new THREE.CanvasTexture(maskCanvas);
		maskTexture.flipY = false; // Fix: WebGL texImage3D/2D invalid operation

		const BRUSH_RADIUS = 120;
		const paintBrush = (x, y, dx = 0, dy = 0) => {
			const speed = Math.hypot(dx, dy);
			const angle = speed > 1 ? Math.atan2(dy, dx) : 0;
			const stretch = 1 + Math.min(speed / (BRUSH_RADIUS * 0.4), 3.0);

			maskCtx.save();
			maskCtx.translate(x, y);
			maskCtx.rotate(angle);
			maskCtx.scale(stretch, 1);

			const g = maskCtx.createRadialGradient(0, 0, 0, 0, 0, BRUSH_RADIUS);
			g.addColorStop(0, "rgba(255,255,255,1)");
			g.addColorStop(0.65, "rgba(255,255,255,0.9)");
			g.addColorStop(1, "rgba(255,255,255,0)");
			maskCtx.globalCompositeOperation = "source-over";
			maskCtx.fillStyle = g;
			maskCtx.beginPath();
			maskCtx.arc(0, 0, BRUSH_RADIUS, 0, Math.PI * 2);
			maskCtx.fill();
			maskCtx.restore();

			maskTexture.needsUpdate = true;
		};

		// Parallax suave con el mouse
		let mouseNormX = 0,
			mouseNormY = 0;
		let smoothX = 0,
			smoothY = 0,
			smoothZ = 0;

		let prevMouse = null;
		let lastMouseTime = performance.now();

		const raycaster = new THREE.Raycaster();
		const mouseVec = new THREE.Vector2();

		const handleMove = (clientX, clientY) => {
			lastMouseTime = performance.now();
			mouseNormX = (clientX / window.innerWidth - 0.5) * 2;
			mouseNormY = -(clientY / window.innerHeight - 0.5) * 2;

			// Raycasting to find exact position on the transformed plane
			mouseVec.x = mouseNormX;
			mouseVec.y = mouseNormY;
			raycaster.setFromCamera(mouseVec, camera);
			const intersects = raycaster.intersectObject(plane2);

			if (intersects.length > 0) {
				const uv = intersects[0].uv;
				const cx = uv.x * MASK_SIZE;
				const cy = uv.y * MASK_SIZE;

				if (prevMouse) {
					const dx = cx - prevMouse.x;
					const dy = cy - prevMouse.y;
					const steps = Math.max(1, Math.floor(Math.hypot(dx, dy) / (BRUSH_RADIUS * 0.25)));
					for (let i = 0; i <= steps; i++) {
						paintBrush(prevMouse.x + (dx * i) / steps, prevMouse.y + (dy * i) / steps, dx, dy);
					}
				} else {
					paintBrush(cx, cy);
				}
				prevMouse = { x: cx, y: cy };
			}
		};

		const onMouseMove = (e) => handleMove(e.clientX, e.clientY);
		const onMouseLeave = () => {
			prevMouse = null;
		};

		const onTouchStart = (e) => {
			e.preventDefault();
			prevMouse = null;
			handleMove(e.touches[0].clientX, e.touches[0].clientY);
		};
		const onTouchMove = (e) => {
			e.preventDefault();
			handleMove(e.touches[0].clientX, e.touches[0].clientY);
		};
		const onTouchEnd = () => {
			prevMouse = null;
		};

		window.addEventListener("mousemove", onMouseMove);
		window.addEventListener("mouseleave", onMouseLeave);
		window.addEventListener("touchstart", onTouchStart, { passive: false });
		window.addEventListener("touchmove", onTouchMove, { passive: false });
		window.addEventListener("touchend", onTouchEnd);

		// plane2 encima con efecto blanco y textura procedural
		const plane2Material = new THREE.ShaderMaterial({
			transparent: true,
			uniforms: {
				uMask: { value: maskTexture },
				uTime: { value: 0 },
			},
			side: THREE.DoubleSide,
			vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
			fragmentShader: `
    uniform sampler2D uMask;
    uniform float uTime;
    varying vec2 vUv;

    // Fast random for noise
    float random (vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }

    // 2D Noise
    float noise (vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);
        float a = random(i);
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));
        vec2 u = f*f*(3.0-2.0*f);
        return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }

    void main() {
      // ---- TEXTURA 3D PROCEDURAL BLANCA ----
      vec2 st = vUv * 5.0; // Scale of the pattern
      
      // Moving noise layers for a "professional" feel
      float n1 = noise(st + uTime * 0.1);
      float n2 = noise(st * 2.0 - uTime * 0.15);
      float finalNoise = (n1 + n2 * 0.5) / 1.5;
      
      // Add subtle grid/lines for structure
      vec2 grid = fract(vUv * 30.0);
      float lines = smoothstep(0.0, 0.02, grid.x) * smoothstep(1.0, 0.98, grid.x);
      lines *= smoothstep(0.0, 0.02, grid.y) * smoothstep(1.0, 0.98, grid.y);
      
      // Base white color with subtle depth variations
      vec3 color = vec3(1.0);
      color *= 0.9 + finalNoise * 0.1; // Subtle depth
      color = mix(color, vec3(0.95), 1.0 - lines); // Subtle grid lines

      // ---- REVEAL LÍQUIDO ----
      vec2 wUv = vUv + vec2(
        sin(vUv.y * 5.0 + uTime * 0.9) * 0.02,
        cos(vUv.x * 5.0 + uTime * 0.7) * 0.02
      );
      vec2 d1 = vec2(
        sin(wUv.y * 4.0 + uTime * 1.4) * cos(wUv.x * 3.0 + uTime * 1.1),
        cos(wUv.x * 3.5 + uTime * 1.3) * sin(wUv.y * 2.5 + uTime * 0.9)
      ) * 0.045;
      vec2 d2 = vec2(
        sin(wUv.y * 11.0 - uTime * 2.6 + wUv.x * 5.0),
        cos(wUv.x * 9.0  + uTime * 2.9 - wUv.y * 6.0)
      ) * 0.022;
      vec2 distort = d1 + d2;

      float mask = texture2D(uMask, vUv + distort).r;

      float edgeNoise =
        sin(vUv.x * 18.0 + uTime * 2.0) * cos(vUv.y * 16.0 + uTime * 1.7) * 0.22
      + sin(vUv.x * 38.0 - uTime * 3.2) * cos(vUv.y * 33.0 + uTime * 2.6) * 0.11;

      float edgeMask = smoothstep(0.05, 0.35, mask) * (1.0 - smoothstep(0.35, 0.65, mask));
      float liquidMask = mask + edgeNoise * edgeMask * 1.8;

      float alpha = smoothstep(0.45, 0.55, liquidMask);

      vec4 revealColor = vec4(color, alpha);

      // ---- WIREFRAME diagonal sweep ----
      float t = mod(uTime, 5.0) / 5.0;
      float target = t * 2.5 - 0.25;
      float dist = (vUv.x + vUv.y) - target;
      float sweepIntensity = max(0.0, 1.0 - abs(dist) / 0.1);

      vec2 wGrid = fract(vUv * 100.0);
      float thickness = 0.03;
      bool isLine = wGrid.x < thickness || wGrid.y < thickness || abs(wGrid.x - wGrid.y) < thickness;

      vec4 wireColor = vec4(0.0);
      if (sweepIntensity > 0.0) {
        float baseAlpha = sweepIntensity * 0.18;
        wireColor = vec4(color, isLine ? sweepIntensity : baseAlpha);
      }

      gl_FragColor = mix(revealColor, wireColor, wireColor.a);
    }
  `,
		});

		const plane2 = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), plane2Material);
		plane2.position.z = 0.01;
		scene.add(plane2);
		fitCover(plane2);

		// clock
		let startTime = performance.now();
		let animationFrameId;

		// tick
		const tick = () => {
			if (!plane2Material || !plane2Material.uniforms) return;
			const elapsedTime = (performance.now() - startTime) / 1000;
			plane2Material.uniforms.uTime.value = elapsedTime;
			// Idle: movimiento automático si el mouse lleva +2s sin moverse
			const secondsSinceMouse = (performance.now() - lastMouseTime) / 1000;
			let targetX = mouseNormX;
			let targetY = mouseNormY;

			if (secondsSinceMouse > 2.0) {
				const zigX = Math.sin(elapsedTime * 1.1);
				const zigY = Math.sin(elapsedTime * 0.7);

				const winAspect = window.innerWidth / window.innerHeight;
				const worldX = zigX * winAspect;
				const worldY = zigY;
				const scaleX = plane2.scale.x;
				const scaleY = plane2.scale.y;
				const cx = ((worldX + scaleX) / (2 * scaleX)) * MASK_SIZE;
				const cy = ((scaleY - worldY) / (2 * scaleY)) * MASK_SIZE;
				paintBrush(cx, cy);
			}

			// Parallax: lerp suave hacia la posición objetivo
			smoothX += (targetX - smoothX) * 0.06;
			smoothY += (targetY - smoothY) * 0.06;
			const dist = Math.sqrt(targetX * targetX + targetY * targetY);
			smoothZ += (dist - smoothZ) * 0.06;

			// Traslación mínima (separación de capas)
			plane2.position.x = smoothX * 0.02;
			plane2.position.y = smoothY * 0.02;
			plane2.position.z = 0.01 + smoothZ * 0.05;

			const lookTarget = new THREE.Vector3(smoothX * 0.3, smoothY * 0.3, 5);
			plane2.lookAt(lookTarget);

			// Fade siempre
			maskCtx.globalCompositeOperation = "source-over";
			maskCtx.fillStyle = "rgba(0,0,0,0.018)";
			maskCtx.fillRect(0, 0, MASK_SIZE, MASK_SIZE);
			maskTexture.needsUpdate = true;

			renderer.render(scene, camera);

			animationFrameId = requestAnimationFrame(tick);
		};
		tick();

		// resize
		const handleResize = () => {
			updateCamera();
			renderer.setSize(window.innerWidth, window.innerHeight);
			fitCover(plane2);
		};
		window.addEventListener("resize", handleResize);

		// Cleanup
		return () => {
			cancelAnimationFrame(animationFrameId);
			window.removeEventListener("mousemove", onMouseMove);
			window.removeEventListener("mouseleave", onMouseLeave);
			window.removeEventListener("touchstart", onTouchStart);
			window.removeEventListener("touchmove", onTouchMove);
			window.removeEventListener("touchend", onTouchEnd);
			window.removeEventListener("resize", handleResize);
			
			if (renderer) {
				renderer.dispose();
			}
			if (plane2Material) {
				plane2Material.dispose();
			}
			if (maskTexture) {
				maskTexture.dispose();
			}
		};
	}, []);

	return (
		<div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-[10005] mix-blend-difference">
			<canvas ref={canvasRef} className="webgl w-full h-full block" />
		</div>
	);
};

export default CyberHero;
