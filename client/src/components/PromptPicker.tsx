import { useState } from "react";
import { Challenge, ChallengePrompt } from "@shared/schema";

interface PromptPickerProps {
  challenge: Challenge;
  onPromptsSelected: (selectedPrompts: ChallengePrompt[]) => void;
  onBack: () => void;
}

export default function PromptPicker({ challenge, onPromptsSelected, onBack }: PromptPickerProps) {
  const [selectedPromptIds, setSelectedPromptIds] = useState<string[]>([]);
  
  const maxPrompts = challenge.maxPrompts || 5;
  const promptPool = challenge.promptPool || [];

  // Debug log
  console.log('Challenge:', challenge);
  console.log('Prompt Pool:', promptPool);

  const togglePrompt = (promptId: string) => {
    setSelectedPromptIds(prev => {
      if (prev.includes(promptId)) {
        return prev.filter(id => id !== promptId);
      } else if (prev.length < maxPrompts) {
        return [...prev, promptId];
      }
      return prev;
    });
  };

  const handleContinue = () => {
    if (selectedPromptIds.length === maxPrompts) {
      const selectedPrompts = promptPool.filter(prompt => selectedPromptIds.includes(prompt.id));
      onPromptsSelected(selectedPrompts);
    }
  };

  const isSelected = (promptId: string) => selectedPromptIds.includes(promptId);
  const canSelect = (promptId: string) => isSelected(promptId) || selectedPromptIds.length < maxPrompts;

  return (
    <div className="min-h-screen bg-white overflow-y-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={onBack}
            className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"
          >
            <span className="text-xl">←</span>
          </button>
          <h2 className="text-xl font-semibold">{challenge.name}</h2>
          <div className="w-10 h-10"></div>
        </div>
        
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Pick Your {maxPrompts} Prompts</h1>
          <p className="text-base opacity-90 mb-4">
            Help the next student imagine living here — we'll guide you with quick clips.
          </p>
          <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 inline-block">
            <span className="font-semibold">{selectedPromptIds.length}/{maxPrompts} selected</span>
          </div>
        </div>
      </div>
      
      <div className="p-6 pb-safe">
        {/* Prompt Selection Grid */}
        <div className="space-y-3 mb-8">
          {promptPool.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-600">No prompts available for this challenge.</p>
              <button 
                onClick={onBack}
                className="mt-4 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg"
              >
                Go Back
              </button>
            </div>
          )}
          {promptPool.map((prompt) => {
            const selected = isSelected(prompt.id);
            const selectable = canSelect(prompt.id);
            
            return (
              <div
                key={prompt.id}
                className={`p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                  selected
                    ? 'bg-primary/10 border-primary shadow-lg transform scale-105'
                    : selectable
                    ? 'bg-gray-50 border-gray-200 hover:border-primary/50 hover:bg-primary/5'
                    : 'bg-gray-100 border-gray-200 opacity-50 cursor-not-allowed'
                }`}
                onClick={() => selectable && togglePrompt(prompt.id)}
              >
                <div className="flex items-center space-x-4">
                  {/* Selection Indicator */}
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                    selected
                      ? 'bg-primary border-primary text-white'
                      : 'border-gray-300'
                  }`}>
                    {selected && <span className="text-sm">✓</span>}
                  </div>
                  
                  {/* Prompt Content */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-2xl">{prompt.emoji}</span>
                      <h3 className="font-semibold text-gray-800">{prompt.text}</h3>
                    </div>
                    <p className="text-sm text-gray-600">{prompt.duration}s clip</p>
                  </div>
                  
                  {/* Points Indicator */}
                  <div className="text-right">
                    <div className="text-sm font-medium text-primary">+{challenge.pointsPerStep}</div>
                    <div className="text-xs text-gray-500">points</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Selection Helper */}
        {selectedPromptIds.length < maxPrompts && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-xl">💡</span>
              <span className="font-semibold text-blue-800">Quick Tip</span>
            </div>
            <p className="text-sm text-blue-700">
              Pick {maxPrompts - selectedPromptIds.length} more prompt{maxPrompts - selectedPromptIds.length !== 1 ? 's' : ''} to get started. 
              Choose the ones that best show off your space!
            </p>
          </div>
        )}
        
        {/* Continue Button */}
        <button 
          onClick={handleContinue}
          disabled={selectedPromptIds.length !== maxPrompts}
          className="w-full bg-primary text-white py-4 px-6 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed"
        >
          {selectedPromptIds.length === maxPrompts 
            ? '🎥 Let\'s Start Recording' 
            : `Select ${maxPrompts - selectedPromptIds.length} more prompt${maxPrompts - selectedPromptIds.length !== 1 ? 's' : ''}`
          }
        </button>
      </div>
    </div>
  );
}