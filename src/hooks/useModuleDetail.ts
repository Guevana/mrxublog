import { useState, useEffect } from 'react';
import { AppModule } from '../types';
import { useAppStore } from '../store/appStore';

export function useModuleDetail(id: string | undefined) {
  const modules = useAppStore(state => state.modules);
  const isModulesLoading = useAppStore(state => state.isModulesLoading);
  const modulesFetched = useAppStore(state => state.modulesFetched);
  const fetchModules = useAppStore(state => state.fetchModules);
  
  const [section, setSection] = useState<AppModule | null>(null);

  useEffect(() => {
    if (!modulesFetched && !isModulesLoading) {
      fetchModules();
    }
  }, [fetchModules, modulesFetched, isModulesLoading]);

  useEffect(() => {
    if (modulesFetched && id) {
      const found = modules.find(m => m.id === id);
      setSection(found || null);
    }
  }, [id, modules, modulesFetched]);

  return { 
    section, 
    loading: isModulesLoading && !modulesFetched 
  };
}
