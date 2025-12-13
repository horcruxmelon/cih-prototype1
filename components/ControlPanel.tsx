import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Globe, 
  Flame, 
  LayoutTemplate, 
  Wand2, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw,
  ChevronRight
} from 'lucide-react';
import { ActivePanel, BrandIssue, DesignState, Template } from '../types';
import * as GeminiService from '../services/geminiService';

interface ControlPanelProps {
  activePanel: ActivePanel;
  designState: DesignState;
  onUpdateState: (updates: Partial<DesignState>) => void;
  onToggleHeatmap: (show: boolean) => void;
  brandIssues: BrandIssue[];
  setBrandIssues: (issues: BrandIssue[]) => void;
}

const TEMPLATES: Template[] = [
  { 
    id: 't1', 
    name: 'Weekly Saver', 
    description: 'Standard product focus', 
    previewColor: 'bg-blue-600',
    stateConfig: { layoutMode: 'standard', headline: 'Weekly Deals', ctaText: 'Shop Now' } 
  },
  { 
    id: 't2', 
    name: 'Seasonal Promo', 
    description: 'High impact visuals', 
    previewColor: 'bg-orange-500',
    stateConfig: { layoutMode: 'seasonal', headline: 'Summer Vibes', ctaText: 'Explore' } 
  },
  { 
    id: 't3', 
    name: 'Clubcard Exclusive', 
    description: 'Loyalty member focus', 
    previewColor: 'bg-yellow-400',
    stateConfig: { layoutMode: 'promo', headline: 'Exclusive Prices', ctaText: 'Unlock Deals' } 
  },
];

const LANGUAGES = ['French', 'German', 'Spanish', 'Polish', 'Mandarin'];

