import { useState } from 'react';
import { Icon } from '../../components/ui/Icon';
import { useFooter } from '../../context/FooterContext';
import type { FooterContent, FooterLink, FooterPerk } from '../../types/footer';
import { Footer } from '../../components/Footer';

interface FooterSectionProps {
  showToast: (msg: string) => void;
}

type TabType = 'brand' | 'collections' | 'support' | 'newsletter' | 'legal';

export function FooterSection({ showToast }: FooterSectionProps) {
  const {
    footerContent,
    updateFooterContent,
    resetToDefaultFooterContent,
    isSaving,
  } = useFooter();

  const [form, setForm] = useState<FooterContent>(footerContent);
  const [activeTab, setActiveTab] = useState<TabType>('brand');
  const [showPreview, setShowPreview] = useState(false);

  // Handle saving
  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const success = await updateFooterContent(form);
    if (success) {
      showToast('Footer content successfully saved & updated store-wide!');
    } else {
      showToast('Footer saved locally (offline / cloud sync fallback).');
    }
  };

  const handleReset = async () => {
    if (
      window.confirm(
        'Are you sure you want to reset all footer content, links, and sections to original defaults?'
      )
    ) {
      await resetToDefaultFooterContent();
      showToast('Footer reset to default template.');
    }
  };

  // Helper: Links manipulation
  const handleAddLink = (section: 'collectionsLinks' | 'supportLinks' | 'legalLinks') => {
    const newLink: FooterLink = { label: 'New Link', path: '/collections' };
    setForm((prev) => ({
      ...prev,
      [section]: [...prev[section], newLink],
    }));
  };

  const handleUpdateLink = (
    section: 'collectionsLinks' | 'supportLinks' | 'legalLinks',
    index: number,
    field: keyof FooterLink,
    value: string
  ) => {
    setForm((prev) => {
      const updated = [...prev[section]];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, [section]: updated };
    });
  };

  const handleRemoveLink = (
    section: 'collectionsLinks' | 'supportLinks' | 'legalLinks',
    index: number
  ) => {
    setForm((prev) => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index),
    }));
  };

  // Helper: Perks manipulation
  const handleAddPerk = () => {
    const newPerk: FooterPerk = { icon: '🇮🇳', text: 'Complimentary shipping across India' };
    setForm((prev) => ({
      ...prev,
      perks: [...prev.perks, newPerk],
    }));
  };

  const handleUpdatePerk = (index: number, field: keyof FooterPerk, value: string) => {
    setForm((prev) => {
      const updated = [...prev.perks];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, perks: updated };
    });
  };

  const handleRemovePerk = (index: number) => {
    setForm((prev) => ({
      ...prev,
      perks: prev.perks.filter((_, i) => i !== index),
    }));
  };

  // Helper: Payment badges
  const [newBadgeInput, setNewBadgeInput] = useState('');
  const handleAddBadge = () => {
    if (newBadgeInput.trim()) {
      setForm((prev) => ({
        ...prev,
        paymentBadges: [...prev.paymentBadges, newBadgeInput.trim()],
      }));
      setNewBadgeInput('');
    }
  };

  const handleRemoveBadge = (idx: number) => {
    setForm((prev) => ({
      ...prev,
      paymentBadges: prev.paymentBadges.filter((_, i) => i !== idx),
    }));
  };

  return (
    <div className="space-y-6 max-w-6xl pb-16 font-sans">
      {/* Header & Main Actions */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest block">
            Merchandising &amp; Brand Experience
          </span>
          <h2 className="text-lg font-bold text-gray-900">Storefront Footer CMS</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Modify footer descriptions, navigation columns, social URLs, and legal disclaimers in real time.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
              showPreview
                ? 'bg-primary/10 border-primary text-primary'
                : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Icon name="photo_camera" className="w-4 h-4" />
            <span>{showPreview ? 'Hide Preview' : 'Live Preview'}</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:text-red-600 hover:bg-red-50 border border-gray-200 transition cursor-pointer"
          >
            Reset Defaults
          </button>

          <button
            type="button"
            onClick={() => handleSave()}
            disabled={isSaving}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-primary hover:bg-[#8A2600] active:scale-95 transition shadow-sm cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <span>✓</span> Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      {/* Live Preview Container (Conditional) */}
      {showPreview && (
        <div className="space-y-2">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Storefront Footer Live Preview
            </span>
            <span className="text-[11px] text-gray-400">Renders changes dynamically</span>
          </div>
          <div className="rounded-3xl overflow-hidden border border-gray-300 shadow-xl pointer-events-none opacity-95">
            <Footer />
          </div>
        </div>
      )}

      {/* Editor Tabs Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
        <button
          onClick={() => setActiveTab('brand')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'brand'
              ? 'bg-primary text-white shadow-xs'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          🏢 Brand &amp; Social Channels
        </button>
        <button
          onClick={() => setActiveTab('collections')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'collections'
              ? 'bg-primary text-white shadow-xs'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          👟 Collections Column ({form.collectionsLinks.length})
        </button>
        <button
          onClick={() => setActiveTab('support')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'support'
              ? 'bg-primary text-white shadow-xs'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          🎧 Customer Support ({form.supportLinks.length})
        </button>
        <button
          onClick={() => setActiveTab('newsletter')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'newsletter'
              ? 'bg-primary text-white shadow-xs'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          📩 Newsletter &amp; Badges
        </button>
        <button
          onClick={() => setActiveTab('legal')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'legal'
              ? 'bg-primary text-white shadow-xs'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          ⚖️ Copyright &amp; Legal
        </button>
      </div>

      {/* TAB 1: BRAND & SOCIALS */}
      {activeTab === 'brand' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-6 space-y-6">
          <div>
            <label className="text-xs font-bold text-gray-800 block mb-1">
              Brand Bio &amp; Artisanal Mission Statement
            </label>
            <textarea
              rows={3}
              value={form.brandDescription}
              onChange={(e) => setForm({ ...form, brandDescription: e.target.value })}
              className="w-full p-3 rounded-xl border border-gray-200 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 leading-relaxed"
              placeholder="Enter brand tagline and story description..."
            />
          </div>

          {/* Value Perks Strip */}
          <div className="space-y-3 pt-2 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-gray-800">Assurance Badges / Perks</h4>
                <p className="text-[11px] text-gray-400">Displayed directly under the brand bio</p>
              </div>
              <button
                type="button"
                onClick={handleAddPerk}
                className="text-xs font-bold text-primary hover:underline cursor-pointer"
              >
                + Add Perk
              </button>
            </div>

            <div className="space-y-2">
              {form.perks.map((perk, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-gray-50 p-2.5 rounded-xl border border-gray-200">
                  <input
                    type="text"
                    value={perk.icon}
                    onChange={(e) => handleUpdatePerk(idx, 'icon', e.target.value)}
                    className="w-20 px-2 py-1.5 text-xs bg-white rounded-lg border border-gray-200 text-center"
                    placeholder="Icon / Emoji"
                    title="Icon or emoji, e.g. 🇮🇳 or 'dot'"
                  />
                  <input
                    type="text"
                    value={perk.text}
                    onChange={(e) => handleUpdatePerk(idx, 'text', e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs bg-white rounded-lg border border-gray-200 text-gray-800"
                    placeholder="Perk description"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemovePerk(idx)}
                    className="text-gray-400 hover:text-red-600 p-1 rounded-lg text-sm font-bold cursor-pointer"
                    title="Delete Perk"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Social Profiles */}
          <div className="space-y-3 pt-2 border-t border-gray-100">
            <h4 className="text-xs font-bold text-gray-800">Official Social Media Profile Links</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-semibold text-gray-600 block mb-1">Instagram URL</label>
                <input
                  type="text"
                  value={form.socialLinks.instagram}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      socialLinks: { ...form.socialLinks, instagram: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-800"
                  placeholder="https://instagram.com/craftyoursole"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-gray-600 block mb-1">Facebook URL</label>
                <input
                  type="text"
                  value={form.socialLinks.facebook}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      socialLinks: { ...form.socialLinks, facebook: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-800"
                  placeholder="https://facebook.com/craftyoursole"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-gray-600 block mb-1">X / Twitter URL</label>
                <input
                  type="text"
                  value={form.socialLinks.x}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      socialLinks: { ...form.socialLinks, x: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-800"
                  placeholder="https://x.com/craftyoursole"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-gray-600 block mb-1">YouTube URL</label>
                <input
                  type="text"
                  value={form.socialLinks.youtube}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      socialLinks: { ...form.socialLinks, youtube: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-800"
                  placeholder="https://youtube.com/@craftyoursole"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: COLLECTIONS LINKS */}
      {activeTab === 'collections' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <label className="text-xs font-bold text-gray-800 block mb-1">Column Heading</label>
              <input
                type="text"
                value={form.collectionsHeading}
                onChange={(e) => setForm({ ...form, collectionsHeading: e.target.value })}
                className="w-64 px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-900"
              />
            </div>
            <button
              type="button"
              onClick={() => handleAddLink('collectionsLinks')}
              className="px-3.5 py-2 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors text-xs font-bold cursor-pointer self-start sm:self-auto"
            >
              + Add Navigation Link
            </button>
          </div>

          <div className="space-y-2.5">
            {form.collectionsLinks.map((link, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row items-center gap-2 bg-gray-50 p-2.5 rounded-xl border border-gray-200"
              >
                <div className="flex-1 w-full">
                  <span className="text-[10px] text-gray-400 block mb-0.5">Label</span>
                  <input
                    type="text"
                    value={link.label}
                    onChange={(e) =>
                      handleUpdateLink('collectionsLinks', idx, 'label', e.target.value)
                    }
                    className="w-full px-3 py-1.5 text-xs bg-white rounded-lg border border-gray-200 text-gray-800 font-medium"
                    placeholder="Display text"
                  />
                </div>
                <div className="flex-1 w-full">
                  <span className="text-[10px] text-gray-400 block mb-0.5">Target Route / URL</span>
                  <input
                    type="text"
                    value={link.path}
                    onChange={(e) =>
                      handleUpdateLink('collectionsLinks', idx, 'path', e.target.value)
                    }
                    className="w-full px-3 py-1.5 text-xs bg-white rounded-lg border border-gray-200 text-gray-800 font-mono"
                    placeholder="/collections/..."
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveLink('collectionsLinks', idx)}
                  className="text-gray-400 hover:text-red-600 p-2 rounded-lg text-sm font-bold cursor-pointer mt-3 sm:mt-4"
                  title="Remove Link"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: CUSTOMER SUPPORT LINKS & CONCIERGE */}
      {activeTab === 'support' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <label className="text-xs font-bold text-gray-800 block mb-1">Column Heading</label>
              <input
                type="text"
                value={form.supportHeading}
                onChange={(e) => setForm({ ...form, supportHeading: e.target.value })}
                className="w-64 px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-900"
              />
            </div>
            <button
              type="button"
              onClick={() => handleAddLink('supportLinks')}
              className="px-3.5 py-2 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors text-xs font-bold cursor-pointer self-start sm:self-auto"
            >
              + Add Support Link
            </button>
          </div>

          <div className="space-y-2.5">
            {form.supportLinks.map((link, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row items-center gap-2 bg-gray-50 p-2.5 rounded-xl border border-gray-200"
              >
                <div className="flex-1 w-full">
                  <span className="text-[10px] text-gray-400 block mb-0.5">Label</span>
                  <input
                    type="text"
                    value={link.label}
                    onChange={(e) =>
                      handleUpdateLink('supportLinks', idx, 'label', e.target.value)
                    }
                    className="w-full px-3 py-1.5 text-xs bg-white rounded-lg border border-gray-200 text-gray-800 font-medium"
                    placeholder="Display text"
                  />
                </div>
                <div className="flex-1 w-full">
                  <span className="text-[10px] text-gray-400 block mb-0.5">Target Route / URL</span>
                  <input
                    type="text"
                    value={link.path}
                    onChange={(e) =>
                      handleUpdateLink('supportLinks', idx, 'path', e.target.value)
                    }
                    className="w-full px-3 py-1.5 text-xs bg-white rounded-lg border border-gray-200 text-gray-800 font-mono"
                    placeholder="/shipping-policy..."
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveLink('supportLinks', idx)}
                  className="text-gray-400 hover:text-red-600 p-2 rounded-lg text-sm font-bold cursor-pointer mt-3 sm:mt-4"
                  title="Remove Link"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Dedicated Concierge Details */}
          <div className="pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-semibold text-gray-700 block mb-1">
                Dedicated Support Email
              </label>
              <input
                type="email"
                value={form.supportEmail}
                onChange={(e) => setForm({ ...form, supportEmail: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-800"
                placeholder="care@craftyoursole.in"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-gray-700 block mb-1">
                Support Operational Hours
              </label>
              <input
                type="text"
                value={form.supportHours}
                onChange={(e) => setForm({ ...form, supportHours: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-800"
                placeholder="Mon – Sat: 9:30 AM – 6:30 PM IST"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: NEWSLETTER & BADGES */}
      {activeTab === 'newsletter' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-800 block mb-1">Newsletter Heading</label>
              <input
                type="text"
                value={form.newsletterHeading}
                onChange={(e) => setForm({ ...form, newsletterHeading: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-900"
                placeholder="Stay In The Loop"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-800 block mb-1">Subscribe Button Text</label>
              <input
                type="text"
                value={form.newsletterButtonText}
                onChange={(e) => setForm({ ...form, newsletterButtonText: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-900"
                placeholder="Join"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-800 block mb-1">Subtitle / Callout Text</label>
            <textarea
              rows={2}
              value={form.newsletterSubtitle}
              onChange={(e) => setForm({ ...form, newsletterSubtitle: e.target.value })}
              className="w-full p-3 rounded-xl border border-gray-200 text-xs text-gray-800 leading-relaxed"
              placeholder="Be the first to hear about secret drops..."
            />
          </div>

          {/* Payment & Trust Badges Chips */}
          <div className="pt-4 border-t border-gray-100 space-y-2">
            <label className="text-xs font-bold text-gray-800 block">
              Payment &amp; Security Badges (Chips)
            </label>
            <div className="flex flex-wrap gap-2 items-center">
              {form.paymentBadges.map((badge, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gray-100 text-gray-800 text-xs font-semibold border border-gray-200"
                >
                  {badge}
                  <button
                    type="button"
                    onClick={() => handleRemoveBadge(idx)}
                    className="text-gray-400 hover:text-red-600 font-bold ml-1 cursor-pointer"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-1 max-w-sm">
              <input
                type="text"
                value={newBadgeInput}
                onChange={(e) => setNewBadgeInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddBadge();
                  }
                }}
                className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-gray-200"
                placeholder="e.g. Apple Pay, Amex..."
              />
              <button
                type="button"
                onClick={handleAddBadge}
                className="px-3 py-1.5 bg-gray-800 text-white rounded-xl text-xs font-semibold hover:bg-black transition cursor-pointer"
              >
                + Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: COPYRIGHT & LEGAL LINKS */}
      {activeTab === 'legal' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-6 space-y-5">
          <div>
            <label className="text-xs font-bold text-gray-800 block mb-1">Copyright Notice Text</label>
            <input
              type="text"
              value={form.copyrightText}
              onChange={(e) => setForm({ ...form, copyrightText: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-900"
              placeholder="All rights reserved. Handcrafted Indian Footwear Culture."
            />
            <p className="text-[10px] text-gray-400 mt-1">
              Note: Current year and brand name (&copy; {new Date().getFullYear()} CraftYourSole) are prefixed automatically.
            </p>
          </div>

          <div className="space-y-3 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-gray-800">Legal &amp; Policy Links</h4>
                <p className="text-[11px] text-gray-400">Displayed in the bottom bar</p>
              </div>
              <button
                type="button"
                onClick={() => handleAddLink('legalLinks')}
                className="text-xs font-bold text-primary hover:underline cursor-pointer"
              >
                + Add Legal Link
              </button>
            </div>

            <div className="space-y-2">
              {form.legalLinks.map((link, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row items-center gap-2 bg-gray-50 p-2.5 rounded-xl border border-gray-200"
                >
                  <input
                    type="text"
                    value={link.label}
                    onChange={(e) => handleUpdateLink('legalLinks', idx, 'label', e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs bg-white rounded-lg border border-gray-200 text-gray-800 font-medium"
                    placeholder="Privacy Policy"
                  />
                  <input
                    type="text"
                    value={link.path}
                    onChange={(e) => handleUpdateLink('legalLinks', idx, 'path', e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs bg-white rounded-lg border border-gray-200 text-gray-800 font-mono"
                    placeholder="/privacy-policy"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveLink('legalLinks', idx)}
                    className="text-gray-400 hover:text-red-600 p-1.5 rounded-lg text-sm font-bold cursor-pointer"
                    title="Remove Link"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
