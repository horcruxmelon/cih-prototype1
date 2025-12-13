import React, { useState, useEffect, useCallback } from 'react';
import { 
  LayoutTemplate, 
  ShieldCheck, 
  Globe, 
  Flame, 
  Menu,
  Download,
  Share2,
  Undo2,
  Redo2,
  Type,
  Palette,
  Image as ImageIcon
} from 'lucide-react';
import { 
  DesignState, 
  BrandIssue, 
  HeatmapPoint, 
  ActivePanel, 
  INITIAL_STATE 
} from './types';
import { HeatmapOverlay } from './components/HeatmapOverlay';
import { ControlPanel } from './components/ControlPanel';
import * as GeminiService from './services/geminiService';

const App: React.FC = () => {
  const [designState, setDesignState] = useState<DesignState>(INITIAL_STATE);
  const [activePanel, setActivePanel] = useState<ActivePanel>(ActivePanel.TEMPLATES);
  const [brandIssues, setBrandIssues] = useState<BrandIssue[]>([]);
  const [heatmapPoints, setHeatmapPoints] = useState<HeatmapPoint[]>([]);
  const [showHeatmap, setShowHeatmap] = useState(false);
  
  // Update handler for the design state
  const handleStateUpdate = useCallback((updates: Partial<DesignState>) => {
    setDesignState(prev => ({ ...prev, ...updates }));
    
    // Clear heatmap if layout changes significantly to avoid stale overlay
    if (updates.layoutMode || updates.headline) {
        setHeatmapPoints([]); 
        // In a real app, we might auto-regenerate heatmap here, 
        // but for API cost/latency we wait for user trigger or explicit panel load
    }
    
    // Clear brand issues on update (assuming they might be fixed)
    // In a real app we might debounce a re-check
    if (brandIssues.length > 0) {
        setBrandIssues([]); 
    }
  }, [brandIssues.length]);

  // Effect to generate heatmap data when toggle is enabled but no data exists
  useEffect(() => {
    if (showHeatmap && heatmapPoints.length === 0) {
      const fetchHeatmap = async () => {
        const points = await GeminiService.generateHeatmapData(designState);
        setHeatmapPoints(points);
      };
      fetchHeatmap();
    }
  }, [showHeatmap, heatmapPoints.length, designState]);

  // Render the Main Canvas (The "Sandbox")
  const renderCanvas = () => {
    return (
      <div className="relative w-full max-w-4xl aspect-video bg-white shadow-2xl rounded-lg overflow-hidden transition-all duration-500 group">
        
        {/* Heatmap Overlay */}
        <HeatmapOverlay points={heatmapPoints} isVisible={showHeatmap} />

        {/* Background */}
        <div 
            className="absolute inset-0 bg-cover bg-center transition-all duration-500"
            style={{ backgroundImage: `url(${designState.backgroundImage})` }}
        />
        
        {/* Overlay Tint for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />

        {/* Content Layer */}
        <div className={`absolute inset-0 p-12 flex flex-col justify-center ${
            designState.layoutMode === 'promo' ? 'items-center text-center bg-yellow-400/10' : 'items-start text-left'
        }`}>
            <div className="relative z-10 max-w-2xl animate-fade-in-up">
                {designState.layoutMode === 'seasonal' && (
                    <span className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-wider text-white uppercase bg-opacity-50 rounded-full bg-white/20 backdrop-blur-sm">
                        {designState.layoutMode} Collection
                    </span>
                )}
                
                <h1 
                    className="mb-4 text-5xl font-bold leading-tight transition-all duration-300"
                    style={{ 
                        fontFamily: designState.fontFamily,
                        color: designState.layoutMode === 'promo' ? designState.primaryColor : '#FFFFFF',
                        textShadow: designState.layoutMode !== 'promo' ? '0 2px 10px rgba(0,0,0,0.3)' : 'none'
                    }}
                >
                    {designState.headline}
                </h1>
                
                <p 
                    className="mb-8 text-xl font-medium text-gray-200 transition-all duration-300"
                    style={{ 
                         color: designState.layoutMode === 'promo' ? '#333' : '#E5E7EB',
                         fontFamily: designState.fontFamily
                    }}
                >
                    {designState.subheadline}
                </p>
                
                <button 
                    className="px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:transform hover:scale-105 transition-all duration-200"
                    style={{ 
                        backgroundColor: designState.accentColor, 
                        color: '#FFFFFF',
                        fontFamily: designState.fontFamily
                    }}
                >
                    {designState.ctaText}
                </button>
            </div>
        </div>

        {/* Brand Tag (Mock) */}
        <div className="absolute top-8 right-8">
             <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center font-bold text-blue-900 shadow-md">
                 LOGO
             </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 font-sans overflow-hidden">
      
      {/* Left Navigation Bar */}
      <nav className="w-20 bg-gray-900 flex flex-col items-center py-6 gap-8 shrink-0 z-30">
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-900/50">
          B
        </div>
        
        <div className="flex flex-col gap-4 w-full px-2">
            {[
              { id: ActivePanel.TEMPLATES, icon: LayoutTemplate, label: 'Templates' },
              { id: ActivePanel.BRAND_CHECK, icon: ShieldCheck, label: 'Brand Safe' },
              { id: ActivePanel.LOCALIZE, icon: Globe, label: 'Localize' },
              { id: ActivePanel.HEATMAP, icon: Flame, label: 'Heatmap' },
            ].map((item) => (
                <button
                    key={item.id}
                    onClick={() => setActivePanel(item.id as ActivePanel)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-200 group relative ${
                        activePanel === item.id 
                        ? 'bg-blue-600 text-white shadow-lg' 
                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    }`}
                >
                    <item.icon className="w-6 h-6 mb-1" />
                    <span className="text-[10px] font-medium">{item.label}</span>
                    {item.id === ActivePanel.BRAND_CHECK && brandIssues.length > 0 && (
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    )}
                </button>
            ))}
        </div>

        <div className="mt-auto flex flex-col gap-4 text-gray-500">
             <button className="p-2 hover:text-white transition-colors"><Undo2 className="w-5 h-5" /></button>
             <button className="p-2 hover:text-white transition-colors"><Redo2 className="w-5 h-5" /></button>
        </div>
      </nav>

      {/* Main Workspace */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* Top Toolbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm z-20">
            <div className="flex items-center gap-4">
                <h2 className="text-xl font-bold text-gray-800">Campaign: Summer Refresh 2025</h2>
                <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-md border border-gray-200">
                    {designState.language}
                </span>
            </div>

            <div className="flex items-center gap-3">
                 <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-200">
                    <Share2 className="w-4 h-4" /> Share
                 </button>
                 <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-black rounded-lg transition-all shadow-md hover:shadow-lg">
                    <Download className="w-4 h-4" /> Export Assets
                 </button>
            </div>
        </header>

        {/* Canvas Area */}
        <div className="flex-1 overflow-hidden relative bg-gray-100 flex items-center justify-center p-12">
            
            {/* Simple Floating Inspector for quick edits */}
            <div className="absolute top-8 left-8 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/50 w-64 z-10 transition-opacity hover:opacity-100 opacity-80">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Quick Edit</h4>
                <div className="space-y-3">
                    <div className="group relative">
                        <Type className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
                        <input 
                            type="text" 
                            value={designState.headline}
                            onChange={(e) => handleStateUpdate({ headline: e.target.value })}
                            className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Headline"
                        />
                    </div>
                    <div className="group relative">
                        <Palette className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
                        <input 
                            type="color" 
                            value={designState.primaryColor}
                            onChange={(e) => handleStateUpdate({ primaryColor: e.target.value })}
                            className="w-full h-9 pl-8 pr-1 py-1 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer"
                        />
                    </div>
                     <div className="group relative">
                        <ImageIcon className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
                        <select 
                            value={designState.layoutMode}
                            onChange={(e) => handleStateUpdate({ layoutMode: e.target.value as any })}
                            className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
                        >
                            <option value="standard">Standard Layout</option>
                            <option value="seasonal">Seasonal Layout</option>
                            <option value="promo">Promo Layout</option>
                        </select>
                    </div>
                </div>
            </div>

            {renderCanvas()}
        </div>
      </main>

      {/* Right Control Panel (Contextual) */}
      <ControlPanel 
        activePanel={activePanel}
        designState={designState}
        onUpdateState={handleStateUpdate}
        onToggleHeatmap={setShowHeatmap}
        brandIssues={brandIssues}
        setBrandIssues={setBrandIssues}
      />

    </div>
  );
};

export default App;