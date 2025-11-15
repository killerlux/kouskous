# 🌐 Admin Web Implementation Guide

**Status**: Foundation Ready → Implementation in Progress  
**Framework**: Next.js 14 (App Router) + TypeScript  
**Design**: Trust & Safety theme (French primary, Arabic secondary)

---

## ✅ **Phase 1: Foundation (COMPLETE)**

### **Dependencies Installed**
- ✅ TailwindCSS 4.x with custom config
- ✅ @tanstack/react-query for data fetching
- ✅ axios for HTTP
- ✅ next-intl for i18n
- ✅ zustand for state
- ✅ lucide-react for icons
- ✅ Utility libraries (clsx, tailwind-merge, date-fns)

### **Design System**
- ✅ Color palette (Primary Blue, Secondary Amber, Accent Green)
- ✅ Typography (Inter for French, Cairo for Arabic)
- ✅ Component utilities (buttons, cards, inputs, badges)
- ✅ Spacing system (8px base)
- ✅ Elevation shadows (4 levels)
- ✅ Animations (slide, fade)
- ✅ RTL support prepared

### **Utilities**
- ✅ `cn()` for class merging
- ✅ `formatCurrency()` for TND
- ✅ `formatDate()` locale-aware
- ✅ `formatPhoneNumber()` Tunisia format
- ✅ `getInitials()` for avatars
- ✅ `debounce()` for performance

---

## 🚧 **Phase 2: Core Components** (In Progress)

### **Priority 1: Essential Components**

#### **1. Button Component**
```typescript
// src/components/ui/Button.tsx
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'btn',
        variant === 'primary' && 'btn-primary',
        variant === 'secondary' && 'btn-secondary',
        variant === 'accent' && 'btn-accent',
        variant === 'outline' && 'btn-outline',
        variant === 'ghost' && 'btn-ghost',
        size === 'sm' && 'px-3 py-1 text-sm',
        size === 'lg' && 'px-6 py-3 text-lg',
        (disabled || loading) && 'opacity-50 cursor-not-allowed'
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </button>
  );
}
```

#### **2. Card Component**
```typescript
// src/components/ui/Card.tsx
import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className, hover }: CardProps) {
  return (
    <div
      className={cn(
        'card',
        hover && 'cursor-pointer hover:shadow-elevation-3',
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: CardProps) {
  return (
    <div className={cn('border-b border-neutral-200 pb-4 mb-4', className)}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className }: CardProps) {
  return (
    <h3 className={cn('text-xl font-semibold text-neutral-900', className)}>
      {children}
    </h3>
  );
}

export function CardContent({ children, className }: CardProps) {
  return <div className={cn('', className)}>{children}</div>;
}
```

#### **3. Badge Component**
```typescript
// src/components/ui/Badge.tsx
import { cn } from '@/lib/utils';

type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral';

interface BadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
  dot?: boolean;
}

export function Badge({ variant, children, dot }: BadgeProps) {
  return (
    <span
      className={cn(
        'badge',
        variant === 'success' && 'badge-success',
        variant === 'warning' && 'badge-warning',
        variant === 'error' && 'badge-error',
        variant === 'info' && 'badge-info',
        variant === 'neutral' && 'bg-neutral-100 text-neutral-800'
      )}
    >
      {dot && (
        <span
          className={cn(
            'status-dot mr-2',
            variant === 'success' && 'status-success',
            variant === 'warning' && 'status-warning',
            variant === 'error' && 'status-error'
          )}
        />
      )}
      {children}
    </span>
  );
}
```

#### **4. Input Component**
```typescript
// src/components/ui/Input.tsx
import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'input',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        {helperText && !error && (
          <p className="mt-1 text-sm text-neutral-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
```

---

## 🏗️ **Phase 3: Layout & Navigation**

