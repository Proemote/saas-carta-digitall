'use client';

import { useState } from 'react';
import { ChevronDown, Plus } from 'lucide-react';
import type { CurrentOrg } from '@/lib/auth';

interface OrgSwitcherProps {
  currentOrg: CurrentOrg;
  organizations: CurrentOrg[];
}

export default function OrgSwitcher({
  currentOrg,
  organizations,
}: OrgSwitcherProps) {
  const [open, setOpen] = useState(false);

  const otherOrgs = organizations.filter((org) => org.id !== currentOrg.id);

  // Dynamic colors from current org
  const primaryColor = currentOrg.primary_color || '#8B5A3C';
  const secondaryColor = currentOrg.secondary_color || '#D4A574';

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2.5 rounded-lg transition-colors w-full text-left"
        style={{
          backgroundColor: `${primaryColor}15`,
          color: primaryColor,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = `${primaryColor}25`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = `${primaryColor}15`;
        }}
      >
        <div className="flex-1 min-w-0">
          {currentOrg.logo_url && (
            <img
              src={currentOrg.logo_url}
              alt={currentOrg.name}
              className="w-5 h-5 rounded"
            />
          )}
          <div className="text-sm font-semibold truncate">
            {currentOrg.name}
          </div>
          <div className="text-xs opacity-70 capitalize">
            {currentOrg.plan}
          </div>
        </div>
        <ChevronDown
          className="w-4 h-4 flex-shrink-0 transition-transform"
          style={{
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </button>

      {open && (
        <div
          className="absolute top-full left-0 right-0 mt-2 bg-white border rounded-lg shadow-lg z-50"
          style={{ borderColor: `${primaryColor}30` }}
        >
          {otherOrgs.length > 0 && (
            <>
              <div className="py-1">
                {otherOrgs.map((org) => (
                  <a
                    key={org.id}
                    href={`/admin/${org.slug}`}
                    className="block px-3 py-2 text-sm transition-colors"
                    style={{
                      color: primaryColor,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = `${primaryColor}10`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <div className="font-medium">{org.name}</div>
                    <div className="text-xs opacity-70">{org.slug}</div>
                  </a>
                ))}
              </div>
              <div
                style={{ borderColor: `${primaryColor}20` }}
                className="border-t"
              ></div>
            </>
          )}

          <a
            href="/onboarding"
            className="flex items-center gap-2 px-3 py-2 text-sm transition-colors"
            style={{
              color: primaryColor,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = `${primaryColor}10`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <Plus className="w-4 h-4" />
            Nueva organización
          </a>
        </div>
      )}
    </div>
  );
}