export const ControlPanel: React.FC<ControlPanelProps> = ({
  activePanel,
  designState,
  onUpdateState,
  onToggleHeatmap,
  brandIssues,
  setBrandIssues
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [targetLang, setTargetLang] = useState('Spanish');
  const [aiPrompt, setAiPrompt] = useState('');

  // Brand Check Handler
  const handleBrandCheck = async () => {
    setIsAnalyzing(true);
    const issues = await GeminiService.checkBrandAlignment(designState);
    setBrandIssues(issues);
    setIsAnalyzing(false);
  };

  const handleFixIssue = (issue: BrandIssue) => {
    if (issue.fixedState) {
      onUpdateState(issue.fixedState);
      // Remove fixed issue from list
      setBrandIssues(brandIssues.filter(i => i.id !== issue.id));
    }
  };

  // Localization Handler
  const handleLocalize = async () => {
    setIsAnalyzing(true);
    const updates = await GeminiService.localizeContent(designState, targetLang);
    onUpdateState({ ...updates, language: targetLang });
    setIsAnalyzing(false);
  };

  // AI Design Suggestion
  const handleAiSuggestion = async () => {
    if (!aiPrompt) return;
    setIsAnalyzing(true);
    const updates = await GeminiService.getAiSuggestions(aiPrompt);
    onUpdateState(updates);
    setIsAnalyzing(false);
    setAiPrompt('');
  };

  const renderTemplates = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Smart Templates</h3>
      <p className="text-sm text-gray-500">Templates automatically adjust to your campaign context.</p>
      <div className="grid grid-cols-1 gap-3">
        {TEMPLATES.map((t) => (
          <button
            key={t.id}
            onClick={() => onUpdateState(t.stateConfig)}
            className="flex items-center p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all group"
          >
            <div className={`w-10 h-10 rounded-md ${t.previewColor} mr-3 opacity-80 group-hover:opacity-100`} />
            <div className="text-left">
              <div className="font-medium text-gray-900">{t.name}</div>
              <div className="text-xs text-gray-500">{t.description}</div>
            </div>
            <ChevronRight className="w-4 h-4 ml-auto text-gray-400" />
          </button>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
        <label className="text-sm font-medium text-indigo-900 flex items-center gap-2 mb-2">
          <Wand2 className="w-4 h-4" /> AI Generator
        </label>
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="e.g. Back to School" 
            className="flex-1 text-sm p-2 border border-indigo-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
          />
          <button 
            onClick={handleAiSuggestion}
            disabled={isAnalyzing || !aiPrompt}
            className="bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {isAnalyzing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );

  const renderBrandCheck = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-gray-800">Brand Guard</h3>
        <button
          onClick={handleBrandCheck}
          disabled={isAnalyzing}
          className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-full hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm"
        >
          {isAnalyzing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
          Run Audit
        </button>
      </div>

      {brandIssues.length === 0 && !isAnalyzing ? (
        <div className="flex flex-col items-center justify-center py-10 text-gray-500 border-2 border-dashed border-gray-200 rounded-xl">
           <CheckCircle2 className="w-12 h-12 text-green-500 mb-2" />
           <p className="text-sm">All systems nominal.</p>
           <p className="text-xs text-gray-400">Design is brand-safe.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {brandIssues.map((issue) => (
            <div key={issue.id} className={`p-4 rounded-lg border-l-4 shadow-sm bg-white ${
              issue.severity === 'critical' ? 'border-red-500' : 'border-yellow-400'
            }`}>
              <div className="flex items-start gap-3">
                <AlertTriangle className={`w-5 h-5 shrink-0 ${
                  issue.severity === 'critical' ? 'text-red-500' : 'text-yellow-500'
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{issue.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{issue.suggestion}</p>
                  {issue.fixedState && (
                    <button
                      onClick={() => handleFixIssue(issue)}
                      className="mt-2 text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-md transition-colors"
                    >
                      <Wand2 className="w-3 h-3" /> Auto-Fix
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderLocalize = () => (
    <div className="space-y-4">
       <h3 className="text-lg font-semibold text-gray-800">Global Localizer</h3>
       <p className="text-sm text-gray-500">Translate content while keeping the brand voice consistent.</p>
       
       <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
         <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Target Market</label>
         <select 
          value={targetLang} 
          onChange={(e) => setTargetLang(e.target.value)}
          className="w-full p-2 bg-gray-50 border border-gray-200 rounded-md text-sm mb-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
         >
           {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
         </select>
         
         <button
          onClick={handleLocalize}
          disabled={isAnalyzing}
          className="w-full flex justify-center items-center gap-2 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
         >
           {isAnalyzing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
           Translate & Adapt
         </button>
       </div>
    </div>
  );

  const renderHeatmap = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Attention Prediction</h3>
      <p className="text-sm text-gray-500">AI-simulated eye tracking to maximize engagement.</p>
      
      <div className="p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border border-orange-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-white rounded-full shadow-sm">
            <Flame className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <div className="font-semibold text-gray-900">Heatmap Engine</div>
            <div className="text-xs text-gray-500">Predictive Model v2.5</div>
          </div>
        </div>
        
        <label className="flex items-center gap-3 p-3 bg-white rounded-lg border border-orange-100 cursor-pointer hover:bg-orange-50/50 transition-colors">
          <input 
            type="checkbox" 
            className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500 border-gray-300" 
            onChange={(e) => onToggleHeatmap(e.target.checked)}
          />
          <span className="text-sm font-medium text-gray-700">Overlay Heatmap</span>
        </label>
      </div>

      <div className="text-xs text-gray-400 italic">
        *Based on Gemini Vision analysis of layout and contrast.
      </div>
    </div>
  );

  return (
    <div className="h-full bg-white border-l border-gray-200 p-6 overflow-y-auto w-80 shrink-0 shadow-xl z-20">
      {activePanel === ActivePanel.TEMPLATES && renderTemplates()}
      {activePanel === ActivePanel.BRAND_CHECK && renderBrandCheck()}
      {activePanel === ActivePanel.LOCALIZE && renderLocalize()}
      {activePanel === ActivePanel.HEATMAP && renderHeatmap()}
    </div>
  );
};