### **App Layout**
```typescript
// src/app/layout.tsx
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Admin - Taxi Platform',
  description: 'Administration dashboard for Tunisian taxi platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

### **Sidebar Navigation**
```typescript
// src/components/layout/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Wallet, 
  Users, 
  Car,
  Settings,
  LogOut 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Tableau de bord', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Dépôts', href: '/deposits', icon: Wallet },
  { name: 'Chauffeurs', href: '/drivers', icon: Car },
  { name: 'Utilisateurs', href: '/users', icon: Users },
  { name: 'Paramètres', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-neutral-200 flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-neutral-200">
        <h1 className="text-xl font-bold text-primary-500">Taxi Admin</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-neutral-700 hover:bg-neutral-100'
              )}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User menu */}
      <div className="p-4 border-t border-neutral-200">
        <button className="flex items-center w-full px-4 py-3 rounded-lg text-sm font-medium text-neutral-700 hover:bg-neutral-100">
          <LogOut className="w-5 h-5 mr-3" />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
```

---

## 📊 **Phase 4: Deposit Approval Queue** (Priority Feature)

### **Deposit List Page**
```typescript
// src/app/(dashboard)/deposits/page.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { Eye } from 'lucide-react';

export default function DepositsPage() {
  const { data: deposits, isLoading } = useQuery({
    queryKey: ['deposits', 'pending'],
    queryFn: async () => {
      // TODO: Use backend SDK
      const response = await fetch('/api/admin/deposits/pending');
      return response.json();
    },
  });

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">
          Dépôts en attente
        </h1>
        <p className="text-neutral-600 mt-2">
          {deposits?.length || 0} dépôt(s) à approuver
        </p>
      </div>

      <div className="grid gap-4">
        {deposits?.map((deposit: any) => (
          <Card key={deposit.id} hover>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Driver info */}
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-700 font-semibold">
                    {deposit.driver?.name?.charAt(0) || 'D'}
                  </span>
                </div>

                <div>
                  <p className="font-semibold text-neutral-900">
                    {deposit.driver?.name || 'Chauffeur'}
                  </p>
                  <p className="text-sm text-neutral-600">
                    {formatDateTime(deposit.created_at)}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-lg font-bold text-neutral-900">
                    {formatCurrency(deposit.amount_cents)}
                  </p>
                  <Badge variant="warning" dot>
                    En attente
                  </Badge>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // TODO: Open modal
                  }}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Voir
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

---

## 🔐 **Phase 5: Authentication**

### **Auth Store (Zustand)**
```typescript
// src/stores/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  phone: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (token, user) =>
        set({ token, user, isAuthenticated: true }),
      logout: () =>
        set({ token: null, user: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
```

---

## 🌍 **Phase 6: Internationalization (i18n)**

### **i18n Setup**
```typescript
// src/i18n.ts
import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

export const locales = ['fr', 'ar'] as const;
export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as Locale)) notFound();

  return {
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
```

### **French Translations**
```json
// messages/fr.json
{
  "nav": {
    "dashboard": "Tableau de bord",
    "deposits": "Dépôts",
    "drivers": "Chauffeurs",
    "users": "Utilisateurs",
    "settings": "Paramètres",
    "logout": "Déconnexion"
  },
  "deposits": {
    "title": "Dépôts en attente",
    "pending": "{{count}} dépôt(s) à approuver",
    "approve": "Approuver",
    "reject": "Rejeter",
    "viewReceipt": "Voir le reçu",
    "amount": "Montant",
    "driver": "Chauffeur",
    "date": "Date",
    "status": {
      "submitted": "Soumis",
      "approved": "Approuvé",
      "rejected": "Rejeté"
    }
  },
  "common": {
    "loading": "Chargement...",
    "error": "Erreur",
    "save": "Enregistrer",
    "cancel": "Annuler",
    "confirm": "Confirmer"
  }
}
```

---

## 🔌 **Phase 7: SDK Integration**

### **API Client**
```typescript
// src/lib/api.ts
import { Configuration, DepositsApi, AuthApi } from '@taxi/shared/sdk';
import { useAuthStore } from '@/stores/authStore';

function getConfig() {
  const token = useAuthStore.getState().token;
  return new Configuration({
    basePath: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
    accessToken: token || undefined,
  });
}

export const api = {
  auth: new AuthApi(getConfig()),
  deposits: new DepositsApi(getConfig()),
  // Add more as needed
};

// React Query helpers
export const queryKeys = {
  deposits: {
    pending: ['deposits', 'pending'] as const,
    byId: (id: string) => ['deposits', id] as const,
  },
  drivers: {
    all: ['drivers'] as const,
    byId: (id: string) => ['drivers', id] as const,
  },
};
```

---

## 🧪 **Phase 8: Testing**

### **Component Test Example**
```typescript
// src/components/ui/__tests__/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    
    fireEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    render(<Button loading>Loading</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

---

## 📦 **File Structure**

```
apps/admin/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── deposits/
│   │   │   │   ├── [id]/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── drivers/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx (with Sidebar)
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── providers.tsx
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Input.tsx
│   │   │   └── ...
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Topbar.tsx
│   │   │   └── ...
│   │   └── deposits/
│   │       ├── DepositCard.tsx
│   │       ├── DepositModal.tsx
│   │       └── ReceiptViewer.tsx
│   ├── lib/
│   │   ├── api.ts
│   │   ├── utils.ts
│   │   └── constants.ts
│   ├── stores/
│   │   ├── authStore.ts
│   │   └── uiStore.ts
│   └── hooks/
│       ├── useDeposits.ts
│       └── useAuth.ts
├── messages/
│   ├── fr.json
│   └── ar.json
├── public/
├── tailwind.config.ts
├── postcss.config.mjs
└── package.json
```

---

## ✅ **Implementation Checklist**

### **Phase 1: Foundation** ✅
- [x] Dependencies installed
- [x] TailwindCSS configured
- [x] Design system implemented
- [x] Utility functions created

### **Phase 2: Components** 🚧
- [ ] Button component
- [ ] Card component
- [ ] Badge component
- [ ] Input component
- [ ] Modal component
- [ ] Table component
- [ ] Loading states
- [ ] Error states

### **Phase 3: Layout** 🚧
- [ ] App layout
- [ ] Sidebar navigation
- [ ] Topbar with user menu
- [ ] Responsive design
- [ ] RTL support

### **Phase 4: Deposit Approval** ⏳
- [ ] Deposit list page
- [ ] Deposit detail modal
- [ ] Receipt image viewer
- [ ] Approve/reject actions
- [ ] Success/error feedback

### **Phase 5: Authentication** ⏳
- [ ] Login page
- [ ] Phone OTP flow
- [ ] JWT storage
- [ ] Auth guards
- [ ] Logout functionality

### **Phase 6: Dashboard** ⏳
- [ ] Metrics cards
- [ ] Charts (rides, earnings)
- [ ] Active drivers count
- [ ] Recent activity

### **Phase 7: i18n** ⏳
- [ ] next-intl setup
- [ ] French translations
- [ ] Arabic translations
- [ ] Language switcher
- [ ] RTL styling

### **Phase 8: SDK Integration** ⏳
- [ ] API client setup
- [ ] React Query hooks
- [ ] Error handling
- [ ] Loading states

### **Phase 9: Testing** ⏳
- [ ] Component tests
- [ ] Integration tests
- [ ] E2E tests (Playwright)
- [ ] Test coverage >80%

### **Phase 10: CI/CD** ⏳
- [ ] GitHub Actions workflow
- [ ] Build verification
- [ ] Test automation
- [ ] Deployment pipeline

---

## 🚀 **Next Steps**

1. **Continue Component Development** (This Week)
   - Build remaining UI components
   - Create layout structure
   - Implement routing

2. **Deposit Approval Feature** (Next Week)
   - Highest priority for operations
   - Complete CRUD operations
   - Receipt viewer
   - Approval workflow

3. **Authentication** (Week 3)
   - Phone OTP integration
   - JWT management
   - Protected routes

4. **Dashboard & Analytics** (Week 4)
   - Metrics visualization
   - Charts integration
   - Real-time updates

**Estimated Timeline**: 4-6 weeks for complete MVP

---

**Status**: Foundation complete, ready for component development! 🎨

