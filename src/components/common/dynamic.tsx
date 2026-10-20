import React, { ComponentType, lazy, Suspense } from 'react';

interface DynamicOptions {
  ssr?: boolean;
  loading?: () => React.ReactNode;
}

export function dynamic<T extends ComponentType<any>>(
  importer: () => Promise<{ default?: T } | any>,
  options?: DynamicOptions
): React.FC<any> {
  const LazyComponent = lazy(async () => {
    const mod = await importer();
    if (mod.default) {
      return { default: mod.default };
    }
    // Handle named export where importer resolved mod directly
    const firstExport = Object.values(mod).find((val) => typeof val === 'function');
    return { default: (firstExport as T) || mod };
  });

  return (props: any) => (
    <Suspense fallback={options?.loading ? options.loading() : null}>
      <LazyComponent {...props} />
    </Suspense>
  );
}

export default dynamic;

