
import React, { useState } from 'react';

interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  stampText?: string;
  stampColor?: 'red' | 'gold' | 'green';
  onSuccess?: () => void;
  mode?: 'full' | 'lead' | 'vision'; // lead = name/email only, vision = name/email/country/phone/message
}

export const ActionModal: React.FC<ActionModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  subtitle, 
  description, 
  buttonText,
  stampText = "TRANSMISSION_OPEN",
  stampColor = "gold",
  onSuccess,
  mode = 'full'
}) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    organization: '',
    heardFrom: '',
    country: '',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Build payload to match Google Apps Script expectations
      let payload: any = {};
      if (mode === 'vision') {
        payload = {
          formType: 'vision_deck_access',
          name: formData.name,
          email: formData.email,
          country: formData.country,
          organization: formData.organization
        };
      } else {
        payload = {
          formType: 'interest_form',
          name: formData.name,
          email: formData.email,
          organization: formData.organization,
          heardFrom: formData.heardFrom
        };
      }
      await fetch('https://script.google.com/macros/s/AKfycbzhsRt2_oW8Yb6VXGmMINtki46-fhJoM8NK7jxPuZ6b_d29qS_oKReF5bG_vjQZPiyb/exec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (error) {
      console.error('Google Sheets submission error:', error);
    }
    setStep(2);
    if (onSuccess) onSuccess();
  };

  const stampClass = stampColor === 'red' ? 'text-red border-red' : 
                     stampColor === 'gold' ? 'text-gold border-gold' : 
                     'text-green border-green';

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 bg-paper/95 backdrop-blur-xl animate-fade-in overflow-y-auto">
      <div className="max-w-2xl w-full my-8 bg-white p-1 lg:p-1.5 shadow-2xl relative border border-obsidian/5">
        <button 
          onClick={() => { onClose(); setStep(1); }}
          className="absolute -top-10 sm:-top-12 right-0 text-obsidian font-mono text-[10px] sm:text-xs uppercase tracking-[0.3em] sm:tracking-[0.5em] hover:text-gold transition-colors"
        >
          Close [x]
        </button>

        <div className="border border-obsidian/10 p-6 sm:p-8 lg:p-16 space-y-8 sm:space-y-12">
          <header className="space-y-4 border-b border-obsidian/10 pb-8">
            <div className="flex justify-between items-start">
              <div className={`passport-stamp ${stampClass} scale-75 origin-left uppercase`}>{stampText}</div>
              <span className="font-mono text-[8px] text-obsidian/30 uppercase tracking-[0.4em]">Ref_Code: BA-88-ENTRY</span>
            </div>
            <div className="space-y-1">
              <span className="font-mono text-[10px] text-obsidian/30 uppercase tracking-[0.3em]">{subtitle}</span>
              <h2 className="text-4xl lg:text-5xl font-serif italic font-bold tracking-tighter text-obsidian uppercase">
                {title}
              </h2>
            </div>
          </header>

          {step === 1 ? (
            <div className="space-y-8 animate-fade-up">
              <div className="space-y-4">
                <h3 className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-gold">Basic Identity</h3>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <label className="font-mono text-[9px] uppercase tracking-widest text-obsidian/40">Full Name</label>
                    <input 
                      type="text" 
                      required 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-paper border border-obsidian/10 p-4 font-serif italic text-xl focus:border-gold outline-none transition-all text-obsidian" 
                      placeholder="Enter your name..." 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-mono text-[9px] uppercase tracking-widest text-obsidian/40">Email Address</label>
                    <input 
                      type="email" 
                      required 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-paper border border-obsidian/10 p-4 font-serif italic text-xl focus:border-gold outline-none transition-all text-obsidian" 
                      placeholder="your@email.com" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-mono text-[9px] uppercase tracking-widest text-obsidian/40">Organization / Affiliation (optional)</label>
                    <input 
                      type="text" 
                      value={formData.organization}
                      onChange={(e) => setFormData({...formData, organization: e.target.value})}
                      className="w-full bg-paper border border-obsidian/10 p-4 font-serif italic text-xl focus:border-gold outline-none transition-all text-obsidian" 
                      placeholder="Organization, company, or group (optional)" 
                    />
                  </div>
                  <div className="space-y-2">
                    {mode === 'vision' && (
                      <div className="space-y-2">
                        <label className="font-mono text-[9px] uppercase tracking-widest text-obsidian/40">Country</label>
                        <input
                          type="text"
                          required
                          value={formData.country}
                          onChange={(e) => setFormData({...formData, country: e.target.value})}
                          className="w-full bg-paper border border-obsidian/10 p-4 font-serif italic text-xl focus:border-gold outline-none transition-all text-obsidian"
                          placeholder="Your country"
                        />
                      </div>
                    )}
                    {mode !== 'vision' && (
                      <>
                        <h3 className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-gold mt-8">Relationship to the Mission</h3>
                        <label className="font-mono text-[9px] uppercase tracking-widest text-obsidian/40 mb-2 block">How did you hear about Bantu Ants Travel Club?</label>
                        <div className="space-y-2">
                          <label className="flex items-center gap-2 font-serif text-lg">
                            <input type="radio" name="heardFrom" value="Social media" checked={formData.heardFrom === 'Social media'} onChange={() => setFormData({...formData, heardFrom: 'Social media'})} />
                            Social media
                          </label>
                          <label className="flex items-center gap-2 font-serif text-lg">
                            <input type="radio" name="heardFrom" value="Friend / referral" checked={formData.heardFrom === 'Friend / referral'} onChange={() => setFormData({...formData, heardFrom: 'Friend / referral'})} />
                            Friend / referral
                          </label>
                          <label className="flex items-center gap-2 font-serif text-lg">
                            <input type="radio" name="heardFrom" value="Event or pitch" checked={formData.heardFrom === 'Event or pitch'} onChange={() => setFormData({...formData, heardFrom: 'Event or pitch'})} />
                            Event or pitch
                          </label>
                          <label className="flex items-center gap-2 font-serif text-lg">
                            <input type="radio" name="heardFrom" value="Website" checked={formData.heardFrom === 'Website'} onChange={() => setFormData({...formData, heardFrom: 'Website'})} />
                            Website
                          </label>
                          <label className="flex items-center gap-2 font-serif text-lg">
                            <input type="radio" name="heardFrom" value="Other" checked={formData.heardFrom === 'Other'} onChange={() => setFormData({...formData, heardFrom: 'Other'})} />
                            Other
                          </label>
                        </div>
                      </>
                    )}
                  </div>
                  <button type="submit" className="w-full py-6 bg-obsidian text-paper font-mono text-[10px] font-bold uppercase tracking-[0.5em] hover:bg-gold hover:text-obsidian transition-all mt-8">
                    {buttonText}
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="space-y-12 text-center py-12 animate-fade-up">
              <div className="w-24 h-24 border border-gold rounded-full flex items-center justify-center mx-auto">
                <span className="text-gold text-4xl">✓</span>
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl font-serif italic font-bold text-obsidian">Transmission Logged.</h3>
                <p className="text-lg font-serif italic text-obsidian/50">Your interest has been cataloged in the Archive. Expect a secure dispatch soon.</p>
              </div>
              <button onClick={() => { onClose(); setStep(1); }} className="btn-travel bg-obsidian text-paper hover:bg-gold hover:text-obsidian">Return to Hub</button>
            </div>
          )}
        </div>

        <div className="absolute bottom-4 left-8 pointer-events-none">
          <span className="font-mono text-[7px] text-obsidian/10 uppercase tracking-[1em]">Handshake_Verified_2088</span>
        </div>
      </div>
    </div>
  );
};
