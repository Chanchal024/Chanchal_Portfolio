import { useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap } from "gsap";

const LuxurySmoke = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    let scene, camera, renderer, particles;
    let animationFrameId;

    const mount = mountRef.current;

    // Scene
    scene = new THREE.Scene();

    // Camera
    camera = new THREE.PerspectiveCamera(
      75,
      mount.clientWidth / mount.clientHeight,
      1,
      1000
    );
    camera.position.z = 400;

    // Renderer
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    mount.appendChild(renderer.domElement);

    // Particle count (responsive)
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 60 : 120;

    // Geometry
    const geometry = new THREE.BufferGeometry();
    const positions = [];

    for (let i = 0; i < particleCount; i++) {
      positions.push(
        (Math.random() - 0.5) * 800,
        (Math.random() - 0.5) * 800,
        (Math.random() - 0.5) * 800
      );
    }

    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );

    // Material (soft white smoke)
    const material = new THREE.PointsMaterial({
      color: 0x888888,
      size: isMobile ? 25 : 40,
      transparent: true,
      opacity: 0.05,
      depthWrite: false,
    });

    // Particles
    particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // GSAP slow rotation (smooth premium feel)
    gsap.to(particles.rotation, {
      y: Math.PI * 2,
      duration: 120,
      repeat: -1,
      ease: "none",
    });

    // Mouse interaction (subtle)
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e) => {
      mouseX = (e.clientX - window.innerWidth / 2) * 0.0003;
      mouseY = (e.clientY - window.innerHeight / 2) * 0.0003;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Animation loop
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      particles.rotation.x += 0.0002;

      camera.position.x += (mouseX * 200 - camera.position.x) * 0.02;
      camera.position.y += (-mouseY * 200 - camera.position.y) * 0.02;

      camera.lookAt(scene.position);
      renderer.render(scene, camera);
    };

    animate();

    // Resize handling
    const handleResize = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup (IMPORTANT)
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);

      if (geometry) geometry.dispose();
      if (material) material.dispose();

      if (renderer) {
        renderer.dispose();
        if (mount && mount.contains(renderer.domElement)) {
          mount.removeChild(renderer.domElement);
        }
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
        background: "var(--bg-color)",
        pointerEvents: "none", // important
      }}
    />
  );
};

export default LuxurySmoke;
