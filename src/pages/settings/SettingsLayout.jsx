
// src/components/settings/SettingsLayout.jsx
import React, { useState } from 'react';
import BasicSetup from './BasicSetup';
import SEOSetup from './SEOSetup';
import SocialPages from './SocialPages';
import PushNotification from './PushNotification';
import WatermarkSetup from './WatermarkSetup';
import Recaptcha from './Recaptcha';

const SECTIONS = [
  { key: 'basic', label: 'Basic Setup', Comp: BasicSetup },
  { key: 'seo', label: 'SEO Setup', Comp: SEOSetup },
  { key: 'social', label: 'Social Pages', Comp: SocialPages },
  { key: 'push', label: 'Push Notification', Comp: PushNotification },
  { key: 'watermark', label: 'Watermark Setup', Comp: WatermarkSetup },
  { key: 'recaptcha', label: 'Google Recaptcha', Comp: Recaptcha },
];

export default function SettingsLayout() {
  const [active, setActive] = useState('basic');
  const ActiveComp = SECTIONS.find(s => s.key === active)?.Comp ?? BasicSetup;

  return (
    <div className="container-fluid">
      <div className="row min-vh-100">
        <aside className="col-12 col-md-3 col-lg-2 bg-light border-end p-3">
          <h6 className="mb-3">SETTINGS</h6>
          <div className="list-group">
            {SECTIONS.map(s => (
              <button key={s.key}
                className={`list-group-item list-group-item-action ${active === s.key ? 'active' : ''}`}
                onClick={() => setActive(s.key)}>
                {s.label}
              </button>
            ))}
          </div>
        </aside>

        <main className="col-12 col-md-9 col-lg-10 p-3">
          <ActiveComp />
        </main>
      </div>
    </div>
  );
}
