import { Component, Suspense, useMemo, type ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { DoubleSide } from 'three';

const TREE_COUNT = 20;

function cryptoRandom(): number {
  return crypto.getRandomValues(new Uint32Array(1))[0] / 4294967295;
}

function Terrain() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[500, 500, 50, 50]} />
      <meshLambertMaterial color="#90ee90" side={DoubleSide} />
    </mesh>
  );
}

function HostelBuilding() {
  return (
    <mesh position={[0, 7.5, 0]} castShadow receiveShadow>
      <boxGeometry args={[40, 15, 30]} />
      <meshLambertMaterial color="#d3d3d3" />
    </mesh>
  );
}

function Trees() {
  const positions = useMemo<[number, number, number][]>(
    () =>
      Array.from({ length: TREE_COUNT }, () => [
        (cryptoRandom() - 0.5) * 200,
        4,
        (cryptoRandom() - 0.5) * 200,
      ]),
    []
  );

  return (
    <>
      {positions.map((position) => (
        <mesh key={position.join(',')} position={position} castShadow>
          <coneGeometry args={[2, 8, 8]} />
          <meshLambertMaterial color="#228b22" />
        </mesh>
      ))}
    </>
  );
}

function Road() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 0]} receiveShadow>
      <planeGeometry args={[8, 200]} />
      <meshLambertMaterial color="#404040" />
    </mesh>
  );
}

function HostelSceneContent() {
  return (
    <>
      <color attach="background" args={['#87ceeb']} />
      <ambientLight intensity={0.6} color="#404040" />
      <directionalLight
        position={[50, 100, 50]}
        intensity={0.8}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <Terrain />
      <HostelBuilding />
      <Trees />
      <Road />
      <OrbitControls enableDamping dampingFactor={0.05} maxPolarAngle={Math.PI / 2} />
    </>
  );
}

function HostelSceneLoading() {
  return (
    <div className="hostel-scene-overlay" style={{ color: '#374151' }}>
      Cargando visualización 3D...
    </div>
  );
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class HostelSceneErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error('Error initializing Hostel 3D scene:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="hostel-scene-overlay" style={{ color: '#dc2626' }}>
          <div style={{ marginBottom: '1rem' }}>Error al cargar la visualización 3D</div>
          <button
            type="button"
            onClick={() => location.reload()}
            style={{
              padding: '0.5rem 1rem',
              background: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
            }}
          >
            Recargar
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export function HostelScene() {
  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      <style>{`
        .hostel-scene-overlay {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 1000;
          text-align: center;
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 1.2rem;
        }
      `}</style>
      <HostelSceneErrorBoundary>
        <Suspense fallback={<HostelSceneLoading />}>
          <Canvas
            shadows="soft"
            camera={{ position: [0, 50, 100], fov: 75, near: 0.1, far: 1000 }}
            style={{ display: 'block' }}
          >
            <HostelSceneContent />
          </Canvas>
        </Suspense>
      </HostelSceneErrorBoundary>
    </div>
  );
}
