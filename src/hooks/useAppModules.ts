import { useEffect } from 'react';
import { useAppStore } from '../store/appStore';

export function useAppModules() {
  const modules = useAppStore(state => state.modules);
  const loading = useAppStore(state => state.isModulesLoading);
  const fetchModules = useAppStore(state => state.fetchModules);
  const modulesFetched = useAppStore(state => state.modulesFetched);

  useEffect(() => {
    if (!modulesFetched && !loading) {
      fetchModules();
    }
  }, [fetchModules, modulesFetched, loading]);

  return { modules, loading: loading && !modulesFetched };
}
